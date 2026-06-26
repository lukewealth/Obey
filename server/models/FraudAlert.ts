import mongoose from 'mongoose';

const FraudAlertSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  transactionId: { type: String, required: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], required: true },
  flags: [{ type: String }],
  hash: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['PENDING_REVIEW', 'INVESTIGATING', 'RESOLVED', 'FALSE_POSITIVE', 'CONFIRMED_FRAUD'],
    default: 'PENDING_REVIEW'
  },
  reviewedBy: { type: String },
  reviewNotes: { type: String },
  resolvedAt: { type: Date },
  actionTaken: { type: String },
}, { timestamps: true });

export const FraudAlert = mongoose.models.FraudAlert || mongoose.model('FraudAlert', FraudAlertSchema);
