# CHAT
CHAT is an Internet Relay Chat application that allows users to chat amongst each other.

### Chat-Client
The frontend client is a Single Page Application using the Angular framework.
* [Angular](https://angular.io)

### Chat-Server
The backend server, RESTful API, and database is implemented with:
* [Express v4](https://expressjs.com/)
* [Socket.io](https://socket.io/)
* [TypeScript](https://www.typescriptlang.org/)
* [TypeORM](http://typeorm.io/#/)
* [Postgres](https://www.postgresql.org/)

#### Features
Users can create an account using a username and password
* Passwords are stored securely using password hashing w/ a salt

Users can login and logout of their account when using the application
* Frontend routes throughout the application are guarded to ensure that
  only users who are logged in can navigate anywhere outside of the login page

Users can create rooms and delete rooms
* Rooms can be deleted only by the user who created them

Users can join rooms and leave rooms
* While joined, you receive messages for the room you are in as well as any messages
  that were broadcasted to a room you are in
* While joined to a room, users can chat with other users who are also in that room

Users can broadcast a message to multiple rooms of their choosing
* Choose from the available rooms and users in those rooms will receive the message

Rooms and users persist across sessions via the use of Postgres
* TypeORM maps application models to relational tables 
* The backend RESTful API handles any routing when requesting info from the DB.

### Running the CHAT application
In order to run CHAT you must first ensure that you meet all of the prerequisite requirements.

#### Prerequisites
1. Please ensure that you have the latest stable version of [NodeJS](https://nodejs.org/en/) installed
   on your local machine.
2. With NodeJS installed, if you do not have the AngularCLI installed please run the following command:
   **npm install -g @angular/cli**
3. This project uses TypeScript as the underlying programming language. As such, in order to appropriately
   compile the backend server, you must ensure that you have TypeScript installed. Similar to installing the 
   Angular CLI, run the following command if you don't have TypeScript: **npm install -g typescript**

### Clone this repository
With the prior prerequisites out of the way, clone this repository to your local machine. Once you have
cloned the repository, navigate to the folder where the project is cloned. You will notice that the project
is split into two separate folders, chat-client and chat-server. Inside of each of these folders, run the 
following command to install relevant dependencies: **npm install**.

#### chat-server
To run the server, you must first compile the server code using TypeScripts compile command. Navigate into the
**chat-server** folder and Run: **tsc** from the command-line. This will compile all of the server code into 
thier JavaScript equivalent files and place them in the build/ folder. Then, to run the server simply type the 
following command in the command-line in the **chat-server** folder: **node build/app.js**

The server should take a moment and then boot up.

#### chat-client
To run the frontend client, you can use the Angular CLI. First, navigate into the **chat-client** folder. Once
inside this folder, run the following command: **ng serve --open**. This will run the frontend Angular development
server and, after a few moments, should open up your default browser and take you to the main page of the application.

### Some basic instructions
In order to use the application you must first register an account. 
* Create a username, a password, and then verify that password and click create account. This should log you into 
  the newly created account and direct you to the lobby page. 
* Once in the lobby you can create rooms, and click the join room button to enter that room.
* Once joined to a room, you can type your messages and click send to send them.
* To logout of the application, from the lobby.. click on your usename in the upper left corner, then click logout.
  This will log you out and redirect you back to the login page. 

To test multiple users, open up a different browser and navigate to **localhost:4200/**. You can create another account,
login, and join that same room to see messages passed back and forth.

#### The application is currently not hosted because college has stripped me of all my money.

