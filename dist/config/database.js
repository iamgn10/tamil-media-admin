"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_config_1 = require("./app.config");
const connectDB = async (retries = 5) => {
    const mongoUri = app_config_1.config.database.uri;
    if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            await mongoose_1.default.connect(mongoUri, {
                maxPoolSize: app_config_1.config.database.maxPoolSize,
                serverSelectionTimeoutMS: app_config_1.config.database.serverSelectionTimeoutMS,
                socketTimeoutMS: app_config_1.config.database.socketTimeoutMS,
                bufferCommands: app_config_1.config.database.bufferCommands
            });
            console.log('MongoDB connected successfully');
            console.log(`Database: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`);
            return;
        }
        catch (error) {
            console.error(`MongoDB connection attempt ${attempt}/${retries} failed:`, error);
            if (attempt === retries) {
                console.error('All connection attempts failed. Exiting...');
                process.exit(1);
            }
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            console.log(`Retrying connection in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};
exports.default = connectDB;
