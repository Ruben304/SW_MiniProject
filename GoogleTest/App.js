import React, { useState, useEffect } from 'react';
import {View,Text,StyleSheet,TouchableOpacity,TextInput,FlatList,Button,} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GoogleButton from 'react-google-button';
import { signInWithPopup, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { authentication, provider, firestore } from './components/config';
import {
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already signed in (e.g., on app start)
    // You can implement this logic using Firebase authentication

    // For demonstration purposes, I'm assuming the user is not signed in initially.
    setIsSignedIn(false);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isSignedIn ? 'Chat' : 'Home'}>
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
                setIsSignedIn={setIsSignedIn}
              />
            ),
            headerLeft: null,
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
    <View style={styles.homeContainer}>
      <View style={styles.whiteSquare}></View>
      <View style={styles.contentContainer}>
        <Text style={styles.logoText}>Mood Chat</Text>
        <Text style={styles.boldText}>Sign in to chat</Text>
        <StatusBar style="auto" />
        <GoogleButton onClick={signUp} />
      </View>
    </View>
  );
}

function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Firestore collection for chat messages
  const messagesCollection = collection(firestore, 'messages');
  // Firestore collection for user profiles
  const usersCollection = collection(firestore, 'users');

  // Load existing messages from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(messagesCollection, (querySnapshot) => {
      const newMessages = [];
      querySnapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    // Add the new message to Firestore
    await addDoc(messagesCollection, {
      text: message,
      timestamp: new Date(),
      userId: authentication.currentUser.uid, // Include user ID
    });
    setMessage(''); // Clear the input field
  };

  // Function to search for users by username or email
  const searchUsers = async () => {
    const q = query(usersCollection, where('username', '==', searchQuery));
    const querySnapshot = await getDocs(q);

    const matchingUsers = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      matchingUsers.push({ id: doc.id, ...userData });
    });

    setSearchResults(matchingUsers);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftPane}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for people..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <Button title="Search" onPress={searchUsers} />
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <Text>{item.username}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.rightPane}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text>{item.text}</Text>}
        />
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={(text) => setMessage(text)}
            placeholder="Type your message..."
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    </View>
  );
}

function SignOutButton({ navigation, setIsSignedIn }) {
  function handleSignOut() {
    signOut(authentication)
      .then(() => {
        alert('User signed out successfully.');
        setIsSignedIn(false);
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
    backgroundColor: '#blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeContainer: {
    flex: 1,
    backgroundColor: '#blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontWeight: 'bold',
    fontSize: 48,
    marginBottom: 20,
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
  whiteSquare: {
    width: 400, // Updated width to 400
    height: 225, // Updated height to 225
    backgroundColor: 'white',
    position: 'absolute',
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    marginLeft: -200, // Half of the width (negative margin)
    marginTop: -112.5, // Half of the height (negative margin)
    borderRadius: 10, // Add border radius to make edges round
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leftPane: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Adjust the color as needed
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 16,
    borderRadius: 5,
  },
  rightPane: {
    flex: 2,
  },
  searchResults: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 5,
    marginBottom: 16,
  }
});


// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import GoogleButton from 'react-google-button';
// import { signInWithPopup, signOut } from 'firebase/auth';
// import { authentication, provider } from './components/config';
// import 'firebase/firestore';
// import { NavigationContainer, useNavigation } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// const Stack = createNativeStackNavigator();

// export default function App() {
//   const [isSignedIn, setIsSignedIn] = useState(false); // Lift the state to the App component

//   useEffect(() => {
//     // Check if the user is already signed in (e.g., on app start)
//     // You can implement this logic using Firebase authentication

//     // For demonstration purposes, I'm assuming the user is not signed in initially.
//     setIsSignedIn(false);
//   }, []);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName={isSignedIn ? "Chat" : "Home"}>
//         <Stack.Screen
//           name="Home"
//           component={SignInScreen}
//           options={{ headerShown: true }}
//         />
//         <Stack.Screen
//           name="Chat"
//           component={ChatScreen}
//           options={({ navigation }) => ({
//             title: 'Chat',
//             headerRight: () => (
//               <SignOutButton
//                 navigation={navigation}
//                 setIsSignedIn={setIsSignedIn} // Pass setIsSignedIn as a prop
//               />
//             ),
//             headerLeft: null, // Hide the back arrow
//           })}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// function SignInScreen() {
//   const navigation = useNavigation();

//   function signUp() {
//     signInWithPopup(authentication, provider)
//       .then((result) => {
//         const user = result.user;
//         alert(`Welcome, ${user.displayName}!`);
//         navigation.navigate('Chat');
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });
//   }

//   return (
//     <View style={styles.homeContainer}>
//       <View style={styles.whiteSquare}></View>
//       <View style={styles.contentContainer}>
//         <Text style={styles.logoText}>Mood Chat</Text>
//         <Text style={styles.boldText}>Sign in to chat</Text>
//         <StatusBar style="auto" />
//         <GoogleButton onClick={signUp} />
//       </View>
//     </View>
//   );
// }

// function ChatScreen() {
//   return (
//     <View style={styles.container}>
//       <Text>Welcome to the Chat Screen!</Text>
//     </View>
//   );
// }

// function SignOutButton({ navigation, setIsSignedIn }) {
//   function handleSignOut() {
//     // Perform sign out logic here
//     // ...
//     signOut(authentication)
//       .then(() => {
//         alert('User signed out successfully.');
//         setIsSignedIn(false); // Update the state to indicate signed out
//         navigation.navigate('Home');
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });
//   }

//   return (
//     <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
//       <Text style={styles.signOutButtonText}>Sign Out</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   homeContainer: {
//     flex: 1,
//     backgroundColor: 'lavendar',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   whiteSquare: {
//     width: 400, // Updated width to 400
//     height: 225, // Updated height to 225
//     backgroundColor: 'white',
//     position: 'absolute',
//     top: '50%', // Center vertically
//     left: '50%', // Center horizontally
//     marginLeft: -200, // Half of the width (negative margin)
//     marginTop: -112.5, // Half of the height (negative margin)
//     borderRadius: 10
//   },
//   contentContainer: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: 'lavender',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   logoText: {
//     fontWeight: 'bold', // Make the text bold
//     fontSize: 48, // Increase the font size
//     marginBottom: 20, // Add some space below the text
//     color: 'black',
//   },
//   boldText: {
//     fontWeight: 'bold',
//     fontSize: 22,
//     marginBottom: 10,
//     color: 'black',
//   },
//   signOutButton: {
//     padding: 10,
//     marginRight: 10,
//   },
//   signOutButtonText: {
//     color: 'black',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });
