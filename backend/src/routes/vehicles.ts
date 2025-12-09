import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAvailableVehicles
} from '../controllers/vehicleController';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllVehicles);

router.get('/available', getAvailableVehicles);

router.get('/:id', getVehicleById);

router.post(
  '/',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('year').isLength({ min: 4, max: 4 }).matches(/^\d{4}$/).withMessage('Ano deve ter 4 dígitos'),
    body('type').trim().isLength({ min: 1, max: 50 }).withMessage('Tipo deve ter entre 1 e 50 caracteres'),
    body('engine').trim().isLength({ min: 1, max: 10 }).withMessage('Motor deve ter entre 1 e 10 caracteres'),
    body('size').trim().isLength({ min: 1, max: 5 }).withMessage('Capacidade deve ter entre 1 e 5 caracteres'),
    body('imageUrl').optional().isURL().withMessage('URL da imagem deve ser válida')
  ],
  createVehicle
);

router.put(
  '/:id',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('year').isLength({ min: 4, max: 4 }).matches(/^\d{4}$/).withMessage('Ano deve ter 4 dígitos'),
    body('type').trim().isLength({ min: 1, max: 50 }).withMessage('Tipo deve ter entre 1 e 50 caracteres'),
    body('engine').trim().isLength({ min: 1, max: 10 }).withMessage('Motor deve ter entre 1 e 10 caracteres'),
    body('size').trim().isLength({ min: 1, max: 5 }).withMessage('Capacidade deve ter entre 1 e 5 caracteres'),
    body('imageUrl').optional().isURL().withMessage('URL da imagem deve ser válida'),
    body('isAvailable').optional().isBoolean().withMessage('Disponibilidade deve ser um booleano')
  ],
  updateVehicle
);

router.delete('/:id', deleteVehicle);

export default router;
