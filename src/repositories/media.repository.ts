import Media, {IMedia} from "../models/media.model";
import { IMediaRepository } from "../types/repo/IMediaRepository";
    
export class MediaRepository implements IMediaRepository {
    
    async createMedia(mediaData: Partial<IMedia>): Promise<IMedia> {
        return await Media.create(mediaData);
    }

    async getAllMedias(): Promise<IMedia[]> {
        return await Media.find()
            .populate('createdBy', 'fullname')
            .sort({ createdAt: -1, updatedAt: -1 });
    }

    async findMediaById(mediaId: string): Promise<IMedia | null> {
        return await Media.findById(mediaId).populate('createdBy', 'fullname');
    }

  
    async deleteMedia(mediaId: string): Promise<boolean> {
        // const media = await this.findUserById(mediaId);
        // if (!media) return false;
        // await media.deleteOne();
        // return true;

        const result = await Media.findByIdAndDelete(mediaId);
        return result !== null;
    }

    async createBulkMedia(mediaDataArray: Partial<IMedia>[]): Promise<IMedia[]> {
        return await Media.insertMany(mediaDataArray) as IMedia[];
    }
}