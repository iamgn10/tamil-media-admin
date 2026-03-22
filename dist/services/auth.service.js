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
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../utils/jwt");
const date_fns_1 = require("date-fns");
const tsyringe_1 = require("tsyringe");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_repository_1 = require("../repositories/auth.repository");
const userRole_service_1 = require("./userRole.service");
let AuthService = class AuthService {
    constructor(authRepository, userRoleService) {
        this.authRepository = authRepository;
        this.userRoleService = userRoleService;
    }
    mapUserToDTO(user) {
        return {
            id: user._id.toString(),
            fullname: user.fullname,
            profilePicture: user.profilePicture || '',
            bio: user.bio || '',
            email: user.email,
            username: user.username,
            mobile: user.mobile || '',
            roleId: user.roleId ? user.roleId._id.toString() : '', // ✅ Extract ObjectId as string
            roleName: user.roleId ? user.roleId.role_name : '' // ✅ Extract role name from populated data
        };
    }
    /**
     * Function: Register a new user
     * @param fullname
     * @param username
     * @param email
     * @param password
     * @param mobile
     * @param category
     * @returns
     */
    async register(data) {
        var _a, _b;
        // Check if user already exists
        const existingUser = await this.authRepository.findUserByEmail(data.email);
        if (existingUser) {
            throw new Error("User with this email already exists");
        }
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await this.authRepository.createUser({
            fullname: data.fullname,
            username: data.username,
            email: data.email,
            password: hashedPassword,
            mobile: data.mobile,
            bio: data.bio,
            profilePicture: data.profilePicture,
            roleId: data.roleId,
            roleName: data.roleId ? ((_a = (await this.userRoleService.findUserRoleById(data.roleId.toString()))) === null || _a === void 0 ? void 0 : _a.role_name) || '' : '',
            category: (_b = data.category) !== null && _b !== void 0 ? _b : []
        });
        return this.mapUserToDTO(user);
    }
    async login(email, password) {
        const user = await this.authRepository.findUserByEmail(email);
        if (!user) {
            throw new Error("Invalid email or password");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }
        // Generate JWT token
        const token = (0, jwt_1.generateToken)({ id: user._id.toString(), email: user.email });
        // Create session with 1-hour expiry
        const expiresAt = (0, date_fns_1.add)(new Date(), { hours: 24 });
        await this.authRepository.createUserSession(user._id, token, expiresAt);
        return {
            token,
            user: this.mapUserToDTO(user)
        };
    }
    async logout(token) {
        const isInvalidated = await this.authRepository.invalidateUserSession(token);
        if (!isInvalidated) {
            throw new Error('Token is already invalid or does not exist');
        }
    }
    async getAuthUserDetails(userId) {
        const user = await this.authRepository.findUserById(new mongoose_1.default.Types.ObjectId(userId));
        if (!user) {
            throw new Error("User not found");
        }
        return this.mapUserToDTO(user);
    }
    async updateUserDetails(userId, updateData) {
        const updatedUser = await this.authRepository.updateUser(new mongoose_1.default.Types.ObjectId(userId), updateData);
        if (!updatedUser) {
            throw new Error("User not found");
        }
        return this.mapUserToDTO(updatedUser);
    }
    async updatePassword(userId, currentPassword, newPassword) {
        // Validate current password
        const isValid = await this.authRepository.validatePassword(new mongoose_1.default.Types.ObjectId(userId), currentPassword);
        if (!isValid) {
            throw new Error('Current password is incorrect');
        }
        // Hash new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        // Update password
        const updated = await this.authRepository.updateUserPassword(new mongoose_1.default.Types.ObjectId(userId), hashedPassword);
        if (!updated) {
            throw new Error('Failed to update password');
        }
        // Invalidate all sessions
        await this.authRepository.invalidateAllUserSessions(new mongoose_1.default.Types.ObjectId(userId));
        return true;
    }
    async logoutAllSessions(userId) {
        await this.authRepository.invalidateAllUserSessions(new mongoose_1.default.Types.ObjectId(userId));
    }
    async getAllUsers() {
        return await this.authRepository.getAllUsers();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(auth_repository_1.AuthRepository)),
    __param(1, (0, tsyringe_1.inject)(userRole_service_1.UserRoleService)),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        userRole_service_1.UserRoleService])
], AuthService);
