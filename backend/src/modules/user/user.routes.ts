import { Router } from "express";

import type UserController from "./user.controller";

export default class UserRoutes {
  public readonly router: Router;

  private readonly controller: UserController;

  constructor(controller: UserController) {
    this.controller = controller;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/", this.controller.getAllUsersController);
    this.router.get("/:userId", this.controller.getUserByIdController);
    this.router.post("/", this.controller.createUserController);
    this.router.put("/:userId", this.controller.updateUserByIdController);
    this.router.delete("/:userId", this.controller.deleteUserByIdController);
  }
}
