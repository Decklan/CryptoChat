# CryptoChat
CryptoChat is an Internet Relay Chat application that allows users to chat amongst each other.

#### Features
CryptoChat will have the following features:
* Users can create an account using a username and password
* Users can create both public and private rooms
* Users can join any public room by default
* Users can join private rooms by invite
* Created rooms persist across sessions via the use of Postgres

### Chat-Client
The frontend client uses Angular 6 using Socket.io-client.

### Chat-Server
The backend server and RESTful API is implemented with:
* Express v4
* Socket.io
* TypeScript
* TypeORM
* Postgres
