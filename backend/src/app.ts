import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { config } from './config/general.config';
import { serverConfigSchema } from './config/general.config.validation';
import DatabaseInit from './database/database-init';
import appDataSource from './database/orm-config';
import { authentication } from './middlewares/authentication';
import { invalidRoutesHandler } from './middlewares/invalidRoutesHandler';
import { safeJsonParser } from './middlewares/jsonParser';
import routes from './routes/routes.index';

type TAppStatus = 'ON' | 'OFF';
export default class MainApp {
  private static instance: MainApp;

  private status: TAppStatus;

  private app!: express.Express;

  private readonly databaseInit: DatabaseInit;

  private isStarted = false;

  private constructor() {
    this.status = 'OFF';
    this.databaseInit = new DatabaseInit();
  }

  public static getInstance(): MainApp {
    if (!MainApp.instance) {
      MainApp.instance = new MainApp();
    }
    return MainApp.instance;
  }

  public getApp(): express.Express {
    return this.app;
  }

  public async stop(): Promise<boolean> {
    if (this.isStarted) {
      this.isStarted = false;
    }
    this.status = 'OFF';
    return true;
  }

  public async start(): Promise<express.Express> {
    const configSchema = serverConfigSchema.safeParse(config);
    if (configSchema.success === false) {
      // eslint-disable-next-line no-console
      console.error('Server configuration validation failed:', configSchema.error);

      await this.stop();
      process.exit(1);
    }

    if (!this.isStarted) {

      this.app = express();

      // Initialize database (create if not exists, check tables)
      const initResult = await this.databaseInit.initialize();
      if (!initResult.success) {
        // eslint-disable-next-line no-console
        console.error('Database initialization failed:', initResult.message);
        await this.stop();
        process.exit(1);
      }

      await appDataSource.initialize();

      // create tables/schemas if initial
      if (initResult.data) {
        await appDataSource.synchronize();
      }

      // run migrations - fake true on initial, else run normally
      await appDataSource.runMigrations({ fake: initResult.data });

      // trust first proxy. need proxy_set_header X-Forwarded-Proto https;
      this.app.set('trust proxy', true);
      this.addMiddlewares();
      this.addSecurity();
      // this.app.use('/api/:schema', authentication, schemaCheck, routes);
      this.app.use('/api/', authentication, routes);

      // Middleware for handling non-existent routes if not serving ui
      // Express 5.x compatible: Use middleware without wildcard pattern
      this.app.use((req, res, _next) => {
        // Only handle unmatched routes (those that reach this point)
        invalidRoutesHandler(req, res);
      });

      this.isStarted = true;
    }
    this.status = 'ON';
    return this.getApp();
  }

  private addSecurity() {
    this.addCors();
    this.addHelmet();
    this.app.disable('x-powered-by');
  }

  private addMiddlewares() {
    // body parsing middleware
    // initialize body-parser to parse incoming parameters requests to req.body
    this.app.use(express.json({ limit: '500mb' }));
    this.app.use(
      express.urlencoded({
        limit: '500mb',
        extended: true,
        parameterLimit: 50000,
      }),
    );
    this.app.use(safeJsonParser);
    this.app.use(cookieParser());
    // add cookie Parser in order to be able to read cookies
    // this.app.use(cookieParser());
  }

  /**
   * Cross-Origin Resource Sharing (CORS)
   * https://www.keycdn.com/support/cors
   * Use Access-Control-Allow-Origin →* at /api for Mobile app support.
   * At the rest angular is triggering.
   * Setting up CORS, such that it can work together with an Application at another domain / port
   */
  private addCors() {
    this.app.use(
      cors({
        origin: ['http://localhost:3000'],
        credentials: true,
      }),
    );
  }

  /**
   * Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
   * https://github.com/helmetjs/helmet
   */
  private addHelmet() {
    // This disables the `contentSecurityPolicy` middleware but keeps the rest.
    this.app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );
  }
}
