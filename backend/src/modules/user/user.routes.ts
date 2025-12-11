import { Router } from 'express';

import type UserController from "./user.controller";

export default class UserRoutes {
  public readonly router: Router;

  private readonly userController: UserController;

  constructor(userController: UserController) {
    this.router = Router();
    this.userController = userController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /users - Get all users
    this.router.get('/', this.userController.getAllUsersController);

    // GET /users/:userId - Get user by ID
    this.router.get('/:userId', this.userController.getUserByIdController);

    // POST /users - Create a new user
    this.router.post('/', this.userController.createUserController);

    // PUT /users/:userId - Update a user by ID
    this.router.put('/:userId', this.userController.updateUserByIdController);

    // DELETE /users/:userId - Delete a user by ID
    this.router.delete('/:userId', this.userController.deleteUserByIdController);
  }
}
