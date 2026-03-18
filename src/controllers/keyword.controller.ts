import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { KeywordService } from "../services/keyword.service";
import { APIResponse } from "../types";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";


@injectable()
export class KeywordController  {
    constructor(@inject(KeywordService) private keywordService: KeywordService) {}

    async createKeyword(req: Request, res: Response): Promise<void> {
        try {
            console.log("Creating keyword with data:", req.body);
            const newKeyword = await this.keywordService.createKeyword(req.body);
            const response : APIResponse<typeof newKeyword> = {status: true, message: "Keyword created successfully"};
            res.status(201).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response); 
        }
    }

    async getAllKeywords(req: Request, res: Response): Promise<void> {
        try {
            const keyword = await this.keywordService.getAllKeywords();
            const response: APIResponse<typeof keyword> = { status: true, data: keyword };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getKeywordById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const keyword = await this.keywordService.findKeywordById(id);
            if (!keyword) {
                return next(new AppError(404, 'Keyword not found'));
            }

            const response: APIResponse<typeof keyword> = { status: true, data: keyword };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async updateKeyword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const keyword = await this.keywordService.updateKeyword(id, req.body);
            if (!keyword) {
                return next(new AppError(404, 'Keyword not found'));
            }

            const response: APIResponse<typeof keyword> = { status: true, data: keyword };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async deleteKeyword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const isDeleted = await this.keywordService.deleteKeyword(id);
            if (!isDeleted) {
                return next(new AppError(404, 'Keyword not found'));
            }

            const response: APIResponse<null> = { status: true, message: 'Keyword deleted successfully' };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
}