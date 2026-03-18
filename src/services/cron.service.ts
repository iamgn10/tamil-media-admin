import cron from 'node-cron';
import { container } from 'tsyringe';
import { SchedulerService } from './scheduler.service';

export class CronService {
    private schedulerService: SchedulerService;

    constructor() {
        this.schedulerService = container.resolve(SchedulerService);
    }

    startScheduler(): void {
        cron.schedule('* * * * *', async () => {
            console.log('Checking for scheduled content to publish...');
            await this.schedulerService.publishScheduledContent();
        });
        
        console.log('Content scheduler started - checking every minute');
    }
}