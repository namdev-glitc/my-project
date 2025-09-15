#!/bin/bash

# Guest Management System - Cloudflare Tunnel Startup Script
# This script starts the Cloudflare tunnel to expose the web application

echo "🌐 Starting Cloudflare Tunnel for Guest Management System..."
echo "========================================================"

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared is not installed. Please install it first."
    exit 1
fi

# Check if the web application is running
if ! curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "❌ Web application is not running on localhost:80"
    echo "   Please start the application first with: ./manage.sh start"
    exit 1
fi

echo "✅ Web application is running"
echo "🚀 Starting Cloudflare tunnel..."
echo ""
echo "📋 Your web application will be available at:"
echo "   https://[tunnel-url].trycloudflare.com"
echo ""
echo "⚠️  Note: This is a temporary tunnel. For production use,"
echo "   consider creating a named tunnel with a custom domain."
echo ""
echo "🛑 Press Ctrl+C to stop the tunnel"
echo ""

# Start the tunnel
cloudflared tunnel --url http://localhost:80

