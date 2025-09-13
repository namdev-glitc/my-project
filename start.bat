@echo off
REM Guest Management System - Docker Startup Script for Windows

echo 🚀 Starting Guest Management System...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.docker.example .env
    echo ⚠️  Please edit .env file with your configuration before running again.
    pause
    exit /b 1
)

REM Build and start services
echo 🔨 Building and starting services...
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to be healthy
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check service health
echo 🏥 Checking service health...

REM Check database
docker-compose exec -T db pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo ❌ Database is not ready
) else (
    echo ✅ Database is ready
)

REM Check Redis
docker-compose exec -T redis redis-cli ping >nul 2>&1
if errorlevel 1 (
    echo ❌ Redis is not ready
) else (
    echo ✅ Redis is ready
)

REM Check backend
curl -f http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo ❌ Backend API is not ready
) else (
    echo ✅ Backend API is ready
)

REM Check frontend
curl -f http://localhost:3000 >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend is not ready
) else (
    echo ✅ Frontend is ready
)

REM Check nginx
curl -f http://localhost >nul 2>&1
if errorlevel 1 (
    echo ❌ Nginx is not ready
) else (
    echo ✅ Nginx is ready
)

echo.
echo 🎉 Guest Management System is starting up!
echo.
echo 📋 Access URLs:
echo    🌐 Main Application: http://localhost
echo    🔧 Backend API: http://localhost:8000
echo    📱 Frontend: http://localhost:3000
echo.
echo 👤 Default Login:
echo    Username: admin
echo    Password: admin123
echo.
echo 📊 Monitor with: docker-compose logs -f
echo 🛑 Stop with: docker-compose down
echo.

pause


