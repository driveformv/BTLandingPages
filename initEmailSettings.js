/**
 * Initialize Email Settings in Firestore
 * 
 * This script creates the initial email settings document in Firestore.
 * It sets up the default email notification settings for recruiter emails.
 * 
 * Usage:
 * node initEmailSettings.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Firebase configuration - hardcoded from firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyCHbPkizviKd_TC7qMmUsLy-KjI-qhrmVo",
  authDomain: "landing-pages-ca8fc.firebaseapp.com",
  projectId: "landing-pages-ca8fc",
  storageBucket: "landing-pages-ca8fc.firebasestorage.app",
  messagingSenderId: "786684458200",
  appId: "1:786684458200:web:73e30e20b4a72bc805d3ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Default email settings
const defaultEmailSettings = {
  to: ["sanhe@m-v-t.com"], // Default to current hardcoded email
  cc: [],
  bcc: []
};

/**
 * Initialize email settings in Firestore
 */
async function initializeEmailSettings() {
  try {
    console.log('Checking if email settings document exists...');
    
    // Check if the document already exists
    const docRef = doc(db, 'settings', 'emailNotifications');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('Email settings document already exists:', docSnap.data());
      return;
    }
    
    // Create the document with default settings
    console.log('Creating email settings document with default values...');
    await setDoc(docRef, defaultEmailSettings);
    
    console.log('Email settings initialized successfully!');
    console.log('Default settings:', defaultEmailSettings);
  } catch (error) {
    console.error('Error initializing email settings:', error);
  }
}

// Run the initialization
initializeEmailSettings()
  .then(() => {
    console.log('Email settings initialization complete.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Initialization failed:', error);
    process.exit(1);
  });
