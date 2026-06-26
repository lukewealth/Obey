import mongoose from 'mongoose';

const VirtualAccountSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  accountRef: { type: String, required: true, unique: true },
  accountName: { type: String, required: true },
  bankAccountNumber: { type: String, required: true },
  bankName: { type: String, required: true },
  currency: { type: String, default: 'NGN' },
  expectedAmount: { type: Number },
  expiryDate: { type: Date },
  expired: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  nombaAccountId: { type: String },
}, { timestamps: true });

export const VirtualAccount = mongoose.models.VirtualAccount || 
  mongoose.model('VirtualAccount', VirtualAccountSchema);
