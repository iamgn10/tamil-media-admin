"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const cloudflare_config_1 = require("../lib/cloudflare.config");
class ImageService {
    static async processImage(imageBuffer) {
        const watermarkPath = path_1.default.resolve(__dirname, "../assets/watermark.png");
        return await (0, sharp_1.default)(imageBuffer)
            .resize(1600, 900, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
            .composite([{ input: watermarkPath, gravity: "center", blend: "overlay" }])
            .toBuffer();
    }
    static async processImageWithoutResize(imageBuffer) {
        const watermarkPath = path_1.default.resolve(__dirname, "../assets/watermark.png");
        return await (0, sharp_1.default)(imageBuffer)
            .composite([{ input: watermarkPath, gravity: "southeast", blend: "overlay" }])
            .toBuffer();
    }
    static async processImageNoWatermark(imageBuffer) {
        return await (0, sharp_1.default)(imageBuffer).toBuffer(); // return original image
    }
    static async processRichTextImage(imageBuffer) {
        const watermarkPath = path_1.default.resolve(__dirname, "../assets/watermark.png");
        const metadata = await (0, sharp_1.default)(imageBuffer).metadata();
        const svgRoundedCorners = `
      <svg width="100%" height="100%" viewBox="0 0 ${metadata.width} ${metadata.height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${metadata.width}" height="${metadata.height}" rx="12" ry="12" />
      </svg>
    `;
        return await (0, sharp_1.default)(imageBuffer)
            .composite([{ input: watermarkPath, gravity: "southeast", blend: "overlay" }])
            .composite([{ input: Buffer.from(svgRoundedCorners), blend: "dest-in" }])
            .toBuffer();
    }
    static async processThumbnail(imageBuffer) {
        return await (0, sharp_1.default)(imageBuffer)
            .resize({ height: 175, withoutEnlargement: true })
            .jpeg({ quality: 70 })
            .toBuffer();
    }
    static async uploadToR2(buffer, mimeType, fileName, folder = "uploads") {
        const fileKey = fileName ? `${folder}/${fileName}` : `${folder}/tamilmedia-${(0, uuid_1.v4)()}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: cloudflare_config_1.CloudflareR2Config.bucketName,
            Key: fileKey,
            Body: buffer,
            ContentType: mimeType,
        });
        await this.s3Client.send(command);
        const publicUrl = `${cloudflare_config_1.CloudflareR2Config.publicBaseUrl}/${fileKey}`;
        return { fileKey, publicUrl };
    }
    static async uploadImage(buffer, mimeType, resize = true) {
        const processed = resize
            ? await this.processImage(buffer)
            : await this.processImageWithoutResize(buffer);
        const fileName = `tamilmedia-${(0, uuid_1.v4)()}`;
        const uploadResult = await this.uploadToR2(processed, mimeType, fileName);
        console.log('Uploaded image:', uploadResult);
        const thumbnailBuffer = await this.processThumbnail(buffer);
        const thumbFileName = `${fileName}_thumb`;
        const thumbnailResult = await this.uploadToR2(thumbnailBuffer, "image/jpeg", thumbFileName);
        console.log('Uploaded thumbnail:', thumbnailResult);
        return uploadResult;
    }
    // upload images without any watermark [ad images, logos etc]
    static async uploadImageOriginal(buffer, mimeType) {
        const processed = await this.processImageNoWatermark(buffer);
        return await this.uploadToR2(processed, mimeType);
    }
    // upload images to the media library - store both original and watermarked versions
    static async uploadImageForMediaLibrary(buffer, mimeType) {
        const fileName = `tamilmedia-${(0, uuid_1.v4)()}`;
        // Upload original without watermark
        const originalProcessed = await this.processImageNoWatermark(buffer);
        const originalUpload = await this.uploadToR2(originalProcessed, mimeType, `${fileName}_original`, "uploads");
        // Upload watermarked version 
        const watermarkedProcessed = await this.processImage(buffer);
        const watermarkedUpload = await this.uploadToR2(watermarkedProcessed, mimeType, fileName, "uploads");
        return {
            fileKey: watermarkedUpload.fileKey,
            publicUrl: watermarkedUpload.publicUrl,
            originalFileKey: originalUpload.fileKey,
            originalPublicUrl: originalUpload.publicUrl
        };
    }
    static getImageUrl(fileKey) {
        return `${cloudflare_config_1.CloudflareR2Config.publicBaseUrl}/${fileKey}`;
    }
    // Remove watermark: Copy _original to main filename
    static async removeWatermarkFromMedia(currentFileKey) {
        try {
            // Extract base filename (e.g., "uploads/tamilmedia-xxx" -> "tamilmedia-xxx")
            const fileName = currentFileKey.split('/').pop() || currentFileKey;
            const originalFileName = `${fileName}_original`;
            // Fetch the original image (without watermark)
            const originalImageUrl = this.getImageUrl(`uploads/${originalFileName}`);
            const response = await fetch(originalImageUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch original image: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);
            // Overwrite the current image with the original (no processing needed)
            await this.uploadToR2(imageBuffer, "image/webp", fileName, "uploads");
            return { success: true };
        }
        catch (error) {
            console.error('Error removing watermark from media:', error);
            throw error;
        }
    }
    // Add watermark: Process _original and copy to main filename  
    static async addWatermarkToMedia(currentFileKey) {
        try {
            // Extract base filename (e.g., "uploads/tamilmedia-xxx" -> "tamilmedia-xxx")
            const fileName = currentFileKey.split('/').pop() || currentFileKey;
            const originalFileName = `${fileName}_original`;
            // Fetch the original image
            const originalImageUrl = this.getImageUrl(`uploads/${originalFileName}`);
            const response = await fetch(originalImageUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch original image: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);
            // Process with watermark
            const watermarkedBuffer = await this.processImage(imageBuffer);
            // Overwrite the current image with watermarked version
            await this.uploadToR2(watermarkedBuffer, "image/webp", fileName, "uploads");
            return { success: true };
        }
        catch (error) {
            console.error('Error adding watermark to media:', error);
            throw error;
        }
    }
    //generate humbnail image from existing media image
    static async createThumbnailFromUrl(imageUrl) {
        try {
            // Extract filename from URL
            const urlParts = imageUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];
            // Fetch the original image from R2
            const response = await fetch(imageUrl);
            //console.log('response from r2:', response);
            if (!response.ok) {
                throw new Error(`Failed to fetch image from R2: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            const imageBuffer = Buffer.from(arrayBuffer);
            // Create and upload thumbnail with watermark
            const watermarkedBuffer = await this.processImageNoWatermark(imageBuffer);
            const thumbnailBuffer = await this.processThumbnail(watermarkedBuffer);
            const thumbFileName = `${fileName}_thumb`;
            const thumbnailUpload = await this.uploadToR2(thumbnailBuffer, "image/webp", thumbFileName, "uploads");
            //console.log('Thumbnail uploaded:', thumbnailUpload);
            // Return the original file path for database storage
            return `uploads/${fileName}`;
        }
        catch (error) {
            console.error('Error creating thumbnail from URL:', error);
            throw error;
        }
    }
}
exports.ImageService = ImageService;
ImageService.s3Client = new client_s3_1.S3Client({
    region: "auto",
    endpoint: cloudflare_config_1.CloudflareR2Config.endpoint,
    credentials: {
        accessKeyId: cloudflare_config_1.CloudflareR2Config.accessKeyId,
        secretAccessKey: cloudflare_config_1.CloudflareR2Config.secretAccessKey,
    },
});
