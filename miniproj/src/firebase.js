//import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { getDatabase } from 'firebase/database';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDL1slKD5FUg_bKGB6VRYgt4-qIMH-GGZM",
    authDomain: "mood-chat-9a7f7.firebaseapp.com",
    projectId: "mood-chat-9a7f7",
    storageBucket: "mood-chat-9a7f7.appspot.com",
    messagingSenderId: "15499134485",
    appId: "1:15499134485:web:477886be2ebc25c6cdb01c",
    measurementId: "G-SFE17R7FJE",
    databaseURL: "https://mood-chat-9a7f7-default-rtdb.firebaseio.com"
};
  
export const app = firebase.initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const firestore = firebase.firestore();
export const db = getDatabase(app);
