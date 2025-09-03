import { Router } from 'express';
import { login, refreshToken, logout } from '../controllers/workers.controller';

const router = Router();

// Legacy auth routes for backward compatibility
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;