import { Router } from "express";

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
    this.router.post("/login", this.userController.loginUserController);
    this.router.post("/logout", this.userController.logoutUserController);
    this.router.post("/register", this.userController.registerUserController);

    this.router.get("/me", this.userController.getCurrentUserController);

    this.router.get("/", this.userController.getAllUsersController);
    this.router.get("/:userId", this.userController.getUserByIdController);
    this.router.post("/", this.userController.createUserController);
    this.router.put("/:userId", this.userController.updateUserByIdController);
    this.router.delete(
      "/:userId",
      this.userController.deleteUserByIdController
    );
  }
}
