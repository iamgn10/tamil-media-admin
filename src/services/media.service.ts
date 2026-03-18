import { injectable, inject } from "tsyringe";
import { MediaRepository } from "../repositories/media.repository";
import { IMedia } from "../models/media.model";
import { ImageService } from "./image-service";
import mongoose from "mongoose";

@injectable()
export class MediaService {

    constructor(@inject(MediaRepository) private mediaRepository: MediaRepository) {}

    async createMedia(mediaData: Partial<IMedia>): Promise<IMedia> {
        return await this.mediaRepository.createMedia(mediaData);
    }

    async getAllMedias(): Promise<IMedia[]> {
        return await this.mediaRepository.getAllMedias();
    }
    
    async findMediaById(mediaId: string): Promise<IMedia | null> {
        return await this.mediaRepository.findMediaById(mediaId);
    }
       
    async deleteMedia(mediaId: string): Promise<boolean> {
        return await this.mediaRepository.deleteMedia(mediaId);
    }

    async createBulkMedia(files: Express.Multer.File[], userId: string): Promise<IMedia[]> {
        const uploadPromises = files.map(async (file) => {
            const { fileKey } = await ImageService.uploadImageForMediaLibrary(file.buffer, file.mimetype);
            return {
                img_url: fileKey,
                createdBy: new mongoose.Types.ObjectId(userId)
            };
        });

        const mediaDataArray = await Promise.all(uploadPromises);
        return await this.mediaRepository.createBulkMedia(mediaDataArray);
    }

    async removeWatermark(mediaId: string): Promise<boolean> {
        const media = await this.mediaRepository.findMediaById(mediaId);
        if (!media) {
            throw new Error('Media not found');
        }

        await ImageService.removeWatermarkFromMedia(media.img_url);
        return true;
    }

    async addWatermark(mediaId: string): Promise<boolean> {
        const media = await this.mediaRepository.findMediaById(mediaId);
        if (!media) {
            throw new Error('Media not found');
        }

        await ImageService.addWatermarkToMedia(media.img_url);
        return true;
    }
}