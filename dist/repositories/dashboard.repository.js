"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRepository = void 0;
const advertiesment_model_1 = __importDefault(require("../models/advertiesment.model"));
const content_model_1 = __importDefault(require("../models/content.model"));
const logo_model_1 = __importDefault(require("../models/logo.model"));
class DashboardRepository {
    async saveLogo(logoData) {
        return await logo_model_1.default.create(logoData);
    }
    async getLogos() {
        return await logo_model_1.default.find();
    }
    async deleteLogosByType(type) {
        await logo_model_1.default.deleteMany({ type });
    }
    async getTotalNews() {
        return await content_model_1.default.countDocuments();
    }
    async getTotalPublishedNews() {
        return await content_model_1.default.countDocuments({ status: 'Published' });
    }
    async getTodayNews() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return await content_model_1.default.countDocuments({
            createdAt: { $gte: startOfDay },
            status: 'Published'
        });
    }
    async getTotalDraftNews() {
        return await content_model_1.default.countDocuments({ status: 'Draft' });
    }
    async getTotalScheduledNews() {
        return await content_model_1.default.countDocuments({ status: 'Scheduled' });
    }
    async getTotalAds() {
        return await advertiesment_model_1.default.countDocuments();
    }
    async getTotalNewsOfUser(userId) {
        return await content_model_1.default.countDocuments({ authorId: userId });
    }
    async getTotalPublishedNewsOfUser(userId) {
        return await content_model_1.default.countDocuments({ status: 'Published', authorId: userId });
    }
    async getTodayNewsOfUser(userId) {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return await content_model_1.default.countDocuments({
            createdAt: { $gte: startOfDay },
            status: 'Published',
            authorId: userId
        });
    }
    async getTotalDraftNewsOfUser(userId) {
        return await content_model_1.default.countDocuments({ status: 'Draft', authorId: userId });
    }
    async getTotalScheduledNewsOfUser(userId) {
        return await content_model_1.default.countDocuments({ status: 'Scheduled', authorId: userId });
    }
}
exports.DashboardRepository = DashboardRepository;
