"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertiesmentRepository = void 0;
const advertiesment_model_1 = __importDefault(require("../models/advertiesment.model"));
class AdvertiesmentRepository {
    async createAdvertiesment(advertiesmentData) {
        return await advertiesment_model_1.default.create(advertiesmentData);
    }
    async getAllAdvertiesments() {
        return await advertiesment_model_1.default.find();
    }
    async findAdvertiesmentById(advertiesmentId) {
        return await advertiesment_model_1.default.findById(advertiesmentId);
    }
    async findOneByPositionAndStatus(position, status) {
        return await advertiesment_model_1.default.findOne({ position, status });
    }
    async updateAdvertiesment(advertiesmentId, updateData) {
        return await advertiesment_model_1.default.findByIdAndUpdate(advertiesmentId, updateData, { new: true });
    }
    async deleteAdvertiesment(advertiesmentId) {
        // const advertiesment = await this.findUserById(advertiesmentId);
        // if (!advertiesment) return false;
        // await advertiesment.deleteOne();
        // return true;
        const result = await advertiesment_model_1.default.findByIdAndDelete(advertiesmentId);
        return result !== null;
    }
}
exports.AdvertiesmentRepository = AdvertiesmentRepository;
