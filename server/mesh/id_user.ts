import { User } from '../models/User';
import { generateNodeId } from './id_node';

/**
 * ID User: Handles the creation and maintenance of the User Unique Node ID.
 */
export const syncUserNode = async (profile: any) => {
  try {
    const { supabaseId, email } = profile;
    
    let user = await User.findOne({ $or: [{ supabaseId }, { email }] });
    
    if (!user) {
      user = new User({
        ...profile,
        obeyId: generateNodeId('OBEY')
      });
    } else {
      // Update existing node with fresh metadata
      Object.assign(user, profile);
      user.lastSync = new Date();
    }
    
    await user.save();
    return user;
  } catch (error) {
    console.error('[MESH_ERROR] User Node Synchronization Failure:', error);
    throw error;
  }
};
