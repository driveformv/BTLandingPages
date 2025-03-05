#!/bin/bash

# This script tests the manual job update function by making a POST request to the manualUpdateJobs endpoint.
# It requires the Firebase project ID as an argument.

# Check if a project ID was provided
if [ -z "$1" ]; then
  echo "Error: No Firebase project ID provided."
  echo "Usage: $0 <firebase-project-id>"
  echo "Example: $0 my-firebase-project"
  exit 1
fi

PROJECT_ID=$1
FUNCTION_URL="https://us-central1-${PROJECT_ID}.cloudfunctions.net/manualUpdateJobs"

echo "===== Testing XML Feed Job Update Function ====="
echo "Making POST request to: $FUNCTION_URL"
echo ""

# Make the POST request
curl -X POST $FUNCTION_URL

echo ""
echo "===== Test complete! ====="
echo "Check the Firebase Functions logs for details: https://console.firebase.google.com/project/${PROJECT_ID}/functions/logs"
