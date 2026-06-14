import mongoose from 'mongoose';

const CryptoListingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sellerId: { type: String, required: true }, // Supabase ID
  sellerName: { type: String, required: true },
  assetSymbol: { type: String, required: true }, // BTC, ETH, SOL, SUI
  amount: { type: Number, required: true },
  priceInUSD: { type: Number, required: true }, // Total price in USD
  rate: { type: Number, required: true }, // Price per unit at listing
  status: { 
    type: String, 
    enum: ["OPEN", "PENDING", "COMPLETED", "CANCELLED", "DISPUTED"], 
    default: "OPEN" 
  },
  buyerId: { type: String },
  transactionId: { type: String }, // Reference to the Escrow Transaction
}, { timestamps: true });

export const CryptoListing = mongoose.model('CryptoListing', CryptoListingSchema);
