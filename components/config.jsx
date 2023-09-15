// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL1slKD5FUg_bKGB6VRYgt4-qIMH-GGZM",
  authDomain: "mood-chat-9a7f7.firebaseapp.com",
  projectId: "mood-chat-9a7f7",
  storageBucket: "mood-chat-9a7f7.appspot.com",
  messagingSenderId: "15499134485",
  appId: "1:15499134485:web:477886be2ebc25c6cdb01c",
  measurementId: "G-SFE17R7FJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const authentication = getAuth(app)
export const provider = new GoogleAuthProvider(app);
export const firestore = getFirestore(app);
export const fireDB = getDatabase(app)