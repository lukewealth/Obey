import mongoose from 'mongoose';

const FraudAlertSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ["Account Takeover", "Bulk Transfer", "Card Testing", "Velocity Anomaly", "Geo-Mismatch"],
    required: true 
  },
  severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], required: true },
  entityId: { type: String, required: true }, // User ID or Transaction ID
  description: { type: String, required: true },
  riskScore: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Reviewing", "Resolved", "Dismissed"], default: "Pending" },
  metadata: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export const FraudAlert = mongoose.models.FraudAlert || mongoose.model('FraudAlert', FraudAlertSchema);
