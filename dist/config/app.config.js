"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const configSchema = zod_1.z.object({
    app: zod_1.z.object({
        port: zod_1.z.number().default(3000),
        env: zod_1.z.enum(['development', 'staging', 'production']),
        name: zod_1.z.string().default('TamilMedia API'),
    }), database: zod_1.z.object({
        uri: zod_1.z.string().optional().default(''),
        maxPoolSize: zod_1.z.number().default(10),
        serverSelectionTimeoutMS: zod_1.z.number().default(30000),
        socketTimeoutMS: zod_1.z.number().default(60000),
        bufferCommands: zod_1.z.boolean().default(false),
    }),
    jwt: zod_1.z.object({
        secret: zod_1.z.string().optional().default('dummy'),
        expiresIn: zod_1.z.string().default('7d'),
    }),
    redis: zod_1.z.object({
        host: zod_1.z.string().default('localhost'),
        port: zod_1.z.number().default(6379),
    }),
    rateLimiting: zod_1.z.object({
        windowMs: zod_1.z.number().default(15 * 60 * 1000), // 15 minutes
        max: zod_1.z.number().default(100), // requests per window
    }),
});
exports.config = configSchema.parse({
    app: {
        port: parseInt(process.env.PORT || '3000'),
        env: process.env.NODE_ENV || 'development',
        name: process.env.APP_NAME,
    }, database: {
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
