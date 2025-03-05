const admin = require('firebase-admin');
const serviceAccount = require('./firebase-config.js');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkJobsTable() {
  try {
    console.log('Checking jobs table...');
    
    // Get all jobs from Firestore
    const jobsSnapshot = await db.collection('jobs').get();
    
    if (jobsSnapshot.empty) {
      console.log('No jobs found in Firestore.');
      return;
    }
    
    console.log(`Found ${jobsSnapshot.size} jobs in Firestore.`);
    
    // Count active and inactive jobs
    let activeCount = 0;
    let inactiveCount = 0;
    let borderTireCount = 0;
    let nonBorderTireCount = 0;
    
    // Track jobs by company
    const companyCounts = {};
    
    jobsSnapshot.forEach(doc => {
      const jobData = doc.data();
      
      // Count active/inactive
      if (jobData.isActive === true) {
        activeCount++;
      } else {
        inactiveCount++;
      }
      
      // Count by company
      const company = jobData.company || 'Unknown';
      companyCounts[company] = (companyCounts[company] || 0) + 1;
      
      // Count Border Tire vs non-Border Tire
      if (company === 'Border Tire') {
        borderTireCount++;
      } else {
        nonBorderTireCount++;
      }
      
      // Log job details
      console.log(`Job ID: ${doc.id}`);
      console.log(`  Title: ${jobData.title || 'No title'}`);
      console.log(`  Company: ${company}`);
      console.log(`  Active: ${jobData.isActive === true ? 'Yes' : 'No'}`);
      console.log(`  External ID: ${jobData.externalId || 'None'}`);
      console.log('---');
    });
    
    // Print summary
    console.log('\nSummary:');
    console.log(`Total jobs: ${jobsSnapshot.size}`);
    console.log(`Active jobs: ${activeCount}`);
    console.log(`Inactive jobs: ${inactiveCount}`);
    console.log(`Border Tire jobs: ${borderTireCount}`);
    console.log(`Non-Border Tire jobs: ${nonBorderTireCount}`);
    
    console.log('\nJobs by company:');
    Object.entries(companyCounts).forEach(([company, count]) => {
      console.log(`  ${company}: ${count}`);
    });
    
  } catch (error) {
    console.error('Error checking jobs table:', error);
  } finally {
    // Terminate the Firebase app
    await admin.app().delete();
  }
}

// Run the function
checkJobsTable();
