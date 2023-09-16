import './App.css'
import React, {useState, useRef, useEffect} from 'react';
import Login from './Login.js';
import {signOut} from 'firebase/auth';
import {auth, firestore, db} from './firebase.js';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {ref, get} from 'firebase/database'

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
    
    const [collection, setcollection] = useState('placeholder');
    //const [ruser, setruser] = useState(' ');
    const uid = auth.currentUser.uid;
    function selectRuid(user){
        const ruid = user.id;
        const temp = (uid < ruid) ? uid+ruid : ruid+uid;
        setcollection(temp);
        //setruser(user)
        console.log(collection);
    }
    
    const messagesRef = firestore.collection(collection);
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

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const handleSearchUsers = async (text) => {
        text.preventDefault();
        try {
          const usersRef = ref(db, 'users');
          const snapshot = await get(usersRef);
      
          const results = [];
          snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            console.log(user.displayName);
            if (
              user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
              results.push({ id: childSnapshot.key, ...user });
            }
          });
      
          setSearchResults(results);
        } catch (error) {
          console.error('Error searching for users:', error);
        }
        setSearchQuery('');
      };


    return(
        <div className='AppContainer'>
            <div className='LogoutContainer'>
                <p className='Receiver'>Messaging: </p>
                <button className='Logout' onClick={signOutWithGoogle}>Sign Out</button>
            </div>
            <div className='SearchResults'>
                <form onSubmit={handleSearchUsers}>
                    <input value={searchQuery} placeholder='search'
                    onChange={(text) => setSearchQuery(text.target.value)}/>
                    <button>Search Users</button>
                </form>
                <div className = 'searchResultsDropdown'>
                    <ul>
                        {searchResults.map((user,index) => (
                            <li key={(user.id)}>
                                <div onClick={()=>selectRuid(user)}>
                                    <p class="userDisplayName">{user.displayName} - {user.email}</p>
                                </div>
                                {index < searchResults.length -1 && <hr className="separator" />}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='Messages'>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
                <span ref={dummy}></span>
            </div>
            {collection != 'placeholder' && <form onSubmit={sendMessage}>
                <input value = {formValue} onChange={(e) => setFormValue(e.target.value)}/>
                <button type="submit">send message</button>
            </form>}
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