#!/bin/bash

# Guest Management System - Docker Startup Script

echo "🚀 Starting Guest Management System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.docker.example .env
    echo "⚠️  Please edit .env file with your configuration before running again."
    exit 1
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check database
if docker-compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ Database is ready"
else
    echo "❌ Database is not ready"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis is not ready"
fi

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend API is ready"
else
    echo "❌ Backend API is not ready"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is ready"
else
    echo "❌ Frontend is not ready"
fi

# Check nginx
if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Nginx is ready"
else
    echo "❌ Nginx is not ready"
fi

echo ""
echo "🎉 Guest Management System is starting up!"
echo ""
echo "📋 Access URLs:"
echo "   🌐 Main Application: http://localhost"
echo "   🔧 Backend API: http://localhost:8000"
echo "   📱 Frontend: http://localhost:3000"
echo ""
echo "👤 Default Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "📊 Monitor with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"
echo ""


