// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
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

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Storage
const storage = getStorage(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { db, storage, auth };
