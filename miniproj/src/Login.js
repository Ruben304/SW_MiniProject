import './Login.css'
import React from 'react';
import GoogleButton from 'react-google-button';
import {signInWithPopup, GoogleAuthProvider} from 'firebase/auth'
import {auth, provider, db} from './firebase.js'
import {ref,set } from 'firebase/database';

function Login() {
    function writeUserData(uid, displayName, email){
        set(ref(db,'users/'+uid),{
            displayName: displayName,
            emai:email,
            uid: uid
        });
    }

    const signInWithGoogle = () => {
        signInWithPopup(auth,provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            localStorage.setItem("token",token);
            localStorage.setItem("user",user.displayName);
            writeUserData(user.uid,user.displayName, user.email);
        }).catch((error) =>{
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);
        })
    };

    return(
        <div className = "LoginContainer">
            <div className="Login">
                <span className = "Title">Chat App</span>
                <span className = "Intro">Sign In Below</span>
                <GoogleButton onClick={signInWithGoogle}>Sign In With Google</GoogleButton>
            </div>
        </div>
    )
}

export default Login; 