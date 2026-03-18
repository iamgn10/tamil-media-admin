import { IKeyword } from "../../models/keyword.model";

        
export interface IKeywordRepository {
    createKeyword(keyword: Partial<IKeyword>): Promise<IKeyword>;
    getAllKeywords(): Promise<IKeyword[]>;
    findKeywordById(keywordId: string): Promise<IKeyword | null>;
    updateKeyword(keywordId: string, updateData: Partial<IKeyword>): Promise<IKeyword | null>;
    deleteKeyword(keywordId: string): Promise<boolean>;
}