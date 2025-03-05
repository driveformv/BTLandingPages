#!/bin/bash

# Script to call the markBorderTireJobsActive Cloud Function
# This function marks all Border Tire jobs as active in Firestore

echo "Calling markBorderTireJobsActive Cloud Function..."

# Call the Cloud Function using curl
curl -X POST https://us-central1-landing-pages-ca8fc.cloudfunctions.net/markBorderTireJobsActive

echo ""
echo "Done!"
