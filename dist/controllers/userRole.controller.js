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
exports.UserRoleController = void 0;
const tsyringe_1 = require("tsyringe");
const userRole_service_1 = require("../services/userRole.service");
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
let UserRoleController = class UserRoleController {
    constructor(userRoleService) {
        this.userRoleService = userRoleService;
    }
    async createUserRole(req, res) {
        try {
            const newUserRole = await this.userRoleService.createUserRole(req.body);
            const response = {
                status: true,
                message: "User role created successfully"
            };
            res.status(201).json(response);
        }
        catch (error) {
            let errorMessage = "An unexpected error occurred.";
            if (error.message.includes("Role name already exists")) {
                errorMessage = error.message; // Custom error message from repository
            }
            const response = { status: false, error: errorMessage };
            res.status(400).json(response); // ✅ Return 400 instead of 500
        }
    }
    async getAllUserRoles(req, res) {
        try {
            const userRoles = await this.userRoleService.getAllUserRoles();
            const response = { status: true, data: userRoles };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getUserRoleById(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const userRole = await this.userRoleService.findUserRoleById(id);
            if (!userRole) {
                return next(new AppError_1.AppError(404, 'User role not found'));
            }
            const response = { status: true, data: userRole };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async updateUserRole(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const userRole = await this.userRoleService.updateUserRole(id, req.body);
            if (!userRole) {
                return next(new AppError_1.AppError(404, 'User role not found'));
            }
            const response = { status: true, data: userRole };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async deleteUserRole(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const isDeleted = await this.userRoleService.deleteUserRole(id);
            if (!isDeleted) {
                return next(new AppError_1.AppError(404, 'User role not found'));
            }
            const response = { status: true, message: 'User role deleted successfully' };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
};
exports.UserRoleController = UserRoleController;
exports.UserRoleController = UserRoleController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(userRole_service_1.UserRoleService)),
    __metadata("design:paramtypes", [userRole_service_1.UserRoleService])
], UserRoleController);
