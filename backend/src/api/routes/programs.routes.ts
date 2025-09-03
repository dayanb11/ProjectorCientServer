import { Router } from 'express';
import { getPrograms, getProgram, createProgram, updateProgram } from '../controllers/programs.controller';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all programs (filtered by role)
router.get('/', getPrograms);

// Get single program
router.get('/:id', getProgram);

// Create new program (only managers and requesters)
router.post('/', authorizeRoles(1, 4), createProgram);

// Update program (role-based permissions handled in controller)
router.put('/:id', updateProgram);

export default router;