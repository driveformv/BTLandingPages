import { addDocument } from './firestoreService';

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

/**
 * Initialize Firestore with sample data
 * This function checks if data exists in the specified collection
 * If not, it adds the sample data
 */
export const initializeFirestore = async () => {
  try {
    // Add sample jobs to Firestore
    console.log('Initializing Firestore with sample job data...');
    
    // Add each job to the jobs collection
    for (const job of initialJobs) {
      await addDocument('jobs', job);
    }
    
    console.log('Firestore initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    return false;
  }
};
