import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";
import { add } from 'date-fns';
import { injectable, inject } from "tsyringe";
import mongoose from "mongoose";
import { AuthRepository } from "../repositories/auth.repository";
import { IUser } from "../models/user.model";
import { UserRoleService } from "./userRole.service";


@injectable()
export class AuthService {
  
  constructor(
    @inject(AuthRepository) private authRepository: AuthRepository,
    @inject(UserRoleService) private userRoleService: UserRoleService
   ) {}

  private mapUserToDTO(user: IUser) {
    return {
      id: user._id.toString(),
      fullname: user.fullname,
      profilePicture: user.profilePicture || '',
      bio: user.bio || '',
      email: user.email,
      username: user.username,
      mobile: user.mobile || '',
      roleId: user.roleId ? (user.roleId as any)._id.toString() : '',  // ✅ Extract ObjectId as string
      roleName: user.roleId ? (user.roleId as any).role_name : '' // ✅ Extract role name from populated data
    };
  }


  /**
   * Function: Register a new user
   * @param fullname 
   * @param username 
   * @param email 
   * @param password 
   * @param mobile 
   * @param category
   * @returns 
   */
  async register(data: {
    fullname: string;
    username: string;
    email: string;
    password: string;
    roleId: mongoose.Types.ObjectId;
    mobile?: string;
    bio?: string;
    profilePicture?: string;
    category?: string[];
  }): Promise<ReturnType<AuthService['mapUserToDTO']>> {
    // Check if user already exists
    const existingUser = await this.authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.authRepository.createUser({
      fullname: data.fullname,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      mobile: data.mobile,
      bio: data.bio,
      profilePicture: data.profilePicture,
      roleId: data.roleId,
      roleName: data.roleId ? (await this.userRoleService.findUserRoleById(data.roleId.toString()))?.role_name || '' : '',
      category: data.category ?? []
    });

    return this.mapUserToDTO(user);
  }

  async login(email: string, password: string): Promise<{ token: string; user: ReturnType<AuthService['mapUserToDTO']> }> {
    const user = await this.authRepository.findUserByEmail(email) as IUser | null;
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const token = generateToken({ id: user._id.toString(), email: user.email });
    
    // Create session with 1-hour expiry
    const expiresAt = add(new Date(), { hours: 24 });
    await this.authRepository.createUserSession(user._id, token, expiresAt);

    return {
      token,
      user: this.mapUserToDTO(user)
    };
  }

  async logout(token: string): Promise<void> {
    const isInvalidated = await this.authRepository.invalidateUserSession(token);
    if (!isInvalidated) {
      throw new Error('Token is already invalid or does not exist');
    }
  }

  async getAuthUserDetails(userId: string): Promise<ReturnType<AuthService['mapUserToDTO']>> {
    const user = await this.authRepository.findUserById(new mongoose.Types.ObjectId(userId)) as IUser | null;
    if (!user) {
      throw new Error("User not found");
    }

    return this.mapUserToDTO(user);
  }

  async updateUserDetails(userId: string, updateData: {
    firstName?: string;
    lastName?: string;
    username?: string;
    mobile?: string;
    email?: string;
  }): Promise<ReturnType<AuthService['mapUserToDTO']>> {
    const updatedUser = await this.authRepository.updateUser(new mongoose.Types.ObjectId(userId), updateData) as IUser | null;
    if (!updatedUser) {
      throw new Error("User not found");
    }

    return this.mapUserToDTO(updatedUser);
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    // Validate current password
    const isValid = await this.authRepository.validatePassword(new mongoose.Types.ObjectId(userId), currentPassword);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    const updated = await this.authRepository.updateUserPassword(new mongoose.Types.ObjectId(userId), hashedPassword);
    if (!updated) {
      throw new Error('Failed to update password');
    }

    // Invalidate all sessions
    await this.authRepository.invalidateAllUserSessions(new mongoose.Types.ObjectId(userId));
    
    return true;
  }

  async logoutAllSessions(userId: string): Promise<void> {
    await this.authRepository.invalidateAllUserSessions(new mongoose.Types.ObjectId(userId));
  }

  async getAllUsers(): Promise<IUser[]> {
          return await this.authRepository.getAllUsers();
      }
}
