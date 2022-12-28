# Social Media Web Application

Social media platform for conversation , 
connecting friends and building relationships

## Technical Goals
###### Posts, Comments, Chat, Marketplace:
Users will be able to custom tailor a ”post” to be accessible from other devices. A post will be described as image upload.
The author of the post as well as other users of the web application will be able to “comment” on existing posts. Comment defined as text.
Users can have chat other users on the app.
###### User Authentication:
Users will be able to login with their specific data to access posting, commenting.
We aim to utilize JWT for authentication rather than using external libraries such as Passport.js
User's data will be stored in a database(MongoDB tentatively) to allow for recalling of existing post and profile pages.

## Sample images
![Screenshot from 2022-20-12](https://res.cloudinary.com/di70gas60/image/upload/v1671556378/login_sae9rr.png)
![Screenshot from 2022-20-12](https://res.cloudinary.com/di70gas60/image/upload/v1671556378/home_tuhy8m.png)
![Screenshot from 2022-20-12](https://res.cloudinary.com/di70gas60/image/upload/v1671556377/profile_rljgsv.png)

Social media web application . This will include functionality of posting, commenting, user authentication and messaging.



## Languages/Frameworks
React.js
Node.js
Express.js
JavaScript
Socket.io

## Database
MongoDB

## Login Details

   | Email             | Name | Password | Role       |
   |-------------------|----------|----------|--------------|
   | admin@mail.com | Admin    | admin@123    | Administrator |
   | jasim.mohmd125@gmail.com  | User     | user@123    | User  |
   
   ## Compiling assets


```bash
  cd client
  cd server
  cd socket
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  client:npm start
  server:npm start
  socket:npm start
```
