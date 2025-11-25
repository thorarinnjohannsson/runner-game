#!/bin/bash
# Simple script to start the game server

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo ""
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi

# Check if port is already in use
PORT=${PORT:-8000}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port $PORT is already in use!"
    echo ""
    echo "Options:"
    echo "  1. Kill the process: lsof -ti:$PORT | xargs kill -9"
    echo "  2. Use a different port: PORT=8001 ./start.sh"
    echo ""
    read -p "Kill the process on port $PORT? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:$PORT | xargs kill -9 2>/dev/null
        echo "✅ Killed process on port $PORT"
        sleep 1
    else
        exit 1
    fi
fi

# Start the server
echo "🚀 Starting game server..."
node server.js

