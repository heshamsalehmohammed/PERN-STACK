import { Router } from 'express';

import genericRoutes from './generic.routes';
import { todoRoutes } from '../modules/todo';

// routes reference
const routes = Router();

// Use generic routes
routes.use(genericRoutes);
// module routes
routes.use('/todos', todoRoutes);

export default routes;
