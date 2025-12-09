import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { Reservation } from '../models/Reservation';
import { Vehicle } from '../models/Vehicle';
import { AuthRequest } from '../middleware/auth';

export const createReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { vehicleId } = req.body;
    const userId = req.user!.id;

    // Check if vehicle exists and is available
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      res.status(404).json({ error: 'Veículo não encontrado' });
      return;
    }

    if (!vehicle.isAvailable) {
      res.status(400).json({ error: 'Veículo não está disponível' });
      return;
    }

    // Check if user already has an active reservation
    const existingReservation = await Reservation.findOne({
      user: userId,
      status: 'active'
    });

    if (existingReservation) {
      res.status(400).json({ error: 'Usuário já possui uma reserva ativa' });
      return;
    }

    // Check if vehicle is already reserved
    const vehicleReservation = await Reservation.findOne({
      vehicle: vehicleId,
      status: 'active'
    });

    if (vehicleReservation) {
      res.status(400).json({ error: 'Veículo já está reservado' });
      return;
    }

    // Create the reservation
    const reservation = new Reservation({
      user: userId,
      vehicle: vehicleId,
      status: 'active',
      reservedAt: new Date()
    });

    await reservation.save();

    // Update vehicle availability
    vehicle.isAvailable = false;
    await vehicle.save();

    // Populate the reservation with vehicle and user details
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('vehicle')
      .populate('user', 'name email');

    res.status(201).json({
      message: 'Reserva realizada com sucesso',
      reservation: populatedReservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const releaseReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      res.status(404).json({ error: 'Reserva não encontrada' });
      return;
    }

    // Check if the reservation belongs to the user
    if (reservation.user.toString() !== userId) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    // Check if reservation is already released
    if (reservation.status !== 'active') {
      res.status(400).json({ error: 'Reserva já foi finalizada' });
      return;
    }

    // Update reservation status
    reservation.status = 'completed';
    reservation.releasedAt = new Date();
    await reservation.save();

    // Update vehicle availability
    await Vehicle.findByIdAndUpdate(reservation.vehicle, { isAvailable: true });

    // Populate the reservation
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('vehicle')
      .populate('user', 'name email');

    res.json({
      message: 'Reserva finalizada com sucesso',
      reservation: populatedReservation
    });
  } catch (error) {
    console.error('Release reservation error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const cancelReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      res.status(404).json({ error: 'Reserva não encontrada' });
      return;
    }

    // Check if the reservation belongs to the user
    if (reservation.user.toString() !== userId) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    // Check if reservation is already cancelled
    if (reservation.status === 'cancelled') {
      res.status(400).json({ error: 'Reserva já foi cancelada' });
      return;
    }

    // Update reservation status
    reservation.status = 'cancelled';
    reservation.releasedAt = new Date();
    await reservation.save();

    // Update vehicle availability
    await Vehicle.findByIdAndUpdate(reservation.vehicle, { isAvailable: true });

    // Populate the reservation
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('vehicle')
      .populate('user', 'name email');

    res.json({
      message: 'Reserva cancelada com sucesso',
      reservation: populatedReservation
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getUserReservations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { page = 1, limit = 10 } = req.query;

    const reservations = await Reservation.find({ user: userId })
      .populate('vehicle')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Reservation.countDocuments({ user: userId });

    res.json({
      reservations,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get user reservations error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getReservationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const reservation = await Reservation.findById(id)
      .populate('vehicle')
      .populate('user', 'name email');

    if (!reservation) {
      res.status(404).json({ error: 'Reserva não encontrada' });
      return;
    }

    // Check if the reservation belongs to the user
    if (reservation.user._id.toString() !== userId) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    res.json({ reservation });
  } catch (error) {
    console.error('Get reservation by ID error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getAllReservations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query: any = {};
    
    if (status) {
      query.status = status;
    }

    const reservations = await Reservation.find(query)
      .populate('vehicle')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Reservation.countDocuments(query);

    res.json({
      reservations,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get all reservations error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
