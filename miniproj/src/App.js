import React,{useState, useEffect} from 'react';
import './App.css'
import { signOutWithGoogle } from './firebase.js';
import {Navigate} from "react-router-dom";

function App() {
    const [authenticated, setauthenticated] = useState(null);
    useEffect(() => {
        const loggedInUser = localStorage.getItem("authenticated");
        if (loggedInUser) {
            setauthenticated(loggedInUser);
        } else {
            setauthenticated(false);
        }
    }, []);
    if (!authenticated){
        return <Navigate replace to ="/" />;
    } else {
        return(
            <button onClick={signOutWithGoogle}>Sign Out</button>
        ) 
    }
}
export default App;