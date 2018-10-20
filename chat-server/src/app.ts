import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { createConnection } from 'typeorm';

// Import controllers
import { UserController } from './controllers';

/**
 * Set up the express application
 *  - For some reason using the typescript import style 
 *    for this doesn't work so I'm sticking with the require
 *    style for now
 */
const express = require('express');
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
 * Mount each of the controllers to a specified route
 * Doing it this way will allow for better architecture by
 * separating all of the route/API logic to each of the 
 * various controllers that will be used rather than having
 * one big file full of http verbs to different routes. 
 */
app.use('/users', UserController);

// PORT
const PORT = process.env.PORT || 8080;

// Listen on PORT
app.listen(PORT, () => {
    console.log(`Application is now listening on port: ${PORT}`);
});
