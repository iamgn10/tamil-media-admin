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
exports.UserRoleService = void 0;
const tsyringe_1 = require("tsyringe");
const userRole_repository_1 = require("../repositories/userRole.repository");
let UserRoleService = class UserRoleService {
    constructor(userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }
    async createUserRole(userRoleData) {
        return await this.userRoleRepository.createUserRole(userRoleData);
    }
    async getAllUserRoles() {
        return await this.userRoleRepository.getAllUserRoles();
    }
    async findUserRoleById(userId) {
        return await this.userRoleRepository.findUserRoleById(userId);
    }
    async updateUserRole(userId, updateData) {
        return await this.userRoleRepository.updateUserRole(userId, updateData);
    }
    async deleteUserRole(userId) {
        return await this.userRoleRepository.deleteUserRole(userId);
    }
};
UserRoleService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(userRole_repository_1.UserRoleRepository)),
    __metadata("design:paramtypes", [userRole_repository_1.UserRoleRepository])
], UserRoleService);
exports.UserRoleService = UserRoleService;
