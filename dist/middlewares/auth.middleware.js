"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticated = void 0;
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
const auth_repository_1 = require("../repositories/auth.repository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authRepository = new auth_repository_1.AuthRepository();
const Authenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ status: false, message: 'Unauthorized Access Denied', statusCode: 401, code: '001-401' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Check if token is valid in the database
        const isValidSession = await authRepository.isTokenValid(token);
        if (!isValidSession) {
            res.status(401).json({ status: false, message: 'Session expired or invalid', statusCode: 401, code: '002-401' });
            return;
        }
        // Verify the token
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded || typeof decoded !== 'object') {
            res.status(401).json({ status: false, message: 'Invalid token', statusCode: 401, code: '003-401' });
            return;
        }
        // Fetch the user from the database
        const user = await user_model_1.User.findById(decoded.id).populate('roleId', ['role_name']);
        if (!user) {
            res.status(401).json({ status: false, message: 'User Not Found', statusCode: 401, code: '004-401' });
            return;
        }
        // Attach user details to the request object
        req.user = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            roleId: user.roleId.toString(),
            roleName: user.roleId.role_name || '',
        };
        // Proceed to the next middleware
        next();
    }
    catch (error) {
        // Log the actual error for debugging
        console.error('Authentication Error:', error);
        // Return a more specific error message
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ status: false, message: 'Invalid token format', statusCode: 401, code: '005-401' });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ status: false, message: 'Token has expired', statusCode: 401, code: '006-401' });
            return;
        }
        // Return a generic error message for other cases
        res.status(401).json({ status: false, message: 'Authentication failed', statusCode: 401, code: '007-401' });
    }
};
exports.Authenticated = Authenticated;
