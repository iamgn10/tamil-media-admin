
import mongoose from "mongoose";
import User, { IUser } from "../models/user.model";
import { IUserRepository } from "../types/repo/IUserRepository";
import { injectable } from "tsyringe";
    
@injectable()
export class UserRepository implements IUserRepository {
    
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        return await (User as any).create(userData);
    }

    async getAllUsers(): Promise<IUser[]> {
        return await (User as any).find();
    }

    async findUserById(userId: mongoose.Types.ObjectId): Promise<IUser | null> {
        return await (User as any).findById(userId);
    }

    async updateUser(userId: mongoose.Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
        return await (User as any).findByIdAndUpdate(userId, updateData, { new: true });
            
    }   

    async deleteUser(userId: mongoose.Types.ObjectId): Promise<boolean> {
        // const user = await this.findUserById(userId);
        // if (!user) return false;
        // await user.deleteOne();
        // return true;

        const result = await (User as any).findByIdAndDelete(userId);
        return result !== null;
    }
}