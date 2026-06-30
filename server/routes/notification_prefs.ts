import express, { Request, Response } from 'express';
import { User } from '../models/User';

const router = express.Router();

// Get notification preferences for a user
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const preferences = user.metadata?.notificationPreferences || {
      email: true,
      sms: false,
      push: true,
      transactions: true,
      marketing: false,
      security: true,
      muted: false,
      quietHoursStart: "22:00",
      quietHoursEnd: "08:00"
    };

    res.json({ success: true, preferences });
  } catch (error: any) {
    console.error('[NOTIF_PREFS_GET] Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch notification preferences' });
  }
});

// Update notification preferences for a user
router.post('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update metadata with notification preferences
    user.metadata = {
      ...user.metadata,
      notificationPreferences: preferences
    };
    await user.save();

    res.json({ success: true, message: 'Notification preferences updated' });
  } catch (error: any) {
    console.error('[NOTIF_PREFS_POST] Error:', error.message);
    res.status(500).json({ error: 'Failed to update notification preferences' });
  }
});

export default router;
