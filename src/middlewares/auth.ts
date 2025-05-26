import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const payload = await AuthService.verifyToken(token);
    (req as any).userId = payload.userId;
    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};