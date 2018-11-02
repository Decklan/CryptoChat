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

const PORT = process.env.PORT || 8081;
const express = require('express');

createConnection().then(() => {
    const app = express();

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

    // Listen on PORT
    app.listen(PORT, () => {
        console.log(`Application is now listening on port: ${PORT}`);
    });

});
