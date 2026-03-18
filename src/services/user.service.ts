import { injectable, inject } from "tsyringe";
import { UserRepository } from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import mongoose from "mongoose";


@injectable()
export class UserService {

    constructor(@inject(UserRepository) private userRepository: UserRepository) {}

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        return await this.userRepository.createUser(userData);
    }

    async getAllUsers(): Promise<IUser[]> {
        return await this.userRepository.getAllUsers();
    }
    
    async findUserById(userId: mongoose.Types.ObjectId): Promise<IUser | null> {
        return await this.userRepository.findUserById(new mongoose.Types.ObjectId(userId));
    }
    
    async updateUser(userId: mongoose.Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
        return await this.userRepository.updateUser(userId, updateData);
    }
    
    async deleteUser(userId: mongoose.Types.ObjectId): Promise<boolean> {
        return await this.userRepository.deleteUser(userId);
    }
}