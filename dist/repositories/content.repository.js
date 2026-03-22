"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentRepository = void 0;
const content_model_1 = __importDefault(require("../models/content.model"));
class ContentRepository {
    async createContent(contentData) {
        return await content_model_1.default.create(contentData);
    }
    async getAllContents(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [contents, total] = await Promise.all([
            content_model_1.default.find().sort({ createdAt: -1, updatedAt: -1 }).skip(skip).limit(limit),
            content_model_1.default.countDocuments()
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            contents,
            total,
            totalPages,
            currentPage: page
        };
    }
    async getAllContentsWithoutPagination() {
        return await content_model_1.default.find().sort({ createdAt: -1, updatedAt: -1 });
    }
    async getAllContentOfUser(userId, page = 1, limit = 5) {
        const skip = (page - 1) * limit;
        const [contents, total] = await Promise.all([
            content_model_1.default.find({ authorId: userId }).sort({ createdAt: -1, updatedAt: -1 }).skip(skip).limit(limit),
            content_model_1.default.countDocuments({ authorId: userId })
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            contents,
            total,
            totalPages,
            currentPage: page
        };
    }
    async findContentById(contentId) {
        return await content_model_1.default.findById(contentId);
    }
    async updateContent(contentId, updateData) {
        return await content_model_1.default.findByIdAndUpdate(contentId, updateData, { new: true });
    }
    async deleteContent(contentId) {
        // const content = await this.findUserById(contentId);
        // if (!content) return false;
        // await content.deleteOne();
        // return true;
        const result = await content_model_1.default.findByIdAndDelete(contentId);
        return result !== null;
    }
    async getFilteredContent(filter, skip, pageSize) {
        return await content_model_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
    }
    async findContentsByUrl(url) {
        return await content_model_1.default.find({ url }).sort({ createdAt: -1 });
    }
    async findContentByUrl(url) {
        return await content_model_1.default.findOne({ url });
    }
    async findContentsByCategory(category) {
        return await content_model_1.default.find({ "category.name": category }).sort({ createdAt: -1 });
    }
    async findContentByKeyword(keyword) {
        return await content_model_1.default.find({ keywords: keyword });
    }
    async findScheduledContentReadyForPublishing(currentDate) {
        return await content_model_1.default.find({
            status: 'Scheduled',
            scheduledPublishDate: { $lte: currentDate }
        });
    }
}
exports.ContentRepository = ContentRepository;
