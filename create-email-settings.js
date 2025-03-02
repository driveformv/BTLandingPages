/**
 * Create Email Settings in Firestore
 * 
 * This script creates the email settings document in Firestore using the Firebase Admin SDK.
 * It sets up the default email notification settings for recruiter emails.
 * 
 * Usage:
 * node create-email-settings.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You need to download this from Firebase console

// Initialize Firebase Admin with service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore instance
const db = admin.firestore();

// Default email settings
const defaultEmailSettings = {
  to: ["sanhe@m-v-t.com"], // Default to current hardcoded email
  cc: [],
  bcc: []
};

/**
 * Create email settings in Firestore
 */
async function createEmailSettings() {
  try {
    console.log('Checking if email settings document exists...');
    
    // Check if the document already exists
    const docRef = db.collection('settings').doc('emailNotifications');
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      console.log('Email settings document already exists:', docSnap.data());
      return;
    }
    
    // Create the document with default settings
    console.log('Creating email settings document with default values...');
    await docRef.set(defaultEmailSettings);
    
    console.log('Email settings created successfully!');
    console.log('Default settings:', defaultEmailSettings);
  } catch (error) {
    console.error('Error creating email settings:', error);
  }
}

// Run the creation
createEmailSettings()
  .then(() => {
    console.log('Email settings creation complete.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Creation failed:', error);
    process.exit(1);
  });
