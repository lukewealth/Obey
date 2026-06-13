import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  supabaseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  avatar: { type: String },
  kycStatus: { 
    type: String, 
    enum: ["Unverified", "Pending", "Verified"],
    default: "Unverified"
  },
  balance: { type: Number, default: 0 },
  promoCode: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  lastSync: { type: Date, default: Date.now }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
