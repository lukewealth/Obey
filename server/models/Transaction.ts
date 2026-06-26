import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true }, // Supabase ID
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Electronics", "Transfer", "Dining", "Travel", "Food", "Crypto", "Airtime", "Data", "GiftCard", "System"],
    required: true 
  },
  type: { type: String, enum: ["Debit", "Credit"], required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Success", "Processing", "Failed", "Awaiting Audit", "Escrow", "Disputed"], 
    default: "Success" 
  },
  recipientWallet: { type: String },
  network: { type: String },
  brand: { type: String },
  requestReference: { type: String },
  riskScore: { type: Number, default: 0 },
  executionNode: { type: String },
  auditHash: { type: String },
  nombaTransactionId: { type: String, index: true },
  orderReference: { type: String, index: true },
  sessionId: { type: String },
  paymentMethod: { type: String, enum: ['card', 'bank_transfer', 'virtual_account', 'wallet', 'ussd', 'qr'] },
  webhookVerified: { type: Boolean, default: false },
  idempotencyKey: { type: String },
  transactionHash: { type: String, index: true },
  previousHash: { type: String },
  blockNumber: { type: Number },
  aiRiskScore: { type: Number, default: 0 },
  aiFlags: [{ type: String }],
  fraudCheckPassed: { type: Boolean, default: true },
  rewardsEarned: { type: Number, default: 0 }
}, { timestamps: true });

TransactionSchema.index({ userId: 1, createdAt: -1 });
TransactionSchema.index({ status: 1, createdAt: -1 });
TransactionSchema.index({ category: 1, createdAt: -1 });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
