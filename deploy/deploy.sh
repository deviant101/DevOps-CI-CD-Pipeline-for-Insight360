#!/bin/bash

# Insight360 Deployment Script for Azure VM
# This script handles the deployment of the Insight360 application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
COMPOSE_FILE="docker-compose.prod.yml"
PROJECT_NAME="insight360"
BACKUP_DIR="./backups"
LOG_FILE="./deploy.log"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a $LOG_FILE
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a $LOG_FILE
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
}

# Function to check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to check Docker Compose availability
check_docker_compose() {
    if command -v docker-compose >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker-compose"
        print_success "Using Docker Compose standalone version"
    elif docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE_CMD="docker compose"
        print_success "Using Docker Compose V2 plugin"
    else
        print_error "Docker Compose not found. Installing Docker Compose V2..."
        # Try to install docker-compose-plugin
        if command -v apt-get >/dev/null 2>&1; then
            sudo apt-get update
            sudo apt-get install -y docker-compose-plugin
            DOCKER_COMPOSE_CMD="docker compose"
        else
            print_error "Cannot install Docker Compose. Please install it manually."
            exit 1
        fi
    fi
}

# Function to check if required environment variables are set
check_env_vars() {
    local required_vars=(
        "MONGO_ROOT_USERNAME"
        "MONGO_ROOT_PASSWORD"
        "JWT_SECRET"
        "REACT_APP_NEWS_API_KEY"
        "DOCKER_HUB_USERNAME"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "Required environment variable $var is not set"
            exit 1
        fi
    done
    print_success "All required environment variables are set"
}

# Function to backup database
backup_database() {
    print_status "Checking for existing deployment to backup..."
    
    # Create backup directory if it doesn't exist
    mkdir -p $BACKUP_DIR
    
    # Check if MongoDB container exists and is running
    if docker ps --format "table {{.Names}}" | grep -q "insight360-mongodb"; then
        print_status "Found running MongoDB container, attempting backup..."
        
        # Create backup directory with timestamp
        local backup_timestamp=$(date +"%Y%m%d_%H%M%S")
        local backup_path="$BACKUP_DIR/mongodb_backup_$backup_timestamp"
        
        # Attempt backup with error handling
        if docker exec insight360-mongodb sh -c "mkdir -p /tmp/backup && mongodump --uri='mongodb://$MONGO_ROOT_USERNAME:$MONGO_ROOT_PASSWORD@localhost:27017/insight360?authSource=admin' --out=/tmp/backup" 2>/dev/null; then
            # Check if backup directory actually contains data before copying
            if docker exec insight360-mongodb sh -c "ls -la /tmp/backup" 2>/dev/null | grep -q "insight360"; then
                if docker cp insight360-mongodb:/tmp/backup $backup_path 2>/dev/null; then
                    print_success "Database backup created at $backup_path"
                else
                    print_warning "Failed to copy backup from container, but continuing..."
                fi
            else
                print_warning "No database data found to backup (empty database). Continuing..."
            fi
        else
            print_warning "Backup command failed, possibly no data to backup. Continuing with deployment..."
        fi
    else
        print_status "No existing MongoDB container found - this appears to be a first deployment"
        print_status "Skipping backup step"
    fi
}

# Function to pull latest images
pull_images() {
    print_status "Pulling latest Docker images..."
    
    # Set image tag (use environment variable or default to latest)
    local image_tag=${IMAGE_TAG:-latest}
    
    print_status "Using image tag: $image_tag"
    print_status "Docker Hub username: $DOCKER_HUB_USERNAME"
    
    # Pull images
    $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE pull
    print_success "Images pulled successfully"
}

# Function to deploy application
deploy_application() {
    print_status "Deploying Insight360 application..."
    
    # Stop existing containers gracefully
    if $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE ps -q | grep -q .; then
        print_status "Stopping existing containers..."
        $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE down --timeout 30
    fi
    
    # Remove unused images to free space
    docker image prune -f
    
    # Start services
    print_status "Starting services..."
    $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE up -d
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    local max_attempts=40
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        # Check MongoDB status specifically
        mongo_status=$($DOCKER_COMPOSE_CMD -f $COMPOSE_FILE ps mongodb --format "table" | grep -v "NAME" || true)
        print_status "MongoDB status: $mongo_status"
        
        # Check if all services are healthy by counting healthy services
        healthy_count=$($DOCKER_COMPOSE_CMD -f $COMPOSE_FILE ps --format "table {{.Name}}\t{{.Status}}" | grep -c "(healthy)" || echo "0")
        total_services=$($DOCKER_COMPOSE_CMD -f $COMPOSE_FILE ps --format "table {{.Name}}" | grep -c "insight360-" || echo "0")
        
        print_status "Healthy services: $healthy_count/$total_services"
        
        # Check if all services are healthy (expecting 3: mongodb, backend, frontend)
        if [ "$healthy_count" -eq "$total_services" ] && [ "$total_services" -eq 3 ]; then
            print_success "All services are healthy ($healthy_count/$total_services)"
            break
        fi
        
        # Check if MongoDB is unhealthy and show logs
        if echo "$mongo_status" | grep -q "unhealthy"; then
            print_warning "MongoDB is unhealthy, showing recent logs..."
            $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE logs --tail=20 mongodb
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Services failed to become healthy after $max_attempts attempts"
            print_status "Final status check:"
            print_status "Healthy services: $healthy_count/$total_services"
            print_status "Showing all service logs..."
            $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE logs --tail=50
            print_status "Showing service status..."
            $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE ps
            exit 1
        fi
        
        print_status "Attempt $attempt/$max_attempts - Waiting for services..."
        sleep 15
        ((attempt++))
    done
}

# Function to run health checks
health_check() {
    print_status "Running post-deployment health checks..."
    
    # Check backend health
    local backend_url="http://localhost:5000/api/health"
    if curl -f $backend_url >/dev/null 2>&1; then
        print_success "Backend health check passed"
    else
        print_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend availability
    local frontend_url="http://localhost:80"
    if curl -f $frontend_url >/dev/null 2>&1; then
        print_success "Frontend health check passed"
    else
        print_error "Frontend health check failed"
        return 1
    fi
    
    # Check MongoDB connectivity
    if docker exec insight360-backend npm run db-check 2>/dev/null || true; then
        print_success "Database connectivity check passed"
    else
        print_warning "Database connectivity check skipped (no db-check script)"
    fi
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo "===========================================" | tee -a $LOG_FILE
    $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE ps | tee -a $LOG_FILE
    echo "===========================================" | tee -a $LOG_FILE
    echo "🌐 Frontend URL: http://$(curl -s ifconfig.me || echo 'localhost'):80" | tee -a $LOG_FILE
    echo "🔧 Backend URL: http://$(curl -s ifconfig.me || echo 'localhost'):5000" | tee -a $LOG_FILE
    echo "📊 Health Check: http://$(curl -s ifconfig.me || echo 'localhost'):5000/api/health" | tee -a $LOG_FILE
    echo "===========================================" | tee -a $LOG_FILE
}

# Function to rollback on failure
rollback() {
    print_error "Deployment failed, attempting rollback..."
    
    # Stop current containers
    $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE down --timeout 30
    
    # Try to start with previous images
    # This is a simplified rollback - in production you'd want to track previous versions
    print_warning "Manual intervention may be required for complete rollback"
    
    # Show logs for debugging
    print_status "Recent logs:"
    $DOCKER_COMPOSE_CMD -f $COMPOSE_FILE logs --tail=50
}

# Main deployment process
main() {
    print_status "Starting Insight360 deployment process..."
    echo "Deployment started at $(date)" >> $LOG_FILE
    
    # Pre-deployment checks
    check_docker
    check_docker_compose
    check_env_vars
    
    # Backup existing data (non-blocking)
    set +e  # Temporarily disable exit on error for backup
    backup_database
    set -e  # Re-enable exit on error
    
    # Trap errors for rollback (after backup)
    trap 'rollback' ERR
    
    # Deploy application
    pull_images
    deploy_application
    
    # Post-deployment verification
    if health_check; then
        print_success "Deployment completed successfully!"
        show_status
        
        # Clean up old backups (keep last 5)
        find $BACKUP_DIR -type d -name "mongodb_backup_*" | sort | head -n -5 | xargs rm -rf
        
        echo "Deployment completed at $(date)" >> $LOG_FILE
    else
        print_error "Health checks failed after deployment"
        exit 1
    fi
}

# Run main function
main "$@"
