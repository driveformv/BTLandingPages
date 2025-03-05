# XML Feed Jobs Integration

This document explains how the XML feed integration works and how to troubleshoot issues with jobs being marked as inactive.

## Overview

The system fetches job listings from an XML feed (https://mvtholdings.jobs/feeds/indeed.xml) and updates the Firestore database with the latest job information. This happens in two ways:

1. **Scheduled Updates**: A Cloud Function runs daily at midnight (America/Denver time) to fetch the latest jobs.
2. **Manual Updates**: You can trigger an update manually using the HTTP endpoint.

## Key Improvements

The following improvements have been made to the job update process:

1. **Better Job Matching**: Jobs are now matched primarily by their external ID (reference number), with title matching as a fallback for Border Tire jobs.
2. **Border Tire Job Protection**: Border Tire jobs are never marked as inactive, even if they're not found in the XML feed.
3. **TypeScript Error Fixes**: All TypeScript errors have been fixed to ensure the code compiles correctly.

## Troubleshooting Scripts

Several scripts have been created to help diagnose and fix issues with the job listings:

### 1. Check Jobs Table

This script checks the current state of jobs in the Firestore database.

```bash
node check-jobs-table.js
```

### 2. Check XML Feed

This script fetches and analyzes the XML feed to see what jobs are available.

```bash
node check-xml-companies.js
```

### 3. Mark Border Tire Jobs as Active

This script marks all Border Tire jobs in the database as active.

```bash
node mark-border-tire-jobs-active.js
```

### 4. Test Job Update

This script runs all the diagnostic scripts in sequence to check the state of jobs before and after marking Border Tire jobs as active.

```bash
./test-job-update.sh
```

### 5. Activate Border Tire Jobs

This script activates all Border Tire jobs and rebuilds the Cloud Functions with the fixed code.

```bash
./activate-border-tire-jobs.sh
```

## Deployment

After making changes to the Cloud Functions code, you need to deploy the changes to make them take effect:

```bash
./deploy-functions.sh
```

## Manual Job Update

You can trigger a manual job update by sending a POST request to the `manualUpdateJobs` endpoint:

```bash
curl -X POST https://your-firebase-project.web.app/manualUpdateJobs
```

## How the Job Matching Works

1. For each job in the XML feed:
   - First, try to match by external ID (reference number)
   - If no match is found, try to match by title (for Border Tire jobs only)
   - If a match is found, update the existing job
   - If no match is found, create a new job

2. For jobs not found in the feed:
   - If it's a Border Tire job, skip it (keep it active)
   - If it's not a Border Tire job, mark it as inactive

This ensures that Border Tire jobs are always kept active, even if they're not in the XML feed.
