import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  year: string;
  type: string;
  engine: string;
  size: string;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const vehicleSchema = new Schema<IVehicle>(
  {
    name: {
      type: String,
      required: [true, 'Nome do veículo é obrigatório'],
      trim: true,
      minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
      maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
    },
    year: {
      type: String,
      required: [true, 'Ano é obrigatório'],
      trim: true,
      match: [/^\d{4}$/, 'Ano deve ter 4 dígitos'],
    },
    type: {
      type: String,
      required: [true, 'Tipo de veículo é obrigatório'],
      trim: true,
      maxlength: [50, 'Tipo deve ter no máximo 50 caracteres'],
    },
    engine: {
      type: String,
      required: [true, 'Motor é obrigatório'],
      trim: true,
      maxlength: [10, 'Motor deve ter no máximo 10 caracteres'],
    },
    size: {
      type: String,
      required: [true, 'Capacidade é obrigatória'],
      trim: true,
      maxlength: [5, 'Capacidade deve ter no máximo 5 caracteres'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
vehicleSchema.index({ name: 1 });
vehicleSchema.index({ type: 1 });
vehicleSchema.index({ isAvailable: 1 });

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
