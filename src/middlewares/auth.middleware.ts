import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { verifyToken } from '../utils/jwt';
import { AuthRepository } from '../repositories/auth.repository';
import { Role } from '../models/role.model';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const authRepository = new AuthRepository();

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    roleId: string;
    roleName: string;
  };
}

interface DecodedToken {
  id: string;
}

export const Authenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ status: false, message: 'Unauthorized Access Denied', statusCode: 401, code: '001-401' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Check if token is valid in the database
    const isValidSession = await authRepository.isTokenValid(token);
    if (!isValidSession) {
      res.status(401).json({ status: false, message: 'Session expired or invalid', statusCode: 401, code: '002-401' });
      return;
    }

    // Verify the token
    const decoded = verifyToken(token) as DecodedToken;
    if (!decoded || typeof decoded !== 'object') {
      res.status(401).json({ status: false, message: 'Invalid token', statusCode: 401, code: '003-401' });
      return;
    }

    // Fetch the user from the database
    const user = await User.findById(decoded.id).populate<{ roleId: { role_name: string } }>('roleId', ['role_name']);
    if (!user) {
      res.status(401).json({ status: false, message: 'User Not Found', statusCode: 401, code: '004-401' });
      return;
    }

    // Attach user details to the request object
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      roleId: user.roleId.toString(),
      roleName: user.roleId.role_name || '',
    };

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Log the actual error for debugging
    console.error('Authentication Error:', error);

    // Return a more specific error message
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ status: false, message: 'Invalid token format', statusCode: 401, code: '005-401' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ status: false, message: 'Token has expired', statusCode: 401, code: '006-401' });
      return;
    }
    
    // Return a generic error message for other cases
    res.status(401).json({ status: false, message: 'Authentication failed', statusCode: 401, code: '007-401' });
  }
};