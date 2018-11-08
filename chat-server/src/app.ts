import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as jwt from 'jsonwebtoken';
import { createConnection } from 'typeorm';
import "reflect-metadata";

// Import user route handlers
import { 
    CreateNewUser, 
    GetActiveUsers,
    GetUserByUsername,
    UpdateUser, 
    RemoveUserById,
    Login
} from './routes/user.routes';

// Import room route handlers
import { 
    CreateRoom,
    GetRoomById,
    GetAllRooms,
    RemoveRoomById
} from './routes/room.routes';

const PORT = process.env.PORT || 8081;
const express = require('express');

createConnection().then(() => {
    const app = express();
    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    // Set secret for signing... should put somewhere better
    app.set('secret', 'supersecret');

    /**
     * Setup the various middlewares used in the application
     *  * bodyParser creates a body in the request containing
     *    any json data sent to the server in the request
     *  * cors middleware allows cross origin resource sharing
     *    so that, during development, you don't run into 500
     *    server errors when requesting resources from a different
     *    origin than the server (eg. localhost:4200 for Angular)
     */
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors({
        origin: 'http://localhost:4200'
    }));

    /**
     * Routes to perform user CRUD operations
     * All routes working
     */
    app.post('/api/users', CreateNewUser);
    app.post('/api/users/login', Login);
    app.get('/api/users/active', GetActiveUsers);
    app.get('/api/users/:username', GetUserByUsername);
    app.post('/api/users/update', UpdateUser);
    app.delete('/api/users/:id', RemoveUserById);

    /**
     * Routes to perform room CRUD operations
     */
    app.post('/api/rooms', CreateRoom); // Create a room
    app.get('/api/rooms', GetAllRooms); // Fetch all rooms
    app.get('/api/rooms/:id', GetRoomById); // Get a room by it's ID
    app.delete('/api/rooms/:id', RemoveRoomById); // Remove a room

    // Listen on PORT
    server.listen(PORT, () => {
        console.log(`Application is now listening on port: ${PORT}`);
    });

    io.on('connection', (socket) => {
        console.log('A user has connected.');
        // Stores the roomId that the socket has joined
        let roomId;

        // Join a chat room by its unique id
        socket.on('join', (room) => {
            roomId = room;
            socket.join(roomId);
        });

        // When leaving a chat room
        socket.on('leave', () => {
            socket.leave(roomId);
        });

        // Receive and emit a message to sockets in a specific room
        socket.on('message', (data) => {
            io.sockets.in(roomId).emit('message', data);
        });

        // When a user disconnects
        socket.on('disconnect', () => {
            console.log('A user has disconnected.')
        })
    })

});
