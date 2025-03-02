/**
 * Script to create an admin user for the application
 * 
 * This script creates a new admin user with email and password authentication
 * using Firebase Admin SDK. It should be run once to set up the initial admin user.
 * 
 * Usage:
 * 1. Make sure you have Firebase Admin SDK installed:
 *    npm install firebase-admin
 * 
 * 2. Run the script with Node.js:
 *    node create-admin-user.js <email> <password>
 * 
 * Example:
 *    node create-admin-user.js admin@example.com mySecurePassword123
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // You need to download this from Firebase console

// Check if email and password are provided
if (process.argv.length < 4) {
  console.error('Usage: node create-admin-user.js <email> <password>');
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Create user with email and password
admin.auth().createUser({
  email: email,
  password: password,
  emailVerified: true,
  disabled: false
})
  .then((userRecord) => {
    console.log('Successfully created admin user:', userRecord.uid);
    
    // Set custom claims to mark user as admin
    return admin.auth().setCustomUserClaims(userRecord.uid, {
      admin: true
    });
  })
  .then(() => {
    console.log(`Successfully set admin claim for user: ${email}`);
    console.log('You can now log in with these credentials in the application.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error creating admin user:', error);
    process.exit(1);
  });
