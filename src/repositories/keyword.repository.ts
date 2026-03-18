
import { IKeywordRepository } from "../types/repo/IKeywordRepository";
import Keyword, { IKeyword } from '../models/keyword.model';
    
export class KeywordRepository implements IKeywordRepository {
    
    async createKeyword(keywordData: Partial<IKeyword>): Promise<IKeyword> {
        return await Keyword.create(keywordData);
    }

    async getAllKeywords(): Promise<IKeyword[]> {
        return await Keyword.find();
    }

    async findKeywordById(keywordId: string): Promise<IKeyword | null> {
        return await Keyword.findById(keywordId);
    }

    async updateKeyword(keywordId: string, updateData: Partial<IKeyword>): Promise<IKeyword | null> {  
        return await Keyword.findByIdAndUpdate(keywordId, updateData, { new: true });       
    }   

    async deleteKeyword(keywordId: string): Promise<boolean> {
        const result = await Keyword.findByIdAndDelete(keywordId);
        return result !== null;
    }
}