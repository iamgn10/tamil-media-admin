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
exports.DashboardService = void 0;
const tsyringe_1 = require("tsyringe");
const dashboard_repository_1 = require("../repositories/dashboard.repository");
let DashboardService = class DashboardService {
    constructor(dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }
    async uploadLogo(logoData) {
        if (!logoData.type) {
            throw new Error('Logo type is required');
        }
        await this.dashboardRepository.deleteLogosByType(logoData.type);
        return await this.dashboardRepository.saveLogo(logoData);
    }
    async getLogos() {
        return await this.dashboardRepository.getLogos();
    }
    async getDashboardData() {
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
    async getDashboardDataOfUser(userId) {
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(dashboard_repository_1.DashboardRepository)),
    __metadata("design:paramtypes", [dashboard_repository_1.DashboardRepository])
], DashboardService);
