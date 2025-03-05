/**
 * Script to mark all non-Border Tire jobs as inactive in the Firestore database
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHbPkizviKd_TC7qMmUsLy-KjI-qhrmVo",
  authDomain: "landing-pages-ca8fc.firebaseapp.com",
  projectId: "landing-pages-ca8fc",
  storageBucket: "landing-pages-ca8fc.firebasestorage.app",
  messagingSenderId: "786684458200",
  appId: "1:786684458200:web:5a087cb7aaa4168105d3ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function markNonBorderTireJobsInactive() {
  try {
    console.log('Fetching jobs from Firestore...');
    
    // Get all jobs from Firestore
    const jobsCollection = collection(db, 'jobs');
    const jobsSnapshot = await getDocs(jobsCollection);
    const jobs = [];
    
    jobsSnapshot.forEach(doc => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`Found ${jobs.length} jobs in Firestore`);
    
    // Count jobs by company
    const companyCounts = {};
    
    jobs.forEach(job => {
      const company = job.company || 'Unknown';
      companyCounts[company] = (companyCounts[company] || 0) + 1;
    });
    
    console.log('\nJobs by company:');
    Object.entries(companyCounts).forEach(([company, count]) => {
      console.log(`${company}: ${count} jobs`);
    });
    
    // Mark non-Border Tire jobs as inactive
    const nonBorderTireJobs = jobs.filter(job => job.company !== 'Border Tire');
    console.log(`\nFound ${nonBorderTireJobs.length} non-Border Tire jobs to mark as inactive`);
    
    for (const job of nonBorderTireJobs) {
      console.log(`Marking job "${job.title}" (${job.id}) as inactive`);
      
      const jobRef = doc(db, 'jobs', job.id);
      await updateDoc(jobRef, {
        isActive: false
      });
    }
    
    console.log('\nAll non-Border Tire jobs have been marked as inactive');
    
  } catch (error) {
    console.error('Error marking non-Border Tire jobs as inactive:', error);
  }
}

// Run the script
markNonBorderTireJobsInactive();
