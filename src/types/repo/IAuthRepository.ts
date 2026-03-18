import mongoose from 'mongoose';
import { IUser } from "../../models/user.model";
import { IUserLoginSession } from "../../models/userLoginSession.model";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  createUser(user: {
      fullname: string;
      username: string;
      email: string;
      password: string;
      mobile: string;
      bio: string;
      profilePicture?: string;
      category?: string[];
      roleName: string;
      roleId: mongoose.Types.ObjectId; // Reference to Role model
    }): Promise<IUser>;
  findUserById(userId: mongoose.Types.ObjectId): Promise<IUser | null>;
  updateUser(userId: mongoose.Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null>;
  updateUserPassword(userId: mongoose.Types.ObjectId, newPassword: string): Promise<boolean>;
  invalidateUserSession(token: string): Promise<boolean>;
  invalidateAllUserSessions(userId: mongoose.Types.ObjectId): Promise<boolean>;
  validatePassword(userId: mongoose.Types.ObjectId, currentPassword: string): Promise<boolean>;
  createUserSession(userId: mongoose.Types.ObjectId, token: string, expiresAt: Date): Promise<IUserLoginSession>;
  isTokenValid(token: string): Promise<boolean>;
}
