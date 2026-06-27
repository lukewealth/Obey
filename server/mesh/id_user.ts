import { User } from '../models/User';
import { generateNodeId } from './id_node';

export const syncUserNode = async (profile: any) => {
  try {
    const { supabaseId, email } = profile;

    if (!supabaseId && !email) {
      throw new Error('syncUserNode requires supabaseId or email');
    }

    const updateData: any = { ...profile, lastSync: new Date() };
    delete updateData._id;

    let existing = null;
    if (supabaseId) {
      existing = await User.findOne({ supabaseId } as any);
    }
    if (!existing && email) {
      existing = await User.findOne({ email } as any);
    }

    if (!existing) {
      const user = new User({
        ...updateData,
        obeyId: generateNodeId('OBEY')
      });
      await user.save();
      return user;
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        (existing as any)[key] = updateData[key];
      }
    });
    existing.lastSync = new Date();
    await existing.save();
    return existing;
  } catch (error) {
    console.error('[MESH_ERROR] User Node Synchronization Failure:', error);
    throw error;
  }
};
