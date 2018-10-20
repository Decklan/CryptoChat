import { Router, Request, Response } from 'express';

const router: Router = Router();

// Route for retrieving all users
router.get('/', (req: Request, res: Response) => {
    // Simple console log for now
    console.log(req.body);
});

// Route for retrieving a single user by their unique id
router.get('/:id', (req: Request, res: Response) => {
    // Simple console log for now
    console.log(req.body);
});

// Route for adding a new user to the database
router.post('/', (req: Request, res: Response) => {
    // Simple console log for now
    console.log(req.body);
});

// Route for updating a user with a matching unique id
router.put('/:id', (req: Request, res: Response) => {
    // Simple console log for now
    console.log(req.body);
});

// Exports the router instance to be used in app.ts
export const UserController: Router = router;
