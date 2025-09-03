import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../infrastructure/startup/database';
import { logger } from '../../infrastructure/logging/logger';
import { AuthenticatedRequest } from '../middleware/auth';

// Login endpoint - מתחבר עם מספר עובד וסיסמה
export async function login(req: Request, res: Response) {
  try {
    const { employeeId, password } = req.body;

    // Validate input
    if (!employeeId || !password) {
      return res.status(400).json({
        success: false,
        error: 'Employee ID and password are required'
      });
    }

    // Find worker by employee ID
    const worker = await prisma.worker.findUnique({
      where: { employeeId },
      include: {
        division: true,
        department: true
      }
    });

    if (!worker) {
      logger.warn(`Login attempt with invalid employee ID: ${employeeId}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid employee credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, worker.password);
    if (!isPasswordValid) {
      logger.warn(`Login attempt with invalid password for employee: ${employeeId}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid employee credentials'
      });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { 
        id: worker.id,
        employeeId: worker.employeeId,
        roleCode: worker.roleCode
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: worker.id },
      process.env.REFRESH_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );

    // Update last login
    await prisma.worker.update({
      where: { id: worker.id },
      data: { lastLogin: new Date() }
    });

    logger.info(`Successful login for employee: ${employeeId}`);

    res.json({
      success: true,
      user: {
        id: worker.id,
        employeeId: worker.employeeId,
        fullName: worker.fullName,
        roleCode: worker.roleCode,
        roleDescription: worker.roleDescription,
        divisionId: worker.divisionId,
        departmentId: worker.departmentId,
        procurementTeam: worker.procurementTeam,
        email: worker.email
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Refresh token endpoint
export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as any;
    
    // Find worker
    const worker = await prisma.worker.findUnique({
      where: { id: decoded.id }
    });

    if (!worker) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newAccessToken = jwt.sign(
      { 
        id: worker.id,
        employeeId: worker.employeeId,
        roleCode: worker.roleCode
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );

    const newRefreshToken = jwt.sign(
      { id: worker.id },
      process.env.REFRESH_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
}

// Get current user info
export async function getCurrentUser(req: Request, res: Response) {
  try {
    const user = (req as AuthenticatedRequest).user;
    
    const worker = await prisma.worker.findUnique({
      where: { id: user!.id },
      include: {
        division: true,
        department: true
      }
    });

    if (!worker) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: worker.id,
        employeeId: worker.employeeId,
        fullName: worker.fullName,
        roleCode: worker.roleCode,
        roleDescription: worker.roleDescription,
        divisionId: worker.divisionId,
        departmentId: worker.departmentId,
        procurementTeam: worker.procurementTeam,
        email: worker.email
      }
    });

  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Logout endpoint
export async function logout(req: Request, res: Response) {
  try {
    // In a real implementation, you might want to blacklist the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Get all workers (for system management)
export async function getWorkers(req: Request, res: Response) {
  try {
    const workers = await prisma.worker.findMany({
      include: {
        division: true,
        department: true
      },
      orderBy: { employeeId: 'asc' }
    });

    const workersWithDivisionNames = workers.map(worker => ({
      ...worker,
      divisionName: worker.division?.name,
      departmentName: worker.department?.name
    }));

    res.json({
      success: true,
      data: workersWithDivisionNames
    });

  } catch (error) {
    logger.error('Get workers error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}