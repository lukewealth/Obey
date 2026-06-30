import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory store for scheduled payments (fallback when MongoDB is unavailable)
const scheduledPaymentStore: Map<string, any[]> = new Map();

const createScheduleSchema = {
  validate: (data: any) => {
    const errors: string[] = [];
    if (!data.userId) errors.push('userId is required');
    if (!data.title) errors.push('title is required');
    if (!data.amount || data.amount <= 0) errors.push('amount must be positive');
    if (!data.date) errors.push('date is required');
    if (!data.time) errors.push('time is required');
    return { success: errors.length === 0, errors };
  }
};

/**
 * GET /api/scheduled-payments/:userId
 * Get all scheduled payments for a user
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    // Try MongoDB first
    try {
      const { ScheduledPayment } = await import('../models/ScheduledPayment');
      const query: any = { userId };
      if (status && status !== 'all') {
        query.status = status;
      }

      const payments = await ScheduledPayment.find(query as any).sort({ nextExecution: 1 });
      const stats = {
        total: payments.length,
        upcoming: payments.filter((p: any) => p.status === 'upcoming').length,
        completed: payments.filter((p: any) => p.status === 'completed').length,
        totalAmount: payments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      };

      return res.json({ payments, stats });
    } catch {
      // Fallback to in-memory store
      const payments = scheduledPaymentStore.get(userId) || [];
      const filtered = status && status !== 'all'
        ? payments.filter((p: any) => p.status === status)
        : payments;

      const stats = {
        total: filtered.length,
        upcoming: filtered.filter((p: any) => p.status === 'upcoming').length,
        completed: filtered.filter((p: any) => p.status === 'completed').length,
        totalAmount: filtered.reduce((sum: number, p: any) => sum + (p.amount || 0), 0),
      };

      return res.json({ payments: filtered, stats });
    }
  } catch (error: any) {
    console.error('[SCHEDULED_PAYMENTS] Fetch error:', error.message);
    res.json({ payments: [], stats: { total: 0, upcoming: 0, completed: 0, totalAmount: 0 } });
  }
});

/**
 * POST /api/scheduled-payments
 * Create a new scheduled payment
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = createScheduleSchema.validate(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters', details: validation.errors });
    }

    const data = req.body;
    const nextExecution = new Date(`${data.date}T${data.time}`);

    // Try MongoDB first
    try {
      const { ScheduledPayment } = await import('../models/ScheduledPayment');
      const payment = new ScheduledPayment({
        id: `SP-${uuidv4().substring(0, 8).toUpperCase()}`,
        ...data,
        nextExecution,
        status: 'upcoming',
      });

      await payment.save();
      return res.json({ success: true, payment });
    } catch {
      // Fallback to in-memory store
      const payment = {
        id: `SP-${uuidv4().substring(0, 8).toUpperCase()}`,
        ...data,
        nextExecution,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
      };

      const existing = scheduledPaymentStore.get(data.userId) || [];
      existing.push(payment);
      scheduledPaymentStore.set(data.userId, existing);

      return res.json({ success: true, payment });
    }
  } catch (error: any) {
    console.error('[SCHEDULED_PAYMENTS] Create error:', error.message);
    res.status(500).json({ error: 'Failed to create scheduled payment' });
  }
});

/**
 * PUT /api/scheduled-payments/:id
 * Update a scheduled payment
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: any = { ...req.body };

    // Try MongoDB first
    try {
      const { ScheduledPayment } = await import('../models/ScheduledPayment');
      if (updateData.date && updateData.time) {
        updateData.nextExecution = new Date(`${updateData.date}T${updateData.time}`);
        const existing = await ScheduledPayment.findOne({ id } as any);
        updateData.rescheduleCount = (existing?.rescheduleCount || 0) + 1;
        updateData.originalDate = updateData.originalDate || existing?.date;
      }

      const payment = await ScheduledPayment.findOneAndUpdate(
        { id } as any,
        updateData as any,
        { new: true } as any
      );

      if (!payment) return res.status(404).json({ error: 'Scheduled payment not found' });
      return res.json({ success: true, payment });
    } catch {
      // Fallback to in-memory store
      for (const [userId, payments] of scheduledPaymentStore.entries()) {
        const idx = payments.findIndex((p: any) => p.id === id);
        if (idx !== -1) {
          if (updateData.date && updateData.time) {
            updateData.nextExecution = new Date(`${updateData.date}T${updateData.time}`);
            updateData.rescheduleCount = (payments[idx].rescheduleCount || 0) + 1;
            updateData.originalDate = updateData.originalDate || payments[idx].date;
          }
          payments[idx] = { ...payments[idx], ...updateData };
          return res.json({ success: true, payment: payments[idx] });
        }
      }
      return res.status(404).json({ error: 'Scheduled payment not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update scheduled payment' });
  }
});

/**
 * POST /api/scheduled-payments/:id/cancel
 * Cancel a scheduled payment
 */
router.post('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Try MongoDB first
    try {
      const { ScheduledPayment } = await import('../models/ScheduledPayment');
      const payment = await ScheduledPayment.findOneAndUpdate(
        { id } as any,
        { status: 'cancelled' } as any,
        { new: true } as any
      );
      if (!payment) return res.status(404).json({ error: 'Scheduled payment not found' });
      return res.json({ success: true, payment });
    } catch {
      // Fallback to in-memory store
      for (const payments of scheduledPaymentStore.values()) {
        const payment = payments.find((p: any) => p.id === id);
        if (payment) {
          payment.status = 'cancelled';
          return res.json({ success: true, payment });
        }
      }
      return res.status(404).json({ error: 'Scheduled payment not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to cancel scheduled payment' });
  }
});

/**
 * POST /api/scheduled-payments/:id/execute
 * Execute a scheduled payment immediately
 */
router.post('/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Try MongoDB first
    try {
      const { ScheduledPayment } = await import('../models/ScheduledPayment');
      const { User } = await import('../models/User');
      const { Transaction } = await import('../models/Transaction');

      const payment = await ScheduledPayment.findOne({ id } as any);
      if (!payment) return res.status(404).json({ error: 'Scheduled payment not found' });
      if (payment.status !== 'upcoming') return res.status(400).json({ error: 'Payment not in upcoming status' });

      const user = await User.findOne({ supabaseId: payment.userId } as any);
      if (!user || user.balance < payment.amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      user.balance -= payment.amount;
      await user.save();

      const tx = new Transaction({
        id: `SP-EXEC-${uuidv4().substring(0, 8).toUpperCase()}`,
        userId: payment.userId,
        title: `Scheduled: ${payment.title}`,
        category: payment.category,
        type: 'Debit',
        amount: payment.amount,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'Success',
        brand: payment.recipient || 'Scheduled Payment',
      });
      await tx.save();

      payment.status = 'completed';
      payment.lastExecuted = new Date();
      await payment.save();

      return res.json({ success: true, transaction: tx, newBalance: user.balance });
    } catch {
      // Fallback - just update status in memory
      for (const payments of scheduledPaymentStore.values()) {
        const payment = payments.find((p: any) => p.id === id);
        if (payment) {
          payment.status = 'completed';
          payment.lastExecuted = new Date().toISOString();
          return res.json({ success: true, payment, newBalance: 0 });
        }
      }
      return res.status(404).json({ error: 'Scheduled payment not found' });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to execute scheduled payment' });
  }
});

/**
 * DELETE /api/scheduled-payments/:id
 * Delete a scheduled payment
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Try MongoDB first
    try {
      const { ScheduledPayment } = await import('../models/ScheduledPayment');
      await ScheduledPayment.findOneAndDelete({ id } as any);
      return res.json({ success: true });
    } catch {
      // Fallback to in-memory store
      for (const [userId, payments] of scheduledPaymentStore.entries()) {
        const idx = payments.findIndex((p: any) => p.id === id);
        if (idx !== -1) {
          payments.splice(idx, 1);
          return res.json({ success: true });
        }
      }
      return res.json({ success: true });
    }
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete scheduled payment' });
  }
});

export default router;
