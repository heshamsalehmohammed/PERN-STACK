
import UserController from './user.controller';
import User from './user.model';
import UserRepository from "./user.repo";
import UserRoutes from "./user.routes";
import UserService from "./user.services";

// Create instances with dependency injection
// Repository handles database operations
const userRepository = new UserRepository();

// Service handles business logic, receives repository via constructor
const userService = new UserService(userRepository);

// Controller handles HTTP request/response, receives service via constructor
const userController = new UserController(userService);

// Routes define API endpoints, receives controller via constructor
const userRoutesInstance = new UserRoutes(userController);

// Export the router for use in routes.index.ts
export const userRoutes = userRoutesInstance.router;

// Export classes for external use
export { User, UserService };
