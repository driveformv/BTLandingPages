# Firebase Cloud Functions for Email Sending

This directory contains Firebase Cloud Functions that handle email sending for the Border Tire recruitment application.

## Overview

The main issue with the previous implementation was that it attempted to send emails directly from the client-side code using the Resend API. This approach doesn't work properly because:

1. API keys should not be exposed in client-side code
2. CORS restrictions may prevent direct API calls from the browser
3. Email services typically require server-side authentication

The solution is to use Firebase Cloud Functions to handle email sending on the server-side, triggered by Firestore document creation.

## Functions

### `sendApplicationEmails`

This function is triggered when a new job application document is created in the Firestore `jobApplications` collection. It:

1. Sends a confirmation email to the applicant
2. Sends a notification email to the recruiter with the application details
3. Updates the Firestore document to indicate that emails were sent

### `testEmail`

This is an HTTP endpoint for testing the email functionality. It can be called with a POST request containing:

```json
{
  "email": "recipient@example.com",
  "name": "Recipient Name"
}
```

## Setup and Deployment

### Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Firebase project initialized: `firebase init`
3. Resend API key (from resend.com)

### Configuration

Before deploying, set the Resend API key in Firebase:

```bash
firebase functions:config:set resend.api_key="your_resend_api_key_here"
```

### Installation

```bash
cd functions
npm install
```

### Deployment

```bash
firebase deploy --only functions
```

## Testing

After deployment, you can test the email functionality by:

1. Submitting a job application through the form
2. Checking the Firebase Functions logs for any errors
3. Using the `testEmail` HTTP endpoint

## Troubleshooting

If emails are not being sent:

1. Check the Firebase Functions logs for errors
2. Verify that the Resend API key is correctly set in the Firebase config
3. Ensure the Firestore security rules allow the function to read/write to the `jobApplications` collection
4. Check that the email addresses are valid and properly formatted
