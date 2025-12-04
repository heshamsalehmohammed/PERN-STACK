import dotenv = require('dotenv');

import type { TServerConfig } from './general.config.validation';

/**
 * Load environment variables from .env and a custom config file.
 *
 * Loading order:
 * 1. First loads .env file (non-sensitive defaults)
 * 2. Then loads PEN2_APP_CONFIG file (sensitive/environment-specific values)
 *
 * Note: dotenv.config() does NOT overwrite existing environment variables by default.
 * Variables from .env are preserved, PEN2_APP_CONFIG can add new variables.
 * If PEN2_APP_CONFIG needs to override .env values, use: override: true
 */
export default function updateEnv(): void {
  // Load .env first (non-sensitive defaults)
  dotenv.config();

  // Load custom config file (sensitive/environment-specific)
  // Won't overwrite variables already loaded from .env
  const envResult = dotenv.config({
    path: process.env.PEN2_APP_CONFIG,
  });

  if (envResult.error) {
    // eslint-disable-next-line no-console
    console.warn(envResult.error);
  }
}

updateEnv();

export const config: TServerConfig = {
  serverOptions: {
    port: parseInt(process.env.SERVER_PORT || '3001', 10),
    internalKey: process.env.INTERNAL_KEY || 'xK9mLp2vQwRt7nYhBjFc',
  },

  jwtOptions: {
    tokenSecret: process.env.ACCESS_JWT_SECRET || 'Hs5uWx8zAqDe3gNkPvMr',
    expireTime:
      parseInt(process.env.ACCESS_JWT_DURATION || '0', 10) * 60 || 60 * 120,
  },

  databaseOptions: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER_NAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'todo_app',
    schema: 'main',
  },

  fileSystem: {
    localStorage: process.env.LOCAL_STORAGE || '',
  },
};
