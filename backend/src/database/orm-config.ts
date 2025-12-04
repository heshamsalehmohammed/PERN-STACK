import { join } from 'path';
import type { LoggerOptions } from 'typeorm';
import { DataSource } from 'typeorm';

import { config } from '../config/general.config';

let typeOrmLogs = false as LoggerOptions;
let poolSize = 50;
if (process.env.NODE_ENV === 'development') {
  typeOrmLogs = ['error']; // ['error']
  poolSize = 10;
}

const options = config.databaseOptions;

class DatabaseSingleton {

  private static instance: DataSource | null = null;

  private constructor() {}

  public static getInstance(): DataSource {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DataSource({
        type: 'postgres',
        host: options.host,
        port: options.port,
        username: options.username,
        password: options.password,
        database: options.database,
        schema: options.schema,
        logging: typeOrmLogs,
        entities: [join(__dirname, '../database/models/entity.index{.ts,.js}')],
        migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
        subscribers: [],
        maxQueryExecutionTime: 10000,
        cache: {
          duration: 5000,
        },
        dropSchema: false,
        synchronize: false,
        // debug: false,
        poolSize: poolSize,
      });
      // eslint-disable-next-line no-console
      console.log(
        '\u001b[1;35m[TYPEORM] New Database connection Created\u001b[0m',
      );
    }
    return DatabaseSingleton.instance;
  }

}

const appDataSource = DatabaseSingleton.getInstance();

export default appDataSource;
