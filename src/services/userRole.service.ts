import { injectable, inject } from "tsyringe";
import { UserRoleRepository } from "../repositories/userRole.repository";
import { IRole } from "../models/role.model";

@injectable()
export class UserRoleService {

    constructor(@inject(UserRoleRepository) private userRoleRepository: UserRoleRepository) {}

    async createUserRole(userRoleData: Partial<IRole>): Promise<IRole> {
        return await this.userRoleRepository.createUserRole(userRoleData);
    }

    async getAllUserRoles(): Promise<IRole[]> {
        return await this.userRoleRepository.getAllUserRoles();
    }
    
    async findUserRoleById(userId: string): Promise<IRole | null> {
        return await this.userRoleRepository.findUserRoleById(userId);
    }
    
    async updateUserRole(userId: string, updateData: Partial<IRole>): Promise<IRole | null> {
        return await this.userRoleRepository.updateUserRole(userId, updateData);
    }
    
    async deleteUserRole(userId: string): Promise<boolean> {
        return await this.userRoleRepository.deleteUserRole(userId);
    }
}