"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleRepository = void 0;
const role_model_1 = require("../models/role.model");
const tsyringe_1 = require("tsyringe");
let UserRoleRepository = class UserRoleRepository {
    async createUserRole(userRoleData) {
        try {
            return await role_model_1.Role.create(userRoleData);
        }
        catch (error) {
            if (error instanceof Error && error.code === 11000) {
                throw new Error("Role name already exists. Please use a different name.");
            }
            throw error;
        }
    }
    async getAllUserRoles() {
        return await role_model_1.Role.find();
    }
    async findUserRoleById(userId) {
        return await role_model_1.Role.findById(userId);
    }
    async updateUserRole(userId, updateData) {
        return await role_model_1.Role.findByIdAndUpdate(userId, updateData, { new: true });
    }
    async deleteUserRole(userId) {
        const result = await role_model_1.Role.findByIdAndDelete(userId);
        return result !== null;
    }
};
exports.UserRoleRepository = UserRoleRepository;
exports.UserRoleRepository = UserRoleRepository = __decorate([
    (0, tsyringe_1.injectable)()
], UserRoleRepository);
