import * as z from 'zod';

import { TODO_STATUS } from './todo.const';

// Status enum for validation (derived from TODO_STATUS constant)
const todoStatusEnum = z.enum(TODO_STATUS);

// Create Todo validation schema
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  status: todoStatusEnum.default(TODO_STATUS[0]),
  due_date: z.coerce.date().optional(),
  priority: z.number().int().min(1).max(5).default(3),
});

// Update Todo validation schema
export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  status: todoStatusEnum.optional(),
  due_date: z.coerce.date().optional().nullable(),
  priority: z.number().int().min(1).max(5).optional(),
});

// Get Todo by ID validation schema
export const getTodoByIdSchema = z.object({
  todo_id: z.coerce
    .number()
    .int()
    .positive('Todo ID must be a positive integer'),
});

// Delete Todo validation schema
export const deleteTodoSchema = z.object({
  todo_id: z.coerce
    .number()
    .int()
    .positive('Todo ID must be a positive integer'),
});
