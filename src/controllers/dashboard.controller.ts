import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service";
import { APIResponse } from "../types";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";
import { ImageService } from "../services/image-service";
import { AuthHelper } from "../utils/authHelper";



@injectable()
export class DashboardController  {
    constructor(
        @inject(DashboardService) private dashboardService: DashboardService, 
        @inject(AuthHelper) private authHelper: AuthHelper
    ) {}

    async uploadLogo(req: Request, res: Response): Promise<void> {
        
        try {
            const { type } = req.body; // 'header' or 'footer'

            if (!req.file) {
                throw new AppError(400, "Logo file is required");
            }

            if (!type || !['header', 'footer'].includes(type)) {
                throw new AppError(400, "Logo type must be either 'header' or 'footer'");
            }

            const imageBuffer = req.file.buffer;
            //const fileName = `logo-${Date.now()}-${req.file.originalname}`;
            const mimeType = req.file.mimetype;

            const uploadResponse = await ImageService.uploadImageOriginal(imageBuffer, mimeType);
            const publicUrl = uploadResponse.publicUrl;

            // Construct the logo data
            const logoData = {
                url: publicUrl,
                type,
            };

            const savedLogo = await this.dashboardService.uploadLogo(logoData);

            const response: APIResponse<typeof savedLogo> = {
                status: true,
                message: `${type.charAt(0).toUpperCase() + type.slice(1)} logo uploaded successfully`,
                data: savedLogo,
            };
            res.status(201).json(response);
            
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
            
        }
    }

    async getLogo(req: Request, res: Response): Promise<void> {
        try {
            const logos = await this.dashboardService.getLogos();
            if (!logos || logos.length === 0) {
                throw new AppError(404, "No logos found");
            }
            const response: APIResponse<typeof logos> = {
                status: true,
                message: "Logos retrieved successfully",
                data: logos,
            };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
            
        }
    }

    async getDashboardData(req: Request, res: Response): Promise<void> {
        try {
            const dashboardData = await this.dashboardService.getDashboardData();
            if (!dashboardData) {
                throw new AppError(404, "Dashboard data not found");
            }
            //console.log("Dashboard Data:", dashboardData);
            const response: APIResponse<typeof dashboardData> = {
                status: true,
                message: "Dashboard data retrieved successfully",
                data: dashboardData,
            };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getDashboardDataOfUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = await this.authHelper.getUserIdFromToken(req);
            if (!userId) {
                const response: APIResponse<null> = { status: false, error: "User not authenticated" };
                res.status(401).json(response);
                return;
            }
            const dashboardData = await this.dashboardService.getDashboardDataOfUser(String(userId));
            if (!dashboardData) {
                throw new AppError(404, "Dashboard data not found");
            }
            //console.log("Dashboard Data:", dashboardData);
            const response: APIResponse<typeof dashboardData> = {
                status: true,
                message: "Dashboard data retrieved successfully",
                data: dashboardData,
            };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
}