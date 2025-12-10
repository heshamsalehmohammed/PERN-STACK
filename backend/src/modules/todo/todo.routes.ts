import { Router } from "express";

import type TodoController from "./todo.controller";
import { authorization } from "@/src/middlewares/authorization";
import { UserPermissionEnum, UserRoleEnum } from "../user/user.const";

export default class TodoRoutes {
  public readonly router: Router;

  private readonly todoController: TodoController;

  constructor(todoController: TodoController) {
    this.router = Router();
    this.todoController = todoController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      "/",
      authorization({
        roles: [UserRoleEnum.master],
        permissions: [UserPermissionEnum.CAN_VIEW_TODO],
      }),
      this.todoController.getAllTodosController
    );

    this.router.get(
      "/:todoId",
      authorization({
        roles: [UserRoleEnum.master],
        permissions: [UserPermissionEnum.CAN_VIEW_TODO],
      }),
      this.todoController.getTodoByIdController
    );

    this.router.post(
      "/",
      authorization({
        roles: [UserRoleEnum.master],
        permissions: [UserPermissionEnum.CAN_ADD_TODO],
      }),
      this.todoController.createTodoController
    );

    this.router.put(
      "/:todoId",
      authorization({
        roles: [UserRoleEnum.master],
        permissions: [UserPermissionEnum.CAN_EDIT_TODO],
      }),
      this.todoController.updateTodoByIdController
    );

    this.router.delete(
      "/:todoId",
      authorization({
        roles: [UserRoleEnum.master],
        permissions: [UserPermissionEnum.CAN_DELETE_TODO],
      }),
      this.todoController.deleteTodoByIdController
    );
  }
}
