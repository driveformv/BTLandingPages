/**
 * Firestore Initialization Script
 * 
 * This script initializes the Firestore database with sample data.
 * Run this script once to set up the initial data in Firestore.
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";

// Firebase configuration from firebase.js
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

// Initialize Cloud Firestore
const db = getFirestore(app);

// Sample job data
const initialJobs = [
  {
    title: "Production Operator",
    description: "Operate machinery and equipment in the retread tire production process.",
    requirements: "1-2 years of manufacturing experience preferred."
  },
  {
    title: "Quality Control Specialist",
    description: "Ensure all retread tires meet quality standards through inspection and testing.",
    requirements: "Experience in quality control or inspection required."
  },
  {
    title: "Maintenance Technician",
    description: "Perform preventative maintenance and repairs on production equipment.",
    requirements: "Mechanical aptitude and troubleshooting skills required."
  },
  {
    title: "Warehouse Associate",
    description: "Handle inventory management and shipping/receiving operations.",
    requirements: "Forklift certification preferred."
  },
  {
    title: "Plant Supervisor",
    description: "Oversee daily operations and lead a team of production workers.",
    requirements: "3+ years of supervisory experience in manufacturing."
  }
];

// Sample job application data
const initialApplications = [
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    experience: "3-5",
    preferredRole: "1", // This should match the ID of a job in the jobs collection
    availability: "2weeks",
    resumeFilename: "john_doe_resume.pdf",
    applicationDate: new Date(),
    status: "pending"
  },
  {
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "555-987-6543",
    experience: "5+",
    preferredRole: "5", // This should match the ID of a job in the jobs collection
    availability: "immediate",
    resumeFilename: "jane_smith_resume.pdf",
    applicationDate: new Date(),
    status: "reviewed"
  }
];

/**
 * Add a document to a collection
 * @param {string} collectionName - The name of the collection
 * @param {Object} data - The data to add
 * @returns {Promise<Object>} - The added document with its ID
 */
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log(`Document added to ${collectionName} with ID: ${docRef.id}`);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Check if a collection exists and has documents
 * @param {string} collectionName - The name of the collection to check
 * @returns {Promise<boolean>} - True if the collection has documents, false otherwise
 */
const collectionHasDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return !querySnapshot.empty;
  } catch (error) {
    console.error(`Error checking if ${collectionName} has documents:`, error);
    return false;
  }
};

/**
 * Initialize the Firestore database with sample data
 */
const initializeFirestore = async () => {
  try {
    console.log("Checking if collections exist...");
    
    // Check if jobs collection has documents
    const jobsExist = await collectionHasDocuments("jobs");
    if (!jobsExist) {
      console.log("Initializing jobs collection...");
      for (const job of initialJobs) {
        await addDocument("jobs", job);
      }
      console.log("Jobs collection initialized successfully!");
    } else {
      console.log("Jobs collection already exists and has documents.");
    }
    
    // Check if jobApplications collection has documents
    const applicationsExist = await collectionHasDocuments("jobApplications");
    if (!applicationsExist) {
      console.log("Initializing jobApplications collection...");
      for (const application of initialApplications) {
        await addDocument("jobApplications", application);
      }
      console.log("JobApplications collection initialized successfully!");
    } else {
      console.log("JobApplications collection already exists and has documents.");
    }
    
    console.log("Firestore initialization complete!");
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
};

// Run the initialization function
initializeFirestore()
  .then(() => {
    console.log("Script execution complete!");
    // In a Node.js environment, you would exit the process here
    // process.exit(0);
  })
  .catch((error) => {
    console.error("Script execution failed:", error);
    // In a Node.js environment, you would exit with an error code here
    // process.exit(1);
  });
