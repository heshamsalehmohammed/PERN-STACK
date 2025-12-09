

import User from "./user.model";
import UserRepository from "./user.repo";
import UserService from "./user.services";
import UserController from "./user.controller";
import UserRoutes from "./user.routes";
import AuthRoutes from "./auth.routes";

const userRepository = new UserRepository();

const userService = new UserService(userRepository);

const userController = new UserController(userService);

const authRoutesInstance = new AuthRoutes(userController);
const userRoutesInstance = new UserRoutes(userController);

export const authRoutes = authRoutesInstance.router;
export const userRoutes = userRoutesInstance.router;

export { User, UserService };
