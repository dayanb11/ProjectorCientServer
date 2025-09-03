import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../../infrastructure/logging/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    employeeId: string;
    roleCode: number;
  };
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token:', error);
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

export function authorizeRoles(...allowedRoles: number[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(user.roleCode)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
}