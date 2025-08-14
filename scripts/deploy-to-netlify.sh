#!/bin/bash

# Netlify Deployment Script for Mahuru Activation 2025
# This script helps set up environment variables and deploy to Netlify

set -e  # Exit on any error

echo "🌿 Mahuru Activation 2025 - Netlify Deployment"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${2}${1}${NC}"
}

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    print_status "❌ Netlify CLI is not installed" $RED
    print_status "Install it with: npm install -g netlify-cli" $YELLOW
    print_status "Or: brew install netlify-cli" $YELLOW
    exit 1
fi

# Check if logged in to Netlify
if ! netlify status &> /dev/null; then
    print_status "🔐 Please log in to Netlify first" $YELLOW
    netlify login
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_status "❌ .env.local file not found" $RED
    print_status "Run 'bun run firebase:setup' first" $YELLOW
    exit 1
fi

print_status "✅ Prerequisites check passed" $GREEN
echo ""

# Read environment variables from .env.local
print_status "📝 Reading environment variables..." $BLUE

# Function to get env var from .env.local
get_env_var() {
    grep "^$1=" .env.local | cut -d '=' -f2- | tr -d '"'
}

# Read Firebase configuration
FIREBASE_API_KEY=$(get_env_var "NEXT_PUBLIC_FIREBASE_API_KEY")
FIREBASE_AUTH_DOMAIN=$(get_env_var "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN")
FIREBASE_PROJECT_ID=$(get_env_var "NEXT_PUBLIC_FIREBASE_PROJECT_ID")
FIREBASE_STORAGE_BUCKET=$(get_env_var "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET")
FIREBASE_MESSAGING_SENDER_ID=$(get_env_var "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID")
FIREBASE_APP_ID=$(get_env_var "NEXT_PUBLIC_FIREBASE_APP_ID")
FIREBASE_MEASUREMENT_ID=$(get_env_var "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID")
ADMIN_EMAILS=$(get_env_var "NEXT_PUBLIC_ADMIN_EMAILS")
SITE_URL=$(get_env_var "NEXT_PUBLIC_SITE_URL")

# Validate required variables
if [ -z "$FIREBASE_API_KEY" ] || [ -z "$FIREBASE_PROJECT_ID" ] || [ -z "$ADMIN_EMAILS" ]; then
    print_status "❌ Missing required environment variables" $RED
    print_status "Please check your .env.local file" $YELLOW
    exit 1
fi

print_status "✅ Environment variables loaded" $GREEN
echo ""

# Ask for confirmation
print_status "🚀 Ready to deploy with the following configuration:" $BLUE
echo "   Project ID: $FIREBASE_PROJECT_ID"
echo "   Site URL: $SITE_URL"
echo "   Admin emails: $ADMIN_EMAILS"
echo ""

read -p "Continue with deployment? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "❌ Deployment cancelled" $YELLOW
    exit 0
fi

echo ""
print_status "🔧 Setting Netlify environment variables..." $BLUE

# Set environment variables in Netlify
netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "$FIREBASE_API_KEY" --silent
netlify env:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN "$FIREBASE_AUTH_DOMAIN" --silent
netlify env:set NEXT_PUBLIC_FIREBASE_PROJECT_ID "$FIREBASE_PROJECT_ID" --silent
netlify env:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET "$FIREBASE_STORAGE_BUCKET" --silent
netlify env:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID "$FIREBASE_MESSAGING_SENDER_ID" --silent
netlify env:set NEXT_PUBLIC_FIREBASE_APP_ID "$FIREBASE_APP_ID" --silent

if [ -n "$FIREBASE_MEASUREMENT_ID" ]; then
    netlify env:set NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID "$FIREBASE_MEASUREMENT_ID" --silent
fi

netlify env:set NEXT_PUBLIC_ADMIN_EMAILS "$ADMIN_EMAILS" --silent
netlify env:set NEXT_PUBLIC_SITE_URL "$SITE_URL" --silent
netlify env:set NEXT_PUBLIC_ENVIRONMENT "production" --silent

print_status "✅ Environment variables set successfully" $GREEN
echo ""

# Build and deploy
print_status "🏗️  Building application..." $BLUE
if bun run build; then
    print_status "✅ Build successful" $GREEN
else
    print_status "❌ Build failed" $RED
    print_status "Please fix build errors and try again" $YELLOW
    exit 1
fi

echo ""
print_status "🚀 Deploying to production..." $BLUE

if netlify deploy --prod; then
    print_status "🎉 Deployment successful!" $GREEN
    echo ""
    print_status "🌐 Your site is live at: $SITE_URL" $BLUE
    print_status "🔧 Admin setup: $SITE_URL/admin/setup" $BLUE
    echo ""
    print_status "Next steps:" $YELLOW
    echo "1. Visit your site and test functionality"
    echo "2. Go to /admin/setup to initialize the database"
    echo "3. Create your admin account"
    echo "4. Start customizing content!"
else
    print_status "❌ Deployment failed" $RED
    print_status "Check the logs above for details" $YELLOW
    exit 1
fi

echo ""
print_status "📊 Deployment summary:" $BLUE
netlify status

echo ""
print_status "🌿 Mahuru Activation 2025 is ready!" $GREEN