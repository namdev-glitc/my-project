#!/bin/bash

# Guest Management System Health Check Script
# This script monitors the health of all services

LOG_FILE="/home/nam/guest-management/logs/health_check.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Create logs directory if it doesn't exist
mkdir -p /home/nam/guest-management/logs

# Function to log messages
log_message() {
    echo "[$DATE] $1" | tee -a "$LOG_FILE"
}

# Function to check service health
check_service() {
    local service_name=$1
    local url=$2
    local port=$3
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        log_message "✅ $service_name is healthy"
        return 0
    else
        log_message "❌ $service_name is unhealthy"
        return 1
    fi
}

# Function to restart service if unhealthy
restart_service() {
    local service_name=$1
    log_message "🔄 Restarting $service_name..."
    cd /home/nam/guest-management
    docker-compose restart "$service_name"
    sleep 10
}

log_message "🏥 Starting health check..."

# Check all services
backend_healthy=false
frontend_healthy=false
nginx_healthy=false
db_healthy=false
redis_healthy=false

# Check Backend API
if check_service "Backend API" "http://localhost:8000/health" "8000"; then
    backend_healthy=true
fi

# Check Frontend
if check_service "Frontend" "http://localhost:3000" "3000"; then
    frontend_healthy=true
fi

# Check Nginx
if check_service "Nginx" "http://localhost" "80"; then
    nginx_healthy=true
fi

# Check Database
if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    log_message "✅ Database is healthy"
    db_healthy=true
else
    log_message "❌ Database is unhealthy"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    log_message "✅ Redis is healthy"
    redis_healthy=true
else
    log_message "❌ Redis is unhealthy"
fi

# Restart unhealthy services
if [ "$backend_healthy" = false ]; then
    restart_service "backend"
fi

if [ "$frontend_healthy" = false ]; then
    restart_service "frontend"
fi

if [ "$nginx_healthy" = false ]; then
    restart_service "nginx"
fi

if [ "$db_healthy" = false ]; then
    restart_service "db"
fi

if [ "$redis_healthy" = false ]; then
    restart_service "redis"
fi

# Summary
if [ "$backend_healthy" = true ] && [ "$frontend_healthy" = true ] && [ "$nginx_healthy" = true ] && [ "$db_healthy" = true ] && [ "$redis_healthy" = true ]; then
    log_message "🎉 All services are healthy!"
    exit 0
else
    log_message "⚠️ Some services are unhealthy, restart attempted"
    exit 1
fi

