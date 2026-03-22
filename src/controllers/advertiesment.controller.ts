import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { AdvertiesmentService } from "../services/advertiesment.service";
import { APIResponse } from "../types";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";
import { ImageService } from "../services/image-service";
import { getAdStatus, uniquePositions } from "../types/advertiesment";
import { IAdvertiesment } from "../models/advertiesment.model";
import { sanitizeFormData } from "../utils/sanitizeFormData";



@injectable()
export class AdvertiesmentController  {
    constructor(@inject(AdvertiesmentService) private advertiesmentService: AdvertiesmentService) {}

    

    async createAdvertiesment(req: Request, res: Response): Promise<void> {
        try {
            const advertisementData = req.body;
            // Parse dates if they come as strings
            advertisementData.startDatetime = new Date(advertisementData.startDatetime);
            advertisementData.endDatetime = new Date(advertisementData.endDatetime);

            // Parse countries data if it's a string
            if (typeof advertisementData.countries === 'string') {
                try {
                    advertisementData.countries = JSON.parse(advertisementData.countries);
                } catch (error) {
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
            advertisementData.status = getAdStatus(advertisementData.startDatetime, advertisementData.endDatetime);
            console.log("Advertisement status:", advertisementData.status);

            // Enforce only one published ad for unique positions
            if (
                uniquePositions.includes(advertisementData.position) &&
                advertisementData.status === "published"
            ) {
                const existingAd = await this.advertiesmentService.findOneByPositionAndStatus(
                    advertisementData.position,
                    advertisementData.status
                );
                if (existingAd) {
                     res.status(400).json({
                        status: "error",
                        message: `Only one published ad allowed for position: ${advertisementData.position}`,
                    });
                    return
                }
            }

            console.log("debu point hit:", advertisementData)
            console.log("req.file:", req.file);

            // Check if an image file is provided
            if (req.file) {
                try {
                    const imageBuffer = req.file.buffer;
                    // const fileName = req.file.originalname;
                    const mimeType = req.file.mimetype;

                    // Process image without watermark or resizing
                    const processedImage = await ImageService.processImageNoWatermark(imageBuffer);

                    // Attempt to upload the image to Cloudflare
                    const uploadResponse = await ImageService.uploadImageOriginal(processedImage, mimeType);
                    console.log("✅ R2 Upload:", uploadResponse);

                    // Set the adImage field to the uploaded image URL
                    advertisementData.adImage = uploadResponse.publicUrl;
                } catch (error: any) {
                    console.error("Cloudflare upload failed:", error.message);
                    // Use a placeholder image if Cloudflare upload fails
                    
                }
            } 


            const newAdvertiesment = await this.advertiesmentService.createAdvertiesment(advertisementData);
            const response : APIResponse<typeof newAdvertiesment> = {status: true, message: "Advertiesment created successfully", data: newAdvertiesment};
            res.status(201).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response); 
        }
    }

    async getAllAdvertiesments(req: Request, res: Response): Promise<void> {
        try {
            const advertiesment = await this.advertiesmentService.getAllAdvertiesments();
            const response: APIResponse<typeof advertiesment> = { status: true, data: advertiesment };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getAdvertiesmentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const advertiesment = await this.advertiesmentService.findAdvertiesmentById(id);
            if (!advertiesment) {
                return next(new AppError(404, 'Advertiesment not found'));
            }

            const response: APIResponse<typeof advertiesment> = { status: true, data: advertiesment };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async updateAdvertiesment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { id } = req.params as { id: string };
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new AppError(400, 'Invalid ID format'));
          }
      
          let updateData = sanitizeFormData<IAdvertiesment>(req.body);
      
          // Parse and validate dates
          if (updateData.startDatetime) updateData.startDatetime = new Date(updateData.startDatetime);
          if (updateData.endDatetime) updateData.endDatetime = new Date(updateData.endDatetime);
      
          // Parse countries if stringified
          if (typeof updateData.countries === 'string') {
            try {
              updateData.countries = JSON.parse(updateData.countries);
            } catch (error) {
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
            updateData.status = getAdStatus(updateData.startDatetime, updateData.endDatetime) as "draft" | "published" | "expired" | "toPublish";
          }
      
          // Check for unique published ad positions
          if (
            updateData.status === 'published' &&
            updateData.position &&
            uniquePositions.includes(updateData.position)
          ) {
            const existingAd = await this.advertiesmentService.findOneByPositionAndStatus(
              updateData.position,
              updateData.status
            );
      
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
      
              const processedImage = await ImageService.processImageNoWatermark(imageBuffer);
              const uploadResponse = await ImageService.uploadImageOriginal(processedImage, mimeType);
              updateData.adImage = uploadResponse.publicUrl;
            } catch (error: any) {
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
            return next(new AppError(404, 'Advertiesment not found'));
          }
      
          const response: APIResponse<typeof updatedAd> = { status: true, data: updatedAd, message: 'Advertiesment updated successfully' };
          res.status(200).json(response);
        } catch (error: any) {
          const response: APIResponse<null> = { status: false, error: error.message };
          res.status(500).json(response);
        }
      }
      

    async deleteAdvertiesment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const isDeleted = await this.advertiesmentService.deleteAdvertiesment(id);
            if (!isDeleted) {
                return next(new AppError(404, 'Advertiesment not found'));
            }

            const response: APIResponse<null> = { status: true, message: 'Advertiesment deleted successfully' };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async changeAdvertiesmentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
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
                return next(new AppError(404, 'Advertiesment not found'));
            }

            const response: APIResponse<typeof advertiesment> = { status: true, data: advertiesment };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
}