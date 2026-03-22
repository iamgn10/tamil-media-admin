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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthHelper = void 0;
const jwt_1 = require("../utils/jwt");
const auth_service_1 = require("../services/auth.service");
const customErrors_1 = require("./errors/customErrors");
const tsyringe_1 = require("tsyringe");
let AuthHelper = class AuthHelper {
    constructor(authService) {
        this.authService = authService;
    }
    async Auth(req) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new customErrors_1.UnauthorizedError("No token provided");
            }
            // Extract the token
            const token = authHeader.split(" ")[1];
            const decoded = (0, jwt_1.verifyToken)(token); // Decode token
            // Retrieve authenticated user details
            const authUser = await this.authService.getAuthUserDetails(decoded.id);
            if (!authUser) {
                throw new customErrors_1.UnauthorizedError("User not found");
            }
            return authUser; // Return the authenticated user
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unauthorized";
            throw new customErrors_1.UnauthorizedError(errorMessage);
        }
    }
    async getUserIdFromToken(req) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                throw new customErrors_1.UnauthorizedError("No token provided");
            }
            const token = authHeader.split(" ")[1];
            const decoded = (0, jwt_1.verifyToken)(token);
            return decoded.id;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unauthorized";
            throw new customErrors_1.UnauthorizedError(errorMessage);
        }
    }
};
exports.AuthHelper = AuthHelper;
exports.AuthHelper = AuthHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(auth_service_1.AuthService)),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthHelper);
