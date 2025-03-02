#!/bin/bash

# Exit on error
set -e

echo "===== Deploying Firebase Application with Admin Dashboard ====="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if user is logged in to Firebase
firebase projects:list > /dev/null 2>&1 || {
    echo "You need to log in to Firebase first."
    firebase login
}

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the React application
echo "Building React application..."
npm run build

# Deploy Firestore security rules
echo "Deploying Firestore security rules..."
firebase deploy --only firestore:rules

# Deploy Storage security rules
echo "Deploying Storage security rules..."
firebase deploy --only storage:rules

# Deploy Firebase Cloud Functions
echo "Deploying Cloud Functions..."

# Navigate to functions directory
cd functions

# Install dependencies
echo "Installing functions dependencies..."
npm install

# Build the functions
echo "Building functions..."
npm run build

# Set Resend API key from .env file if not already set
if [ -f "../.env" ]; then
    source "../.env"
    CURRENT_API_KEY=$(firebase functions:config:get resend.api_key 2>/dev/null || echo "")
    
    if [ -z "$CURRENT_API_KEY" ] && [ -n "$REACT_APP_RESEND_API_KEY" ]; then
        echo "Setting Resend API key from .env file..."
        firebase functions:config:set resend.api_key="$REACT_APP_RESEND_API_KEY"
    fi
else
    echo "Warning: .env file not found. Make sure to set the Resend API key manually:"
    echo "firebase functions:config:set resend.api_key=\"your_resend_api_key_here\""
fi

# Return to root directory
cd ..

# Deploy functions
echo "Deploying functions..."
firebase deploy --only functions

# Deploy hosting
echo "Deploying hosting..."
firebase deploy --only hosting

echo "===== Deployment complete! ====="
echo "Your application with the admin dashboard is now deployed."
echo "You can access it at your Firebase hosting URL."
echo ""
echo "Next steps:"
echo "1. Create an admin user using the create-admin-user.js script"
echo "2. Log in to the admin dashboard at /login"
echo ""
echo "For more information, see the ADMIN_DASHBOARD_README.md file."
