# XML Feed Job Update Functionality

This document explains the XML feed job update functionality implemented for Border Tire's recruitment website.

## Overview

The system automatically imports job listings from an XML feed provided by MVT Holdings and updates the Firestore database. The jobs are then displayed on the Border Tire recruitment website.

## Features

- **Scheduled Updates**: Jobs are automatically updated daily at midnight (Mountain Time)
- **Manual Updates**: Jobs can be updated manually via an HTTP endpoint
- **Border Tire Jobs Only**: Only jobs for Border Tire are imported from the XML feed
- **Formatting**: Job descriptions are properly formatted for display on the website
- **Inactive Jobs**: Jobs that are no longer in the XML feed are marked as inactive

## Implementation Details

### Cloud Functions

Two Firebase Cloud Functions have been implemented:

1. **updateJobsFromXmlFeed**: A scheduled function that runs daily at midnight (Mountain Time)
2. **manualUpdateJobs**: An HTTP endpoint for manually triggering the job update process

### XML Feed Source

The XML feed is fetched from: `https://mvtholdings.jobs/feeds/indeed.xml`

### Job Processing

For each job in the XML feed:

1. Check if the job is for Border Tire (company field equals "Border Tire")
2. Clean up HTML formatting in the job description
3. Extract job data (title, description, location, etc.)
4. Check if the job already exists in the database
   - If it exists, update it
   - If it doesn't exist, add it
5. Mark jobs not in the feed as inactive

### HTML Formatting

The job descriptions from the XML feed are processed to ensure proper formatting:

- Fix spacing issues (multiple spaces, spacing after punctuation, etc.)
- Fix spacing around special characters (parentheses, brackets, quotes, etc.)
- Fix spacing around currency symbols and other special characters

## Usage

### Automatic Updates

The `updateJobsFromXmlFeed` function runs automatically at midnight (Mountain Time) every day.

### Manual Updates

There are several ways to manually manage the job update process:

#### 1. Using the Admin Interface

The Jobs Management page in the admin dashboard includes two important buttons:

##### a. "Sync Jobs" Button

This button allows administrators to manually trigger the XML feed job update process directly from the web interface. When clicked, the button will:

- Show a loading spinner while the sync is in progress
- Call the `manualUpdateJobs` HTTP endpoint to trigger the XML feed job update
- Display a success message with details about the jobs that were added, updated, or inactivated
- Refresh the jobs list to show the latest data

##### b. "Activate All Jobs" Button

This button allows administrators to mark all Border Tire jobs as active, regardless of their current status. This is particularly useful if jobs were incorrectly marked as inactive during the sync process. When clicked, the button will:

- Show a loading spinner while the activation is in progress
- Call the `markBorderTireJobsActive` HTTP endpoint to mark all Border Tire jobs as active
- Display a success message with details about the jobs that were activated
- Refresh the jobs list to show the latest data

#### 2. Using the Command Line

To manually trigger the job update process from the command line, use the following command:

```bash
./test-job-update.sh landing-pages-ca8fc
```

This script makes a POST request to the `manualUpdateJobs` HTTP endpoint.

To manually mark all Border Tire jobs as active from the command line, use the following command:

```bash
./activate-border-tire-jobs.sh
```

This script makes a POST request to the `markBorderTireJobsActive` HTTP endpoint.

### Known Issues

#### Jobs Being Marked as Inactive

In some cases, the XML feed job update process may incorrectly mark jobs as inactive even though they exist in the XML feed. This can happen due to:

1. Differences in job titles or external IDs between the database and the XML feed
2. Formatting differences in the job data
3. Matching algorithm limitations

If you notice jobs being incorrectly marked as inactive after a sync, simply use the "Activate All Jobs" button to mark them as active again.

## Testing

To test the XML feed parsing functionality, use the following command:

```bash
node test-xml-feed.js
```

This script fetches the XML feed, parses it, and displays information about the jobs.

## Troubleshooting

If jobs are not being updated correctly, check the Firebase Functions logs:

```bash
firebase functions:log --project landing-pages-ca8fc
```

Look for error messages related to the `updateJobsFromXmlFeed` or `manualUpdateJobs` functions.

## Future Improvements

- Add error handling for XML feed fetch failures
- Add email notifications for job update failures
- Add support for additional job fields from the XML feed
- Improve HTML formatting for job descriptions
