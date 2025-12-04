import dotenv from 'dotenv';
import path from 'path';

// Load .env.test file for test environment
dotenv.config({ path: path.resolve(__dirname, '.env.test') });
