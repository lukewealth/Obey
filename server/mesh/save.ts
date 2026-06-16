import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { storeMetadata } from './metadatabse';

/**
 * Save Node: Unified persistence layer for the Institutional Mesh.
 * Ensures all real-time data is committed to the database and metadata store.
 */
export const saveUserNode = async (userId: string, profile: any) => {
  const user = await User.findOneAndUpdate(
    { supabaseId: userId } as any,
    { ...profile, lastSync: new Date() } as any,
    { upsert: true, new: true }
  );
  
  await storeMetadata(userId, 'USER', profile);
  return user;
};

export const saveTransactionNode = async (txData: any) => {
  const tx = new Transaction(txData);
  await tx.save();
  
  await storeMetadata(txData.id, 'TRANSACTION', txData);
  return tx;
};
