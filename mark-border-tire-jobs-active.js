const admin = require('firebase-admin');
const serviceAccount = require('./firebase-config.js');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function markBorderTireJobsActive() {
  try {
    console.log('Starting to mark Border Tire jobs as active...');
    
    // Get all Border Tire jobs from Firestore
    const borderTireJobsSnapshot = await db.collection('jobs')
      .where('company', '==', 'Border Tire')
      .get();
    
    if (borderTireJobsSnapshot.empty) {
      console.log('No Border Tire jobs found in Firestore.');
      return;
    }
    
    console.log(`Found ${borderTireJobsSnapshot.size} Border Tire jobs in Firestore.`);
    
    // Update each Border Tire job to be active
    const updatePromises = [];
    const updatedJobs = [];
    const alreadyActiveJobs = [];
    
    borderTireJobsSnapshot.forEach(doc => {
      const jobData = doc.data();
      console.log(`Job ID: ${doc.id}`);
      console.log(`Title: ${jobData.title || 'No title'}`);
      console.log(`Location: ${jobData.location || 'Unknown'}`);
      console.log(`Current isActive status: ${jobData.isActive === true ? 'Active' : 'Inactive'}`);
      console.log(`External ID: ${jobData.externalId || 'None'}`);
      
      // Only update if not already active
      if (jobData.isActive !== true) {
        console.log(`Marking job as active: ${jobData.title || 'No title'}`);
        updatePromises.push(
          db.collection('jobs').doc(doc.id).update({ 
            isActive: true,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
          })
        );
        updatedJobs.push(jobData.title || 'No title');
      } else {
        console.log(`Job already active: ${jobData.title || 'No title'}`);
        alreadyActiveJobs.push(jobData.title || 'No title');
      }
      console.log('---');
    });
    
    // Wait for all updates to complete
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`\nSuccessfully marked ${updatePromises.length} Border Tire jobs as active.`);
      console.log('\nJobs updated:');
      updatedJobs.forEach((title, index) => {
        console.log(`  ${index + 1}. ${title}`);
      });
    } else {
      console.log('\nAll Border Tire jobs are already active.');
    }
    
    console.log(`\nTotal Border Tire jobs: ${borderTireJobsSnapshot.size}`);
    console.log(`Jobs updated: ${updatedJobs.length}`);
    console.log(`Jobs already active: ${alreadyActiveJobs.length}`);
    
  } catch (error) {
    console.error('Error marking Border Tire jobs as active:', error);
  } finally {
    // Terminate the Firebase app
    await admin.app().delete();
  }
}

// Run the function
markBorderTireJobsActive();
