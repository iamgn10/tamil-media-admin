"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
const generateToken = (payload) => {
    const sessionId = (0, uuid_1.v4)(); // Generate unique session ID
    return jsonwebtoken_1.default.sign({ ...payload, sessionId }, SECRET_KEY, {
        expiresIn: '24h',
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        if (typeof decoded === 'object' && decoded !== null) {
            return decoded;
        }
        return null;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
