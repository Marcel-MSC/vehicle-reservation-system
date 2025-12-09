import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import {
  createReservation,
  releaseReservation,
  cancelReservation,
  getUserReservations,
  getReservationById,
  getAllReservations
} from '../controllers/reservationController';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/my-reservations', getUserReservations);

router.get('/all', getAllReservations);

router.get('/:id', getReservationById);

router.post(
  '/',
  [
    body('vehicleId').isMongoId().withMessage('ID do veículo deve ser válido')
  ],
  createReservation
);

router.patch('/:id/release', releaseReservation);

router.patch('/:id/cancel', cancelReservation);

export default router;
