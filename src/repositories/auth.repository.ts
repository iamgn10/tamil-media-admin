
import { IAuthRepository } from "../types/repo/IAuthRepository";
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User, { IUser } from "../models/user.model";
import UserLoginSession, { IUserLoginSession } from "../models/userLoginSession.model";
import { injectable } from "tsyringe";

@injectable()
export class AuthRepository implements IAuthRepository {

  /**
   * Function: Create a new user
   * @param userData 
   * @returns 
   */
  async createUser(userData: {
    fullname: string;
    username: string;
    email: string;
    password: string;
    mobile?: string;
    bio?: string;
    profilePicture?: string;
    category?: string[];
    roleName: string;
    roleId: mongoose.Types.ObjectId; // Reference to Role model
  }): Promise<IUser> {
    return await User.create(userData);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email })
      .populate({ path: 'roleId', select: 'role_name' }) // Populate role details
      .exec();
  }

  async findUserById(userId: mongoose.Types.ObjectId): Promise<IUser | null> {
    return await User.findById(userId)
      .populate({ path: 'roleId', select: 'role_name' }) // Populate role details
      .select('-password') // Exclude password from the response
      .exec();
  }

  async getAllUsers(): Promise<IUser[]> {
    return await User.find()
      .populate({ path: 'roleId', select: 'role_name' }) // Populate role details
      .select('-password') // Exclude password
      .exec();
  }

  async updateUser(userId: mongoose.Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, { new: true })
      .populate({ path: 'roleId', select: 'role_name' }) // Populate role details
      .select('-password') // Exclude password
      .exec();
  }

  async updateUserPassword(userId: mongoose.Types.ObjectId, newPassword: string): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user) return false;

    user.password = newPassword;
    await user.save();
    return true;
  }

  async validatePassword(userId: mongoose.Types.ObjectId, currentPassword: string): Promise<boolean> {
    const user = await User.findById(userId).exec();
    if (!user) return false;

    return await bcrypt.compare(currentPassword, user.password);
  }

  async createUserSession(userId: mongoose.Types.ObjectId, token: string, expiresAt: Date): Promise<IUserLoginSession> {
    // Invalidate previous sessions
    // await UserLoginSession.updateMany(
    //   { userId, isValid: true },
    //   { isValid: false }
    // );

    return await UserLoginSession.create({ userId, token, expiresAt });
  }

  async invalidateUserSession(token: string): Promise<boolean> {
    const session = await UserLoginSession.findOne({ token, isValid: true }).exec();
    if (session) {
      session.isValid = false;
      await session.save();
      return true;
    }
    return false;
  }

  async invalidateAllUserSessions(userId: mongoose.Types.ObjectId): Promise<boolean> {
    await UserLoginSession.updateMany(
      { userId, isValid: true },
      { isValid: false }
    );
    return true;
  }

  async isTokenValid(token: string): Promise<boolean> {
    const session = await UserLoginSession.findOne({
      token,
      isValid: true,
      expiresAt: { $gt: new Date() }, // Check if expiresAt is greater than now
    }).exec();

    return !!session;
  }
}
