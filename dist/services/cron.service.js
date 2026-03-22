"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const tsyringe_1 = require("tsyringe");
const scheduler_service_1 = require("./scheduler.service");
class CronService {
    constructor() {
        this.schedulerService = tsyringe_1.container.resolve(scheduler_service_1.SchedulerService);
    }
    startScheduler() {
        node_cron_1.default.schedule('* * * * *', async () => {
            console.log('Checking for scheduled content to publish...');
            await this.schedulerService.publishScheduledContent();
        });
        console.log('Content scheduler started - checking every minute');
    }
}
exports.CronService = CronService;
