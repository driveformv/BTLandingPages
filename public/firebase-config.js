/**
 * Firebase Configuration for Client-Side Use
 * 
 * IMPORTANT SECURITY NOTICE:
 * This file is intended for development and testing purposes only.
 * For production use, implement proper security measures:
 * 1. Set up Firebase Authentication
 * 2. Configure Firebase Security Rules
 * 3. Use server-side rendering or a backend API to handle sensitive operations
 * 4. Apply API key restrictions in the Google Cloud Console
 * 
 * DO NOT expose sensitive API keys in client-side code for production applications.
 */

// This configuration should match the environment variables used in the main application
const firebaseConfig = {
  // In a real production environment, these values would be injected by the build process
  // from environment variables, not hardcoded here
  apiKey: "AIzaSyCHbPkizviKd_TC7qMmUsLy-KjI-qhrmVo",
  authDomain: "landing-pages-ca8fc.firebaseapp.com",
  projectId: "landing-pages-ca8fc",
  storageBucket: "landing-pages-ca8fc.firebasestorage.app",
  messagingSenderId: "786684458200",
  appId: "1:786684458200:web:5a087cb7aaa4168105d3ad"
};

// Initialize Firebase if the SDK is loaded
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  console.log('Firebase initialized from firebase-config.js');
} else {
  console.error('Firebase SDK not loaded. Make sure to include the Firebase scripts before this file.');
}
