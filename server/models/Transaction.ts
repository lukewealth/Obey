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
  riskScore: { type: Number, default: 0 }, // 0-100 institutional risk index
  executionNode: { type: String }, // e.g. OBEY-SUI-01
  auditHash: { type: String } // Blockchain verification hash
}, { timestamps: true });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
