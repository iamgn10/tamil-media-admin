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
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const logger_1 = __importDefault(require("../utils/logger"));
const tsyringe_1 = require("tsyringe");
let AuthController = class AuthController {
    // Injected dependency
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * Function: handle the user registration request
     * @param req
     * @param res
     */
    async register(req, res) {
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
    /**
     * Function: hanlde the login request
     * @param req
     * @param res
     */
    async login(req, res) {
        logger_1.default.info(`Received login request from IP: ${req.ip}, Payload: ${JSON.stringify(req.body)}`);
        try {
            const { email, password } = req.body;
            const { token, user } = await this.authService.login(email, password);
            logger_1.default.info(`Login successful for user: ${user.email}`);
            res.status(200).json({
                status: true,
                data: {
                    token,
                    user,
                },
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            logger_1.default.error(`Login failed for IP: ${req.ip}, Error: ${errorMessage}`);
            res.status(401).json({ status: false, message: errorMessage });
        }
    }
    /**
     * Function: handle the logout request
     * @param req
     * @param res
     * @returns
     */
    async logout(req, res) {
        var _a;
        logger_1.default.info(`Received logout request from IP: ${req.ip}`);
        try {
            const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!token) {
                res.status(401).json({ status: false, message: 'Unauthorized', statusCode: 401, code: '005-401' });
                return;
            }
            await this.authService.logout(token);
            logger_1.default.info(`Logout successful for token: ${token}`);
            res.status(200).json({ status: true, message: 'Logged out successfully' });
        }
        catch (error) {
            logger_1.default.error(`Logout failed: ${error.message}`);
            res.status(400).json({ status: false, message: error.message });
        }
    }
    /**
     * Function: handle the logout all request
     * @param req
     * @param res
     * @returns
     */
    async logoutAll(req, res) {
        var _a;
        logger_1.default.info(`Received logout all devices request from IP: ${req.ip}`);
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                res.status(401).json({ status: false, message: "User not authenticated" });
                return;
            }
            await this.authService.logoutAllSessions(req.user.id);
            logger_1.default.info(`Logout all devices successful for user ID: ${req.user.id}`);
            res.status(200).json({ status: true, message: "Logged out from all devices successfully" });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            logger_1.default.error(`Logout all devices failed: ${errorMessage}`);
            res.status(500).json({ status: false, message: errorMessage });
        }
    }
    /**
     * Function: handle the get auth user request
     * @param req
     * @param res
     * @returns
     */
    async getAuthUser(req, res) {
        try {
            const user = await this.authService.getAuthUserDetails(req.user.id);
            res.status(200).json({
                status: true,
                data: user
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            logger_1.default.error(`Failed to get auth user details: ${errorMessage}`);
            res.status(400).json({ status: false, message: errorMessage });
        }
    }
    /**
     * Function: handle the update user request
     * @param req
     * @param res
     * @returns
     */
    async updateUser(req, res) {
        try {
            const userId = req.user.id;
            const updateData = req.body;
            const updatedUser = await this.authService.updateUserDetails(userId, updateData);
            res.status(200).json({
                status: true,
                data: updatedUser,
                message: "User updated successfully"
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            logger_1.default.error(`Failed to update user: ${errorMessage}`);
            res.status(400).json({ status: false, message: errorMessage });
        }
    }
    /**
     * Function: handle the update password request
     * @param req
     * @param res
     * @returns
     */
    async updatePassword(req, res) {
        try {
            const userId = req.user.id;
            const { currentPassword, newPassword } = req.body;
            await this.authService.updatePassword(userId, currentPassword, newPassword);
            res.status(200).json({
                status: true,
                message: "Password updated successfully. Please login again."
            });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            logger_1.default.error(`Failed to update password: ${errorMessage}`);
            res.status(400).json({
                status: false,
                message: errorMessage
            });
        }
    }
    async getAllUsers(req, res) {
        try {
            const userRoles = await this.authService.getAllUsers();
            const response = { status: true, data: userRoles };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
};
AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
exports.default = AuthController;
