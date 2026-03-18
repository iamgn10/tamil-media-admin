import Advertiesment from "../models/advertiesment.model";
import Content from "../models/content.model";
import Logo,{ ILogo } from "../models/logo.model";
import { IDashboardRepository } from "../types/repo/IDashboardRepository";
    
export class DashboardRepository implements IDashboardRepository {
    
    async saveLogo(logoData: Partial<ILogo>): Promise<ILogo> {
        return await Logo.create(logoData);
    }
    async getLogos(): Promise<ILogo[]> {
        return await Logo.find();
    }
    async deleteLogosByType(type: 'header' | 'footer'): Promise<void> {
        await Logo.deleteMany({ type });
    }

    async getTotalNews(): Promise<number> {
        return await Content.countDocuments();
    }

    async getTotalPublishedNews(): Promise<number> {
        return await Content.countDocuments({ status: 'Published' });
    }

    async getTodayNews(): Promise<number> {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return await Content.countDocuments({ 
            createdAt: { $gte: startOfDay },
            status: 'Published' 
        });
    }

    async getTotalDraftNews(): Promise<number> {
        return await Content.countDocuments({ status: 'Draft' });
    }
    async getTotalScheduledNews(): Promise<number> {
        return await Content.countDocuments({ status: 'Scheduled' });
    }   
    async getTotalAds(): Promise<number> {
        return await Advertiesment.countDocuments();
    }

    async getTotalNewsOfUser(userId: string): Promise<number> {
        return await Content.countDocuments({ authorId: userId });
    }

    async getTotalPublishedNewsOfUser(userId: string): Promise<number> {
        return await Content.countDocuments({ status: 'Published', authorId: userId });
    }

    async getTodayNewsOfUser(userId: string): Promise<number> {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return await Content.countDocuments({
            createdAt: { $gte: startOfDay },
            status: 'Published',
            authorId: userId
        });
    }

    async getTotalDraftNewsOfUser(userId: string): Promise<number> {
        return await Content.countDocuments({ status: 'Draft', authorId: userId });
    }
    async getTotalScheduledNewsOfUser(userId: string): Promise<number> {
        return await Content.countDocuments({ status: 'Scheduled', authorId: userId });
    }
}