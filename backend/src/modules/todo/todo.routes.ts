import { Router } from 'express';

import type TodoController from './todo.controller';
import { authorization } from '@/src/middlewares/authorization';
import { UserPermissionEnum } from '../user/user.const';




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
/*       authorization({
        permissions: [UserPermissionEnum.CAN_VIEW_TODO],
      }), */
      this.todoController.getAllTodosController
    );

    this.router.get('/:todoId', this.todoController.getTodoByIdController);

    this.router.post('/', this.todoController.createTodoController);

    this.router.put('/:todoId', this.todoController.updateTodoByIdController);

    this.router.delete('/:todoId', this.todoController.deleteTodoByIdController);
  }
}
