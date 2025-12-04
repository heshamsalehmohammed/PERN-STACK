import type TodoRepository from './todo.repo';
import {
  createTodoSchema,
  deleteTodoSchema,
  getTodoByIdSchema,
  updateTodoSchema,
} from './todo.validations';
import ErrorHandling from '../../helpers/error-handling';

export default class TodoService {
  private readonly todoRepository: TodoRepository;

  constructor(todoRepository: TodoRepository) {
    this.todoRepository = todoRepository;
  }

  /**
   * Get all todos
   */
  public async getAllTodos(status?: TTodoStatus): Promise<IDataResponse<ITodo[]>> {
    // validate status if provided with zod
    if (status) {
        const validation = createTodoSchema.shape.status.safeParse(status);
        if (!validation.success) {
            return {
                success: false,
                message: ErrorHandling.getErrorMessage(validation.error),
            };
        }
    }
    return this.todoRepository.getAllTodosRepo(status);
  }

  /**
   * Get todo by ID
   */
  public async getTodoById(todoId: number): Promise<IDataResponse<ITodo>> {
    const validation = getTodoByIdSchema.safeParse({ todo_id: todoId });
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    return this.todoRepository.getTodoByIdRepo(todoId);
  }

  /**
   * Create a new todo
   */
  public async createTodo(todoData: ITodoInsertDTO): Promise<IDataResponse<ITodo>> {
    const validation = createTodoSchema.safeParse(todoData);
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    const validatedData: ITodoInsertDTO = {
      title: validation.data.title,
      description: validation.data.description,
      status: validation.data.status,
      due_date: validation.data.due_date,
      priority: validation.data.priority,
    };

    return this.todoRepository.createTodoRepo(validatedData);
  }

  /**
   * Update a todo by ID
   */
  public async updateTodoById(
    todoId: number,
    updateData: ITodoUpdateDTO,
  ): Promise<IDataResponse<ITodo>> {
    const idValidation = getTodoByIdSchema.safeParse({ todo_id: todoId });
    if (!idValidation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(idValidation.error),
      };
    }

    const validation = updateTodoSchema.safeParse(updateData);
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    const validatedData: ITodoUpdateDTO = {
      title: validation.data.title,
      description: validation.data.description ?? undefined,
      status: validation.data.status,
      due_date: validation.data.due_date ?? undefined,
      priority: validation.data.priority,
    };

    return this.todoRepository.updateTodoByIdRepo(todoId, validatedData);
  }

  /**
   * Delete a todo by ID
   */
  public async deleteTodoById(todoId: number): Promise<IBasicResponse> {
    const validation = deleteTodoSchema.safeParse({ todo_id: todoId });
    if (!validation.success) {
      return {
        success: false,
        message: ErrorHandling.getErrorMessage(validation.error),
      };
    }

    return this.todoRepository.deleteTodoByIdRepo(todoId);
  }
}
