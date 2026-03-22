"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const userLoginSession_model_1 = __importDefault(require("../models/userLoginSession.model"));
const tsyringe_1 = require("tsyringe");
let AuthRepository = class AuthRepository {
    /**
     * Function: Create a new user
     * @param userData
     * @returns
     */
    async createUser(userData) {
        return await user_model_1.default.create(userData);
    }
    async findUserByEmail(email) {
        return await user_model_1.default.findOne({ email })
            .populate({ path: 'roleId', select: 'role_name' }) // Populate role details
            .exec();
    }
    async findUserById(userId) {
        return await user_model_1.default.findById(userId)
            .populate({ path: 'roleId', select: 'role_name' }) // Populate role details
            .select('-password') // Exclude password from the response
            .exec();
    }
    async getAllUsers() {
        return await user_model_1.default.find()
            .populate({ path: 'roleId', select: 'role_name' }) // Populate role details
            .select('-password') // Exclude password
            .exec();
    }
    async updateUser(userId, updateData) {
        return await user_model_1.default.findByIdAndUpdate(userId, updateData, { new: true })
            .populate({ path: 'roleId', select: 'role_name' }) // Populate role details
            .select('-password') // Exclude password
            .exec();
    }
    async updateUserPassword(userId, newPassword) {
        const user = await user_model_1.default.findById(userId);
        if (!user)
            return false;
        user.password = newPassword;
        await user.save();
        return true;
    }
    async validatePassword(userId, currentPassword) {
        const user = await user_model_1.default.findById(userId).exec();
        if (!user)
            return false;
        return await bcryptjs_1.default.compare(currentPassword, user.password);
    }
    async createUserSession(userId, token, expiresAt) {
        // Invalidate previous sessions
        // await UserLoginSession.updateMany(
        //   { userId, isValid: true },
        //   { isValid: false }
        // );
        return await userLoginSession_model_1.default.create({ userId, token, expiresAt });
    }
    async invalidateUserSession(token) {
        const session = await userLoginSession_model_1.default.findOne({ token, isValid: true }).exec();
        if (session) {
            session.isValid = false;
            await session.save();
            return true;
        }
        return false;
    }
    async invalidateAllUserSessions(userId) {
        await userLoginSession_model_1.default.updateMany({ userId, isValid: true }, { isValid: false });
        return true;
    }
    async isTokenValid(token) {
        const session = await userLoginSession_model_1.default.findOne({
            token,
            isValid: true,
            expiresAt: { $gt: new Date() }, // Check if expiresAt is greater than now
        }).exec();
        return !!session;
    }
};
AuthRepository = __decorate([
    (0, tsyringe_1.injectable)()
], AuthRepository);
exports.AuthRepository = AuthRepository;
