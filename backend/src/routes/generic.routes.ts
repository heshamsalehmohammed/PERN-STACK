import { Router } from 'express';

// generic routes
const genericRoutes = Router();

genericRoutes.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default genericRoutes;
