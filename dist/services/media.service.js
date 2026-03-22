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
exports.MediaService = void 0;
const tsyringe_1 = require("tsyringe");
const media_repository_1 = require("../repositories/media.repository");
const image_service_1 = require("./image-service");
const mongoose_1 = __importDefault(require("mongoose"));
let MediaService = class MediaService {
    constructor(mediaRepository) {
        this.mediaRepository = mediaRepository;
    }
    async createMedia(mediaData) {
        return await this.mediaRepository.createMedia(mediaData);
    }
    async getAllMedias() {
        return await this.mediaRepository.getAllMedias();
    }
    async findMediaById(mediaId) {
        return await this.mediaRepository.findMediaById(mediaId);
    }
    async deleteMedia(mediaId) {
        return await this.mediaRepository.deleteMedia(mediaId);
    }
    async createBulkMedia(files, userId) {
        const uploadPromises = files.map(async (file) => {
            const { fileKey } = await image_service_1.ImageService.uploadImageForMediaLibrary(file.buffer, file.mimetype);
            return {
                img_url: fileKey,
                createdBy: new mongoose_1.default.Types.ObjectId(userId)
            };
        });
        const mediaDataArray = await Promise.all(uploadPromises);
        return await this.mediaRepository.createBulkMedia(mediaDataArray);
    }
    async removeWatermark(mediaId) {
        const media = await this.mediaRepository.findMediaById(mediaId);
        if (!media) {
            throw new Error('Media not found');
        }
        await image_service_1.ImageService.removeWatermarkFromMedia(media.img_url);
        return true;
    }
    async addWatermark(mediaId) {
        const media = await this.mediaRepository.findMediaById(mediaId);
        if (!media) {
            throw new Error('Media not found');
        }
        await image_service_1.ImageService.addWatermarkToMedia(media.img_url);
        return true;
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(media_repository_1.MediaRepository)),
    __metadata("design:paramtypes", [media_repository_1.MediaRepository])
], MediaService);
