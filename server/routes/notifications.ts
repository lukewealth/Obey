import express, { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * GET /api/notifications/:userId
 * Get all notifications for a user
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const notifications = await Notification.find({ userId } as any)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));

    const unreadCount = await Notification.countDocuments({ userId, read: false } as any);

    res.json({
      notifications,
      unreadCount,
      total: notifications.length,
    });
  } catch (error: any) {
    console.error('[NOTIFICATIONS] Fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

/**
 * POST /api/notifications
 * Create a new notification
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, type, title, message, actionUrl, metadata } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ error: 'userId, title, and message are required' });
    }

    const notification = new Notification({
      id: `NOTIF-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId,
      type: type || 'system',
      title,
      message,
      actionUrl,
      metadata,
    });

    await notification.save();

    res.json({ success: true, notification });
  } catch (error: any) {
    console.error('[NOTIFICATIONS] Create error:', error.message);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

/**
 * POST /api/notifications/:id/read
 * Mark a notification as read
 */
router.post('/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findOneAndUpdate({ id } as any, { read: true } as any, { new: true } as any);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read for a user
 */
router.post('/read-all', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    await Notification.updateMany({ userId, read: false } as any, { read: true } as any);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Notification.findOneAndDelete({ id } as any);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

/**
 * POST /api/notifications/seed
 * Seed sample notifications (for development)
 */
router.post('/seed', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const sampleNotifications = [
      { type: 'transaction', title: 'Payment Received', message: 'You received ₦50,000 from John Doe' },
      { type: 'security', title: 'New Login Detected', message: 'New login from Lagos, Nigeria on Chrome' },
      { type: 'reward', title: 'Reward Earned!', message: 'You earned 50 points from your last transaction' },
      { type: 'system', title: 'System Update', message: 'New features available in your dashboard' },
      { type: 'promo', title: 'Special Offer', message: 'Get 0% fees on your next crypto trade' },
    ];

    const notifications = await Promise.all(
      sampleNotifications.map((n) =>
        new Notification({
          id: `NOTIF-${uuidv4().substring(0, 8).toUpperCase()}`,
          userId,
          ...n,
          createdAt: new Date(Date.now() - Math.random() * 86400000),
        }).save()
      )
    );

    res.json({ success: true, count: notifications.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to seed notifications' });
  }
});

export default router;
