import { Router } from 'express';

import type TodoController from './todo.controller';

export default class TodoRoutes {
  public readonly router: Router;

  private readonly todoController: TodoController;

  constructor(todoController: TodoController) {
    this.router = Router();
    this.todoController = todoController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /todos - Get all todos
    this.router.get('/', this.todoController.getAllTodosController);

    // GET /todos/:todoId - Get todo by ID
    this.router.get('/:todoId', this.todoController.getTodoByIdController);

    // POST /todos - Create a new todo
    this.router.post('/', this.todoController.createTodoController);

    // PUT /todos/:todoId - Update a todo by ID
    this.router.put('/:todoId', this.todoController.updateTodoByIdController);

    // DELETE /todos/:todoId - Delete a todo by ID
    this.router.delete('/:todoId', this.todoController.deleteTodoByIdController);
  }
}
