import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { ContentService } from "../services/content.service";
import { APIResponse } from "../types";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";
import { ImageService } from "../services/image-service";
import { AuthHelper } from "../utils/authHelper";

// Utility function to extract relative path from R2 public URL
const extractRelativePath = (publicUrl: string): string => {
    const r2BaseUrl = 'https://pub-1d85a161c55d409d8c7982e043bce681.r2.dev';
    if (publicUrl.startsWith(r2BaseUrl)) {
        return publicUrl.replace(r2BaseUrl, '');
    }
    return publicUrl;
};


@injectable()
export class ContentController  {
    constructor(
        @inject(ContentService) private contentService: ContentService,
        @inject(AuthHelper) private authHelper: AuthHelper
    ) {}

    async createContent(req: Request, res: Response): Promise<void> {
        try {

            const contentData = req.body;

            const userId = await this.authHelper.getUserIdFromToken(req);
            if (!userId) {
                const response: APIResponse<null> = { status: false, error: "User not authenticated" };
                res.status(401).json(response);
                return;
            }
            else{
                contentData.authorId = userId
            }

            if (contentData.headlineImage) {
                // If headlineImage URL is provided (selecting from media)
                try {
                    // Check if it's a full URL from media selection
                    if (contentData.headlineImage.startsWith('http')) {
                        // Create thumbnail and return the database path
                        contentData.headlineImage = await ImageService.createThumbnailFromUrl(contentData.headlineImage);
                    }
                } catch (error: any) {
                    console.error("Failed to create thumbnail for selected media:", error.message);
                    res.status(500).json({
                        status: 'error',
                        message: 'Failed to process selected media image',
                    });
                    return;
                }
            }

        
            if (typeof contentData.category === 'string') {
            contentData.category = JSON.parse(contentData.category);
            }
            if (typeof contentData.keywords === 'string') {
            contentData.keywords = JSON.parse(contentData.keywords);
            }
            if (typeof req.body.provinces === "string") {
                try {
                    contentData.provinces = JSON.parse(contentData.provinces);
                } catch {
                    contentData.provinces = [];
                }
            }

            // Convert string booleans to actual booleans
            contentData.isFeatured = contentData.isFeatured === 'true';
            contentData.isSpecial = contentData.isSpecial === 'true';
            contentData.isBreaking = contentData.isBreaking === 'true';

            // Handle scheduled publishing
            if (contentData.scheduledPublishDate) {
                contentData.status = 'Scheduled'; // Set initial status as Scheduled for scheduled content
                contentData.scheduledPublishDate = new Date(contentData.scheduledPublishDate);
            }

            const newContent = await this.contentService.createContent(req.body);
            const response : APIResponse<typeof newContent> = {status: true, message: "Content created successfully"};
            res.status(201).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response); 
        }
    }

    async getAllContents(req: Request, res: Response): Promise<void> {
        try {
            const pageQuery = req.query.page as string;
            const limitQuery = req.query.limit as string;
            
            const page = parseInt(pageQuery) || 1;
            const limit = parseInt(limitQuery) || 20;
                
            const result = await this.contentService.getAllContents(page, limit);
            
            // Remove R2 base URL from headlineImage fields
            if (result.contents && Array.isArray(result.contents)) {
                result.contents = result.contents.map((content: any) => {
                    if (content.headlineImage) {
                        content.headlineImage = extractRelativePath(content.headlineImage);
                    }
                    return content;
                });
            }
            
            const response: APIResponse<typeof result> = { status: true, data: result };
            res.status(200).json(response);

        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getAllContent(req: Request, res: Response): Promise<void> {
        try {
            const pageQuery = req.query.page as string;
            const limitQuery = req.query.limit as string;

            const page = parseInt(pageQuery) || 1;
            const limit = parseInt(limitQuery) || 5;

            const result = await this.contentService.getAllContents(page, limit);

            // Remove R2 base URL from headlineImage fields
            if (result.contents && Array.isArray(result.contents)) {
                result.contents = result.contents.map((content: any) => {
                    if (content.headlineImage) {
                        content.headlineImage = extractRelativePath(content.headlineImage);
                    }
                    return content;
                });
            }

            const response: APIResponse<typeof result> = { status: true, data: result };
            res.status(200).json(response);

        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getAllContentOfUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = await this.authHelper.getUserIdFromToken(req);
            if (!userId) {
                const response: APIResponse<null> = { status: false, error: "User not authenticated" };
                res.status(401).json(response);
                return;
            }

            const pageQuery = req.query.page as string;
            const limitQuery = req.query.limit as string;

            const page = parseInt(pageQuery) || 1;
            const limit = parseInt(limitQuery) || 5;

            const result = await this.contentService.getAllContentOfUser(String(userId), page, limit);

            // Remove R2 base URL from headlineImage fields
            if (result.contents && Array.isArray(result.contents)) {
                result.contents = result.contents.map((content: any) => {
                    if (content.headlineImage) {
                        content.headlineImage = extractRelativePath(content.headlineImage);
                    }
                    return content;
                });
            }

            const response: APIResponse<typeof result> = { status: true, data: result };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getSpecialContents_and_FeaturedContents_and_Breaking(req: Request, res: Response): Promise<void> {
        try {
            // Set headers to prevent caching
            // res.set({
            //     'Cache-Control': 'no-cache, no-store, must-revalidate',
            //     'Pragma': 'no-cache',
            //     'Expires': '0'
            // });

            const allContents = await this.contentService.getAllContentsWithoutPagination();
            
            // Remove R2 base URL from headlineImage fields
            const cleanedContents = allContents.map((content: any) => {
                if (content.headlineImage) {
                    content.headlineImage = extractRelativePath(content.headlineImage);
                }
                return content;
            });
            
            const specialContents = cleanedContents.filter(content => content.isSpecial);
            const featuredContents = cleanedContents.filter(content => content.isFeatured);
            const breakingContents = cleanedContents.filter(content => content.isBreaking);
            const response: APIResponse<{ specialContents: typeof specialContents, featuredContents: typeof featuredContents, breakingContents: typeof breakingContents }> = { status: true, data: { specialContents, featuredContents, breakingContents } };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getContentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const content = await this.contentService.findContentById(id);
            if (!content) {
                return next(new AppError(404, 'Content not found'));
            }

            // Remove R2 base URL from headlineImage if it exists
            if ((content as any).headlineImage) {
                (content as any).headlineImage = extractRelativePath((content as any).headlineImage);
            }

            const response: APIResponse<typeof content> = { status: true, data: content };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    
    async updateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
          const { id } = req.params;
          if (!mongoose.Types.ObjectId.isValid(id)) {
              return next(new AppError(400, 'Invalid ID format'));
          }

          // Create a clean update object without using sanitizeFormData to avoid duplicates
          const updateData: any = {};
          
          // Copy all fields from req.body, handling duplicates by taking the last value
          for (const [key, value] of Object.entries(req.body)) {
              updateData[key] = value;
          }
          
          console.log('Update Data:', updateData);
          
          if (req.file) {
              try {
                  const imageBuffer = req.file.buffer;
                  const mimeType = req.file.mimetype;

                  // Attempt to upload the image to Cloudflare
                  const uploadResponse = await ImageService.uploadImage(imageBuffer, mimeType, true);

                  // Set the imageUrl field to the relative path
                  updateData.headlineImage = extractRelativePath(uploadResponse.publicUrl);
              } catch (error: any) {
                  console.error("Cloudflare upload failed:", error.message);
                  res.status(500).json({
                      status: 'error',
                      message: 'Failed to upload image to Cloudflare',
                  });
                  return
              }
          } else if (updateData.headlineImage) {
              // If headlineImage URL is provided (selecting from media)
              try {
                  // Check if it's a full URL from media selection
                  if (updateData.headlineImage.startsWith('http')) {
                      // Create thumbnail and return the database path
                      updateData.headlineImage = await ImageService.createThumbnailFromUrl(updateData.headlineImage);
                  }
              } catch (error: any) {
                  console.error("Failed to create thumbnail for selected media:", error.message);
                  res.status(500).json({
                      status: 'error',
                      message: 'Failed to process selected media image',
                  });
                  return;
              }
          }

          // Parse JSON strings
          if (typeof updateData.category === 'string') {
              try {
                  updateData.category = JSON.parse(updateData.category);
              } catch {
                  // Keep as string if parsing fails
              }
          }
          if (typeof updateData.keywords === 'string') {
              try {
                  updateData.keywords = JSON.parse(updateData.keywords);
              } catch {
                  // Keep as string if parsing fails
              }
          }
          if (typeof updateData.provinces === "string") {
              try {
                  updateData.provinces = JSON.parse(updateData.provinces);
              } catch {
                  console.warn('Invalid JSON string for provinces:', updateData.provinces);
                  updateData.provinces = [];
              }
          }

          // Convert string booleans to actual booleans
          if (updateData.isFeatured !== undefined) {
              updateData.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
          }
          if (updateData.isSpecial !== undefined) {
              updateData.isSpecial = updateData.isSpecial === 'true' || updateData.isSpecial === true;
          }
          if (updateData.isBreaking !== undefined) {
              updateData.isBreaking = updateData.isBreaking === 'true' || updateData.isBreaking === true;
          }
          if (updateData.isShownOnHome !== undefined) {
              updateData.isShownOnHome = updateData.isShownOnHome === 'true' || updateData.isShownOnHome === true;
          }

          // Handle scheduled publishing
          if (updateData.scheduledPublishDate) {
              updateData.status = 'Scheduled'; // Set status as Scheduled for scheduled content
              updateData.scheduledPublishDate = new Date(updateData.scheduledPublishDate);
          }

          const content = await this.contentService.updateContent(id, updateData);
          if (!content) {
              return next(new AppError(404, 'Content not found'));
          }

          const response: APIResponse<typeof content> = { status: true, data: content, message: 'Content updated successfully'};
          res.status(200).json(response);
      } catch (error: any) {
          const response: APIResponse<null> = { status: false, error: error.message };
          res.status(500).json(response);
      }
  }

    async deleteContent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const isDeleted = await this.contentService.deleteContent(id);
            if (!isDeleted) {
                return next(new AppError(404, 'Content not found'));
            }

            const response: APIResponse<null> = { status: true, message: 'Content deleted successfully' };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getFilteredContent(req: Request, res: Response): Promise<void> {
        try {
            const {
                roleNo,
                username,
                page = 1,
                headline,
                author,
                status,
                } = req.query;

            const filter: any = {};

            // Only show own news for roles 1,3,4,5
            if ([0,2].includes(Number(roleNo)) && username) {
                filter.author = username;
            }
            if (headline) {
                filter.headline1 = { $regex: headline, $options: "i" };
            }
            if (author) {
                filter.author = { $regex: author, $options: "i" };
            }
            if (status) {
                filter.status = status;
            }
    
            const pageSize = 10;
            const skip = (Number(page) - 1) * pageSize;

            const content = await this.contentService.getFilteredContent(filter, skip, pageSize);
            const response: APIResponse<typeof content> = { status: true, data: content };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async changeContentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const { status } = req.body;
            if (!status) {
                return next(new AppError(400, 'Status is required'));
            }
            if (!['Draft', 'Published', 'Canceled'].includes(status)) {
                res.status(400).json({
                    status: 'error',
                    message: 'Invalid status value',
                });
                return;
            }

            const content = await this.contentService.updateContent(id, { status });
            if (!content) {
                return next(new AppError(404, 'Content not found'));
            }

            const response: APIResponse<typeof content> = { status: true, data: content };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getContentsByUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { url } = req.params;
            if (!url) {
                return next(new AppError(400, 'URL is required'));
            }

            const content = await this.contentService.findContentsByUrl(url);
            if (!content) {
                return next(new AppError(404, 'Content not found'));
            }

            // Remove R2 base URL from headlineImage if it exists
            if (Array.isArray(content)) {
                content.forEach((item: any) => {
                    if (item.headlineImage) {
                        item.headlineImage = extractRelativePath(item.headlineImage);
                    }
                });
            } else if ((content as any).headlineImage) {
                (content as any).headlineImage = extractRelativePath((content as any).headlineImage);
            }

            const response: APIResponse<typeof content> = { status: true, data: content };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getContentsByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { category } = req.params;
            if (!category) {
                return next(new AppError(400, 'Category is required'));
            }

            const decodedCategory = decodeURIComponent(category);
            const content = await this.contentService.findContentsByCategory(decodedCategory);
            if (!content || content.length === 0) {
                return next(new AppError(404, 'Content not found'));
            }

            // Remove R2 base URL from headlineImage fields
            const cleanedContent = content.map((item: any) => {
                if (item.headlineImage) {
                    item.headlineImage = extractRelativePath(item.headlineImage);
                }
                return item;
            });

            const response: APIResponse<typeof cleanedContent> = { status: true, data: cleanedContent };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getSingleContentByUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { url } = req.params;
            if (!url) {
                return next(new AppError(400, 'URL is required'));
            }

            const content = await this.contentService.findContentByUrl(url);
            if (!content) {
                return next(new AppError(404, 'Content not found'));
            }

            const response: APIResponse<typeof content> = { status: true, data: content };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getContentByKeyword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { keyword } = req.body;
            console.log('Keyword:', keyword);
            if (!keyword) {
                return next(new AppError(400, 'Keyword is required'));
            }

            const content = await this.contentService.findContentByKeyword(keyword);
            if (!content || content.length === 0) {
                return next(new AppError(404, 'Content not found'));
            }

            // Remove R2 base URL from headlineImage fields
            const cleanedContent = content.map((item: any) => {
                if (item.headlineImage) {
                    item.headlineImage = extractRelativePath(item.headlineImage);
                }
                return item;
            });

            const response: APIResponse<typeof cleanedContent> = { status: true, data: cleanedContent };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async uploadRichTextImage(req: Request, res: Response): Promise<void> {
        try {

            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                res.status(400).json({
                    status: 'error',
                    message: 'No file uploaded',
                });

                return
            }

        const uploadPromises = req.files.map(async (file: Express.Multer.File) => {
            const imageBuffer = file.buffer;
            const fileName = `rich-text-${Date.now()}-${file.originalname}`;

            const processedImage = await ImageService.processRichTextImage(imageBuffer);
            const uploadResponse = await ImageService.uploadImageOriginal(processedImage, fileName);
            return uploadResponse.publicUrl; // Return the URL
        });

        const urls = await Promise.all(uploadPromises);
        
        // Convert public URLs to relative paths
        const relativePaths = urls.map(url => extractRelativePath(url));

            // Return the relative paths
            res.status(200).json({
                status: 'success',
                urls: relativePaths,
            });
        } catch (error: any) {
            console.error("Cloudflare upload failed:", error.message);
            res.status(500).json({
                status: 'error',
                message: 'Failed to upload image to Cloudflare',
            });
        }
    }
}