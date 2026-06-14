import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  supabaseId: { type: String, required: true, unique: true },
  obeyId: { type: String, unique: true }, // Unique Node Identifier (e.g. OBEY-82F1X)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  phone: { type: String },
  avatar: { type: String },
  kycStatus: { 
    type: String, 
    enum: ["Unverified", "Pending", "Verified"],
    default: "Unverified"
  },
  kycLevel: { type: Number, default: 0 },
  tierLevel: { type: Number, default: 1 }, // 1: Standard, 2: Institutional/Premium
  isEmailVerified: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  promoCode: { type: String },
  twoFactorEnabled: { type: Boolean, default: false },
  lastSync: { type: Date, default: Date.now }
}, { timestamps: true });

// Pre-save hook to generate obeyId if it doesn't exist
UserSchema.pre('save', function(next) {
  if (!this.obeyId) {
    const randomHex = Math.random().toString(16).substring(2, 7).toUpperCase();
    this.obeyId = `OBEY-${randomHex}`;
  }
  next();
});

export const User = mongoose.model('User', UserSchema);
