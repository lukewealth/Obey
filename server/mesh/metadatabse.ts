import mongoose from 'mongoose';
import { User } from '../models/User';

/**
 * Meta-Database Node: Specialized store for institutional metadata across all asset types.
 */
const MetadataSchema = new mongoose.Schema({
  nodeId: { type: String, required: true, unique: true },
  entityType: { type: String, enum: ['USER', 'CRYPTO', 'GIFTCARD', 'TRANSACTION'], required: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export const Metadata = mongoose.models.Metadata || mongoose.model('Metadata', MetadataSchema);

export const storeMetadata = async (nodeId: string, entityType: string, payload: any) => {
  return await Metadata.findOneAndUpdate(
    { nodeId } as any,
    { nodeId, entityType, payload, lastUpdated: new Date() } as any,
    { upsert: true, new: true }
  );
};

/**
 * Sync Metadata Node: Captures and synchronizes verified user metadata with their profile.
 */
export const syncMetadataNode = async (userId: string, metadata: any) => {
  try {
    // 1. Store in Institutional Metadata Node
    const metadataNode = await storeMetadata(userId, 'USER', metadata);

    // 2. Align with User Profile Node
    await User.findOneAndUpdate(
      { supabaseId: userId } as any,
      { 
        $set: { 
          'metadata': metadata,
          'lastSync': new Date()
        } 
      } as any,
      { new: true }
    );

    return metadataNode;
  } catch (error) {
    console.error('[MESH_ERROR] Metadata Node Synchronization Failure:', error);
    throw error;
  }
};

export const fetchMetadata = async (nodeId: string) => {
  return await Metadata.findOne({ nodeId } as any);
};
