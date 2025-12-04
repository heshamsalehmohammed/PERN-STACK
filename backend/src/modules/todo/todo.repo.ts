import Todo from './todo.model';
import appDataSource from '../../database/orm-config';
import ErrorHandling from '../../helpers/error-handling';

export default class TodoRepository {
  private readonly manager = appDataSource.manager;

  /**
   * Get all todos
   */
  public async getAllTodosRepo(status?: TTodoStatus): Promise<IDataResponse<ITodo[]>> {
    // if status pass it as where condition
    try {
      const todos = await this.manager.find(Todo, {
        where: status ? { status } : undefined,
        order: { priority: 'ASC', created_at: 'DESC' },
      });
      return {
        success: true,
        message: 'Todos fetched successfully',
        data: todos,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }

  /**
   * Get todo by ID
   */
  public async getTodoByIdRepo(todoId: number): Promise<IDataResponse<ITodo>> {
    try {
      const todo = await this.manager.findOne(Todo, {
        where: { todo_id: todoId },
      });
      if (!todo) {
        return { success: false, message: 'Todo not found' };
      }
      return {
        success: true,
        message: 'Todo fetched successfully',
        data: todo,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }

  /**
   * Create a new todo
   */
  public async createTodoRepo(
    todoData: ITodoInsertDTO,
  ): Promise<IDataResponse<ITodo>> {
    try {
      const savedTodo = await this.manager.save(Todo, todoData);
      return {
        success: true,
        message: 'Todo created successfully',
        data: savedTodo,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }

  /**
   * Update a todo by ID
   */
  public async updateTodoByIdRepo(
    todoId: number,
    updateData: ITodoUpdateDTO,
  ): Promise<IDataResponse<ITodo>> {
    try {
      const todo = await this.manager.findOne(Todo, {
        where: { todo_id: todoId },
      });
      if (!todo) {
        return { success: false, message: 'Todo not found' };
      }

      await this.manager.update(Todo, { todo_id: todoId }, updateData);

      const updatedTodo = await this.manager.findOne(Todo, {
        where: { todo_id: todoId },
      });
      return {
        success: true,
        message: 'Todo updated successfully',
        data: updatedTodo!,
      };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }

  /**
   * Delete a todo by ID
   */
  public async deleteTodoByIdRepo(todoId: number): Promise<IBasicResponse> {
    try {
      const todo = await this.manager.findOne(Todo, {
        where: { todo_id: todoId },
      });
      if (!todo) {
        return { success: false, message: 'Todo not found' };
      }

      await this.manager.delete(Todo, { todo_id: todoId });
      return { success: true, message: 'Todo deleted successfully' };
    } catch (error) {
      return { success: false, message: ErrorHandling.getErrorMessage(error) };
    }
  }
}
