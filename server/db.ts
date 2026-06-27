import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_OPTIONS = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 3000,
  socketTimeoutMS: 30000,
  connectTimeoutMS: 5000,
};

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI === 'your_mongodb_atlas_connection_string_here') {
  console.warn('[DB_MESH_WARN] MONGODB_URI not configured.');
}

let cachedConnection: any = null;
let connectionPromise: Promise<any> | null = null;

export const connectDB = async () => {
  if (!MONGODB_URI || MONGODB_URI === 'your_mongodb_atlas_connection_string_here') {
    return null;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  if (mongoose.connection.readyState === 1) {
    cachedConnection = mongoose.connection;
    return cachedConnection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = mongoose.connect(MONGODB_URI, MONGODB_OPTIONS)
    .then(() => {
      cachedConnection = mongoose.connection;
      connectionPromise = null;
      console.log('[DB_MESH] Institutional database node online');
      return cachedConnection;
    })
    .catch((error: any) => {
      connectionPromise = null;
      console.error('[DB_MESH_CRITICAL] Connection failure:', error.message);
      throw error;
    });

  return connectionPromise;
};

export const prewarmDB = () => {
  if (MONGODB_URI && MONGODB_URI !== 'your_mongodb_atlas_connection_string_here') {
    connectDB().catch(() => {});
  }
};
