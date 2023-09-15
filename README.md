# SW_MiniProject

## Collaborators: 
- Ruben Carbajal 
- Johnson Yang

## Project:
Welcome to Chit Chat* this is a messaging app you can use to talk between friends, acquaintances, or any user signed up

## Tools: 
- React for the front end 
- Firebase for the user login authentication, user, and message storage

## Timeline: 
  The first part of the project was setting up the environment such as creating a firebase and configuring the correct dependencies 
A firebase can be created using this link: https://console.firebase.google.com/, ensuring you have all the dependencies for react and firebase installed.

  Now we work on configuring the authentication for the application. We start by enabling this feature on the Firebase website and choosing the Google login method. There are other ways to do it such as regular email and password or Facebook login but Google login seemed the most intuitive and gets more information about the user such as 
name, email, and photo. Some resources for this part are: https://firebase.google.com/docs/auth/web/google-signin and https://youtu.be/sYlOJykMEnA?si=ZkPbJZMN3rlqPbZJ
With these resources, we completed the login and logout done we can now move on to styling he home screen. When the users enters the page is it greeted and prompted to log in, 
once logged in then we can move on to the chat page. 

  In the chat page, there are two main features, search and chat. First we will go over the search feature, and things to do before we start coding is setting up a database where
the user information can be stored. Going to the Firebase website and setting that up will show you the users that are stored. Now we can make a "profile" with the users that have
successfully logged in. We used an array of methods that essentially populate the matching users when a search is queried. If one or more users match that then their name and email will display in the dropdown. some resources I used for this were https://firebase.google.com/docs/database/web/start, ChatGPT, and https://youtu.be/q1bxyyKh3Dc?si=xgQPuOdeIRPwBQbz


  


