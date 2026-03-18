import { IContent } from "../../models/content.model";

export interface IContentRepository {
    createContent(content: Partial<IContent>): Promise<IContent>;
    getAllContents(page?: number, limit?: number): Promise<{ contents: IContent[], total: number, totalPages: number, currentPage: number }>;
    getAllContentsWithoutPagination(): Promise<IContent[]>;
    getAllContentOfUser(userId: string, page?: number, limit?: number): Promise<{ contents: IContent[], total: number, totalPages: number, currentPage: number }>;
    findContentById(contentId: string): Promise<IContent | null>;
    updateContent(contentId: string, updateData: Partial<IContent>): Promise<IContent | null>;
    deleteContent(contentId: string): Promise<boolean>;
}