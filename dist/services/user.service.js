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
exports.UserService = void 0;
const tsyringe_1 = require("tsyringe");
const user_repository_1 = require("../repositories/user.repository");
const mongoose_1 = __importDefault(require("mongoose"));
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(userData) {
        return await this.userRepository.createUser(userData);
    }
    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }
    async findUserById(userId) {
        return await this.userRepository.findUserById(new mongoose_1.default.Types.ObjectId(userId));
    }
    async updateUser(userId, updateData) {
        return await this.userRepository.updateUser(userId, updateData);
    }
    async deleteUser(userId) {
        return await this.userRepository.deleteUser(userId);
    }
};
UserService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
exports.UserService = UserService;
