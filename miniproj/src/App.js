
import React, {useState} from 'react';
import './App.css';
import { signInWithGoogle } from './firebase.js';
import GoogleButton from 'react-google-button';

function App() {
    
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
export default App;
