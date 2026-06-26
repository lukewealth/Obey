import mongoose from 'mongoose';

const RewardsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  points: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  tier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'], default: 'Bronze' },
  totalEarned: { type: Number, default: 0 },
  totalRedeemed: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  achievements: [{
    id: String,
    name: String,
    description: String,
    earnedAt: Date,
    points: Number,
  }],
  history: [{
    type: { type: String, enum: ['EARNED', 'REDEEMED', 'EXPIRED', 'BONUS'] },
    points: Number,
    reason: String,
    reference: String,
    createdAt: { type: Date, default: Date.now },
  }],
  badges: [{
    id: String,
    name: String,
    icon: String,
    earnedAt: Date,
  }],
  referralCode: { type: String, unique: true },
  referrals: { type: Number, default: 0 },
  multiplier: { type: Number, default: 1.0 },
}, { timestamps: true });

RewardsSchema.pre('save', function(this: any, next: any) {
  if (!this.referralCode) {
    this.referralCode = `OBEY-${this.userId.substring(0, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  
  if (this.points >= 10000) this.tier = 'Diamond';
  else if (this.points >= 5000) this.tier = 'Platinum';
  else if (this.points >= 2000) this.tier = 'Gold';
  else if (this.points >= 500) this.tier = 'Silver';
  else this.tier = 'Bronze';

  this.level = Math.floor(this.totalEarned / 1000) + 1;
  
  next();
});

export const Rewards = mongoose.models.Rewards || mongoose.model('Rewards', RewardsSchema);
