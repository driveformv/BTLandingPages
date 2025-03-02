import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - The path in storage where the file should be saved
 * @param {Object} metadata - Optional metadata for the file
 * @returns {Promise<string>} - A promise that resolves to the download URL of the uploaded file
 */
export const uploadFile = async (file, path, metadata = null) => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);
    
    // Upload the file with optional metadata
    const snapshot = metadata 
      ? await uploadBytes(storageRef, file, metadata)
      : await uploadBytes(storageRef, file);
    
    console.log('File uploaded successfully:', snapshot);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('File download URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Generate a unique filename for a resume
 * @param {string} originalFilename - The original filename
 * @param {string} applicantId - The ID of the applicant
 * @returns {string} - A unique filename
 */
export const generateUniqueFilename = (originalFilename, applicantId) => {
  const fileExtension = originalFilename.split('.').pop();
  const timestamp = new Date().getTime();
  return `${applicantId}_${timestamp}.${fileExtension}`;
};

/**
 * Upload a resume file to Firebase Storage
 * @param {File} resumeFile - The resume file to upload
 * @param {string} applicantId - The ID of the applicant
 * @param {string} userId - Optional user ID for metadata
 * @returns {Promise<Object>} - A promise that resolves to an object containing the download URL and filename
 */
export const uploadResume = async (resumeFile, applicantId, userId = null) => {
  try {
    // Generate a unique filename
    const uniqueFilename = generateUniqueFilename(resumeFile.name, applicantId);
    
    // Define the storage path
    const storagePath = `resumes/${uniqueFilename}`;
    
    // Create metadata object
    const metadata = {
      contentType: resumeFile.type,
      customMetadata: {
        applicantId: applicantId
      }
    };
    
    // Add userId to metadata if available
    if (userId) {
      metadata.customMetadata.userId = userId;
    }
    
    // Upload the file with metadata
    const downloadURL = await uploadFile(resumeFile, storagePath, metadata);
    
    return {
      downloadURL,
      filename: uniqueFilename
    };
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};
