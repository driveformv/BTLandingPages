#!/bin/bash

# This script activates all Border Tire jobs and fixes the Cloud Functions code

echo "===== STEP 1: Checking current jobs in database ====="
node check-jobs-table.js
echo ""

echo "===== STEP 2: Checking XML feed ====="
node check-xml-companies.js
echo ""

echo "===== STEP 3: Marking Border Tire jobs as active ====="
node mark-border-tire-jobs-active.js
echo ""

echo "===== STEP 4: Fixing Cloud Functions code ====="
node fix-cloud-functions.js
echo ""

echo "===== STEP 5: Rebuilding Cloud Functions ====="
cd functions && npm run build
echo ""

echo "===== STEP 6: Checking jobs after fix ====="
cd .. && node check-jobs-table.js
echo ""

echo "===== COMPLETE ====="
echo "All Border Tire jobs should now be marked as active."
echo "The Cloud Functions code has been fixed to prevent this issue from happening again."
echo "To deploy the updated Cloud Functions, run: ./deploy-functions.sh"
