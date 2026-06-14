import { User } from '../models/User';

/**
 * User ID Node: Manages the mapping between Supabase/Firebase IDs and Institutional Node IDs.
 */
export const resolveUserId = async (identifier: string) => {
  try {
    const user = await User.findOne({
      $or: [
        { supabaseId: identifier },
        { email: identifier },
        { obeyId: identifier }
      ]
    });
    return user ? user.supabaseId : null;
  } catch (error) {
    console.error('[MESH_ERROR] Failed to resolve User ID:', error);
    return null;
  }
};

export const linkMetadataToUser = (userId: string, metadata: any) => {
  return {
    userId,
    ...metadata,
    linkedAt: new Date()
  };
};
