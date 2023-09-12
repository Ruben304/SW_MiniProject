import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDL1slKD5FUg_bKGB6VRYgt4-qIMH-GGZM",
    authDomain: "mood-chat-9a7f7.firebaseapp.com",
    projectId: "mood-chat-9a7f7",
    storageBucket: "mood-chat-9a7f7.appspot.com",
    messagingSenderId: "15499134485",
    appId: "1:15499134485:web:477886be2ebc25c6cdb01c",
    measurementId: "G-SFE17R7FJE"
  };
  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export const signInWithGoogle = () => {
    signInWithPopup(auth,provider).then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        //signed in user info
        const user = result.user;
    }).catch((error) =>{
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
    })
};

export const signOutWithGoogle = () => {
    signOut(auth).then( () => {
        console.log("sign out success");
    }).catch((error) => {
        console.log("sign out failed");
    });
};