#!/bin/bash

# Exit on error
set -e

echo "===== Deploying Firebase Cloud Functions for Email Sending and Job Updates ====="

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
echo "You can now test the following functionality:"
echo "1. Email sending by submitting a job application"
echo "2. XML feed job updates by making a POST request to the manualUpdateJobs endpoint:"
echo "   curl -X POST https://us-central1-[YOUR-PROJECT-ID].cloudfunctions.net/manualUpdateJobs"
echo ""
echo "The job update function will also run automatically at midnight (Mountain Time) every day."
echo "Check the Firebase Functions logs for any errors: https://console.firebase.google.com/project/_/functions/logs"
echo ""
echo "For more information about the XML feed job update functionality, see the XML_FEED_JOBS_README.md file."
