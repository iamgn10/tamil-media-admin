import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export const generateToken = (payload: object): string => {
  const sessionId = uuidv4(); // Generate unique session ID
  return jwt.sign({ ...payload, sessionId }, SECRET_KEY, {
    expiresIn: '24h',
  });
};

export const verifyToken = (token: string): object | null => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (typeof decoded === 'object' && decoded !== null) {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
};
