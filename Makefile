# Guest Management System - Makefile

.PHONY: help build up down restart logs clean dev prod test

# Default target
help: ## Show this help message
	@echo "Guest Management System - Docker Commands"
	@echo "========================================"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Production commands
build: ## Build all Docker images
	docker-compose build --no-cache

up: ## Start all services in production mode
	docker-compose up -d

down: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## Show logs for all services
	docker-compose logs -f

# Development commands
dev: ## Start services in development mode
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

dev-logs: ## Show logs in development mode
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Database commands
db-shell: ## Access database shell
	docker-compose exec db psql -U postgres -d guest_management

db-backup: ## Backup database
	docker-compose exec db pg_dump -U postgres guest_management > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-restore: ## Restore database from backup file
	@read -p "Enter backup file name: " file; \
	docker-compose exec -T db psql -U postgres -d guest_management < $$file

# Service-specific commands
backend-logs: ## Show backend logs
	docker-compose logs -f backend

frontend-logs: ## Show frontend logs
	docker-compose logs -f frontend

nginx-logs: ## Show nginx logs
	docker-compose logs -f nginx

redis-logs: ## Show redis logs
	docker-compose logs -f redis

# Utility commands
clean: ## Clean up containers, networks, and volumes
	docker-compose down -v --remove-orphans
	docker system prune -f

clean-all: ## Clean everything including images
	docker-compose down -v --remove-orphans
	docker system prune -af

status: ## Show status of all services
	docker-compose ps

health: ## Check health of all services
	@echo "Checking service health..."
	@curl -s http://localhost/health && echo "✅ Nginx: OK" || echo "❌ Nginx: FAILED"
	@curl -s http://localhost:8000/health && echo "✅ Backend: OK" || echo "❌ Backend: FAILED"
	@curl -s http://localhost:3000 > /dev/null && echo "✅ Frontend: OK" || echo "❌ Frontend: FAILED"

# Test commands
test: ## Run tests
	docker-compose exec backend python -m pytest
	docker-compose exec frontend npm test

# Setup commands
setup: ## Initial setup
	@if [ ! -f .env ]; then \
		cp env.docker.example .env; \
		echo "✅ Created .env file from template"; \
		echo "⚠️  Please edit .env file with your configuration"; \
	fi
	@echo "✅ Setup complete. Run 'make up' to start services."

# Quick start
start: setup up health ## Quick start - setup, build, and start services
	@echo "🎉 Guest Management System is running!"
	@echo "📋 Access URLs:"
	@echo "   🌐 Main Application: http://localhost"
	@echo "   🔧 Backend API: http://localhost:8000"
	@echo "   📱 Frontend: http://localhost:3000"
	@echo "👤 Default Login: admin / admin123"


