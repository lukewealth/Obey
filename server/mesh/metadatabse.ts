import mongoose from 'mongoose';

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
    { nodeId },
    { nodeId, entityType, payload, lastUpdated: new Date() },
    { upsert: true, new: true }
  );
};

export const fetchMetadata = async (nodeId: string) => {
  return await Metadata.findOne({ nodeId });
};
