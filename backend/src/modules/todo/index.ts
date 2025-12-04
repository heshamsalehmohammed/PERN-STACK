/**
 * Todo Module Entry Point
 *
 * This file exports the main classes for the todo module:
 * - TodoService: Business logic layer
 * - Todo: Database model
 * - todoRoutes: Express router instance
 *
 * DEPENDENCY INJECTION PATTERN:
 * We instantiate dependencies here (composition root) rather than inside classes because:
 *
 * 1. LOOSE COUPLING - Classes don't know how their dependencies are created
 * 2. TESTABILITY - Easy to mock dependencies in unit tests by injecting mocks
 * 3. FLEXIBILITY - Can swap implementations without changing class code
 * 4. SINGLE RESPONSIBILITY - Each class focuses on its own logic, not instantiation
 *
 * INJECTION CHAIN (within module):
 * TodoRepository → TodoService → TodoController → TodoRoutes
 *
 * Each layer only knows about the layer directly below it:
 * - Repository: Only injected into Service (NEVER exposed outside module)
 * - Service: Only injected into Controller
 * - Controller: Only injected into Routes
 *
 * CROSS-MODULE INJECTION:
 * - Service is the ONLY class allowed to be injected into other modules' services
 * - Example: If OrderService needs todo functionality, inject TodoService into OrderService
 * - NEVER inject Repository, Controller, or Routes into other modules
 */

import TodoController from './todo.controller';
import Todo from './todo.model';
import TodoRepository from './todo.repo';
import TodoRoutes from './todo.routes';
import TodoService from './todo.services';

// Create instances with dependency injection
// Repository handles database operations
const todoRepository = new TodoRepository();

// Service handles business logic, receives repository via constructor
const todoService = new TodoService(todoRepository);

// Controller handles HTTP request/response, receives service via constructor
const todoController = new TodoController(todoService);

// Routes define API endpoints, receives controller via constructor
const todoRoutesInstance = new TodoRoutes(todoController);

// Export the router for use in routes.index.ts
export const todoRoutes = todoRoutesInstance.router;

// Export classes for external use
export { Todo, TodoService };
