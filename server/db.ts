import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-sky-yacht:StwR1ECXbmmYy0YQ@atlas-sky-yacht.d5yxhii.mongodb.net/?retryWrites=true&w=majority";

export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // Continue running as Supabase might still be available
  }
};
