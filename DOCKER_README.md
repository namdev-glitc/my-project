# 🐳 Docker Setup - Guest Management System

## 📋 Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- Git

## 🚀 Quick Start

### Windows
```bash
# Clone the repository
git clone <repository-url>
cd "Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm"

# Run the startup script
start.bat
```

### Linux/Mac
```bash
# Clone the repository
git clone <repository-url>
cd "Hệ thống Quản lý Khách mời – Lễ kỷ niệm 15 năm"

# Make script executable
chmod +x start.sh

# Run the startup script
./start.sh
```

### Manual Setup
```bash
# 1. Create environment file
cp env.docker.example .env

# 2. Edit .env with your configuration
# (Optional - defaults will work for development)

# 3. Build and start services
docker-compose up -d --build

# 4. Check logs
docker-compose logs -f
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │    Frontend     │    │    Backend      │
│   (Port 80)     │◄───┤   (Port 3000)   │◄───┤   (Port 8000)   │
│  Reverse Proxy  │    │   React App     │    │   FastAPI       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PostgreSQL    │    │     Redis       │    │   Static Files  │
│   (Port 5432)   │    │   (Port 6379)   │    │   & Uploads     │
│    Database     │    │    Cache        │    │   (Volumes)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📦 Services

| Service | Port | Description |
|---------|------|-------------|
| **Nginx** | 80 | Reverse proxy, static files, load balancing |
| **Frontend** | 3000 | React application |
| **Backend** | 8000 | FastAPI REST API |
| **PostgreSQL** | 5432 | Primary database |
| **Redis** | 6379 | Caching and sessions |

## 🔧 Configuration

### Environment Variables

Edit `.env` file to customize:

```env
# Database
POSTGRES_DB=guest_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123

# Security
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 📊 Access URLs

- **Main Application**: http://localhost
- **Backend API**: http://localhost:8000
- **Frontend Direct**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

## 👤 Default Credentials

- **Username**: admin
- **Password**: admin123

⚠️ **Change these credentials in production!**

## 🛠️ Management Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Rebuild and restart
docker-compose up -d --build

# Access database
docker-compose exec db psql -U postgres -d guest_management

# Access backend container
docker-compose exec backend bash

# Access Redis
docker-compose exec redis redis-cli
```

## 📁 Volumes

Data is persisted in Docker volumes:

- `postgres_data`: Database files
- `redis_data`: Redis cache
- `backend_static`: Static files
- `backend_exports`: Export files
- `backend_qr_images`: QR code images
- `backend_templates`: HTML templates

## 🔍 Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost/health
curl http://localhost:8000/health
curl http://localhost:3000
```

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :80
   netstat -tulpn | grep :8000
   netstat -tulpn | grep :3000
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs db
   
   # Reset database
   docker-compose down -v
   docker-compose up -d
   ```

3. **Build failures**
   ```bash
   # Clean build
   docker-compose down
   docker system prune -f
   docker-compose up -d --build
   ```

4. **Permission issues (Linux/Mac)**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   chmod +x start.sh
   ```

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
docker-compose logs -f nginx
```

## 🔒 Security Notes

- Change default passwords in production
- Use environment variables for secrets
- Enable HTTPS in production
- Configure firewall rules
- Regular security updates

## 📈 Production Deployment

For production deployment:

1. Use a reverse proxy (Nginx/Traefik)
2. Enable HTTPS with Let's Encrypt
3. Use managed databases (AWS RDS, etc.)
4. Configure monitoring and logging
5. Set up backup strategies
6. Use Docker secrets for sensitive data

## 🤝 Development

```bash
# Development with live reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Run tests
docker-compose exec backend python -m pytest
docker-compose exec frontend npm test
```

## 📞 Support

For issues and questions:
- Check the logs: `docker-compose logs -f`
- Verify health: `docker-compose ps`
- Restart services: `docker-compose restart`


