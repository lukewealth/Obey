import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-sky-yacht:StwR1ECXbmmYy0YQ@atlas-sky-yacht.d5yxhii.mongodb.net/?retryWrites=true&w=majority";

/**
 * Institutional Database Mesh Connector
 * Ensures single connection pool in serverless environments.
 */
export const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('🔄 Reusing existing institutional database node');
      return;
    }
    
    // If it's connecting (2), we might want to wait for it, 
    // but calling connect() again is usually safe in Mongoose as it returns the existing connection promise.
    console.log('🛰️ Establishing institutional database connection...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Disable buffering to fail fast if connection drops
    });
    console.log('✅ Institutional database node online');
  } catch (error) {
    console.error('❌ Institutional database node failure:', error);
    // In production, we want to know why it's failing
    throw error; 
  }
};
