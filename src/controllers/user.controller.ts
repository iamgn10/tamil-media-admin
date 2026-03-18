import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { APIResponse } from "../types";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";
import Logger from "../utils/logger";
import { AuthService } from "../services/auth.service";


@injectable()
export class UserController  {
    constructor(
        @inject(UserService) private userService: UserService,
        @inject(AuthService) private authService: AuthService
    ) {}

    async createUser(req: Request, res: Response): Promise<void> {
        Logger.info(`Received registration request from IP: ${req.ip}, Payload: ${JSON.stringify(req.body)}`);
  
    try {
      const {
        fullname,
        username,
        email,
        password,
        mobile,
        bio,
        roleId,
        profilePicture,
        category
      } = req.body;
  
      const user = await this.authService.register({
        fullname,
        username,
        email,
        password,
        mobile,
        bio,
        roleId,
        profilePicture,
        category
      });
  
      Logger.info(`Registration successful for user: ${user.email}`);
      res.status(201).json({
        status: true,
        data: {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          username: user.username,
          mobile: user.mobile,
          bio: user.bio,
          profilePicture: user.profilePicture,
          roleId: user.roleId,
          roleName: user.roleName,
        }
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      Logger.error(`Registration failed for IP: ${req.ip}, Error: ${errorMessage}`);
      res.status(400).json({ status: false, message: errorMessage });
    }
    }

    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.userService.getAllUsers();
            const response: APIResponse<typeof user> = { status: true, data: user };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const  validId = new mongoose.Types.ObjectId(id)
            // Validate the ID
            if (!mongoose.Types.ObjectId.isValid(validId)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const user = await this.userService.findUserById(validId);
            if (!user) {
                return next(new AppError(404, 'User not found'));
            }

            const response: APIResponse<typeof user> = { status: true, data: user };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(404).json(response);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const  validId = new mongoose.Types.ObjectId(id)
            // Validate the ID
            if (!mongoose.Types.ObjectId.isValid(validId)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const user = await this.userService.updateUser(validId, req.body);
            if (!user) {
                return next(new AppError(404, 'User not found'));
            }

            const response: APIResponse<typeof user> = { status: true, data: user };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const  validId = new mongoose.Types.ObjectId(id)
            // Validate the ID
            if (!mongoose.Types.ObjectId.isValid(validId)) {
                return next(new AppError(400, 'Invalid ID format'));
            }

            const isDeleted = await this.userService.deleteUser(validId);
            if (!isDeleted) {
                return next(new AppError(404, 'User not found'));
            }

            const response: APIResponse<null> = { status: true, message: 'User deleted successfully' };
            res.status(200).json(response);
        } catch (error: any) {
            const response: APIResponse<null> = { status: false, error: error.message };
            res.status(500).json(response);
        }
    }
}