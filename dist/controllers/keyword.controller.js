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
exports.KeywordController = void 0;
const tsyringe_1 = require("tsyringe");
const keyword_service_1 = require("../services/keyword.service");
const AppError_1 = require("../utils/AppError");
const mongoose_1 = __importDefault(require("mongoose"));
let KeywordController = class KeywordController {
    constructor(keywordService) {
        this.keywordService = keywordService;
    }
    async createKeyword(req, res) {
        try {
            console.log("Creating keyword with data:", req.body);
            const newKeyword = await this.keywordService.createKeyword(req.body);
            const response = { status: true, message: "Keyword created successfully" };
            res.status(201).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getAllKeywords(req, res) {
        try {
            const keyword = await this.keywordService.getAllKeywords();
            const response = { status: true, data: keyword };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async getKeywordById(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const keyword = await this.keywordService.findKeywordById(id);
            if (!keyword) {
                return next(new AppError_1.AppError(404, 'Keyword not found'));
            }
            const response = { status: true, data: keyword };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async updateKeyword(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const keyword = await this.keywordService.updateKeyword(id, req.body);
            if (!keyword) {
                return next(new AppError_1.AppError(404, 'Keyword not found'));
            }
            const response = { status: true, data: keyword };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
    async deleteKeyword(req, res, next) {
        try {
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                return next(new AppError_1.AppError(400, 'Invalid ID format'));
            }
            const isDeleted = await this.keywordService.deleteKeyword(id);
            if (!isDeleted) {
                return next(new AppError_1.AppError(404, 'Keyword not found'));
            }
            const response = { status: true, message: 'Keyword deleted successfully' };
            res.status(200).json(response);
        }
        catch (error) {
            const response = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
};
exports.KeywordController = KeywordController;
exports.KeywordController = KeywordController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(keyword_service_1.KeywordService)),
    __metadata("design:paramtypes", [keyword_service_1.KeywordService])
], KeywordController);
