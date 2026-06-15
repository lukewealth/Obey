import mongoose, { Schema, Document } from 'mongoose';

export interface IVirtualCard extends Document {
  userId: string;
  holderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  balance: number;
  currency: string;
  status: 'Active' | 'Locked' | 'Terminated';
  cardType: 'Visa' | 'Mastercard';
  interswitchRef: string;
  lastCVVRotation: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VirtualCardSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  holderName: { type: String, required: true },
  cardNumber: { type: String, required: true },
  expiryDate: { type: String, required: true },
  cvv: { type: String, required: true },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'NGN' },
  status: { type: String, enum: ['Active', 'Locked', 'Terminated'], default: 'Active' },
  cardType: { type: String, enum: ['Visa', 'Mastercard'], default: 'Mastercard' },
  interswitchRef: { type: String, required: true, unique: true },
  lastCVVRotation: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model<IVirtualCard>('VirtualCard', VirtualCardSchema);
