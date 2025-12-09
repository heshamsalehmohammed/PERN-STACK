

import User from "./user.model";
import UserRepository from "./user.repo";
import UserService from "./user.services";
import UserController from "./user.controller";
import UserRoutes from "./user.routes";

const userRepository = new UserRepository();

const userService = new UserService(userRepository);

const userController = new UserController(userService);

const userRoutesInstance = new UserRoutes(userController);

export const userRoutes = userRoutesInstance.router;

export { User, UserService };
