import { IRole, Role } from "../models/role.model";
import { IUserRoleRepository } from "../types/repo/IUserRoleRepository";
import { injectable } from "tsyringe";

@injectable()
export class UserRoleRepository implements IUserRoleRepository {

    async createUserRole(userRoleData: Partial<IRole>): Promise<IRole> {
    try {
        return await Role.create(userRoleData);
    } catch (error: any) {
        if (error instanceof Error && (error as any).code === 11000) {
            throw new Error("Role name already exists. Please use a different name.");
        }
        throw error;
    }
}

    async getAllUserRoles(): Promise<IRole[]> {
        return await Role.find();
    }

    async findUserRoleById(userId: string): Promise<IRole | null> {
        return await Role.findById(userId);
    }

    async updateUserRole(userId: string, updateData: Partial<IRole>): Promise<IRole | null> {
        return await Role.findByIdAndUpdate(userId, updateData, { new: true });
    }   

    async deleteUserRole(userId: string): Promise<boolean> {
        const result = await Role.findByIdAndDelete(userId);
        return result !== null;
    }
}