#!/bin/bash

# Exit on error
set -e

echo "===== Deploying Firebase Cloud Functions for Email Sending ====="

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

# Navigate to functions directory
cd functions

# Install dependencies
echo "Installing dependencies..."
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

# Deploy functions
echo "Deploying functions..."
cd ..
firebase deploy --only functions

echo "===== Deployment complete! ====="
echo "You can now test the email functionality by submitting a job application."
echo "Check the Firebase Functions logs for any errors: https://console.firebase.google.com/project/_/functions/logs"
