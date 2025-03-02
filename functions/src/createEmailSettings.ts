/**
 * Create Email Settings in Firestore
 * 
 * This script creates the email settings document in Firestore using the Firebase Admin SDK.
 * It's meant to be run once to ensure the email settings document exists.
 */

import * as admin from 'firebase-admin';

// Default email settings
const defaultEmailSettings = {
  to: ["sanhe@m-v-t.com"], // Default to current hardcoded email
  cc: [],
  bcc: []
};

/**
 * Create email settings in Firestore
 */
export async function createEmailSettings(): Promise<void> {
  try {
    console.log('Checking if email settings document exists...');
    
    // Check if the document already exists
    const docRef = admin.firestore().collection('settings').doc('emailNotifications');
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
  } catch (error: any) {
    console.error('Error creating email settings:', error);
  }
}
