import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

// BCrypt for password hashing
import * as bcrypt from 'bcrypt';

// Import model
import { User } from '../../build/entity/User';
import { UserResource } from '../resources/UserResource';

// For salting purposes
const saltRounds = 10;

/**
 * Handles checking the user's password when they log in. 
 * @param req Request containing the username and password for the user logging in
 * @param res Response sends the UserResource if login is successful
 * @returns The UserResource for the user if login was successful else nothing
 */
export function Login(req: Request, res: Response) {
    const userRepository = getConnection().getRepository(User);

    userRepository.findOne({
        where: { userName: req.body.username }
    })
    .then((user: User) => {
        bcrypt.compare(req.body.password, user.hashedPassword)
        .then((response) => {
            if (response === true) {
                user.isActive = true;
                userRepository.save(user)
                .then((user: User) => {
                    let userResource = new UserResource();
                    userResource.id = user.id;
                    userResource.userName = user.userName;
                    userResource.isActive = true;
    
                    res.status(200);
                    res.send(userResource);
                })
                .catch((err) => {
                    res.status(err.statusCode);
                    res.send({
                        error: 'There were issues updating the user active status.'
                    });
                });
            } else {
                res.status(500);
                res.send({
                    error: 'The password you entered does not match our records.'
                });
            }
        })
        .catch((err) => {
            res.status(err.statusCode);
            res.send({
                error: 'There were issue checking the password.'
            })
        });
    })
    .catch((err) => {
        res.status(err.statusCode);
        res.send({
            error: 'There were issues logging in.'
        });
    });
}

/**
 * Creates a new user and adds them to the database
 * @param req The user info we want to create a user with
 * @param res Response to the client with the newly created user
 * @returns The newly created user as a resource from the database
 */
export function CreateNewUser(req: Request, res: Response) {
    const userRepository = getConnection().getRepository(User);

    bcrypt.hash(req.body.password, saltRounds)
    .then((hash) => {
        let newUser = new User();
        newUser.userName = req.body.username;
        newUser.hashedPassword = hash;
        newUser.isActive = true;

        userRepository.save(newUser)
        .then((user: User) => {
            let resource = new UserResource();
            resource.id = user.id;
            resource.userName = user.userName;
            resource.isActive = user.isActive;
            res.status(200);
            res.send(resource);
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            res.send({
                error: 'There was an issue creating the new user.'
            });
        })
    }).catch((err) => {
        console.log(err);
        res.status(500);
        res.send({
            error: 'There was an issue during password creation.'
        });
    });
}

/**
 * Gets all the users who are currently listed as active
 * @param req Request for currently active users
 * @param res Response to the client with the currently active users
 * @returns Collection of currently active users
 */
export function GetActiveUsers(req: Request, res: Response) {
    const userRepository = getConnection().getRepository(User);

    userRepository.find({
        where: { isActive: true }
    })
    .then((activeUsers: User[]) => {
        // Convert each user to a resource
        let activeResources = [];

        for (let active of activeUsers) {
            let resource = new UserResource();
            resource.id = active.id;
            resource.userName = active.userName;
            resource.isActive = active.isActive;

            activeResources.push(resource);
        }

        res.send(activeResources);
    })
    .catch((err) => {
        console.log(err);
    });
}

/**
 * Fetches a user by their username
 * @param req The username for the user we are fetching from the database
 * @param res Response to the client with the requested user
 * @returns The user matching the given username
 */
export function GetUserByUsername(req: Request, res: Response) {
    const userRepository = getConnection().getRepository(User);

    userRepository.findOne({
        where: { userName: req.params.username }   
    })
    .then((user: User) => {
        // Should set additional headers for successful response
        let fetchedUser = new UserResource();
        fetchedUser.id = user.id;
        fetchedUser.userName = user.userName;
        fetchedUser.isActive = user.isActive;

        res.status(200);
        res.send(fetchedUser);
    })
    .catch((err) => {
        res.status(err.statusCode);
        res.send({
            error: err.message
        });
    });
}

/**
 * Updates a users information by the given username
 * @param req The user and updated information that should be updated
 * @param res The newly updated user
 * @returns The newly updated user from the database
 */
export function UpdateUser(req: Request, res: Response) {
    const userRepository = getConnection().getRepository(User);

    userRepository.findOne({
        where: { userName: req.body.userName } // userName could be issue
    })
    .then((user: User) => {
        user.id = req.body.id;
        user.userName = req.body.userName;
        user.isActive = req.body.isActive;
        userRepository.save(user)
        .then((updatedUser: User) => {
            let updated = new UserResource();
            updated.id = updatedUser.id;
            updated.userName = updatedUser.userName;
            updated.isActive = updatedUser.isActive;
            res.send(updated);
        });
    })
    .catch((err) => {
        console.log(err);
    });
}

/**
 * Removes a user from the database by the given id
 * @param req Request containing the id of the user to remove
 * @param res Successful removal of the user
 * @returns Success for removal
 */
export function RemoveUserById(req: Request, res: Response) {
    const userRepository = getConnection().getRepository(User);

    userRepository.findOne({ 
        where: { id: req.params.id }
    })
    .then((user) => {
        userRepository.remove(user);
        res.status(200);
        res.end();
    })
    .catch((err) => {
        console.log(err);
    })
}
















