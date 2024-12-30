// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAofpefRWjkqbE23_dBDRU9HBJ682HxpyY",
  authDomain: "sortesis.firebaseapp.com",
  projectId: "sortesis",
  storageBucket: "sortesis.firebasestorage.app",
  messagingSenderId: "544562643339",
  appId: "1:544562643339:web:7d7bd48ecdc00cc998af8e",
  measurementId: "G-9PFBQBTVVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);// Import the functions you need from the SDKs you need

export const db = getFirestore(app);
export const storage = getStorage(app);