import { injectable, inject } from "tsyringe";
import { AdvertiesmentRepository } from "../repositories/advertiesment.repository";
import { IAdvertiesment } from "../models/advertiesment.model";

@injectable()
export class AdvertiesmentService {

    constructor(@inject(AdvertiesmentRepository) private advertiesmentRepository: AdvertiesmentRepository) {}

    async createAdvertiesment(advertiesmentData: Partial<IAdvertiesment>): Promise<IAdvertiesment> {
        return await this.advertiesmentRepository.createAdvertiesment(advertiesmentData);
    }

    async getAllAdvertiesments(): Promise<IAdvertiesment[]> {
        return await this.advertiesmentRepository.getAllAdvertiesments();
    }
    
    async findAdvertiesmentById(advertiesmentId: string): Promise<IAdvertiesment | null> {
        return await this.advertiesmentRepository.findAdvertiesmentById(advertiesmentId);
    }

    async findOneByPositionAndStatus(position: string, status: string): Promise<IAdvertiesment | null> {
        return await this.advertiesmentRepository.findOneByPositionAndStatus(position, status );
    }
    
    async updateAdvertiesment(advertiesmentId: string, updateData: Partial<IAdvertiesment>): Promise<IAdvertiesment | null> {
        return await this.advertiesmentRepository.updateAdvertiesment(advertiesmentId, updateData);
    }
    
    async deleteAdvertiesment(advertiesmentId: string): Promise<boolean> {
        return await this.advertiesmentRepository.deleteAdvertiesment(advertiesmentId);
    }
}