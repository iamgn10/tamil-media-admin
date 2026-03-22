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
exports.DashboardController = void 0;
const tsyringe_1 = require("tsyringe");
const dashboard_service_1 = require("../services/dashboard.service");
const AppError_1 = require("../utils/AppError");
const image_service_1 = require("../services/image-service");
const authHelper_1 = require("../utils/authHelper");
let DashboardController = class DashboardController {
    constructor(dashboardService, authHelper) {
        this.dashboardService = dashboardService;
        this.authHelper = authHelper;
    }
    async uploadLogo(req, res) {
        try {
            const { type } = req.body; // 'header' or 'footer'
            if (!req.file) {
                throw new AppError_1.AppError(400, "Logo file is required");
            }
            if (!type || !['header', 'footer'].includes(type)) {
                throw new AppError_1.AppError(400, "Logo type must be either 'header' or 'footer'");
            }
            const imageBuffer = req.file.buffer;
            //const fileName = `logo-${Date.now()}-${req.file.originalname}`;
            const mimeType = req.file.mimetype;
            const uploadResponse = await image_service_1.ImageService.uploadImageOriginal(imageBuffer, mimeType);
            const publicUrl = uploadResponse.publicUrl;
            // Construct the logo data
            const logoData = {
                url: publicUrl,
                type,
            };
            const savedLogo = await this.dashboardService.uploadLogo(logoData);
            const response = {
                status: true,
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} logo uploaded successfully`,
                data: savedLogo,
            };
            res.status(201).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getLogo(req, res) {
        try {
            const logos = await this.dashboardService.getLogos();
            if (!logos || logos.length === 0) {
                throw new AppError_1.AppError(404, "No logos found");
            }
            const response = {
                status: true,
                message: "Logos retrieved successfully",
                data: logos,
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getDashboardData(req, res) {
        try {
            const dashboardData = await this.dashboardService.getDashboardData();
            if (!dashboardData) {
                throw new AppError_1.AppError(404, "Dashboard data not found");
            }
            //console.log("Dashboard Data:", dashboardData);
            const response = {
                status: true,
                message: "Dashboard data retrieved successfully",
                data: dashboardData,
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getDashboardDataOfUser(req, res) {
        try {
            const userId = await this.authHelper.getUserIdFromToken(req);
            if (!userId) {
                const response = { status: false, error: "User not authenticated" };
                res.status(401).json(response);
                return;
            }
            const dashboardData = await this.dashboardService.getDashboardDataOfUser(String(userId));
            if (!dashboardData) {
                throw new AppError_1.AppError(404, "Dashboard data not found");
            }
            //console.log("Dashboard Data:", dashboardData);
            const response = {
                status: true,
                message: "Dashboard data retrieved successfully",
                data: dashboardData,
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
};
exports.DashboardController = DashboardController;
exports.DashboardController = DashboardController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(dashboard_service_1.DashboardService)),
    __param(1, (0, tsyringe_1.inject)(authHelper_1.AuthHelper)),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService,
        authHelper_1.AuthHelper])
], DashboardController);
