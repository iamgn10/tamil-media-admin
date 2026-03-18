import { IRole } from "../../models/role.model";

export interface IUserRoleRepository {
    createUserRole(userRoleData: Partial<IRole>): Promise<IRole>;
    getAllUserRoles(): Promise<IRole[]>;
    findUserRoleById(userId: string): Promise<IRole | null>;
    updateUserRole(userId: string, updateData: Partial<IRole>): Promise<IRole | null>;
    deleteUserRole(userId: string): Promise<boolean>;
}