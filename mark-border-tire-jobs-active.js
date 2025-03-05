/**
 * Script to mark all Border Tire jobs as active in Firestore
 * 
 * This script connects to Firestore, finds all jobs with company='Border Tire',
 * and updates their isActive field to true.
 */

console.log('Starting script to mark Border Tire jobs as active...');

const admin = require('firebase-admin');
console.log('Firebase admin loaded');

try {
  const serviceAccount = require('./hiring.bordertire.com-20250304T104611.json');
  console.log('Service account loaded');

  // Initialize Firebase Admin with the service account
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase admin initialized');

  const db = admin.firestore();
  console.log('Firestore initialized');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

async function markBorderTireJobsActive() {
  try {
    console.log('Fetching Border Tire jobs from Firestore...');
    
    // Query for all jobs with company='Border Tire'
    const jobsRef = db.collection('jobs');
    const snapshot = await jobsRef.where('company', '==', 'Border Tire').get();
    
    if (snapshot.empty) {
      console.log('No Border Tire jobs found in Firestore.');
      return;
    }
    
    console.log(`Found ${snapshot.size} Border Tire jobs in Firestore.`);
    
    // Update each job to be active
    const updatePromises = [];
    snapshot.forEach(doc => {
      const jobData = doc.data();
      console.log(`Job ID: ${doc.id}`);
      console.log(`Title: ${jobData.title}`);
      console.log(`Location: ${jobData.location || 'N/A'}`);
      console.log(`Current isActive status: ${jobData.isActive}`);
      
      // Only update if not already active
      if (jobData.isActive !== true) {
        console.log(`Marking job as active: ${jobData.title}`);
        updatePromises.push(
          jobsRef.doc(doc.id).update({ 
            isActive: true,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          })
        );
      } else {
        console.log(`Job already active: ${jobData.title}`);
      }
      console.log('-----------------------------------');
    });
    
    // Wait for all updates to complete
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`Successfully marked ${updatePromises.length} Border Tire jobs as active.`);
    } else {
      console.log('All Border Tire jobs are already active.');
    }
    
  } catch (error) {
    console.error('Error marking Border Tire jobs as active:', error);
  } finally {
    // Terminate the Firebase Admin app
    admin.app().delete();
  }
}

// Run the function
markBorderTireJobsActive();
