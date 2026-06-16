import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Standardize connection options for institutional mesh stability
const MONGODB_OPTIONS = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Fixed connection string with explicit database name 'obey_ecosystem' for reliability
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://Vercel-Admin-atlas-sky-yacht:StwR1ECXbmmYy0YQ@atlas-sky-yacht.d5yxhii.mongodb.net/obey_ecosystem?retryWrites=true&w=majority";

let cachedConnection: any = null;

/**
 * Institutional Database Mesh Connector
 * Ensures single connection pool in serverless environments via caching.
 */
export const connectDB = async () => {
  if (cachedConnection) {
    console.log('🔄 Reusing existing institutional database node');
    return cachedConnection;
  }

  if (mongoose.connection.readyState === 1) {
    console.log('🔄 Institutional database node already online (ReadyState 1)');
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  try {
    console.log('Establishing institutional database connection...');

    // In serverless, we must wait for the connection to establish
    await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);

    cachedConnection = mongoose.connection;
    console.log('✅ Institutional database node online');
    return cachedConnection;
  } catch (error: any) {
    console.error('❌ Institutional database node failure:', error.message);
    // Log more details about the error if possible
    if (error.reason) console.error('Connection details:', error.reason);
    throw error; 
  }
};

