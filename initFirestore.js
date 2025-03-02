// Import Firebase and Firestore
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");

// Firebase configuration
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

// Sample job data to initialize Firestore
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

// Sample job application data to initialize Firestore
const initialJobApplications = [
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "555-123-4567",
    experience: "3-5",
    preferredRole: "3", // Maintenance Technician
    availability: "2weeks",
    resumeFilename: "john_doe_resume.pdf",
    applicationDate: new Date(),
    status: "pending"
  }
];

// Function to add a document to a collection
const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log(`Document added to ${collectionName} with ID: ${docRef.id}`);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Function to get all documents from a collection
const getDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

// Initialize Firestore with sample data
const initializeFirestore = async () => {
  try {
    console.log('Checking if jobs collection already has data...');
    
    // Check if jobs collection already has data
    const existingJobs = await getDocuments("jobs");
    
    if (existingJobs.length > 0) {
      console.log('Jobs collection already has data. Skipping jobs initialization.');
    } else {
      console.log('Initializing Firestore with sample job data...');
      
      // Add each job to the jobs collection
      for (const job of initialJobs) {
        await addDocument('jobs', job);
      }
      
      console.log('Jobs collection initialization complete!');
    }
    
    console.log('Checking if jobApplications collection already has data...');
    
    // Check if jobApplications collection already has data
    const existingApplications = await getDocuments("jobApplications");
    
    if (existingApplications.length > 0) {
      console.log('JobApplications collection already has data. Skipping applications initialization.');
    } else {
      console.log('Initializing Firestore with sample job application data...');
      
      // Add each job application to the jobApplications collection
      for (const application of initialJobApplications) {
        await addDocument('jobApplications', application);
      }
      
      console.log('JobApplications collection initialization complete!');
    }
    
    console.log('Firestore initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
};

// Run the initialization
initializeFirestore()
  .then(() => {
    console.log('Firestore initialization script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Firestore initialization script failed:', error);
    process.exit(1);
  });
