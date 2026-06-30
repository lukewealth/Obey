import mongoose, { Schema, Document } from 'mongoose';
import { encrypt, decrypt } from '../utils/encryption';

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
  getDecryptedCardNumber(): string;
  getDecryptedCVV(): string;
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

// Encrypt sensitive fields before saving
VirtualCardSchema.pre('save', function(next) {
  if (this.isModified('cardNumber') && !this.cardNumber.startsWith('enc:')) {
    this.cardNumber = 'enc:' + encrypt(this.cardNumber);
  }
  if (this.isModified('cvv') && !this.cvv.startsWith('enc:')) {
    this.cvv = 'enc:' + encrypt(this.cvv);
  }
  next();
});

// Methods to decrypt sensitive fields
VirtualCardSchema.methods.getDecryptedCardNumber = function(): string {
  if (this.cardNumber.startsWith('enc:')) {
    return decrypt(this.cardNumber.slice(4));
  }
  return this.cardNumber;
};

VirtualCardSchema.methods.getDecryptedCVV = function(): string {
  if (this.cvv.startsWith('enc:')) {
    return decrypt(this.cvv.slice(4));
  }
  return this.cvv;
};

export default mongoose.model<IVirtualCard>('VirtualCard', VirtualCardSchema);
