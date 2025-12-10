import { z } from 'zod';

export const serverOptionsSchema = z.object({
  port: z.number().optional(),
  internalKey: z.string(),
});

const jwtOptionsSchema = z.object({
  tokenSecret: z.string(),
  expireTime: z.number(),
});

export const fileSystemSchema = z.object({
  localStorage: z.string(),
});

export const databaseOptionsSchema = z.object({
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
  schema: z.string(),
});

export const serverConfigSchema = z.object({
  serverOptions: serverOptionsSchema,
  jwtOptions: jwtOptionsSchema,
  databaseOptions: databaseOptionsSchema,
  fileSystem: fileSystemSchema,
  auth: z.object({
    useCookies: z.boolean(),
  }),
});

export type TServerConfig = z.infer<typeof serverConfigSchema>;
