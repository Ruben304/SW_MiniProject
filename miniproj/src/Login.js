import React, {useState, useEffect} from 'react';
import './Login.css'
import { signInWithGoogle } from './firebase.js';
import GoogleButton from 'react-google-button';
import {Navigate} from "react-router-dom";

function Login() {
    const [authenticated, setauthenticated] = useState(null);
    useEffect(() => {
        const loggedInUser = localStorage.getItem("authenticated");
        if (loggedInUser) {
        setauthenticated(true);
        } else {
            setauthenticated(false);
        }
    }, []);
    if (!authenticated){
        return(
            <div className = "LoginContainer">
                <div className="Login">
                    <span className = "Title">Chat App</span>
                    <span className = "Intro">Sign In Below</span>
                    <GoogleButton onClick={signInWithGoogle}>Sign In With Google</GoogleButton>
                </div>
            </div>
        )
    } else {
        return <Navigate replace to ="/app" />;
    }
}
export default Login;