import { IMedia } from "../../models/media.model";
        
export interface IMediaRepository {
    createMedia(media: Partial<IMedia>): Promise<IMedia>;
    getAllMedias(): Promise<IMedia[]>;
    findMediaById(mediaId: string): Promise<IMedia | null>;
    deleteMedia(mediaId: string): Promise<boolean>;
    createBulkMedia(mediaDataArray: Partial<IMedia>[]): Promise<IMedia[]>;
}