import Advertiesment, {IAdvertiesment} from "../models/advertiesment.model";
import { IAdvertiesmentRepository } from "../types/repo/IAdvertiesmentRepository";
    
export class AdvertiesmentRepository implements IAdvertiesmentRepository {
    
    async createAdvertiesment(advertiesmentData: Partial<IAdvertiesment>): Promise<IAdvertiesment> {
        return await Advertiesment.create(advertiesmentData);
    }

    async getAllAdvertiesments(): Promise<IAdvertiesment[]> {
        return await Advertiesment.find();
    }

    async findAdvertiesmentById(advertiesmentId: string): Promise<IAdvertiesment | null> {
        return await Advertiesment.findById(advertiesmentId);
    }

    async findOneByPositionAndStatus(position: string, status: string): Promise<IAdvertiesment | null> {
        return await Advertiesment.findOne({ position, status });
    }

    async updateAdvertiesment(advertiesmentId: string, updateData: Partial<IAdvertiesment>): Promise<IAdvertiesment | null> {
        
        return await Advertiesment.findByIdAndUpdate(advertiesmentId, updateData, { new: true });
            
    }   

    async deleteAdvertiesment(advertiesmentId: string): Promise<boolean> {
        // const advertiesment = await this.findUserById(advertiesmentId);
        // if (!advertiesment) return false;
        // await advertiesment.deleteOne();
        // return true;

        const result = await Advertiesment.findByIdAndDelete(advertiesmentId);
        return result !== null;
    }
}