import type { Request, Response } from "express";
import type TodoService from "./todo.services";

export default class TodoController {
  private readonly todoService: TodoService;

  constructor(todoService: TodoService) {
    this.todoService = todoService;
  }

  /**
   * Get all todos
   */
  public getAllTodosController = async (
    req: Request, 
    res: Response<IDataResponse<ITodo[]>>
  ): Promise<void> => {
    const status = req.query.status as TTodoStatus | undefined;
    const result = await this.todoService.getAllTodos(status);
    res.status(result.success ? 200 : 400).json(result);
  };

  /**
   * Get todo by ID
   */
  public getTodoByIdController = async (
    req: Request<{ todoId: string }>,
    res: Response<IDataResponse<ITodo>>
  ): Promise<void> => {
    const todoId = parseInt(req.params.todoId, 10);
    const result = await this.todoService.getTodoById(todoId);
    res.status(result.success ? 200 : 404).json(result);
  };

  /**
   * Create a new todo
   */
  public createTodoController = async (
    req: Request<unknown, unknown, ITodoInsertDTO>,
    res: Response<IDataResponse<ITodo>>
  ): Promise<void> => {
    const result = await this.todoService.createTodo(req.body);
    res.status(result.success ? 201 : 400).json(result);
  };

  /**
   * Update a todo by ID
   */
  public updateTodoByIdController = async (
    req: Request<{ todoId: string }, unknown, ITodoUpdateDTO>,
    res: Response<IDataResponse<ITodo>>
  ): Promise<void> => {
    const todoId = parseInt(req.params.todoId, 10);
    const result = await this.todoService.updateTodoById(todoId, req.body);
    res.status(result.success ? 200 : 400).json(result);
  };

  /**
   * Delete a todo by ID
   */
  public deleteTodoByIdController = async (
    req: Request<{ todoId: string }>,
    res: Response<IBasicResponse>
  ): Promise<void> => {
    const todoId = parseInt(req.params.todoId, 10);
    const result = await this.todoService.deleteTodoById(todoId);
    res.status(result.success ? 200 : 404).json(result);
  };
}
