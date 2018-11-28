import * as bodyParser from 'body-parser';
import * as cors from 'cors';
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

// Models
import { RoomMember } from './models/RoomMember';
import { UserResource } from './resources/UserResource';

const PORT = process.env.PORT || 8081;
const express = require('express');

createConnection().then(() => {
    const app = express();
    const server = require('http').Server(app);
    const io = require('socket.io')(server);

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

    // Handler for uncaught exceptions to keep the server from crashing
    process.on('uncaughtException', (err) => {
        console.error('ERROR: Uncaught exception - ' + err.message);
    });

    // Handler for uncaught promise rejections to keep the server from crashing
    process.on('unhandledRejection', (reason, promise) => {
        console.error('ERROR: Unhandled promise rejection - ' + reason.message || reason);
    });

    /**
     * Routes to perform user CRUD operations
     * All routes working
     */
    app.post('/api/users/login', Login);
    app.post('/api/users', CreateNewUser);
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

    /**
     * Store the list of users and the rooms they are in on the server
     * so it can be appropriately emitted back to the client
     */
    let members: RoomMember[] = [];

    io.on('connection', (socket) => {
        console.log('A user has connected.');
        // Stores the roomId that the socket has joined
        let roomId: number;
        let currentMember: RoomMember;

        // Join a chat room by its unique id
        socket.on('join', (member: RoomMember) => {
            // Set the global roomId and join the room
            roomId = member.roomId;
            socket.join(roomId);

            // Add member pairing to members array
            currentMember = member;
            
            // Check if the member is already in the room (page refresh)
            let memberInRoom: boolean = false;
            for (let roomMember of members) {
                if (member.user.id === roomMember.user.id)
                    memberInRoom = true;
            }

            if (!memberInRoom)
                members.push(currentMember);

            // Emit the list of members back to the client
            io.emit('memberJoin', members);
        });

        // When leaving a chat room
        socket.on('leave', (member: RoomMember) => {
            socket.leave(roomId);
            roomId = null;

            // Remove the member from the array of users in room
            let i: number;
            for (i = 0; i < members.length; i++) {
                if (member.user.id === members[i].user.id) {
                    members.splice(i, 1);
                }
            }

            // Emit the list of members back to the client
            io.emit('memberLeave', members);
        });

        // Receive and emit a message to sockets in a specific room
        socket.on('message', (data) => {
            io.sockets.in(roomId).emit('message', data);
        });

        // When a user disconnects
        socket.on('disconnect', () => {
            console.log('A user has disconnected.');
        })
    })

});
