import { Router } from 'express';

import genericRoutes from './generic.routes';
import { todoRoutes } from '../modules/todo';
import { authRoutes, userRoutes } from "../modules/user";

// routes reference
const routes = Router();

// Use generic routes
routes.use(genericRoutes);
// module routes
routes.use('/todos', todoRoutes);
routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);

export default routes;
