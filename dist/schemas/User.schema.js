"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegisterSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.UserRegisterSchema = joi_1.default.object({
    fullname: joi_1.default.string().required().messages({
        'string.empty': 'First name is required.',
    }),
    email: joi_1.default.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'string.empty': 'Email is required.',
    }),
    username: joi_1.default.string().min(3).max(50).required().messages({
        'string.empty': 'Username is required.',
        'string.min': 'Username must be at least 3 characters long.',
        'string.max': 'Username cannot exceed 50 characters.',
    }),
    profilePicture: joi_1.default.string().uri().allow('').optional().messages({
        'string.uri': 'Profile picture must be a valid URL.',
    }),
    bio: joi_1.default.string().max(500).allow('').optional().messages({
        'string.max': 'Bio cannot exceed 500 characters.',
    }),
    category: joi_1.default.array().items(joi_1.default.string()).optional().messages({
        'array.items': 'Category must be an array of strings.',
    }),
    roleId: joi_1.default.string().required().messages({
        'string.empty': 'Role ID is required.',
    }),
    password: joi_1.default.string().min(8).required().messages({
        'string.empty': 'Password is required.',
        'string.min': 'Password must be at least 8 characters long.',
    }),
    mobile: joi_1.default.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .optional()
        .messages({
        'string.length': 'Mobile number must be exactly 10 digits.',
        'string.pattern.base': 'Mobile number must contain only digits.',
    }),
});
