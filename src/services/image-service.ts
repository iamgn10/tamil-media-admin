import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import path from "path";
import { CloudflareR2Config } from "../lib/cloudflare.config";


export class ImageService {
  private static s3Client = new S3Client({
    region: "auto",
    endpoint: CloudflareR2Config.endpoint,
    credentials: {
      accessKeyId: CloudflareR2Config.accessKeyId,
      secretAccessKey: CloudflareR2Config.secretAccessKey,
    },
  });

  static async processImage(imageBuffer: Buffer): Promise<Buffer> {
    const watermarkPath = path.resolve(__dirname, "../assets/watermark.png");

    return await sharp(imageBuffer)
      .resize(1600, 900, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .composite([{ input: watermarkPath, gravity: "center", blend: "overlay" }])
      .toBuffer();
  }

  static async processImageWithoutResize(imageBuffer: Buffer): Promise<Buffer> {
    const watermarkPath = path.resolve(__dirname, "../assets/watermark.png");

    return await sharp(imageBuffer)
      .composite([{ input: watermarkPath, gravity: "southeast", blend: "overlay" }])
      .toBuffer();
  }

  static async processImageNoWatermark(imageBuffer: Buffer): Promise<Buffer> {
    return await sharp(imageBuffer).toBuffer(); // return original image
  }

  static async processRichTextImage(imageBuffer: Buffer): Promise<Buffer> {
    const watermarkPath = path.resolve(__dirname, "../assets/watermark.png");
    const metadata = await sharp(imageBuffer).metadata();

    const svgRoundedCorners = `
      <svg width="100%" height="100%" viewBox="0 0 ${metadata.width} ${metadata.height}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="${metadata.width}" height="${metadata.height}" rx="12" ry="12" />
      </svg>
    `;

    return await sharp(imageBuffer)
      .composite([{ input: watermarkPath, gravity: "southeast", blend: "overlay" }])
      .composite([{ input: Buffer.from(svgRoundedCorners), blend: "dest-in" }])
      .toBuffer();
  }

  static async processThumbnail(imageBuffer: Buffer): Promise<Buffer> {
    return await sharp(imageBuffer)
      .resize({ height: 175, withoutEnlargement: true })
      .jpeg({ quality: 70 })
      .toBuffer();
  }

  static async uploadToR2(buffer: Buffer, mimeType: string, fileName?: string, folder = "uploads") {
    const fileKey = fileName ? `${folder}/${fileName}` : `${folder}/tamilmedia-${uuidv4()}`;

    const command = new PutObjectCommand({
      Bucket: CloudflareR2Config.bucketName,
      Key: fileKey,
      Body: buffer,
      ContentType: mimeType,
    });

    await this.s3Client.send(command);
    const publicUrl = `${CloudflareR2Config.publicBaseUrl}/${fileKey}`;
    return { fileKey, publicUrl };
  }

  

  static async uploadImage(buffer: Buffer, mimeType: string, resize = true): Promise<{ fileKey: string; publicUrl: string; thumbnailKey?: string; thumbnailUrl?: string }> {
    const processed = resize
      ? await this.processImage(buffer)
      : await this.processImageWithoutResize(buffer);

      const fileName = `tamilmedia-${uuidv4()}`;

    const uploadResult = await this.uploadToR2(processed, mimeType, fileName);

    console.log('Uploaded image:', uploadResult);

    const thumbnailBuffer = await this.processThumbnail(buffer);
    const thumbFileName = `${fileName}_thumb`;
    
    const thumbnailResult = await this.uploadToR2(thumbnailBuffer, "image/jpeg", thumbFileName);

    console.log('Uploaded thumbnail:', thumbnailResult);

    
    return uploadResult;
  }

  // upload images without any watermark [ad images, logos etc]
  static async uploadImageOriginal(buffer: Buffer, mimeType: string): Promise<{ fileKey: string; publicUrl: string }> {
    const processed = await this.processImageNoWatermark(buffer);
    return await this.uploadToR2(processed, mimeType);
  }

  // upload images to the media library - store both original and watermarked versions
  static async uploadImageForMediaLibrary(buffer: Buffer, mimeType: string): Promise<{ fileKey: string; publicUrl: string; originalFileKey: string; originalPublicUrl: string }> {
    const fileName = `tamilmedia-${uuidv4()}`;
    
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

  static getImageUrl(fileKey: string): string {
    return `${CloudflareR2Config.publicBaseUrl}/${fileKey}`;
  }

  // Remove watermark: Copy _original to main filename
  static async removeWatermarkFromMedia(currentFileKey: string): Promise<{ success: boolean }> {
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
      
    } catch (error) {
      console.error('Error removing watermark from media:', error);
      throw error;
    }
  }

  // Add watermark: Process _original and copy to main filename  
  static async addWatermarkToMedia(currentFileKey: string): Promise<{ success: boolean }> {
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
      
    } catch (error) {
      console.error('Error adding watermark to media:', error);
      throw error;
    }
  }

  //generate humbnail image from existing media image
  static async createThumbnailFromUrl(imageUrl: string): Promise<string> {
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
      
    } catch (error) {
      console.error('Error creating thumbnail from URL:', error);
      throw error;
    }
  }
}
