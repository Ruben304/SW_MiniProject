# SW_MiniProject

## Collaborators: 
- Johnson Yang
- Ruben Carbajal 

## Project:
Welcome to Chit Chat* this is a messaging app you can use to talk between friends, acquaintances, or any user signed up

## Demo:
Here is the youtube video link to see the demo of our project: https://youtu.be/t92t7-4fDeI
We have also included some screenshots in the documentation -> screenshots folder of ther different behaviors our application has.
Other documentation such as Testing and results, and CoPilot Acknowledgement are left in the documentation folder, while design decisions is in this README

## Tools: 
- React for the front end 
- Firebase for the user login authentication, user, and message storage

## Timeline/Design Decisions: 
  The first part of the project was setting up the environment such as creating a firebase and configuring the correct dependencies 
A firebase can be created using this link: https://console.firebase.google.com/, ensuring you have all the dependencies for react and firebase installed. We chose firebase for the backend as its API allowed for easy access to its database, and we chose to create a website as we thought it would be the simpliest, and as such we chose react for the frontend as it allowed for seamless connection between js, html, and css to create a user-friendly website. 

  Now we work on configuring the authentication for the application. We start by enabling this feature on the Firebase website and choosing the Google login method. There are other ways to do it such as regular email and password or Facebook login but Google login seemed the most intuitive and gets more information about the user such as 
name, email, and photo. Some resources for this part are: https://firebase.google.com/docs/auth/web/google-signin and https://youtu.be/sYlOJykMEnA?si=ZkPbJZMN3rlqPbZJ
With these resources, we completed the login and logout done we can now move on to styling he home screen. When the users enters the page is it greeted and prompted to log in, 
once logged in then we can move on to the chat page. Furthermore, upon login, the users' data is stored within the realtime database on firebase, this will be used later in the search function.

  In the chat page, there are two main features, search and chat. First we will go over the search feature, and things to do before we start coding is setting up a database where
the user information can be stored. Going to the Firebase website and setting that up will show you the users that are stored. Now we can make a "profile" with the users that have
successfully logged in. We used an array of methods that essentially populate the matching users when a search is queried. If one or more users match that then their name and email will display in the dropdown. some resources I used for this were https://firebase.google.com/docs/database/web/start, ChatGPT, and https://youtu.be/q1bxyyKh3Dc?si=xgQPuOdeIRPwBQbz. Then after selecting who the user wants to message, the search dropdown closes which leaves more space for messaging, and the receipients info is stored within a variable in the code. 

For the chatting application of the app, after selecting the receipient to whom the messages will be sent to, we create a unique string consisting of the uid of both the sender and receipient and we create a chatroom with that unique id in the database. Then the user can message that specific recipient. This was done by first figuring out how to send and receieve messages from the database. Then we just have to create a unique room id which is just the concatenation of the two users ID, and rather than sending and receiving messages from the entire database, both users will only see messages within this chatroom. Using these sources https://github.com/fireship-io/react-firebase-chat https://www.geeksforgeeks.org/user-to-user-private-chat-app-using-reactjs-and-firebase-without-socket-programming/, and custom css to separate the messages as blue and on the right if it is sent by the user and green and on the left if it is not. We also added some code to display who you are chatting with on the top left.

  


