# Azure VM Deployment Guide for Insight360

This document provides step-by-step instructions for setting up an Azure Virtual Machine to host the Insight360 news website with automated CI/CD deployment.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Azure VM Creation](#azure-vm-creation)
- [VM Configuration](#vm-configuration)
- [Docker Installation](#docker-installation)
- [Application Setup](#application-setup)
- [Security Configuration](#security-configuration)
- [GitHub Secrets Configuration](#github-secrets-configuration)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts
- Azure account with active subscription
- GitHub account with repository access
- Docker Hub account
- NewsAPI account (https://newsapi.org/)

### Required Tools
- Azure CLI (optional, for command-line management)
- SSH client
- Git (for local development)

## Azure VM Creation

### Step 1: Create Resource Group

1. Log in to the Azure Portal (https://portal.azure.com)
2. Click on "Resource groups" in the left sidebar
3. Click "+ Create"
4. Fill in the details:
   - **Subscription**: Choose your subscription
   - **Resource group name**: `rg-insight360-prod`
   - **Region**: Choose a region close to your users (e.g., East US, West Europe)
5. Click "Review + create" and then "Create"

### Step 2: Create Virtual Machine

1. Navigate to "Virtual machines" in the Azure Portal
2. Click "+ Create" > "Azure virtual machine"
3. **Basics tab**:
   - **Subscription**: Your subscription
   - **Resource group**: `rg-insight360-prod`
   - **Virtual machine name**: `vm-insight360-prod`
   - **Region**: Same as resource group
   - **Availability options**: No infrastructure redundancy required (for development/testing)
   - **Security type**: Standard
   - **Image**: Ubuntu Server 22.04 LTS - x64 Gen2
   - **VM architecture**: x64
   - **Size**: Standard_B2s (2 vcpus, 4 GiB memory) - minimum recommended
     - For production with higher traffic: Standard_D2s_v3 (2 vcpus, 8 GiB memory)

4. **Administrator account**:
   - **Authentication type**: SSH public key
   - **Username**: `azureuser` (default) or your preferred username
   - **SSH public key source**: Generate new key pair
   - **Key pair name**: `insight360-ssh-key`

5. **Inbound port rules**:
   - **Public inbound ports**: Allow selected ports
   - **Select inbound ports**: SSH (22), HTTP (80), HTTPS (443)
   - **Custom ports**: Add 5000 (for backend API)

### Step 3: Configure Disks

1. Click "Next: Disks"
2. **OS disk type**: Premium SSD (recommended) or Standard SSD
3. **Size**: 30 GiB (minimum) or 64 GiB (recommended for logs and backups)
4. **Delete with VM**: Yes (unless you need persistent storage)

### Step 4: Configure Networking

1. Click "Next: Networking"
2. **Virtual network**: Create new or use existing
3. **Subnet**: Default is fine
4. **Public IP**: Create new
   - **Name**: `pip-insight360-prod`
   - **SKU**: Standard
   - **Assignment**: Static (recommended for production)
5. **NIC network security group**: Advanced
6. **Configure network security group**: Create new
   - **Name**: `nsg-insight360-prod`
   - Add custom rules:
     - **Frontend HTTP**: Port 80, Priority 100, Allow
     - **Frontend HTTPS**: Port 443, Priority 110, Allow
     - **Backend API**: Port 5000, Priority 120, Allow
     - **SSH**: Port 22, Priority 300, Allow (restrict source IP if possible)

### Step 5: Management Configuration

1. Click "Next: Management"
2. **Boot diagnostics**: Enable with managed storage account
3. **OS guest diagnostics**: Enable (optional, for monitoring)
4. **System assigned managed identity**: Off (unless needed)

### Step 6: Review and Create

1. Click "Next: Advanced" (leave defaults)
2. Click "Next: Tags" (optional, add tags for organization)
3. Click "Next: Review + create"
4. Review all settings
5. Click "Create"
6. **Download the SSH private key** when prompted and save it securely

## VM Configuration

### Step 1: Connect to VM

1. Once VM is created, go to the VM resource page
2. Copy the **Public IP address**
3. Connect via SSH:

```bash
# Replace with your actual IP and path to private key
ssh -i ~/Downloads/insight360-ssh-key.pem azureuser@YOUR_VM_PUBLIC_IP

# If you get permission denied, fix the key permissions:
chmod 600 ~/Downloads/insight360-ssh-key.pem
```

### Step 2: Update System

```bash
# Update package lists and upgrade system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

## Docker Installation

### Step 1: Install Docker Engine

```bash
# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index
sudo apt update

# Install Docker Engine
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Log out and back in for group changes to take effect
exit
# Reconnect to SSH
```

### Step 2: Verify Docker Installation

```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Test Docker installation
docker run hello-world

# If successful, you should see "Hello from Docker!" message
```

## Application Setup

### Step 1: Create Application Directory

```bash
# Create application directory
mkdir -p ~/insight360
cd ~/insight360

# Create subdirectories for organization
mkdir -p logs backups
```

### Step 2: Configure Environment Variables

```bash
# Create production environment file
nano .env

# Add the following content (replace with actual values):
```

```bash
# MongoDB Configuration
MONGO_ROOT_USERNAME=insight360admin
MONGO_ROOT_PASSWORD=your_secure_mongodb_password_here

# JWT Secret - Generate with: openssl rand -hex 32
JWT_SECRET=your_secure_jwt_secret_here_min_32_characters

# News API Key from https://newsapi.org/
REACT_APP_NEWS_API_KEY=your_news_api_key_here

# Backend API URL (replace with your VM's public IP)
REACT_APP_API_URL=http://YOUR_VM_PUBLIC_IP:5000

# Docker Hub Configuration
DOCKER_HUB_USERNAME=your_docker_hub_username

# Production settings
NODE_ENV=production
```

### Step 3: Create Initial Docker Compose File

```bash
# Create a basic docker-compose file for initial setup
nano docker-compose.yml
```

Add the MongoDB service to test connectivity:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7-jammy
    container_name: insight360-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
      MONGO_INITDB_DATABASE: insight360
    volumes:
      - mongodb_data:/data/db
    networks:
      - insight360-network

volumes:
  mongodb_data:

networks:
  insight360-network:
    driver: bridge
```

### Step 4: Test Database Setup

```bash
# Start MongoDB
docker compose up -d mongodb

# Check if MongoDB is running
docker ps

# Test MongoDB connection
docker exec -it insight360-mongodb mongosh --username $MONGO_ROOT_USERNAME --password $MONGO_ROOT_PASSWORD --authenticationDatabase admin
```

## Security Configuration

### Step 1: Configure UFW Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH (adjust port if you changed it)
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow backend API
sudo ufw allow 5000/tcp

# Check status
sudo ufw status verbose
```

### Step 2: Secure SSH Configuration

```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Recommended security settings:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# Port 22 (or change to custom port)
# AllowUsers azureuser (or your username)

# Restart SSH service
sudo systemctl restart sshd
```

### Step 3: Configure Automatic Security Updates

```bash
# Install unattended upgrades
sudo apt install -y unattended-upgrades

# Configure automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Enable automatic security updates
echo 'Unattended-Upgrade::Automatic-Reboot "false";' | sudo tee -a /etc/apt/apt.conf.d/50unattended-upgrades
```

### Step 4: Setup Log Rotation

```bash
# Create log rotation configuration for application logs
sudo nano /etc/logrotate.d/insight360

# Add the following content:
```

```
/home/azureuser/insight360/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    copytruncate
}
```

## GitHub Secrets Configuration

### Required GitHub Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add these secrets:

1. **AZURE_VM_IP**: Your VM's public IP address
2. **AZURE_VM_USERNAME**: Your VM username (e.g., `azureuser`)
3. **SSH_PRIVATE_KEY**: Content of your SSH private key file
4. **MONGO_ROOT_USERNAME**: MongoDB admin username
5. **MONGO_ROOT_PASSWORD**: MongoDB admin password
6. **JWT_SECRET**: JWT secret for authentication
7. **REACT_APP_NEWS_API_KEY**: Your NewsAPI key
8. **DOCKER_HUB_USERNAME**: Your Docker Hub username
9. **DOCKER_HUB_TOKEN**: Your Docker Hub access token

### How to Add Secrets:

1. **SSH Private Key**:
   ```bash
   # Display private key content
   cat ~/Downloads/insight360-ssh-key.pem
   # Copy the entire content including -----BEGIN and -----END lines
   ```

2. **Generate JWT Secret**:
   ```bash
   # Generate a secure JWT secret
   openssl rand -hex 32
   ```

3. **Docker Hub Token**:
   - Go to Docker Hub → Account Settings → Security
   - Create new access token
   - Copy the token value

## Monitoring and Logging

### Step 1: Setup System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Create monitoring script
nano ~/monitor.sh
```

```bash
#!/bin/bash
# System monitoring script

echo "=== System Status at $(date) ==="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}'

echo "Memory Usage:"
free -h

echo "Disk Usage:"
df -h

echo "Docker Container Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo "Recent Application Logs:"
docker compose -f ~/insight360/docker-compose.prod.yml logs --tail=10
```

```bash
# Make script executable
chmod +x ~/monitor.sh

# Add to crontab for regular monitoring
crontab -e
# Add this line to run every hour:
# 0 * * * * /home/azureuser/monitor.sh >> /home/azureuser/insight360/logs/monitor.log 2>&1
```

### Step 2: Setup Application Logging

```bash
# Create logging directory
mkdir -p ~/insight360/logs

# Setup Docker logging configuration
# Docker Compose will automatically handle container logs
```

### Step 3: Setup Backup Strategy

```bash
# Create backup script
nano ~/backup.sh
```

```bash
#!/bin/bash
# Database backup script

BACKUP_DIR="/home/azureuser/insight360/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="insight360_backup_$DATE"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup MongoDB
docker exec insight360-mongodb mongodump --uri="mongodb://$MONGO_ROOT_USERNAME:$MONGO_ROOT_PASSWORD@localhost:27017/insight360?authSource=admin" --out=/tmp/backup

# Copy backup from container
docker cp insight360-mongodb:/tmp/backup $BACKUP_DIR/$BACKUP_NAME

# Compress backup
tar -czf $BACKUP_DIR/$BACKUP_NAME.tar.gz -C $BACKUP_DIR $BACKUP_NAME
rm -rf $BACKUP_DIR/$BACKUP_NAME

# Keep only last 7 backups
find $BACKUP_DIR -name "*.tar.gz" -type f -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
```

```bash
# Make backup script executable
chmod +x ~/backup.sh

# Add to crontab for daily backups
crontab -e
# Add this line for daily backup at 2 AM:
# 0 2 * * * /home/azureuser/backup.sh >> /home/azureuser/insight360/logs/backup.log 2>&1
```

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Docker Permission Denied

```bash
# Solution: Add user to docker group and restart session
sudo usermod -aG docker $USER
# Log out and back in
```

#### Issue 2: Port Already in Use

```bash
# Check what's using the port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :5000

# Kill process if needed
sudo kill -9 PID_NUMBER
```

#### Issue 3: MongoDB Connection Issues

```bash
# Check MongoDB container logs
docker logs insight360-mongodb

# Check if MongoDB is accessible
docker exec -it insight360-mongodb mongosh --username $MONGO_ROOT_USERNAME --password $MONGO_ROOT_PASSWORD --authenticationDatabase admin

# Reset MongoDB container
docker compose down
docker volume rm insight360_mongodb_data
docker compose up -d mongodb
```

#### Issue 4: Application Not Accessible from Internet

1. Check Azure Network Security Group rules
2. Verify UFW firewall rules
3. Check if application is bound to 0.0.0.0 (not just localhost)

```bash
# Check if services are listening on all interfaces
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :5000
```

#### Issue 5: SSL/HTTPS Setup (Optional)

For production environments, consider setting up SSL:

```bash
# Install Certbot for Let's Encrypt
sudo apt install -y certbot

# Get SSL certificate (requires domain name)
sudo certbot certonly --standalone -d your-domain.com

# Update nginx configuration to use SSL
# This would require modifying the frontend container configuration
```

### Logging and Debugging

```bash
# View application logs
docker compose -f ~/insight360/docker-compose.prod.yml logs -f

# View specific service logs
docker compose -f ~/insight360/docker-compose.prod.yml logs backend
docker compose -f ~/insight360/docker-compose.prod.yml logs frontend
docker compose -f ~/insight360/docker-compose.prod.yml logs mongodb

# View system logs
sudo journalctl -u docker.service -f

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop
```

### Performance Optimization

```bash
# Enable Docker BuildKit for faster builds
echo 'export DOCKER_BUILDKIT=1' >> ~/.bashrc

# Configure Docker log rotation
sudo nano /etc/docker/daemon.json
```

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
# Restart Docker to apply changes
sudo systemctl restart docker
```

## Next Steps

1. **Domain Setup**: Consider purchasing a domain name and configuring DNS
2. **SSL Certificate**: Set up HTTPS using Let's Encrypt
3. **CDN**: Consider using Azure CDN for better performance
4. **Load Balancer**: For high availability, set up Azure Load Balancer
5. **Auto Scaling**: Configure Azure VM Scale Sets for automatic scaling
6. **Monitoring**: Set up Azure Monitor or third-party monitoring solutions
7. **Backup Strategy**: Implement automated database backups to Azure Storage

## Support and Maintenance

- Monitor application logs regularly
- Keep the system updated with security patches
- Review and rotate secrets periodically
- Test backup and recovery procedures
- Monitor resource usage and scale as needed

This completes the Azure VM setup for the Insight360 application. The VM is now ready for CI/CD deployment from GitHub Actions.
