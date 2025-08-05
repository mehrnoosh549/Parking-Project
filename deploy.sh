#!/bin/bash

# Smart Parking System - Local Deployment Script
# This script will set up and run the parking system on your local machine

echo "🚗 Smart Parking System - Local Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    print_error "index.html not found. Please run this script from the project directory."
    exit 1
fi

print_status "Found project files"

# Check for Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    print_status "Python 3 found"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    print_status "Python found"
else
    PYTHON_CMD=""
    print_warning "Python not found"
fi

# Check for Node.js
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    NODE_AVAILABLE=true
    print_status "Node.js and npm found"
else
    NODE_AVAILABLE=false
    print_warning "Node.js/npm not found"
fi

# Function to start Python server
start_python_server() {
    local port=${1:-8000}
    print_info "Starting Python HTTP server on port $port..."
    echo
    print_info "🌐 Your parking system will be available at:"
    echo -e "${GREEN}   http://localhost:$port${NC}"
    echo
    print_info "Press Ctrl+C to stop the server"
    echo "=========================================="
    $PYTHON_CMD -m http.server $port
}

# Function to start Node.js server
start_node_server() {
    print_info "Installing Node.js dependencies..."
    if npm install --silent; then
        print_status "Dependencies installed"
        print_info "Starting Node.js development server..."
        echo
        print_info "🌐 Your parking system will be available at:"
        echo -e "${GREEN}   http://localhost:3000${NC}"
        echo
        print_info "Press Ctrl+C to stop the server"
        echo "=========================================="
        npm start
    else
        print_error "Failed to install Node.js dependencies"
        return 1
    fi
}

# Function to open browser (cross-platform)
open_browser() {
    local url=$1
    if command -v xdg-open &> /dev/null; then
        xdg-open "$url" &> /dev/null &
    elif command -v open &> /dev/null; then
        open "$url" &> /dev/null &
    elif command -v start &> /dev/null; then
        start "$url" &> /dev/null &
    else
        print_info "Please manually open: $url"
    fi
}

# Main deployment logic
echo
print_info "Choose deployment method:"
echo "1) Python HTTP Server (Simple, recommended)"
echo "2) Node.js Development Server (Advanced features)"
echo "3) Just open in browser (No server)"
echo "4) Auto-detect best option"
echo

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        if [ -n "$PYTHON_CMD" ]; then
            start_python_server 8000
        else
            print_error "Python not available. Try option 2 or 3."
            exit 1
        fi
        ;;
    2)
        if [ "$NODE_AVAILABLE" = true ]; then
            start_node_server
        else
            print_error "Node.js not available. Try option 1 or 3."
            exit 1
        fi
        ;;
    3)
        print_info "Opening index.html directly in browser..."
        if [ -f "index.html" ]; then
            open_browser "$(pwd)/index.html"
            print_status "Opened in browser"
            print_warning "Note: Some features may not work without a server"
        else
            print_error "index.html not found"
            exit 1
        fi
        ;;
    4)
        print_info "Auto-detecting best deployment method..."
        if [ "$NODE_AVAILABLE" = true ]; then
            print_info "Using Node.js (best option available)"
            start_node_server
        elif [ -n "$PYTHON_CMD" ]; then
            print_info "Using Python HTTP server"
            start_python_server 8000
        else
            print_info "Opening directly in browser"
            open_browser "$(pwd)/index.html"
            print_warning "Consider installing Python or Node.js for better experience"
        fi
        ;;
    *)
        print_error "Invalid choice. Please run the script again."
        exit 1
        ;;
esac