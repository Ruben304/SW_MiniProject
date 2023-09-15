import './App.css'
import React, {useState, useRef} from 'react';
import Login from './Login.js';
import {signOut} from 'firebase/auth';
import {auth, firestore} from './firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

function App(){
    const [user] = useAuthState(auth);
    console.log(user);
    return(
        <div classname = "App">
            <section>
                {user ? <Room/> : <Login/>}
            </section>
        </div>
    );
}

function Room() {

    const signOutWithGoogle = () => {
        signOut(auth).then( () => {
            console.log("sign out success");
        }).catch((error) => {
            console.log("sign out failed");
        });
    };
    
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt');
    const [messages] = useCollectionData(query,{idField: 'id'});
    const [formValue,setFormValue] = useState('');
    const dummy = useRef();

    const sendMessage = async(e) =>{
        e.preventDefault();
        const {uid} = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid
        })
        setFormValue(' ');
        dummy.current.scrollIntoView({behavior: 'smooth'});
    }

    return(
        <div className='AppContainer'>
            <div className='LogoutContainer'>
                <button className='Logout' onClick={signOutWithGoogle}>Sign Out</button>
            </div>
            <div className='Messages'>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
                <span ref={dummy}></span>
            </div>
            <form onSubmit={sendMessage}>
                <input value = {formValue} onChange={(e) => setFormValue(e.target.value)}/>
                <button type="submit">send message</button>
            </form>
        </div>
    )
}

function ChatMessage(props) {
    const { text, uid} = props.message;
  
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
    
    return (<>
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    </>)
}


export default App;