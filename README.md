# DevOps CI/CD Pipeline for Insight360

## 🌟 Overview

This repository contains a complete DevOps solution for automating the deployment of **Insight360**, a full-stack news aggregation website. The project demonstrates modern DevOps practices including containerization, automated testing, security scanning, and cloud deployment using GitHub Actions.

**Live Application**: Deployed on Azure VM with automated CI/CD pipeline  
**Original Repository**: [insight360](https://github.com/deviant101/insight360.git)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub        │    │   Docker Hub    │    │   Azure VM      │
│   Repository    │───▶│   Registry      │───▶│   Production    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                                             │
        ▼                                             ▼
┌─────────────────┐                         ┌─────────────────┐
│ GitHub Actions  │                         │   Deployed App  │
│   CI/CD         │                         │                 │
│   Pipeline      │                         │ ┌─────────────┐ │
└─────────────────┘                         │ │  Frontend   │ │
                                            │ │   (React)   │ │
                                            │ │   Port 80   │ │
                                            │ └─────────────┘ │
                                            │ ┌─────────────┐ │
                                            │ │  Backend    │ │
                                            │ │  (Node.js)  │ │
                                            │ │  Port 5000  │ │
                                            │ └─────────────┘ │
                                            │ ┌─────────────┐ │
                                            │ │  Database   │ │
                                            │ │  (MongoDB)  │ │
                                            │ │  Port 27017 │ │
                                            │ └─────────────┘ │
                                            └─────────────────┘
```

## 🛠️ Technology Stack

### **Application Stack**
- **Frontend**: React.js with modern hooks, routing, and responsive design
- **Backend**: Node.js with Express.js framework and REST API
- **Database**: MongoDB with Mongoose ODM and authentication
- **Authentication**: JWT-based secure authentication system
- **News Integration**: External News API with backend proxy service
- **Web Server**: Nginx for frontend serving and reverse proxy

### **DevOps & Infrastructure Stack**
- **Containerization**: Docker & Docker Compose for multi-service orchestration
- **CI/CD**: GitHub Actions with automated pipeline
- **Container Registry**: Docker Hub for image storage and distribution
- **Cloud Platform**: Microsoft Azure Virtual Machine (Ubuntu 22.04 LTS)
- **Security Scanning**: Trivy for vulnerability assessment
- **Monitoring**: Container health checks and application monitoring
- **Backup**: Automated MongoDB backup with retention policies

## 🚀 Key Features

### **CI/CD Pipeline Capabilities**
- ✅ **5-Stage Automated Pipeline**: Frontend validation, backend testing, security scanning, image building, deployment
- ✅ **Automated Testing**: Code linting, build validation, and health checks
- ✅ **Security Scanning**: Trivy vulnerability detection with SARIF reporting
- ✅ **Multi-Stage Docker Builds**: Optimized images with production configurations
- ✅ **Zero-Downtime Deployment**: Blue-green style deployment with health verification
- ✅ **Automated Rollback**: Failure detection and automatic rollback mechanisms
- ✅ **Environment Management**: Secure secret handling and configuration management

### **Production-Ready Features**
- 🔐 **User Authentication**: Secure JWT-based login and registration
- 📰 **News Aggregation**: Real-time news from multiple categories (Technology, Science, General)
- 🔍 **Advanced Search**: Article search with filtering and sorting capabilities
- 📱 **Responsive Design**: Mobile-first responsive UI with modern UX
- 🛡️ **Security**: Container security, API key protection, and vulnerability scanning
- 💾 **Data Persistence**: MongoDB with automated backups and health monitoring
- 📊 **Monitoring**: Comprehensive health checks and logging

### **Application Features**
- **News Categories**: Technology, Science, General news with real-time updates
- **User Management**: Secure registration, login, and profile management
- **Search Functionality**: Advanced article search with relevance sorting
- **Responsive UI**: Modern, mobile-friendly interface
- **Real-time Updates**: Dynamic content loading and refresh
- **Error Handling**: Graceful error handling with user feedback

## 📁 Project Structure

```
DevOps-CI-CD-Pipeline-for-Insight360/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # Main CI/CD pipeline configuration
├── backend/
│   ├── controllers/               # API business logic controllers
│   ├── models/                    # MongoDB data models
│   ├── routes/                    # API route definitions
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   └── newsRoutes.js         # News API proxy endpoints
│   ├── Dockerfile                # Backend container configuration
│   ├── package.json              # Node.js dependencies and scripts
│   └── server.js                 # Main Express server file
├── frontend/
│   ├── public/                   # Static assets and HTML template
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Header.jsx       # Navigation header
│   │   │   ├── NewsList.jsx     # News article listing
│   │   │   ├── SearchArticle.jsx # Search functionality
│   │   │   ├── SignIn.jsx       # User login
│   │   │   └── SignUp.jsx       # User registration
│   │   ├── context/             # React context providers
│   │   └── assets/              # Application assets
│   ├── Dockerfile               # Frontend container configuration
│   ├── nginx.conf               # Nginx web server configuration
│   └── package.json             # React dependencies and build scripts
├── deploy/
│   ├── deploy.sh                # Production deployment automation script
│   ├── manual-deploy.sh         # Manual deployment option
│   └── .env.production          # Production environment template
├── docs/                        # Comprehensive documentation
│   ├── AZURE_VM_SETUP.md       # Azure infrastructure setup guide
│   ├── CICD_PIPELINE.md        # Pipeline configuration guide
│   └── troubleshooting/         # Issue resolution guides
├── docker-compose.prod.yml      # Production Docker Compose configuration
├── docker-compose.yml           # Development Docker Compose configuration
├── PROJECT_SUMMARY.md           # Executive project summary
└── README.md                    # This comprehensive guide
```

## 🔧 Setup & Installation

### **Prerequisites**
- GitHub account with repository access
- Docker Hub account for container registry
- Microsoft Azure subscription with VM access
- Node.js 18+ (for local development)
- Docker & Docker Compose installed locally

### **1. Repository Setup**
```bash
# Clone the repository
git clone https://github.com/your-username/DevOps-CI-CD-Pipeline-for-Insight360.git
cd DevOps-CI-CD-Pipeline-for-Insight360

# Copy environment template
cp deploy/.env.production .env
```

### **2. GitHub Secrets Configuration**
Navigate to your GitHub repository → Settings → Secrets and variables → Actions

Configure these repository secrets:

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AZURE_VM_IP` | Azure VM public IP address | `20.123.45.67` |
| `AZURE_VM_USERNAME` | SSH username for VM access | `azureuser` |
| `SSH_PRIVATE_KEY` | Private SSH key for authentication | `-----BEGIN RSA PRIVATE KEY-----...` |
| `DOCKER_HUB_USERNAME` | Docker Hub registry username | `your-dockerhub-username` |
| `DOCKER_HUB_TOKEN` | Docker Hub access token | `dckr_pat_...` |
| `MONGO_ROOT_USERNAME` | MongoDB admin username | `insight360admin` |
| `MONGO_ROOT_PASSWORD` | MongoDB admin password | `SecurePass123!` |
| `JWT_SECRET` | JWT token signing secret | `your-super-secure-jwt-secret-32-chars` |
| `REACT_APP_NEWS_API_KEY` | News API key from newsapi.org | `abc123def456...` |

### **3. Azure VM Infrastructure Setup**
```bash
# Create Azure VM (using Azure CLI)
az vm create \
  --resource-group myResourceGroup \
  --name insight360-vm \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --size Standard_B2s

# Open required ports
az vm open-port --port 80 --resource-group myResourceGroup --name insight360-vm
az vm open-port --port 5000 --resource-group myResourceGroup --name insight360-vm
az vm open-port --port 22 --resource-group myResourceGroup --name insight360-vm

# Connect to VM and install Docker
ssh azureuser@your-vm-ip

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose V2
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Logout and login to apply group changes
exit
```

### **4. Local Development Setup**
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Create local environment file
cp deploy/.env.production .env.local

# Start development environment
cd ..
docker-compose up -d

# Access the application
# Frontend: http://localhost:80
# Backend API: http://localhost:5000
# MongoDB: localhost:27017
```

## 🚀 CI/CD Pipeline

### **Pipeline Stages**

The automated pipeline consists of 5 sequential jobs:

#### **1. Frontend Checks** (`frontend-checks`)
- Code checkout and Node.js setup
- Dependency caching and installation
- ESLint code linting (if configured)
- React application build with production optimizations
- Build artifact upload for deployment

#### **2. Backend Checks** (`backend-checks`)
- MongoDB service container startup
- Backend dependency installation
- API health check validation
- Database connectivity testing
- Code quality assessment

#### **3. Security Scanning** (`security-scan`)
- Trivy vulnerability scanner execution
- SARIF report generation for GitHub Security tab
- Console output for immediate feedback
- Security artifact upload with 30-day retention
- Critical vulnerability blocking (configurable)

#### **4. Docker Image Building** (`build-images`)
- Multi-stage Docker image builds
- Frontend image with Nginx optimization
- Backend image with security hardening
- Image tagging with Git SHA and 'latest'
- Docker Hub registry push with caching

#### **5. Production Deployment** (`deploy`)
- Secure SSH connection to Azure VM
- Environment variable configuration
- Docker Compose service orchestration
- Health check validation
- Automated rollback on failure

### **Pipeline Triggers**
- **Push to `main`**: Full pipeline execution with deployment
- **Pull Request to `main`**: Pipeline execution without deployment
- **Manual trigger**: Via GitHub Actions web interface

### **Pipeline Flow**
```
Git Push → GitHub Actions → Tests → Security Scan → Build Images → Deploy → Health Check
    ↓            ↓           ↓          ↓            ↓           ↓         ↓
  Code        Lint &      Trivy      Docker       Push to    SSH to    Service
  Change      Build      Scanning    Multi-stage   Hub       Azure     Validation
             Validation   Report     Optimization  Registry    VM      & Monitoring
```

## 🔍 Application Endpoints

### **Frontend Endpoints**
- **Main Application**: `http://your-vm-ip:80`
- **User Registration**: `http://your-vm-ip:80/signup`
- **User Login**: `http://your-vm-ip:80/signin`
- **News Search**: `http://your-vm-ip:80/search`
- **Category Pages**: `http://your-vm-ip:80/technology`, `/science`

### **Backend API Endpoints**
- **Health Check**: `GET http://your-vm-ip:5000/api/health`
- **User Registration**: `POST http://your-vm-ip:5000/api/auth/register`
- **User Login**: `POST http://your-vm-ip:5000/api/auth/login`
- **News Headlines**: `GET http://your-vm-ip:5000/api/news/headlines/{category}?count={number}`
- **News Search**: `GET http://your-vm-ip:5000/api/news/search?q={query}&sortBy={sortBy}`

### **Infrastructure Endpoints**
- **MongoDB**: `mongodb://your-vm-ip:27017` (internal access only)
- **Docker Registry**: `https://hub.docker.com/u/your-username`

## 🔒 Security Implementation

### **Container Security**
- **Non-root execution**: All containers run with non-privileged users
- **Minimal base images**: Alpine Linux for reduced attack surface
- **Multi-stage builds**: Separate build and runtime environments
- **Security scanning**: Automated vulnerability assessment with Trivy
- **Image signing**: Docker Content Trust (configurable)

### **Application Security**
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with configurable rounds
- **API Key Protection**: Server-side News API proxy
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Input Validation**: Express.js validation middleware
- **Environment Isolation**: Separate development and production configs

### **Infrastructure Security**
- **SSH Key Authentication**: No password-based access
- **Firewall Configuration**: Limited port exposure (22, 80, 5000)
- **Secret Management**: GitHub encrypted secrets
- **Network Segmentation**: Docker network isolation
- **Regular Updates**: Automated security patches

### **Data Security**
- **Database Authentication**: MongoDB with username/password
- **Connection Encryption**: TLS/SSL for data in transit
- **Backup Encryption**: Secure backup storage
- **Access Logging**: Comprehensive audit trails

## 📊 Monitoring & Health Checks

### **Application Monitoring**
```bash
# Check all service status
docker compose -f docker-compose.prod.yml ps

# View real-time logs
docker compose -f docker-compose.prod.yml logs -f

# Monitor resource usage
docker stats

# Test health endpoints
curl -f http://localhost:5000/api/health
curl -f http://localhost:80
```

### **Health Check Configuration**
- **Backend Health**: HTTP endpoint validation with 30s intervals
- **Frontend Health**: Nginx status verification
- **MongoDB Health**: Database connectivity and ping commands
- **Container Health**: Docker internal health monitoring
- **Service Dependencies**: Ordered startup with health conditions

### **Backup & Recovery**
- **Automated Backups**: MongoDB backup before each deployment
- **Retention Policy**: Keep last 5 backups automatically
- **Backup Verification**: Integrity checks and restore testing
- **Disaster Recovery**: Complete infrastructure recreation from code

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. Pipeline Failure: "npm ci" Lock File Sync Error**
```bash
# Solution: Regenerate package-lock.json
cd backend  # or frontend
rm package-lock.json
npm install
git add package-lock.json
git commit -m "Update package-lock.json"
```

#### **2. Deployment Failure: Container Unhealthy**
```bash
# Check container logs
docker compose -f docker-compose.prod.yml logs backend

# Verify health endpoint
curl -f http://localhost:5000/api/health

# Restart specific service
docker compose -f docker-compose.prod.yml restart backend
```

#### **3. News API Not Loading**
```bash
# Check backend logs for API errors
docker logs insight360-backend

# Verify environment variable
docker exec insight360-backend env | grep NEWS_API

# Test news endpoint
curl "http://localhost:5000/api/news/headlines/general?count=5"
```

#### **4. MongoDB Connection Issues**
```bash
# Check MongoDB container status
docker compose -f docker-compose.prod.yml ps mongodb

# View MongoDB logs
docker compose -f docker-compose.prod.yml logs mongodb

# Test database connection
docker exec insight360-mongodb mongosh --eval "db.runCommand({ping: 1})"
```

#### **5. SSH Connection Failures**
```bash
# Verify SSH key format
ssh-keygen -l -f ~/.ssh/id_rsa

# Test SSH connection
ssh -v azureuser@your-vm-ip

# Check Azure NSG rules
az network nsg rule list --resource-group myResourceGroup --nsg-name myNetworkSecurityGroup
```

### **Log Locations**
- **Deployment Logs**: `~/insight360/deploy.log` on Azure VM
- **Container Logs**: `docker compose logs [service-name]`
- **GitHub Actions**: Repository → Actions tab → Workflow run
- **Application Logs**: Container stdout/stderr via Docker

### **Performance Optimization**
```bash
# Monitor resource usage
docker stats

# Check disk usage
df -h
docker system df

# Clean up unused resources
docker system prune -f
docker volume prune -f
```

## 🔄 Development Workflow

### **Feature Development Process**
1. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
2. **Local Development**: Test changes with `docker-compose up`
3. **Code Quality**: Ensure linting and testing pass
4. **Commit Changes**: Use conventional commit messages
5. **Push Branch**: `git push origin feature/your-feature-name`
6. **Create Pull Request**: Triggers pipeline validation
7. **Code Review**: Team review and approval
8. **Merge to Main**: Triggers production deployment

### **Local Testing**
```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Run tests (if configured)
cd frontend && npm test
cd backend && npm test

# Stop environment
docker-compose down
```

### **Production Hotfixes**
```bash
# Create hotfix branch
git checkout -b hotfix/critical-fix

# Make minimal changes
# Test locally

# Fast-track to production
git checkout main
git merge hotfix/critical-fix
git push origin main  # Triggers immediate deployment
```

## 🚀 Performance Optimization

### **Docker Optimizations**
- **Multi-stage builds**: Separate build and runtime stages
- **Layer caching**: GitHub Actions cache for faster builds
- **Image optimization**: Minimal base images and dependency cleanup
- **Resource limits**: Memory and CPU constraints for containers

### **Application Performance**
- **React optimization**: Production builds with minification
- **Nginx caching**: Static asset caching and gzip compression
- **Database indexing**: MongoDB performance optimization
- **API caching**: Response caching for news endpoints

### **Deployment Speed**
- **Parallel jobs**: Concurrent pipeline execution where possible
- **Registry caching**: Docker Hub layer caching
- **Incremental deployments**: Only changed services restart
- **Health check optimization**: Faster service validation

## 🤝 Contributing

### **Contribution Guidelines**
1. **Fork the repository** and create your feature branch
2. **Follow coding standards** and maintain consistency
3. **Add tests** for new functionality
4. **Update documentation** for any changes
5. **Ensure pipeline passes** before submitting PR
6. **Provide clear commit messages** and PR descriptions

### **Development Standards**
- **Code Style**: ESLint configuration for JavaScript/React
- **Commit Messages**: Conventional commits format
- **Documentation**: Update README for infrastructure changes
- **Testing**: Maintain test coverage for critical paths
- **Security**: Follow security best practices

### **Review Process**
- **Automated Checks**: Pipeline validation required
- **Code Review**: Minimum one reviewer approval
- **Security Review**: For infrastructure or security changes
- **Performance Review**: For changes affecting performance

## 📈 Scaling Considerations

### **Horizontal Scaling**
- **Load Balancer**: Azure Load Balancer for multiple VM instances
- **Database Clustering**: MongoDB replica sets for high availability
- **Container Orchestration**: Migration to Kubernetes for advanced scaling
- **CDN Integration**: Azure CDN for global content delivery

### **Vertical Scaling**
- **VM Sizing**: Upgrade to larger Azure VM sizes
- **Resource Allocation**: Optimize Docker container resources
- **Database Performance**: MongoDB performance tuning
- **Caching Strategies**: Redis for application caching

### **Infrastructure as Code**
- **Terraform**: Infrastructure provisioning automation
- **Ansible**: Configuration management automation
- **GitOps**: Infrastructure changes via Git workflows
- **Environment Replication**: Consistent dev/staging/prod environments

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Application**: [Insight360](https://github.com/deviant101/insight360.git) by DeviantFoxes
- **News Data**: Powered by [News API](https://newsapi.org/)
- **Cloud Infrastructure**: Microsoft Azure
- **Container Registry**: Docker Hub
- **CI/CD Platform**: GitHub Actions
- **Security Scanning**: Aqua Security Trivy

## 📞 Support & Documentation

### **Additional Resources**
- **[Project Summary](PROJECT_SUMMARY.md)**: Executive overview and achievements
- **[Documentation Index](docs/DOCUMENTATION_INDEX.md)**: Complete documentation guide
- **[Azure Setup Guide](docs/AZURE_VM_SETUP.md)**: Detailed infrastructure setup
- **[Pipeline Guide](docs/CICD_PIPELINE.md)**: CI/CD configuration details
- **[Troubleshooting Guides](docs/)**: Issue-specific resolution guides

### **Getting Help**
1. **Check the troubleshooting section** above for common issues
2. **Review the documentation** in the `docs/` directory
3. **Search existing issues** in the GitHub repository
4. **Create a new issue** with detailed problem description and logs
5. **Join discussions** in the repository discussions section

### **Community**
- **Issues**: Report bugs and request features
- **Discussions**: Ask questions and share experiences
- **Pull Requests**: Contribute improvements and fixes
- **Wiki**: Community-maintained documentation and guides

---

## 🎯 Quick Start Summary

```bash
# 1. Clone and setup
git clone <repository-url>
cd DevOps-CI-CD-Pipeline-for-Insight360

# 2. Configure GitHub secrets (see table above)

# 3. Setup Azure VM with Docker

# 4. Push to main branch to trigger deployment
git push origin main

# 5. Access your deployed application
curl http://your-vm-ip:80
```

**🚀 Your production-ready news application with full CI/CD automation is now live!**

---

*Built with ❤️ for modern DevOps practices and automated deployment excellence*
