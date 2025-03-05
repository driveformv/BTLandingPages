#!/bin/bash

# This script runs the diagnostic and fix scripts in sequence

echo "===== STEP 1: Checking current jobs in database ====="
node check-jobs-table.js
echo ""
echo "===== STEP 2: Checking XML feed ====="
node check-xml-companies.js
echo ""
echo "===== STEP 3: Marking Border Tire jobs as active ====="
node mark-border-tire-jobs-active.js
echo ""
echo "===== STEP 4: Checking jobs after fix ====="
node check-jobs-table.js
echo ""
echo "===== COMPLETE ====="
echo "All Border Tire jobs should now be marked as active."
echo "If you still see issues, please check the XML feed and database manually."
