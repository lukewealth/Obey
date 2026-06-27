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
  metadata: { type: mongoose.Schema.Types.Mixed },
  lastSync: { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.index({ supabaseId: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ obeyId: 1 }, { sparse: true });
UserSchema.index({ kycStatus: 1, kycLevel: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

UserSchema.pre('save', function() {
  if (!this.obeyId) {
    const randomHex = Math.random().toString(16).substring(2, 7).toUpperCase();
    this.obeyId = `OBEY-${randomHex}`;
  }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
