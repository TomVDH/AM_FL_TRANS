#!/bin/bash

# AM Translations Helper - Project Setup Script
# This script ensures the project is properly initialized regardless of sync method

set -e  # Exit on any error

echo "🚀 AM Translations Helper - Project Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        print_status "Visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
}

# Clean existing installation if needed
clean_installation() {
    print_status "Cleaning existing installation..."
    
    if [ -d "node_modules" ]; then
        print_status "Removing existing node_modules..."
        rm -rf node_modules
    fi
    
    if [ -f "package-lock.json" ]; then
        print_status "Removing existing package-lock.json..."
        rm -f package-lock.json
    fi
    
    if [ -d ".next" ]; then
        print_status "Removing existing .next build directory..."
        rm -rf .next
    fi
    
    print_success "Cleanup completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    # Install dependencies with verbose output
    if npm install --verbose; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Verify TypeScript configuration
verify_typescript() {
    print_status "Verifying TypeScript configuration..."
    
    if npm run type-check; then
        print_success "TypeScript configuration is valid"
    else
        print_warning "TypeScript errors found - attempting to fix..."
        # Try to fix common font import issues
        if grep -q "next/font/google" src/app/layout.tsx; then
            print_status "Fixing font import issues..."
            sed -i '' 's/import {.*} from '\''next\/font\/google'\''//' src/app/layout.tsx
            sed -i '' 's/const inter = Inter({.*})//' src/app/layout.tsx
            sed -i '' 's/const pixelFont = VT323({.*})//' src/app/layout.tsx
            sed -i '' 's/const pixelifySans = Pixelify_Sans({.*})//' src/app/layout.tsx
            sed -i '' 's/\${inter\.className} //' src/app/layout.tsx
            print_success "Font imports fixed"
        fi
    fi
}

# Build the project
build_project() {
    print_status "Building the project..."
    
    if npm run build; then
        print_success "Project built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Start development server
start_dev_server() {
    print_status "Starting development server..."
    print_status "The application will be available at: http://localhost:3000"
    print_status "Press Ctrl+C to stop the server"
    echo ""
    
    npm run dev
}

# Main setup function
main() {
    echo ""
    print_status "Starting project setup..."
    echo ""
    
    # Check prerequisites
    check_node
    check_npm
    echo ""
    
    # Clean and install
    clean_installation
    install_dependencies
    echo ""
    
    # Verify and build
    verify_typescript
    build_project
    echo ""
    
    print_success "🎉 Project setup completed successfully!"
    echo ""
    print_status "You can now run the following commands:"
    echo "  npm run dev    - Start development server"
    echo "  npm run build  - Build for production"
    echo "  npm run start  - Start production server"
    echo "  npm run lint   - Run linting"
    echo ""
    
    # Ask if user wants to start dev server
    read -p "Would you like to start the development server now? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        start_dev_server
    else
        print_status "Setup complete! Run 'npm run dev' when ready to start development."
    fi
}

# Run main function
main "$@" 