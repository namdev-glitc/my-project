#!/bin/bash

# Guest Management System - Expose to Internet
# This script helps expose the application to the internet

echo "🌐 Guest Management System - Internet Exposure Setup"
echo "=================================================="

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "📦 Installing ngrok..."
    
    # Download and install ngrok
    wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
    tar -xzf ngrok-v3-stable-linux-amd64.tgz
    sudo mv ngrok /usr/local/bin/
    rm ngrok-v3-stable-linux-amd64.tgz
    
    echo "✅ ngrok installed successfully"
    echo "⚠️  Please sign up at https://ngrok.com and get your authtoken"
    echo "   Then run: ngrok config add-authtoken YOUR_TOKEN"
    exit 1
fi

# Check if ngrok is authenticated
if [ ! -f ~/.config/ngrok/ngrok.yml ]; then
    echo "⚠️  ngrok is not authenticated"
    echo "   Please run: ngrok config add-authtoken YOUR_TOKEN"
    exit 1
fi

echo "🚀 Starting ngrok tunnel..."
echo "   This will expose your local application to the internet"
echo "   Press Ctrl+C to stop the tunnel"
echo ""

# Start ngrok tunnel
ngrok http 80 --log=stdout

