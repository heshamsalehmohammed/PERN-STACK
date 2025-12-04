/**
 * Todo Module Type Definitions
 *
 * Note: TTodoStatus is also exported from todo.const.ts for runtime use with TODO_STATUS array
 */

type TTodoStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

interface ITodo extends IBase {
  todo_id: number;
  title: string;
  description?: string;
  status: TTodoStatus;
  due_date?: Date;
  priority: number;
}

interface ITodoInsertDTO extends Omit<ITodo, 'todo_id'> {
  todo_id?: number;
}

