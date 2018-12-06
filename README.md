# CryptoChat
CryptoChat is an Internet Relay Chat application that allows users to chat amongst each other.

#### Features
CryptoChat will have the following features:
* Users can create an account using a username and password
* Users can login and logout of their account when using the application
* Users can create rooms and delete rooms (that they created)
* Users can join rooms and leave rooms
* While joined to a room, users can chat with other users who are also in that room
* Users can broadcast a message to multiple rooms of their choosing
* Rooms and users persist across sessions via the use of Postgres

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
