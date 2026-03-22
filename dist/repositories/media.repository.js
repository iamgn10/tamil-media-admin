"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaRepository = void 0;
const media_model_1 = __importDefault(require("../models/media.model"));
class MediaRepository {
    async createMedia(mediaData) {
        return await media_model_1.default.create(mediaData);
    }
    async getAllMedias() {
        return await media_model_1.default.find()
            .populate('createdBy', 'fullname')
            .sort({ createdAt: -1, updatedAt: -1 });
    }
    async findMediaById(mediaId) {
        return await media_model_1.default.findById(mediaId).populate('createdBy', 'fullname');
    }
    async deleteMedia(mediaId) {
        // const media = await this.findUserById(mediaId);
        // if (!media) return false;
        // await media.deleteOne();
        // return true;
        const result = await media_model_1.default.findByIdAndDelete(mediaId);
        return result !== null;
    }
    async createBulkMedia(mediaDataArray) {
        return await media_model_1.default.insertMany(mediaDataArray);
    }
}
exports.MediaRepository = MediaRepository;
