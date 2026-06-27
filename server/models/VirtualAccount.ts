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

VirtualAccountSchema.index({ userId: 1, isActive: 1 });
VirtualAccountSchema.index({ bankAccountNumber: 1 });
VirtualAccountSchema.index({ nombaAccountId: 1 }, { sparse: true });

export const VirtualAccount = mongoose.models.VirtualAccount ||
  mongoose.model('VirtualAccount', VirtualAccountSchema);
