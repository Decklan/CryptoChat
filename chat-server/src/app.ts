import * as bodyParser from 'body-parser';
import { createConnection } from 'typeorm';

// Import controllers
import { UserController } from './controllers';

// Setup application
const express = require('express');
const app = express();

/**
 * Setup the various middlewares used in the application
 *  * bodyParser creates a body in the request containing
 *    any json data sent to the server in the request
 */
app.use(bodyParser.json());

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
