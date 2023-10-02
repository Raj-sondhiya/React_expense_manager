// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import "firebase/compat/database";
const firebaseConfig = {
    // firebase Configuration code
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database }; 
