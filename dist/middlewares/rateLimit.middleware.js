"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS
        ? parseInt(process.env.RATE_LIMIT_WINDOW_MS)
        : 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX) : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.',
});
// For sensitive routes (e.g., login), you might want a stricter rate limit:
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again after a minute.',
});
