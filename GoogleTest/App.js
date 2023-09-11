import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import GoogleButton from 'react-google-button';
import {signInWithPopup, signOut } from "firebase/auth";
import { authentication, provider } from './components/config';
import CustomButton from './components/signOutButton';

export default function App() {
  
  function signIn() {
    alert('Sign in message');
  }
  
  function signUp(){
    signInWithPopup(authentication, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // comment for now to see if i need it for later
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      // const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
      // can use information from the google account here 
      // such as: name = user.displayname
      // email = user.email
      // photo = user.photoURL

      //make a redirect here
      alert(user.displayName);

    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.log(errorMessage);
    });
  }

  function handleSignOut() {
    // Implement Sign-Out logic
    signOut(authentication)
      .then(() => {
        alert('User signed out successfully.');
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return (
    <View style={styles.container}>
      <Text> Google Firebase Authentication Test 2!</Text>
      <StatusBar style="auto" />
      <GoogleButton onClick={signUp}/>
      <CustomButton title="Sign Out" onPress={handleSignOut}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
