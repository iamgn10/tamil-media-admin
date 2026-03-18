import mongoose from "mongoose";
import { IUser } from "../../models/user.model";

        
export interface IUserRepository {
    createUser(user: Partial<IUser>): Promise<IUser>;
    getAllUsers(): Promise<IUser[]>;
    findUserById(userId: mongoose.Types.ObjectId): Promise<IUser | null>;
    updateUser(userId: mongoose.Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null>;
    deleteUser(userId: mongoose.Types.ObjectId): Promise<boolean>;
}