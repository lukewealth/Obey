import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true }, // Supabase ID
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Electronics", "Transfer", "Dining", "Travel", "Food", "Crypto", "Airtime", "Data", "GiftCard"],
    required: true 
  },
  type: { type: String, enum: ["Debit", "Credit"], required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ["Success", "Processing", "Failed"], default: "Success" },
  recipientWallet: { type: String },
  network: { type: String },
  brand: { type: String }
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', TransactionSchema);
