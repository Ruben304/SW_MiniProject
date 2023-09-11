import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GoogleButton from 'react-google-button';
import { signInWithPopup, signOut } from 'firebase/auth';
import { authentication, provider } from './components/config';
import 'firebase/firestore';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Lift the state to the App component

  useEffect(() => {
    // Check if the user is already signed in (e.g., on app start)
    // You can implement this logic using Firebase authentication

    // For demonstration purposes, I'm assuming the user is not signed in initially.
    setIsSignedIn(false);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isSignedIn ? "Chat" : "Home"}>
        <Stack.Screen
          name="Home"
          component={SignInScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation }) => ({
            title: 'Chat',
            headerRight: () => (
              <SignOutButton
                navigation={navigation}
                setIsSignedIn={setIsSignedIn} // Pass setIsSignedIn as a prop
              />
            ),
            headerLeft: null, // Hide the back arrow
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function SignInScreen() {
  const navigation = useNavigation();

  function signUp() {
    signInWithPopup(authentication, provider)
      .then((result) => {
        const user = result.user;
        alert(`Welcome, ${user.displayName}!`);
        navigation.navigate('Chat');
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Mood Chat</Text>
      <Text style={styles.boldText}>Sign in to chat</Text>
      <StatusBar style="auto" />
      <GoogleButton onClick={signUp} />
    </View>
  );
}

function ChatScreen() {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Chat Screen!</Text>
    </View>
  );
}

function SignOutButton({ navigation, setIsSignedIn }) {
  function handleSignOut() {
    // Perform sign out logic here
    // ...
    signOut(authentication)
      .then(() => {
        alert('User signed out successfully.');
        setIsSignedIn(false); // Update the state to indicate signed out
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
      <Text style={styles.signOutButtonText}>Sign Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: 'bold', // Make the text bold
    fontSize: 48, // Increase the font size
    marginBottom: 20, // Add some space below the text
    color: '#4285F4',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
    color: '#4285F4',
  },
  signOutButton: {
    padding: 10,
    marginRight: 10,
  },
  signOutButtonText: {
    color: '#4285F4',
    fontWeight: 'bold',
    fontSize: 16,
  },
});




// {!isSignedIn && <Text style={styles.logoText}>Mood Chat</Text>}
//import { StatusBar } from 'expo-status-bar';
// import React, { useState } from 'react';
// import { StyleSheet, Text, View, } from 'react-native';
// import GoogleButton from 'react-google-button';
// import {signInWithPopup, signOut } from "firebase/auth";
// import { authentication, provider } from './components/config';
// import CustomButton from './components/signOutButton';
// import 'firebase/firestore'


// export default function App() {
  
//   function signIn() {
//     alert('Sign in message');
//   }
  
//   function signUp(){
//     signInWithPopup(authentication, provider)
//     .then((result) => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       // comment for now to see if i need it for later
//       // const credential = GoogleAuthProvider.credentialFromResult(result);
//       // const token = credential.accessToken;
//       // The signed-in user info.
//       const user = result.user;
//       // IdP data available using getAdditionalUserInfo(result)
//       // ...
//       // can use information from the google account here 
//       // such as: name = user.displayname
//       // email = user.email
//       // photo = user.photoURL

//       //make a redirect here
//       alert(user.displayName);

//     }).catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = GoogleAuthProvider.credentialFromError(error);
//       // ...
//       console.log(errorMessage);
//     });
//   }

//   function handleSignOut() {
//     // Implement Sign-Out logic
//     signOut(authentication)
//       .then(() => {
//         alert('User signed out successfully.');
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });
//   }

//   return (
//     <View style={styles.container}>
//       <Text> Sign in to get ready to chat</Text>
//       <StatusBar style="auto" />
//       <GoogleButton onClick={signUp}/>
//       <CustomButton title="Sign Out" onPress={handleSignOut}/>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
