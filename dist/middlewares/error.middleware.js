"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const errorHandler = (err, req, res, next) => {
    const isDevelopment = process.env.NODE_ENV === 'development';
    // Check if the error is an instance of AppError
    if (err instanceof AppError_1.AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message,
            ...(isDevelopment && { stack: err.stack }), // Include stack trace in development mode
        });
    }
    else {
        console.error(err.stack); // Log the stack trace for debugging
        // For unexpected errors
        res.status(500).json({
            status: 'error',
            statusCode: 500,
            message: 'Internal Server Error',
            ...(isDevelopment && { stack: err.stack, error: err.message }),
        });
    }
};
exports.errorHandler = errorHandler;
// Handle 404 Not Found Errors
const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'Resource not found',
    });
};
exports.notFoundHandler = notFoundHandler;
