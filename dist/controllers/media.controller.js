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
exports.MediaController = void 0;
const tsyringe_1 = require("tsyringe");
const media_service_1 = require("../services/media.service");
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
const authHelper_1 = require("../utils/authHelper");
let MediaController = class MediaController {
    constructor(mediaService, authHelper) {
        this.mediaService = mediaService;
        this.authHelper = authHelper;
    }
    async createMedia(req, res) {
        try {
            const files = req.files;
            if (!files || files.length === 0) {
                const response = { status: false, error: "No images provided" };
                res.status(400).json(response);
                return;
            }
            const userId = await this.authHelper.getUserIdFromToken(req);
            if (!userId) {
                const response = { status: false, error: "User not authenticated" };
                res.status(401).json(response);
                return;
            }
            const newMedia = await this.mediaService.createBulkMedia(files, userId.toString());
            const response = { status: true, message: "Media created successfully", data: newMedia };
            res.status(201).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getAllMedias(req, res) {
        try {
            const media = await this.mediaService.getAllMedias();
            const response = { status: true, data: media };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getMediaById(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const media = await this.mediaService.findMediaById(id);
            if (!media) {
                return next(new AppError_1.AppError(404, 'Media not found'));
            }
            const response = { status: true, data: media };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async deleteMedia(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const isDeleted = await this.mediaService.deleteMedia(id);
            if (!isDeleted) {
                return next(new AppError_1.AppError(404, 'Media not found'));
            }
            const response = { status: true, message: 'Image deleted successfully' };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async removeWatermark(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            await this.mediaService.removeWatermark(id);
            const response = {
                status: true,
                message: "Watermark removed successfully"
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async addWatermark(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            await this.mediaService.addWatermark(id);
            const response = {
                status: true,
                message: "Watermark added successfully"
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
};
exports.MediaController = MediaController;
exports.MediaController = MediaController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(media_service_1.MediaService)),
    __param(1, (0, tsyringe_1.inject)(authHelper_1.AuthHelper)),
    __metadata("design:paramtypes", [media_service_1.MediaService,
        authHelper_1.AuthHelper])
], MediaController);
