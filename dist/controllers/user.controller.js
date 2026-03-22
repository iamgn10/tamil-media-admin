"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsyringe_1 = require("tsyringe");
const user_service_1 = require("../services/user.service");
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const auth_service_1 = require("../services/auth.service");
let UserController = class UserController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async createUser(req, res) {
        logger_1.default.info(`Received registration request from IP: ${req.ip}, Payload: ${JSON.stringify(req.body)}`);
        try {
            const { fullname, username, email, password, mobile, bio, roleId, profilePicture, category } = req.body;
            const user = await this.authService.register({
                fullname,
                username,
                email,
                password,
                mobile,
                bio,
                roleId,
                profilePicture,
                category
            });
            logger_1.default.info(`Registration successful for user: ${user.email}`);
            res.status(201).json({
                status: true,
                data: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    username: user.username,
                    mobile: user.mobile,
                    bio: user.bio,
                    profilePicture: user.profilePicture,
                    roleId: user.roleId,
                    roleName: user.roleName,
                }
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            logger_1.default.error(`Registration failed for IP: ${req.ip}, Error: ${errorMessage}`);
            res.status(400).json({ status: false, message: errorMessage });
        }
    }
    async getAllUsers(req, res) {
        try {
            const user = await this.userService.getAllUsers();
            const response = { status: true, data: user };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const validId = new mongoose_1.default.Types.ObjectId(id);
            // Validate the ID
            if (!mongoose_1.default.Types.ObjectId.isValid(validId)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const user = await this.userService.findUserById(validId);
            if (!user) {
                return next(new AppError_1.AppError(404, 'User not found'));
            }
            const response = { status: true, data: user };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(404).json(response);
        }
    }
    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const validId = new mongoose_1.default.Types.ObjectId(id);
            // Validate the ID
            if (!mongoose_1.default.Types.ObjectId.isValid(validId)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const user = await this.userService.updateUser(validId, req.body);
            if (!user) {
                return next(new AppError_1.AppError(404, 'User not found'));
            }
            const response = { status: true, data: user };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const validId = new mongoose_1.default.Types.ObjectId(id);
            // Validate the ID
            if (!mongoose_1.default.Types.ObjectId.isValid(validId)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const isDeleted = await this.userService.deleteUser(validId);
            if (!isDeleted) {
                return next(new AppError_1.AppError(404, 'User not found'));
            }
            const response = { status: true, message: 'User deleted successfully' };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(user_service_1.UserService)),
    __param(1, (0, tsyringe_1.inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], UserController);
