
import React from 'react';
import './App.css';
import { signInWithGoogle } from './firebase.js';

function App() {

    return(
        <div className="App">
            <button onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
    )
}
export default App;
