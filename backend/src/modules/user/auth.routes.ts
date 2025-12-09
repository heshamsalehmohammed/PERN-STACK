import { Router } from "express";

import type UserController from "./user.controller";

export default class AuthRoutes {
  public readonly router: Router;

  private readonly controller: UserController;

  constructor(controller: UserController) {
    this.controller = controller;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/login", this.controller.loginUserController);
    this.router.post("/register", this.controller.registerUserController);
    this.router.post("/logout", this.controller.logoutUserController);
    this.router.get("/me", this.controller.getCurrentUserController);
  }
}