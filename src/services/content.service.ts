import { injectable, inject } from "tsyringe";
import { ContentRepository } from "../repositories/content.repository";
import { IContent } from "../models/content.model";

@injectable()
export class ContentService {

    constructor(@inject(ContentRepository) private contentRepository: ContentRepository) {}

    async createContent(contentData: Partial<IContent>): Promise<IContent> {
        return await this.contentRepository.createContent(contentData);
    }

    async getAllContents(page: number = 1, limit: number = 20): Promise<{ contents: IContent[], total: number, totalPages: number, currentPage: number }> {
        return await this.contentRepository.getAllContents(page, limit);
    }

    async getAllContentsWithoutPagination(): Promise<IContent[]> {
        return await this.contentRepository.getAllContentsWithoutPagination();
    }
    async getAllContentOfUser(userId: string, page: number = 1, limit: number = 5): Promise<{ contents: IContent[], total: number, totalPages: number, currentPage: number }> {
        return await this.contentRepository.getAllContentOfUser(userId, page, limit);
    }
    
    async findContentById(contentId: string): Promise<IContent | null> {
        return await this.contentRepository.findContentById(contentId);
    }

    async findContentsByCategory(category: string): Promise<IContent[] | null> {
        return await this.contentRepository.findContentsByCategory(category);
    }

    async updateContent(contentId: string, updateData: Partial<IContent>): Promise<IContent | null> {
        return await this.contentRepository.updateContent(contentId, updateData);
    }
    
    async deleteContent(contentId: string): Promise<boolean> {
        return await this.contentRepository.deleteContent(contentId);
    }

    async getFilteredContent(filter: any, skip: number, pageSize: number): Promise<IContent[]> {
        return await this.contentRepository.getFilteredContent(filter, skip, pageSize);
    }

    async findContentsByUrl(url: string): Promise<IContent[] | null> {
        return await this.contentRepository.findContentsByUrl(url);
    }

    async findContentByUrl(url: string): Promise<IContent | null> {
        return await this.contentRepository.findContentByUrl(url);
    }

    async findContentByKeyword(keyword: string): Promise<IContent[] | null> {
        return await this.contentRepository.findContentByKeyword(keyword);
    }
}