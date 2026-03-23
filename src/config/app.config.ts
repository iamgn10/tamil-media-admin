import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const configSchema = z.object({
  app: z.object({
    port: z.number().default(3000),
    env: z.enum(['development', 'staging', 'production']),
    name: z.string().default('TamilMedia API'),
  }),  database: z.object({
    uri: z.string().optional().default(''),
    maxPoolSize: z.number().default(10),
    serverSelectionTimeoutMS: z.number().default(30000),
    socketTimeoutMS: z.number().default(60000),
    bufferCommands: z.boolean().default(false),
  }),
  jwt: z.object({
    secret: z.string().optional().default('dummy'),
    expiresIn: z.string().default('7d'),
  }),
  redis: z.object({
    host: z.string().default('localhost'),
    port: z.number().default(6379),
  }),
  rateLimiting: z.object({
    windowMs: z.number().default(15 * 60 * 1000), // 15 minutes
    max: z.number().default(100), // requests per window
  }),
});

export type Config = z.infer<typeof configSchema>;

export const config: Config = configSchema.parse({
  app: {
    port: parseInt(process.env.PORT || '3000'),
    env: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME,
  },  database: {
    uri: process.env.MONGODB_URI || '',
    maxPoolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
    serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT_MS || '30000'),
    socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT_MS || '60000'),
    bufferCommands: process.env.DB_BUFFER_COMMANDS === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dummy',
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  },
});