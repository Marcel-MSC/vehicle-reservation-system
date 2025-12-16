import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Vehicle } from '../models/Vehicle';
import { AuthRequest } from '../middleware/auth';

export const getAllVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search, type, year, engine, size } = req.query;

    const query: any = {};

    // Filtro de busca geral (name, type, year, engine, size)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { year: { $regex: search, $options: 'i' } },
        { engine: { $regex: search, $options: 'i' } },
        { size: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtros específicos
    if (type) {
      query.type = { $regex: type, $options: 'i' };
    }

    if (year) {
      query.year = year;
    }

    if (engine) {
      query.engine = engine;
    }

    if (size) {
      query.size = size;
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { createdAt: -1 }
    };

    const vehicles = await Vehicle.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Vehicle.countDocuments(query);

    res.json({
      vehicles,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get all vehicles error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getVehicleById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findById(id);
    
    if (!vehicle) {
      res.status(404).json({ error: 'Veículo não encontrado' });
      return;
    }

    res.json({ vehicle });
  } catch (error) {
    console.error('Get vehicle by ID error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const createVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, year, type, engine, size, imageUrl } = req.body;

    const vehicle = new Vehicle({
      name,
      year,
      type,
      engine,
      size,
      imageUrl
    });

    await vehicle.save();

    res.status(201).json({
      message: 'Veículo cadastrado com sucesso',
      vehicle
    });
  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const updateVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { name, year, type, engine, size, imageUrl, isAvailable } = req.body;

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { name, year, type, engine, size, imageUrl, isAvailable },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      res.status(404).json({ error: 'Veículo não encontrado' });
      return;
    }

    res.json({
      message: 'Veículo atualizado com sucesso',
      vehicle
    });
  } catch (error) {
    console.error('Update vehicle error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const deleteVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      res.status(404).json({ error: 'Veículo não encontrado' });
      return;
    }

    res.json({ message: 'Veículo removido com sucesso' });
  } catch (error) {
    console.error('Delete vehicle error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getAvailableVehicles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const vehicles = await Vehicle.find({ isAvailable: true })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Vehicle.countDocuments({ isAvailable: true });

    res.json({
      vehicles,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get available vehicles error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
