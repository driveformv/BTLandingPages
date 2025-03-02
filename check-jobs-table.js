// Script to check the jobs table in Firestore
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

// Firebase configuration from initFirestore.js
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

// Function to get all documents from the jobs collection
const getJobs = async () => {
  try {
    console.log('Fetching all jobs from Firestore...');
    
    const querySnapshot = await getDocs(collection(db, "jobs"));
    console.log('Total jobs found:', querySnapshot.size);
    
    // Print each job with its ID and data
    querySnapshot.forEach((doc) => {
      console.log(`Job ID: ${doc.id}`);
      console.log('Job Data:', doc.data());
      console.log('-----------------------------------');
    });
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return 0;
  }
};

// Run the function
getJobs()
  .then((count) => {
    console.log(`Successfully retrieved ${count} jobs from Firestore.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
