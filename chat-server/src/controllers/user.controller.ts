import { Router, Request, Response } from 'express';

/**
 * UsersController for handling routing requests to '/users'
 * Exports the class' router as UserController to be used in 
 * app.ts
 */
class UsersController {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    /**
     * Route for getting all the currently active users in the application
     * @param req Request from the client
     * @param res Response from the server
     */
    public GetActiveUsers(req: Request, res: Response) {
        console.log(req.body);
    }

    /**
     * Route for getting a user by their unique id
     * @param req Request from the client
     * @param res Response from the server
     */
    public GetUserById(req: Request, res: Response) {
        console.log(req.params.id);
    }

    /**
     * Route for creating a new user 
     * @param req Request from the client
     * @param res Response from the server
     */
    public CreateNewUser(req: Request, res: Response) {
        console.log(req.body);
    }

    /**
     * Route for updating a user by their unique id
     * @param req Request from the client
     * @param res Response from the server
     */
    public UpdateUserById(req: Request, res: Response) {
        console.log(req.params.id);
    }

    /**
     * Takes each route and sets the callback function to be called
     * when that route is requested
     */
    public routes(): void {
        this.router.get('/', this.GetActiveUsers);
        this.router.get('/:id', this.GetUserById);
        this.router.post('/', this.CreateNewUser);
        this.router.put('/:id', this.UpdateUserById);
    }
}

/**
 * 1. Instantiate the UsersController class
 * 2. Invoke the usersController routes() method to set callbacks
 * 3. Export the usersController's router to be used in app.ts
 *    (named UserController by convention) 
 */
const usersController: UsersController = new UsersController();
usersController.routes();
export const UserController: Router = usersController.router;