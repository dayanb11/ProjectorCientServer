import { Router } from 'express';
import { login, refreshToken, getCurrentUser, logout, getWorkers } from '../controllers/workers.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.get('/', authenticateToken, authorizeRoles(0, 1, 9), getWorkers); // Only admin, manager, technical

export default router;