import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Note: In production, move firebaseConfig to environment variables for security
const firebaseConfig = {
    apiKey: "AIzaSyBv0ptJ-mZAJ-GA3ypLrJxCO8jXFj2BYeo",
    authDomain: "viettool-95b23.firebaseapp.com",
    projectId: "viettool-95b23",
    storageBucket: "viettool-95b23.firebasestorage.app",
    messagingSenderId: "164029685435",
    appId: "1:164029685435:web:b4c4fa97f94d52cc47539e",
    measurementId: "G-PD85SBFNBV"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };