#!/bin/bash

# Guest Management System - Management Script
# This script provides easy management commands for the system

case "$1" in
    "start")
        echo "🚀 Starting Guest Management System..."
        docker-compose up -d
        echo "✅ System started!"
        ;;
    "stop")
        echo "🛑 Stopping Guest Management System..."
        docker-compose down
        echo "✅ System stopped!"
        ;;
    "restart")
        echo "🔄 Restarting Guest Management System..."
        docker-compose restart
        echo "✅ System restarted!"
        ;;
    "status")
        echo "📊 System Status:"
        docker-compose ps
        echo ""
        echo "🏥 Health Check:"
        ./scripts/health_check.sh
        ;;
    "logs")
        echo "📋 System Logs:"
        docker-compose logs -f
        ;;
    "expose")
        echo "🌐 Exposing to Internet..."
        ./scripts/expose_to_internet.sh
        ;;
    "update")
        echo "🔄 Updating System..."
        docker-compose down
        docker-compose build --no-cache
        docker-compose up -d
        echo "✅ System updated!"
        ;;
    "backup")
        echo "💾 Creating Backup..."
        docker-compose exec db pg_dump -U postgres guest_management > backup_$(date +%Y%m%d_%H%M%S).sql
        echo "✅ Backup created!"
        ;;
    "help"|*)
        echo "Guest Management System - Management Commands"
        echo "============================================="
        echo "Usage: ./manage.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start     - Start the system"
        echo "  stop      - Stop the system"
        echo "  restart   - Restart the system"
        echo "  status    - Show system status and health"
        echo "  logs      - Show system logs"
        echo "  expose    - Expose system to internet"
        echo "  update    - Update and restart system"
        echo "  backup    - Create database backup"
        echo "  help      - Show this help"
        echo ""
        echo "Examples:"
        echo "  ./manage.sh start"
        echo "  ./manage.sh status"
        echo "  ./manage.sh expose"
        ;;
esac

