import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Add a document to a collection
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// Get all documents from a collection
export const getDocuments = async (collectionName, activeOnly = true) => {
  try {
    let q;
    
    // If it's the jobs collection and activeOnly is true, only get active jobs
    if (collectionName === 'jobs' && activeOnly) {
      q = query(collection(db, collectionName), where('isActive', '==', true));
    } else {
      q = collection(db, collectionName);
    }
    
    const querySnapshot = await getDocs(q);
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

// Get a document by ID
export const getDocumentById = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data);
    return { id: documentId, ...data };
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

// Query documents with filters
export const queryDocuments = async (collectionName, filters = [], sortBy = null, limitTo = null) => {
  try {
    let q = collection(db, collectionName);
    
    // Add filters
    if (filters.length > 0) {
      const queryConstraints = filters.map(filter => {
        return where(filter.field, filter.operator, filter.value);
      });
      q = query(q, ...queryConstraints);
    }
    
    // Add sorting
    if (sortBy) {
      q = query(q, orderBy(sortBy.field, sortBy.direction || 'asc'));
    }
    
    // Add limit
    if (limitTo) {
      q = query(q, limit(limitTo));
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error("Error querying documents: ", error);
    throw error;
  }
};
