#!/bin/bash

# This script deploys the Cloud Functions to Firebase

echo "===== Deploying Cloud Functions to Firebase ====="
echo "This will deploy the following functions:"
echo "  - sendApplicationEmails"
echo "  - updateJobsFromXmlFeed"
echo "  - markBorderTireJobsActive"
echo "  - manualUpdateJobs"
echo "  - testEmail"
echo ""

# Build the functions
echo "Building Cloud Functions..."
cd functions && npm run build
cd ..

# Deploy the functions
echo "Deploying Cloud Functions..."
firebase deploy --only functions

echo ""
echo "===== Deployment Complete ====="
echo "The Cloud Functions have been deployed to Firebase."
echo "You can now use the manualUpdateJobs endpoint to trigger a job update."
