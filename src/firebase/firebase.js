import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA_gorPY3cDKXbRJmOBaS9US8dfAFH83lM",
    authDomain: "web-group-2-1c123.firebaseapp.com",
    databaseURL: "https://web-group-2-1c123-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "web-group-2-1c123",
    storageBucket: "web-group-2-1c123.firebasestorage.app",
    messagingSenderId: "582918243763",
    appId: "1:582918243763:web:e6355a322f657d78d337c6",
    measurementId: "G-QTBKV1Z4EX"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const database = getDatabase(app);