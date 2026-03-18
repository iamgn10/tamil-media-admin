import { injectable, inject } from "tsyringe";
import { DashboardRepository } from "../repositories/dashboard.repository";
import { ILogo } from "../models/logo.model";


@injectable()
export class DashboardService {

    constructor(@inject(DashboardRepository) private dashboardRepository: DashboardRepository) {}

    async uploadLogo(logoData: Partial<ILogo>): Promise<ILogo> {
        if (!logoData.type) {
            throw new Error('Logo type is required');
        }
        await this.dashboardRepository.deleteLogosByType(logoData.type);
        return await this.dashboardRepository.saveLogo(logoData);
    }
    async getLogos(): Promise<ILogo[]> {
        return await this.dashboardRepository.getLogos();
    }

    async getDashboardData(): Promise<any> {
        const [totalNews, totalPublished, newsToday, totalDrafts, totalScheduled, totalAds] = await Promise.all([
            this.dashboardRepository.getTotalNews(),
            this.dashboardRepository.getTotalPublishedNews(),
            this.dashboardRepository.getTodayNews(),
            this.dashboardRepository.getTotalDraftNews(),
            this.dashboardRepository.getTotalScheduledNews(),
            this.dashboardRepository.getTotalAds()
        ]);

        return {
            totalNews: totalNews,
            totalPublished: totalPublished,
            newsToday: newsToday,
            totalDrafts: totalDrafts,
            totalScheduled: totalScheduled,
            totalAds: totalAds
        };
    }

    async getDashboardDataOfUser(userId: string): Promise<any> {
        const [totalNews, totalPublished, newsToday, totalDrafts, totalScheduled] = await Promise.all([
            this.dashboardRepository.getTotalNewsOfUser(userId),
            this.dashboardRepository.getTotalPublishedNewsOfUser(userId),
            this.dashboardRepository.getTodayNewsOfUser(userId),
            this.dashboardRepository.getTotalDraftNewsOfUser(userId),
            this.dashboardRepository.getTotalScheduledNewsOfUser(userId),
           
        ]);

        return {
            totalNews: totalNews,
            totalPublished: totalPublished,
            newsToday: newsToday,
            totalDrafts: totalDrafts,
            totalScheduled: totalScheduled,
        };
    }
    
    
}