#!/bin/bash

# Quick deployment script for manual deployments
# This script can be run locally to deploy to Azure VM

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env() {
    local required_vars=(
        "AZURE_VM_IP"
        "AZURE_VM_USERNAME"
        "SSH_PRIVATE_KEY_PATH"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "Required environment variable $var is not set"
            exit 1
        fi
    done
}

# Deploy to Azure VM
deploy() {
    print_status "Starting manual deployment to Azure VM..."
    
    # Copy files to Azure VM
    print_status "Copying deployment files..."
    scp -i "$SSH_PRIVATE_KEY_PATH" -o StrictHostKeyChecking=no docker-compose.prod.yml "$AZURE_VM_USERNAME@$AZURE_VM_IP:~/insight360/"
    scp -i "$SSH_PRIVATE_KEY_PATH" -o StrictHostKeyChecking=no deploy/deploy.sh "$AZURE_VM_USERNAME@$AZURE_VM_IP:~/insight360/"
    
    # Execute deployment on Azure VM
    print_status "Executing deployment on Azure VM..."
    ssh -i "$SSH_PRIVATE_KEY_PATH" -o StrictHostKeyChecking=no "$AZURE_VM_USERNAME@$AZURE_VM_IP" << 'EOF'
        cd ~/insight360
        chmod +x deploy.sh
        ./deploy.sh
EOF
    
    print_status "Deployment completed!"
    print_status "Frontend: http://$AZURE_VM_IP"
    print_status "Backend: http://$AZURE_VM_IP:5000"
}

# Main function
main() {
    print_status "Manual Deployment Script for Insight360"
    
    # Check environment variables
    check_env
    
    # Run deployment
    deploy
}

# Show usage if no environment variables are set
if [ -z "$AZURE_VM_IP" ]; then
    echo "Usage: Set the following environment variables and run this script:"
    echo "  export AZURE_VM_IP=your_vm_ip"
    echo "  export AZURE_VM_USERNAME=azureuser"
    echo "  export SSH_PRIVATE_KEY_PATH=path/to/private/key"
    echo "  ./deploy/manual-deploy.sh"
    exit 1
fi

# Run main function
main "$@"
