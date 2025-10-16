import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1Bbr1smnKb9AzfxTh9VZkF3X9Q-Zg2dw",
  authDomain: "ubss-9f4a1.firebaseapp.com",
  projectId: "ubss-9f4a1",
  storageBucket: "ubss-9f4a1.firebasestorage.app",
  messagingSenderId: "124546511785",
  appId: "1:124546511785:web:b0d098bf3db618d2b04ab8",
  measurementId: "G-5X9YC8NLRQ"
};

// Initialize Firebase with error handling
let app, db, auth, storage;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create mock objects to prevent crashes
  app = null;
  db = null;
  auth = null;
  storage = null;
}

export { db, auth, storage };
export default app;
