import { injectable, inject } from "tsyringe";
import { KeywordRepository } from "../repositories/keyword.repository";
import { IKeyword } from "../models/keyword.model";

@injectable()
export class KeywordService {

    constructor(@inject(KeywordRepository) private keywordRepository: KeywordRepository) {}

    async createKeyword(keywordData: Partial<IKeyword>): Promise<IKeyword> {
        return await this.keywordRepository.createKeyword(keywordData);
    }

    async getAllKeywords(): Promise<IKeyword[]> {
        return await this.keywordRepository.getAllKeywords();
    }
    
    async findKeywordById(keywordId: string): Promise<IKeyword | null> {
        return await this.keywordRepository.findKeywordById(keywordId);
    }
    
    async updateKeyword(keywordId: string, updateData: Partial<IKeyword>): Promise<IKeyword | null> {
        return await this.keywordRepository.updateKeyword(keywordId, updateData);
    }
    
    async deleteKeyword(keywordId: string): Promise<boolean> {
        return await this.keywordRepository.deleteKeyword(keywordId);
    }
}