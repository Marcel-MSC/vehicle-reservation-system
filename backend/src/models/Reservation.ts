import mongoose, { Document, Schema } from 'mongoose';

export interface IReservation extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  vehicle: mongoose.Types.ObjectId;
  status: 'active' | 'cancelled' | 'completed';
  reservedAt: Date;
  releasedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reservationSchema = new Schema<IReservation>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Usuário é obrigatório'],
    },
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Veículo é obrigatório'],
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
    reservedAt: {
      type: Date,
      default: Date.now,
    },
    releasedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
reservationSchema.index({ user: 1, status: 1 });
reservationSchema.index({ vehicle: 1, status: 1 });
reservationSchema.index({ status: 1, reservedAt: -1 });

// Prevent duplicate active reservations for same vehicle
reservationSchema.index({ vehicle: 1, status: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });

export const Reservation = mongoose.model<IReservation>('Reservation', reservationSchema);
