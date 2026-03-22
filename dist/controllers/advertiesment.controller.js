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
exports.AdvertiesmentController = void 0;
const tsyringe_1 = require("tsyringe");
const advertiesment_service_1 = require("../services/advertiesment.service");
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
const image_service_1 = require("../services/image-service");
const advertiesment_1 = require("../types/advertiesment");
const sanitizeFormData_1 = require("../utils/sanitizeFormData");
let AdvertiesmentController = class AdvertiesmentController {
    constructor(advertiesmentService) {
        this.advertiesmentService = advertiesmentService;
    }
    async createAdvertiesment(req, res) {
        try {
            const advertisementData = req.body;
            // Parse dates if they come as strings
            advertisementData.startDatetime = new Date(advertisementData.startDatetime);
            advertisementData.endDatetime = new Date(advertisementData.endDatetime);
            // Parse countries data if it's a string
            if (typeof advertisementData.countries === 'string') {
                try {
                    advertisementData.countries = JSON.parse(advertisementData.countries);
                }
                catch (error) {
                    console.error('Error parsing countries data:', error);
                    res.status(400).json({
                        status: 'error',
                        message: 'Invalid countries data format',
                    });
                    return;
                }
            }
            // Validate countries data
            if (!Array.isArray(advertisementData.countries) || advertisementData.countries.length === 0) {
                res.status(400).json({
                    status: 'error',
                    message: 'At least one country is required',
                });
                return;
            }
            // Validate each country has required fields
            for (const country of advertisementData.countries) {
                if (!country.code || !country.name) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Each country must have both code and name',
                    });
                    return;
                }
            }
            // Set status based on schedule
            advertisementData.status = (0, advertiesment_1.getAdStatus)(advertisementData.startDatetime, advertisementData.endDatetime);
            console.log("Advertisement status:", advertisementData.status);
            // Enforce only one published ad for unique positions
            if (advertiesment_1.uniquePositions.includes(advertisementData.position) &&
                advertisementData.status === "published") {
                const existingAd = await this.advertiesmentService.findOneByPositionAndStatus(advertisementData.position, advertisementData.status);
                if (existingAd) {
                    res.status(400).json({
                        status: "error",
                        message: `Only one published ad allowed for position: ${advertisementData.position}`,
                    });
                    return;
                }
            }
            console.log("debu point hit:", advertisementData);
            console.log("req.file:", req.file);
            // Check if an image file is provided
            if (req.file) {
                try {
                    const imageBuffer = req.file.buffer;
                    // const fileName = req.file.originalname;
                    const mimeType = req.file.mimetype;
                    // Process image without watermark or resizing
                    const processedImage = await image_service_1.ImageService.processImageNoWatermark(imageBuffer);
                    // Attempt to upload the image to Cloudflare
                    const uploadResponse = await image_service_1.ImageService.uploadImageOriginal(processedImage, mimeType);
                    console.log("✅ R2 Upload:", uploadResponse);
                    // Set the adImage field to the uploaded image URL
                    advertisementData.adImage = uploadResponse.publicUrl;
                }
                catch (error) {
                    console.error("Cloudflare upload failed:", error.message);
                    // Use a placeholder image if Cloudflare upload fails
                }
            }
            const newAdvertiesment = await this.advertiesmentService.createAdvertiesment(advertisementData);
            const response = { status: true, message: "Advertiesment created successfully", data: newAdvertiesment };
            res.status(201).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getAllAdvertiesments(req, res) {
        try {
            const advertiesment = await this.advertiesmentService.getAllAdvertiesments();
            const response = { status: true, data: advertiesment };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getAdvertiesmentById(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const advertiesment = await this.advertiesmentService.findAdvertiesmentById(id);
            if (!advertiesment) {
                return next(new AppError_1.AppError(404, 'Advertiesment not found'));
            }
            const response = { status: true, data: advertiesment };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async updateAdvertiesment(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            let updateData = (0, sanitizeFormData_1.sanitizeFormData)(req.body);
            // Parse and validate dates
            if (updateData.startDatetime)
                updateData.startDatetime = new Date(updateData.startDatetime);
            if (updateData.endDatetime)
                updateData.endDatetime = new Date(updateData.endDatetime);
            // Parse countries if stringified
            if (typeof updateData.countries === 'string') {
                try {
                    updateData.countries = JSON.parse(updateData.countries);
                }
                catch (error) {
                    res.status(400).json({
                        status: 'error',
                        message: 'Invalid countries data format',
                    });
                    return;
                }
            }
            // Validate countries format
            if (updateData.countries) {
                if (!Array.isArray(updateData.countries) || updateData.countries.length === 0) {
                    res.status(400).json({
                        status: 'error',
                        message: 'At least one country is required',
                    });
                    return;
                }
                for (const country of updateData.countries) {
                    if (!country.code || !country.name) {
                        res.status(400).json({
                            status: 'error',
                            message: 'Each country must have both code and name',
                        });
                        return;
                    }
                }
            }
            // If both dates exist, re-compute status
            if (updateData.startDatetime && updateData.endDatetime) {
                updateData.status = (0, advertiesment_1.getAdStatus)(updateData.startDatetime, updateData.endDatetime);
            }
            // Check for unique published ad positions
            if (updateData.status === 'published' &&
                updateData.position &&
                advertiesment_1.uniquePositions.includes(updateData.position)) {
                const existingAd = await this.advertiesmentService.findOneByPositionAndStatus(updateData.position, updateData.status);
                if (existingAd && existingAd._id.toString() !== id) {
                    res.status(400).json({
                        status: 'error',
                        message: `Only one published ad allowed for position: ${updateData.position}`,
                    });
                    return;
                }
            }
            // If image is provided, upload to R2
            if (req.file) {
                try {
                    const imageBuffer = req.file.buffer;
                    const mimeType = req.file.mimetype;
                    const processedImage = await image_service_1.ImageService.processImageNoWatermark(imageBuffer);
                    const uploadResponse = await image_service_1.ImageService.uploadImageOriginal(processedImage, mimeType);
                    updateData.adImage = uploadResponse.publicUrl;
                }
                catch (error) {
                    console.error("Cloudflare upload failed:", error.message);
                    res.status(500).json({
                        status: 'error',
                        message: 'Failed to upload image to Cloudflare',
                    });
                    return;
                }
            }
            // Proceed to update
            const updatedAd = await this.advertiesmentService.updateAdvertiesment(id, updateData);
            if (!updatedAd) {
                return next(new AppError_1.AppError(404, 'Advertiesment not found'));
            }
            const response = { status: true, data: updatedAd, message: 'Advertiesment updated successfully' };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async deleteAdvertiesment(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const isDeleted = await this.advertiesmentService.deleteAdvertiesment(id);
            if (!isDeleted) {
                return next(new AppError_1.AppError(404, 'Advertiesment not found'));
            }
            const response = { status: true, message: 'Advertiesment deleted successfully' };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async changeAdvertiesmentStatus(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const { status } = req.body;
            if (!['draft', 'published', 'expired', 'toPublish'].includes(status)) {
                res.status(400).json({
                    status: 'error',
                    message: 'Invalid status value',
                });
                return;
            }
            const advertiesment = await this.advertiesmentService.updateAdvertiesment(id, { status });
            if (!advertiesment) {
                return next(new AppError_1.AppError(404, 'Advertiesment not found'));
            }
            const response = { status: true, data: advertiesment };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
};
exports.AdvertiesmentController = AdvertiesmentController;
exports.AdvertiesmentController = AdvertiesmentController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(advertiesment_service_1.AdvertiesmentService)),
    __metadata("design:paramtypes", [advertiesment_service_1.AdvertiesmentService])
], AdvertiesmentController);
