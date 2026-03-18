import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { MediaService } from "../services/media.service";
import { APIResponse } from "../types";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";
import { AuthHelper } from "../utils/authHelper";
import { ImageService } from "../services/image-service";


@injectable()
export class MediaController  {
    constructor(
        @inject(MediaService) private mediaService: MediaService, 
        @inject(AuthHelper) private authHelper: AuthHelper) 
    {}

    async createMedia(req: Request, res: Response): Promise<void> {
        try {
            
            const files = req.files as Express.Multer.File[];
            if (!files || files.length === 0) {
                const response: APIResponse<null> = { status: false, error: "No images provided" };
                res.status(400).json(response);
                return;
            }

            const userId = await this.authHelper.getUserIdFromToken(req);
            if (!userId) {
                const response: APIResponse<null> = { status: false, error: "User not authenticated" };
                res.status(401).json(response);
                return;
            }

            const newMedia = await this.mediaService.createBulkMedia(files, userId.toString());
            const response : APIResponse<typeof newMedia> = {status: true, message: "Media created successfully", data: newMedia};
            res.status(201).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response); 
        }
    }

    async getAllMedias(req: Request, res: Response): Promise<void> {
        try {
            const media = await this.mediaService.getAllMedias();
            const response: APIResponse<typeof media> = { status: true, data: media };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getMediaById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const media = await this.mediaService.findMediaById(id);
            if (!media) {
                return next(new AppError(404, 'Media not found'));
            }

            const response: APIResponse<typeof media> = { status: true, data: media };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const isDeleted = await this.mediaService.deleteMedia(id);
            if (!isDeleted) {
                return next(new AppError(404, 'Media not found'));
            }

            const response: APIResponse<null> = { status: true, message: 'Image deleted successfully' };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async removeWatermark(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            await this.mediaService.removeWatermark(id);

            const response: APIResponse<null> = { 
                status: true, 
                message: "Watermark removed successfully"
            };
            res.status(200).json(response);

        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async addWatermark(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            await this.mediaService.addWatermark(id);

            const response: APIResponse<null> = { 
                status: true, 
                message: "Watermark added successfully"
            };
            res.status(200).json(response);

        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
}