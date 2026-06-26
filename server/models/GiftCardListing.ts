import mongoose from 'mongoose';

const GiftCardListingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  sellerId: { type: String, required: true }, // Supabase ID
  sellerName: { type: String, required: true },
  assetName: { type: String, required: true },
  faceValue: { type: Number, required: true },
  price: { type: Number, required: true }, // Amount buyer pays in SUI/NGN
  status: { 
    type: String, 
    enum: ["OPEN", "PENDING", "COMPLETED", "CANCELLED", "DISPUTED"], 
    default: "OPEN" 
  },
  claimCode: { type: String }, // Optional, encrypted or held until release
  buyerId: { type: String },
  transactionId: { type: String }, // Reference to the Escrow Transaction
}, { timestamps: true });

export const GiftCardListing = mongoose.models.GiftCardListing || mongoose.model('GiftCardListing', GiftCardListingSchema);
