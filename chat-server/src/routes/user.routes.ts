import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

// Import model
import { User } from '../../build/entity/User';

/**
 * Creates a new user and adds them to the database
 * @param req The user info we want to create a user with
 * @param res Response to the client with the newly created user
 * @returns The newly created user from the database
 */
export function CreateNewUser(req: Request, res: Response) {
    const userRepository = getConnection().getRepository(User);

    let newUser = new User();
    newUser.userName = req.body.userName;
    newUser.hashedPassword = req.body.hashedPassword;
    newUser.salt = req.body.salt;
    newUser.isActive = req.body.isActive;

    // Should check to ensure the body contains information (even though forms will ensure this)

    // Should actually hash the password and generate a salt

    userRepository.save(newUser)
        .then((user) => {
            res.send(user);
        }).catch((err) => {
            console.log('There was an issue saving the user');
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
    .then((activeUsers) => {
        // Should set additional headers in here
        res.send(activeUsers);
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
    console.log(req.params.username);
    const userRepository = getConnection().getRepository(User);

    userRepository.findOne({
        where: { userName: req.params.username }   
    })
    .then((user) => {
        // Should set additional headers for successful response
        res.send(user);
    })
    .catch((err) => {
        // Should check the error to provide meaningful response to the client
        console.log(err);
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
        where: { userName: req.body.userName }
    })
    .then((user: User) => {
        user.userName = req.body.userName;
        user.hashedPassword = req.body.hashedPassword;
        user.isActive = req.body.isActive;
        userRepository.save(user);
        res.send(user);
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















