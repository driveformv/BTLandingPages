# Email Settings Management

This document explains how to set up and manage email notification settings for the recruitment application.

## Overview

The application sends email notifications to recruiters when a new job application is submitted. The email recipients (To, Cc, Bcc) are stored in Firestore and can be managed through the admin dashboard.

## Email Settings Document

The email settings are stored in a Firestore document at:
```
settings/emailNotifications
```

The document has the following structure:
```json
{
  "to": ["primary@example.com"],
  "cc": ["manager@example.com"],
  "bcc": ["records@example.com"]
}
```

## Managing Email Settings

### Through the Admin Dashboard

1. Log in to the admin dashboard
2. Navigate to "Email Settings" in the sidebar
3. Add or remove email addresses as needed
4. Click "Save Settings" to apply changes

### Using the Admin Script

If you need to create or reset the email settings document, you can use the provided script:

1. Download your Firebase service account key:
   - Go to the Firebase console
   - Navigate to Project settings > Service accounts
   - Click "Generate new private key"
   - Save the file as `serviceAccountKey.json` in the project root directory

2. Run the script:
   ```
   node create-email-settings.js
   ```

This will create the email settings document with default values if it doesn't exist.

## Troubleshooting

### Permission Issues

If you encounter permission issues when accessing the email settings, make sure:

1. You are logged in as an admin user
2. The Firestore security rules allow access to the settings collection:
   ```
   match /settings/{settingId} {
     allow read, write: if request.auth != null;
   }
   ```

### Email Notifications Not Sending

If email notifications are not being sent:

1. Check that the email settings document exists in Firestore
2. Verify that the Cloud Function is deployed and running
3. Check the Firebase Functions logs for any errors

## Default Configuration

The default email configuration is:
```json
{
  "to": ["sanhe@m-v-t.com"],
  "cc": [],
  "bcc": []
}
```

This will be created automatically when:
- The Email Settings page is accessed for the first time
- A new job application is submitted and the settings don't exist
- The admin script is run
