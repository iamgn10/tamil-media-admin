import { inject, injectable } from "tsyringe";
import { ContentRepository } from "../repositories/content.repository";
import { IContent } from "../models/content.model";

@injectable()
export class SchedulerService {
    constructor(@inject(ContentRepository) private contentRepository: ContentRepository) {}

    async publishScheduledContent(): Promise<void> {
        try {
            const now = new Date();
            const scheduledContent = await this.contentRepository.findScheduledContentReadyForPublishing(now);
            
            if (scheduledContent.length === 0) {
                console.log('No scheduled content ready for publishing');
                return;
            }

            for (const content of scheduledContent) {
                await this.contentRepository.updateContent(content._id.toString(), {
                    status: 'Published'
                });
                console.log(`Content published: ${content.headline1} (ID: ${content._id})`);
            }
        } catch (error) {
            console.error('Error publishing scheduled content:', error);
        }
    }
}