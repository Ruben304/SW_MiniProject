import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GoogleButton from 'react-google-button';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, get, query,startAt, endAt } from 'firebase/database';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import {
  authentication,
  provider,
  firestore,
  fireDB,
} from './components/config';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    setIsSignedIn(false);

    const unsubscribe = onAuthStateChanged(authentication, (user) => {
      if (user) {
        setIsSignedIn(true);
        fetchUserProfile(user.uid);
      } else {
        setIsSignedIn(false);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid) => {
    try {
      const userRef = ref(fireDB, 'users/' + uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setUserProfile(snapshot.val());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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
        //alert(`Welcome, ${user.displayName}!`);
        navigation.navigate('Chat');
        writeUserProfile(user.uid, user.displayName, user.email, user.photoURL);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  const writeUserProfile = async (uid, displayName, email, photoURL) => {
    try {
      await set(ref(fireDB, 'users/' + uid), {
        displayName,
        email,
        photoURL,
      });
    } catch (error) {
      console.error('Error writing user profile:', error);
    }
  };

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
  const [userProfile, setUserProfile] = useState(null);
  const [displayUserProfile, setDisplayUserProfile] = useState(true);


  const user = authentication.currentUser;

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

  const messagesCollection = collection(firestore, 'messages');
  const usersCollection = collection(firestore, 'users');

  useEffect(() => {
    fetchUserProfile(user.uid);
  }, [user]);

  const fetchUserProfile = async (uid) => {
    try {
      const userRef = ref(fireDB, 'users/' + uid);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setUserProfile(snapshot.val());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const sendMessage = async () => {
    await addDoc(messagesCollection, {
      text: message,
      timestamp: new Date(),
      userId: user.uid,
    });
    setMessage('');
  };

  const handleSearchUsers = async () => {
    try {
      const usersRef = ref(fireDB, 'users');
      const snapshot = await get(usersRef);
  
      const results = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
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
  };

  return (
    <View style={styles.container}>
      {/* Display user profile data */}
      {userProfile && !searchQuery && ( // Only display when searchQuery is empty
        <View style={styles.userProfile}>
          {userProfile.photoURL && (
            <Image source={{ uri: userProfile.photoURL }} style={styles.userAvatar} />
          )}
          <Text style={styles.userName}>Welcome {userProfile.displayName}!</Text>
        </View>
      )}

      {/* Search input */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for users by name or email"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchUsers}
        >
          <Text style={styles.searchButtonText}>Search Users</Text>
        </TouchableOpacity>
      </View>

      {/* Display search results in a dropdown */}
      {searchQuery.length > 0 && searchResults.length > 0 && (
        <View style={styles.searchResultsDropdown}>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <>
              {/* Your item content */}
              <TouchableOpacity
                onPress={() => {
                  // You can customize this action as needed
                  // For example, you can initiate a chat with the selected user
                  initiateChatWithUser(item);
                }}
              >
                <Text>{item.displayName}</Text>
                <Text>{item.email}</Text>
              </TouchableOpacity>
              
              {/* Add a custom separator */}
              {index < searchResults.length - 1 && <View style={styles.separator} />}
            </>
          )}
        />
        </View>
      )}

      {/* Your chat input and messages */}
      <TextInput
        placeholder="Enter your message..."
        value={message}
        onChangeText={(text) => setMessage(text)}
      />
      <TouchableOpacity onPress={sendMessage}>
        <Text>Send</Text>
      </TouchableOpacity>

      {/* Display chat messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{item.text}</Text>
        )}
      />
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    marginTop: 10,
    borderRadius: 2,
    marginBottom: 0,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    height: 35,
  },
  searchButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  userName:{
    fontWeight: 'bold',
    margin: 8,
  },
  searchResultsDropdown: {
    backgroundColor: 'white', // Add white background color here
    borderRadius: 2,
    padding: 10, // Add padding for spacing
    width: 305,
  },
  separator: {
    borderBottomWidth: 1, // Adjust the width as needed
    borderBottomColor: '#d3d3d3', // Adjust the color as needed
    marginHorizontal: 5, // Adjust the margin as needed
    marginVertical: 5, // Adjust the vertical margin to control the length
  },
});
