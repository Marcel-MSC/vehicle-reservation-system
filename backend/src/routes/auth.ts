import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/authController';

const router = Router();

// Public routes
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email deve ser válido'),
    body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email deve ser válido'),
    body('password').notEmpty().withMessage('Senha é obrigatória')
  ],
  login
);

// Protected routes
router.use(authenticate);

router.get('/profile', getProfile);

router.put(
  '/profile',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email deve ser válido')
  ],
  updateProfile
);

router.delete('/profile', deleteProfile);

export default router;
