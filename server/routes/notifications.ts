import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory store for notifications (fallback when MongoDB is unavailable)
const notificationStore: Map<string, any[]> = new Map();

async function getNotificationModel() {
  try {
    const { Notification } = await import('../models/Notification');
    return Notification;
  } catch {
    return null;
  }
}

/**
 * GET /api/notifications/:userId
 * Get all notifications for a user
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const Notification = await getNotificationModel();
    if (Notification) {
      const notifications = await Notification.find({ userId } as any)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(Number(offset));
      const unreadCount = await Notification.countDocuments({ userId, read: false } as any);
      return res.json({ notifications, unreadCount, total: notifications.length });
    }

    // Fallback to in-memory
    const notifications = notificationStore.get(userId) || [];
    const unreadCount = notifications.filter((n: any) => !n.read).length;
    res.json({
      notifications: notifications.slice(Number(offset), Number(offset) + Number(limit)),
      unreadCount,
      total: notifications.length,
    });
  } catch (error: any) {
    console.error('[NOTIFICATIONS] Fetch error:', error.message);
    res.json({ notifications: [], unreadCount: 0, total: 0 });
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

    const notificationData = {
      id: `NOTIF-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId,
      type: type || 'system',
      title,
      message,
      actionUrl,
      metadata,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const Notification = await getNotificationModel();
    if (Notification) {
      const notification = new Notification(notificationData);
      await notification.save();
      return res.json({ success: true, notification });
    }

    // Fallback to in-memory
    const existing = notificationStore.get(userId) || [];
    existing.push(notificationData);
    notificationStore.set(userId, existing);
    res.json({ success: true, notification: notificationData });
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
    const Notification = await getNotificationModel();
    if (Notification) {
      await Notification.findOneAndUpdate({ id } as any, { read: true } as any, { new: true } as any);
      return res.json({ success: true });
    }

    // Fallback to in-memory
    for (const notifications of notificationStore.values()) {
      const notif = notifications.find((n: any) => n.id === id);
      if (notif) { notif.read = true; return res.json({ success: true }); }
    }
    res.json({ success: true });
  } catch (error: any) {
    res.json({ success: true });
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

    const Notification = await getNotificationModel();
    if (Notification) {
      await Notification.updateMany({ userId, read: false } as any, { read: true } as any);
      return res.json({ success: true });
    }

    // Fallback to in-memory
    const notifications = notificationStore.get(userId) || [];
    notifications.forEach((n: any) => { n.read = true; });
    res.json({ success: true });
  } catch (error: any) {
    res.json({ success: true });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const Notification = await getNotificationModel();
    if (Notification) {
      await Notification.findOneAndDelete({ id } as any);
      return res.json({ success: true });
    }

    // Fallback to in-memory
    for (const [userId, notifications] of notificationStore.entries()) {
      const idx = notifications.findIndex((n: any) => n.id === id);
      if (idx !== -1) { notifications.splice(idx, 1); return res.json({ success: true }); }
    }
    res.json({ success: true });
  } catch (error: any) {
    res.json({ success: true });
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

    const Notification = await getNotificationModel();
    if (Notification) {
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
      return res.json({ success: true, count: notifications.length });
    }

    // Fallback to in-memory
    const existing = notificationStore.get(userId) || [];
    sampleNotifications.forEach((n) => {
      existing.push({
        id: `NOTIF-${uuidv4().substring(0, 8).toUpperCase()}`,
        userId,
        ...n,
        read: false,
        createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      });
    });
    notificationStore.set(userId, existing);
    res.json({ success: true, count: sampleNotifications.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to seed notifications' });
  }
});

export default router;
