import Content, {IContent} from "../models/content.model";
import { IContentRepository } from "../types/repo/IContentRepository";
    
export class ContentRepository implements IContentRepository {
    
    async createContent(contentData: Partial<IContent>): Promise<IContent> {
        return await Content.create(contentData);
    }

    async getAllContents(page: number = 1, limit: number = 20): Promise<{ contents: IContent[], total: number, totalPages: number, currentPage: number }> {
        const skip = (page - 1) * limit;
        
        const [contents, total] = await Promise.all([
            Content.find().sort({ createdAt: -1, updatedAt: -1 }).skip(skip).limit(limit),
            Content.countDocuments()
        ]);
        
        const totalPages = Math.ceil(total / limit);
        
        return {
            contents,
            total,
            totalPages,
            currentPage: page
        };
    }

    async getAllContentsWithoutPagination(): Promise<IContent[]> {
        return await Content.find().sort({ createdAt: -1, updatedAt: -1 });
    }

    async getAllContentOfUser(userId: string, page: number = 1, limit: number = 5): Promise<{ contents: IContent[], total: number, totalPages: number, currentPage: number }> {
        const skip = (page - 1) * limit;

        const [contents, total] = await Promise.all([
            Content.find({ authorId: userId }).sort({ createdAt: -1, updatedAt: -1 }).skip(skip).limit(limit),
            Content.countDocuments({ authorId: userId })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            contents,
            total,
            totalPages,
            currentPage: page
        };
    }

    async findContentById(contentId: string): Promise<IContent | null> {
        return await Content.findById(contentId);
    }

    async updateContent(contentId: string, updateData: Partial<IContent>): Promise<IContent | null> {
        
        return await Content.findByIdAndUpdate(contentId, updateData, { new: true });
            
    }   

    async deleteContent(contentId: string): Promise<boolean> {
        // const content = await this.findUserById(contentId);
        // if (!content) return false;
        // await content.deleteOne();
        // return true;

        const result = await Content.findByIdAndDelete(contentId);
        return result !== null;
    }

    async getFilteredContent( filter: any, skip: number, pageSize: number ): Promise<IContent[]> {
        return await Content.find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize);
    }

    async findContentsByUrl(url: string): Promise<IContent[] | null> {
        return await Content.find({ url }).sort({ createdAt: -1 });
    }

    async findContentByUrl(url: string): Promise<IContent | null> {
        return await Content.findOne({url});
    }

    async findContentsByCategory(category: string): Promise<IContent[] | null> {
        return await Content.find({ "category.name": category }).sort({ createdAt: -1 });
    }

    async findContentByKeyword(keyword: string): Promise<IContent[] | null> {
        return await Content.find({ keywords: keyword });
    }

    async findScheduledContentReadyForPublishing(currentDate: Date): Promise<IContent[]> {
        return await Content.find({
            status: 'Scheduled',
            scheduledPublishDate: { $lte: currentDate }
        });
    }
}