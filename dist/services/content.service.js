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
exports.ContentService = void 0;
const tsyringe_1 = require("tsyringe");
const content_repository_1 = require("../repositories/content.repository");
let ContentService = class ContentService {
    constructor(contentRepository) {
        this.contentRepository = contentRepository;
    }
    async createContent(contentData) {
        return await this.contentRepository.createContent(contentData);
    }
    async getAllContents(page = 1, limit = 20) {
        return await this.contentRepository.getAllContents(page, limit);
    }
    async getAllContentsWithoutPagination() {
        return await this.contentRepository.getAllContentsWithoutPagination();
    }
    async getAllContentOfUser(userId, page = 1, limit = 5) {
        return await this.contentRepository.getAllContentOfUser(userId, page, limit);
    }
    async findContentById(contentId) {
        return await this.contentRepository.findContentById(contentId);
    }
    async findContentsByCategory(category) {
        return await this.contentRepository.findContentsByCategory(category);
    }
    async updateContent(contentId, updateData) {
        return await this.contentRepository.updateContent(contentId, updateData);
    }
    async deleteContent(contentId) {
        return await this.contentRepository.deleteContent(contentId);
    }
    async getFilteredContent(filter, skip, pageSize) {
        return await this.contentRepository.getFilteredContent(filter, skip, pageSize);
    }
    async findContentsByUrl(url) {
        return await this.contentRepository.findContentsByUrl(url);
    }
    async findContentByUrl(url) {
        return await this.contentRepository.findContentByUrl(url);
    }
    async findContentByKeyword(keyword) {
        return await this.contentRepository.findContentByKeyword(keyword);
    }
};
ContentService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(content_repository_1.ContentRepository)),
    __metadata("design:paramtypes", [content_repository_1.ContentRepository])
], ContentService);
exports.ContentService = ContentService;
