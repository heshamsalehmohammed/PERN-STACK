import { Router } from "express";

import type UserController from "./user.controller";
import { authorization } from "@/src/middlewares/authorization";
import { UserRoleEnum } from "./user.const";

export default class UserRoutes {
  public readonly router: Router;

  private readonly controller: UserController;

  constructor(controller: UserController) {
    this.controller = controller;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const masterRoleOnly = authorization({
      roles: [UserRoleEnum.master],
    });

    this.router.get("/", masterRoleOnly, this.controller.getAllUsersController);

    this.router.get(
      "/:userId",
      masterRoleOnly,
      this.controller.getUserByIdController
    );

    this.router.post("/", masterRoleOnly, this.controller.createUserController);

    this.router.put(
      "/:userId",
      masterRoleOnly,
      this.controller.updateUserByIdController
    );

    this.router.delete(
      "/:userId",
      masterRoleOnly,
      this.controller.deleteUserByIdController
    );
  }
}
