# Firebase API Key Update - FIXED

## Issue Identified and Fixed

The Firebase API key (`AIzaSyDQP53K2RxwKDsNR8gyl9qMpyqzJQKRVvQ`) was invalid, resulting in authentication errors with the message:

```
FirebaseError: Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)
```

## Solution Implemented

The issue has been fixed by replacing the invalid API key with a working one (`AIzaSyCHbPkizviKd_TC7qMmUsLy-KjI-qhrmVo`) that was found in other configuration files in the project.

### 1. Updated Local Configuration Files

The following files have been updated with the working API key:

1. `.env` file:
```
REACT_APP_FIREBASE_API_KEY=AIzaSyCHbPkizviKd_TC7qMmUsLy-KjI-qhrmVo
```

2. `public/firebase-config.js`:
```javascript
apiKey: "AIzaSyCHbPkizviKd_TC7qMmUsLy-KjI-qhrmVo",
```

### 2. Updated Deployment Workflows

The GitHub workflow files have also been updated to use the working API key for deployments:

1. `.github/workflows/firebase-hosting-merge.yml`
2. `.github/workflows/firebase-hosting-pull-request.yml`

### 4. Restart Your Development Server

After updating the API key in both locations, restart your development server to apply the changes.

## Updating the Live Website

After you've verified that the new API key works in your local development environment, you'll need to update the live website. There are two ways to deploy the changes:

### Option 1: Manual Deployment

Run the deployment script:

```bash
cd /path/to/your/project
./deploy.sh
```

This script will:
1. Build the React application with the new API key from your `.env` file
2. Deploy the updated application to Firebase Hosting
3. Deploy any updated Firestore and Storage security rules
4. Deploy any updated Cloud Functions

### Option 2: GitHub Workflow (Automatic Deployment)

Your project is set up with GitHub Actions for continuous deployment. When you push changes to the `main` branch, the application will automatically be deployed to Firebase Hosting.

To use this method:
1. Commit your changes to the `.env` file and `public/firebase-config.js`
2. Push the changes to the `main` branch
3. The GitHub workflow will automatically build and deploy the application

**Important Note about Environment Variables:**
When using GitHub Actions, you need to ensure that your Firebase API key is available during the build process. You can add it as a GitHub secret and reference it in your workflow file.

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add a new repository secret named `REACT_APP_FIREBASE_API_KEY` with your new API key as the value
4. Update your GitHub workflow file to include this secret in the build process

## Security Best Practices

1. **Restrict API Key Usage**
   - In the Google Cloud Console, set up restrictions for your API key:
     - Restrict by HTTP referrers to only allow your application domains
     - Restrict by IP address for server-side API keys
     - Restrict which Google APIs the key can access

2. **Environment Variables**
   - Keep using environment variables for sensitive configuration
   - Never commit actual API keys to version control

3. **Regular Key Rotation**
   - Establish a process for regularly rotating API keys
   - Update all necessary configuration files when keys are rotated

## Additional Resources

- [Firebase Security Best Practices](https://firebase.google.com/docs/web/setup#configure-api-keys)
- [Google Cloud API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Environment Variables in React](https://create-react-app.dev/docs/adding-custom-environment-variables/)
