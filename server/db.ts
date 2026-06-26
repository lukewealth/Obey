import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_OPTIONS = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI === 'your_mongodb_atlas_connection_string_here') {
  console.warn('[DB_MESH_WARN] MONGODB_URI not configured. Database features will be unavailable.');
}

let cachedConnection: any = null;

export const connectDB = async () => {
  if (!MONGODB_URI || MONGODB_URI === 'your_mongodb_atlas_connection_string_here') {
    console.warn('[DB_MESH_WARN] Skipping DB connection - MONGODB_URI not configured');
    return null;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  try {
    await mongoose.connect(MONGODB_URI, MONGODB_OPTIONS);
    cachedConnection = mongoose.connection;
    console.log('[DB_MESH] Institutional database node online');
    return cachedConnection;
  } catch (error: any) {
    console.error('[DB_MESH_CRITICAL] Connection failure:', error.message);
    throw error;
  }
};
