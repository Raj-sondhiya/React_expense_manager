// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import "firebase/compat/database";
const firebaseConfig = {
    apiKey: "AIzaSyBj05u0MvlE5yMXWauga92DmBV1qeMjn-A",
    authDomain: "expense-manager-99cc0.firebaseapp.com",
    databaseURL: "https://expense-manager-99cc0-default-rtdb.firebaseio.com",
    projectId: "expense-manager-99cc0",
    storageBucket: "expense-manager-99cc0.appspot.com",
    messagingSenderId: "121696770914",
    appId: "1:121696770914:web:e394224381d67241acea3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database }; // Export the Firebase database instance
