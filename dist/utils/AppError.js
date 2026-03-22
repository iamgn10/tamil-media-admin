"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor(statusCode, message, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Maintains proper stack trace (only in V8 engines, e.g., Node.js)
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
