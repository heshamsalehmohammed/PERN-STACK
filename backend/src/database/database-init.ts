import type { ConnectionConfig } from 'pg';
import { Client } from 'pg';

import { config } from '../config/general.config';
import ErrorHandling from '../helpers/error-handling';

class DatabaseInit {
  private readonly errorHandling: typeof ErrorHandling;

  constructor(errorHandling: typeof ErrorHandling = ErrorHandling) {
    this.errorHandling = errorHandling;
  }

  private async doesTableExist(
    pgConfig: ConnectionConfig,
    database: string,
    tableName: string,
  ): Promise<boolean> {
    let result;
    const client = new Client({ ...pgConfig, database });
    try {
      await client.connect();
      result = await client.query(
        `
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = '${tableName}'
        ) AS "exists";
      `,
      );
    } catch (error) {
      this.errorHandling.getErrorMessage(error);
    } finally {
      await client.end();
    }

    if (result) {
      return result.rows[0].exists;
    }

    return false;
  }

  /**
   * Check if database exists and if not creates the database
   * @returns TRUE/FALSE - true need to run TYPEORM sync and fake migrations - false run migrations
   */
  public async initialize(): Promise<IDataResponse<boolean>> {
    const dbOptions = config.databaseOptions;

    const pgConfig: ConnectionConfig = {
      host: dbOptions.host,
      user: dbOptions.username,
      password: dbOptions.password,
      port: dbOptions.port,
      database: undefined,
    };
    const client = new Client(pgConfig);
    let clientDB: Client | null = null;

    // if database and tables exists then false else true
    let runInitSync = false;

    try {
      await client.connect();

      const res = await client.query(
        `SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbOptions.database}'`,
      );

      if ((res.rowCount || 0) < 1) {
        // Database not found, creating it
        await client.query(`CREATE DATABASE ${dbOptions.database};`);
        runInitSync = true;
      }
      await client.end();

      clientDB = new Client({ ...pgConfig, database: dbOptions.database });
      await clientDB.connect();
      await clientDB.query(`CREATE SCHEMA IF NOT EXISTS ${dbOptions.schema};`);

      if ((res.rowCount || 0) > 0) {
        // query that checks if tables exists
        const resTableExist = await this.doesTableExist(
          pgConfig,
          dbOptions.database,
          'tasks',
        );
        // if no tables status true
        if (!resTableExist) {
          runInitSync = true;
        }
      }
    } catch (error) {
      const msg = this.errorHandling.getErrorMessage(error);

      return {
        success: false,
        message: msg,
      };
    } finally {
      await client.end();
      if (clientDB) {
        await clientDB.end();
      }
    }

    return {
      success: true,
      message: 'Connection OK',
      data: runInitSync,
    };
  }
}

export default DatabaseInit;
