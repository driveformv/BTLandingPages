# Security Improvements: Firebase Configuration

## Overview

This document outlines the security improvements made to address the exposed Google Firebase API keys in the codebase. The changes follow security best practices by moving sensitive configuration values from hardcoded values in source code to environment variables.

## Changes Made

1. **Environment Variables Setup**
   - Added Firebase configuration variables to the `.env` file
   - Created placeholder values that need to be replaced with actual Firebase configuration

2. **Updated Files**
   - `src/firebase.js`: Now uses environment variables instead of hardcoded values
   - `src/initFirestoreScript.js`: Now imports configuration from firebase.js
   - `initFirestore.js`: Now uses a shared configuration from firebase-config.js
   - `public/test-upload.html`: Now uses an external configuration file
   - `public/init-firestore.html`: Now uses an external configuration file

3. **New Files Created**
   - `public/firebase-config.js`: External configuration for HTML files
   - `firebase-config.js`: Node.js configuration loader for server-side scripts

4. **Dependencies Added**
   - Added `dotenv` package to load environment variables in Node.js scripts

## Required Actions

### 1. Rotate Firebase API Keys

The previously hardcoded API keys have been exposed in the source code and should be considered compromised. You should:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `landing-pages-ca8fc`
3. Navigate to Project Settings
4. In the "General" tab, scroll down to "Your apps" section
5. Find your web app and click the "⋮" (three dots) menu
6. Select "Manage API key"
7. This will take you to the Google Cloud Console where you can:
   - Regenerate the API key
   - Add API key restrictions (recommended):
     - HTTP referrer restrictions to limit where the key can be used
     - API restrictions to limit which Google APIs the key can access

### 2. Update Environment Variables

After rotating your API keys, update the `.env` file with the new values:

```
REACT_APP_FIREBASE_API_KEY=your_new_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=landing-pages-ca8fc.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=landing-pages-ca8fc
REACT_APP_FIREBASE_STORAGE_BUCKET=landing-pages-ca8fc.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=786684458200
REACT_APP_FIREBASE_APP_ID=1:786684458200:web:73e30e20b4a72bc805d3ad
```

### 3. Update Test HTML Files

For the HTML test files that use Firebase directly, update the placeholder in `public/firebase-config.js`:

```javascript
// Replace this with your new API key
apiKey: "YOUR_API_KEY_PLACEHOLDER",
```

## Additional Security Recommendations

1. **Set Up Firebase Authentication**
   - Implement user authentication to control access to your Firebase resources
   - Configure Firebase Security Rules to restrict access based on authentication

2. **Configure Firebase Security Rules**
   - Update Firestore and Storage security rules to restrict access to authorized users only
   - Example rules are provided in the FIRESTORE_README.md file

3. **API Key Restrictions**
   - In the Google Cloud Console, set up restrictions for your API keys:
     - Restrict by HTTP referrers to only allow your application domains
     - Restrict by IP address for server-side API keys
     - Restrict which Google APIs the key can access

4. **Consider Server-Side Operations**
   - For sensitive operations, consider moving them to server-side code (Firebase Cloud Functions)
   - This prevents exposure of API keys and adds an additional layer of security

## Testing Your Changes

After implementing these changes, test your application thoroughly to ensure all Firebase functionality still works correctly:

1. Test the main application functionality
2. Test the Firestore initialization scripts
3. Test the file upload functionality
4. Test the admin dashboard

## References

- [Firebase Security Best Practices](https://firebase.google.com/docs/web/setup#configure-api-keys)
- [Google Cloud API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Environment Variables in React](https://create-react-app.dev/docs/adding-custom-environment-variables/)
