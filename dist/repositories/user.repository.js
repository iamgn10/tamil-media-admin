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
exports.UserRepository = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const tsyringe_1 = require("tsyringe");
let UserRepository = class UserRepository {
    async createUser(userData) {
        return await user_model_1.default.create(userData);
    }
    async getAllUsers() {
        return await user_model_1.default.find();
    }
    async findUserById(userId) {
        return await user_model_1.default.findById(userId);
    }
    async updateUser(userId, updateData) {
        return await user_model_1.default.findByIdAndUpdate(userId, updateData, { new: true });
    }
    async deleteUser(userId) {
        // const user = await this.findUserById(userId);
        // if (!user) return false;
        // await user.deleteOne();
        // return true;
        const result = await user_model_1.default.findByIdAndDelete(userId);
        return result !== null;
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, tsyringe_1.injectable)()
], UserRepository);
