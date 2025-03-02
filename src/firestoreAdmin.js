/**
 * Firestore Admin Utility
 * 
 * This file contains utility functions for administrators to manage Firestore data.
 * It demonstrates how to perform CRUD operations on job listings, applications, and email settings.
 * 
 * Note: This file is not used in the application itself, but serves as a reference
 * for how to interact with Firestore for administrative purposes.
 */

import { 
  addDocument, 
  getDocuments, 
  getDocumentById, 
  updateDocument, 
  deleteDocument, 
  queryDocuments 
} from './firestoreService';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

/**
 * Add a new job listing to Firestore
 * @param {Object} jobData - The job data to add
 * @returns {Promise<Object>} - The added job with its ID
 */
export const addJobListing = async (jobData) => {
  try {
    const newJob = await addDocument('jobs', jobData);
    console.log('Job added successfully:', newJob);
    return newJob;
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
};

/**
 * Get all job listings from Firestore
 * @returns {Promise<Array>} - Array of job listings
 */
export const getAllJobListings = async () => {
  try {
    const jobs = await getDocuments('jobs');
    console.log('Retrieved jobs:', jobs);
    return jobs;
  } catch (error) {
    console.error('Error getting jobs:', error);
    throw error;
  }
};

/**
 * Get a job listing by ID
 * @param {string} jobId - The ID of the job to retrieve
 * @returns {Promise<Object|null>} - The job data or null if not found
 */
export const getJobById = async (jobId) => {
  try {
    const job = await getDocumentById('jobs', jobId);
    console.log('Retrieved job:', job);
    return job;
  } catch (error) {
    console.error('Error getting job:', error);
    throw error;
  }
};

/**
 * Update a job listing
 * @param {string} jobId - The ID of the job to update
 * @param {Object} jobData - The updated job data
 * @returns {Promise<Object>} - The updated job
 */
export const updateJobListing = async (jobId, jobData) => {
  try {
    const updatedJob = await updateDocument('jobs', jobId, jobData);
    console.log('Job updated successfully:', updatedJob);
    return updatedJob;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

/**
 * Delete a job listing
 * @param {string} jobId - The ID of the job to delete
 * @returns {Promise<Object>} - Success status
 */
export const deleteJobListing = async (jobId) => {
  try {
    const result = await deleteDocument('jobs', jobId);
    console.log('Job deleted successfully');
    return result;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

/**
 * Get all job applications from Firestore
 * @returns {Promise<Array>} - Array of job applications
 */
export const getAllApplications = async () => {
  try {
    const applications = await getDocuments('jobApplications');
    console.log('Retrieved applications:', applications);
    return applications;
  } catch (error) {
    console.error('Error getting applications:', error);
    throw error;
  }
};

/**
 * Get applications for a specific job
 * @param {string} jobId - The ID of the job to get applications for
 * @returns {Promise<Array>} - Array of job applications for the specified job
 */
export const getApplicationsForJob = async (jobId) => {
  try {
    const filters = [
      { field: 'preferredRole', operator: '==', value: jobId }
    ];
    
    const applications = await queryDocuments('jobApplications', filters);
    console.log(`Retrieved applications for job ${jobId}:`, applications);
    return applications;
  } catch (error) {
    console.error('Error getting applications for job:', error);
    throw error;
  }
};

/**
 * Get a job application by ID
 * @param {string} applicationId - The ID of the application to retrieve
 * @returns {Promise<Object|null>} - The application data or null if not found
 */
export const getApplication = async (applicationId) => {
  try {
    const application = await getDocumentById('jobApplications', applicationId);
    console.log('Retrieved application:', application);
    return application;
  } catch (error) {
    console.error('Error getting application:', error);
    throw error;
  }
};

/**
 * Update application status
 * @param {string} applicationId - The ID of the application to update
 * @param {string} status - The new status (e.g., 'pending', 'reviewed', 'interviewed', 'hired', 'rejected')
 * @returns {Promise<Object>} - The updated application
 */
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const updatedApplication = await updateDocument('jobApplications', applicationId, { status });
    console.log('Application status updated successfully:', updatedApplication);
    return updatedApplication;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
};

/**
 * Get email settings from Firestore
 * @returns {Promise<Object|null>} - The email settings or null if not found
 */
export const getEmailSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'emailNotifications');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Return null if document doesn't exist, so the component can create it
      return null;
    }
  } catch (error) {
    console.error('Error getting email settings:', error);
    throw error;
  }
};

/**
 * Update email settings in Firestore
 * @param {Object} settings - The email settings to update
 * @returns {Promise<Object>} - The updated settings
 */
export const updateEmailSettings = async (settings) => {
  try {
    const docRef = doc(db, 'settings', 'emailNotifications');
    await setDoc(docRef, settings);
    console.log('Email settings updated successfully:', settings);
    return settings;
  } catch (error) {
    console.error('Error updating email settings:', error);
    throw error;
  }
};

// Example usage:
/*
// Add a new job
const newJob = {
  title: "Software Developer",
  description: "Develop web applications using React and Firebase.",
  requirements: "Experience with React, JavaScript, and Firebase."
};
addJobListing(newJob);

// Get all jobs
getAllJobListings();

// Update a job
updateJobListing("jobId123", { title: "Senior Software Developer" });

// Delete a job
deleteJobListing("jobId123");

// Get applications for a specific job
getApplicationsForJob("jobId123");

// Update application status
updateApplicationStatus("applicationId123", "interviewed");

// Get email settings
getEmailSettings();

// Update email settings
updateEmailSettings({
  to: ["recruiter@example.com"],
  cc: ["manager@example.com"],
  bcc: ["records@example.com"]
});
*/
