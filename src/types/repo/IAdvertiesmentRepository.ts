import { IAdvertiesment } from "../../models/advertiesment.model";
        
export interface IAdvertiesmentRepository {
    createAdvertiesment(advertiesment: Partial<IAdvertiesment>): Promise<IAdvertiesment>;
    getAllAdvertiesments(): Promise<IAdvertiesment[]>;
    findAdvertiesmentById(advertiesmentId: string): Promise<IAdvertiesment | null>;
    updateAdvertiesment(advertiesmentId: string, updateData: Partial<IAdvertiesment>): Promise<IAdvertiesment | null>;
    deleteAdvertiesment(advertiesmentId: string): Promise<boolean>;
}