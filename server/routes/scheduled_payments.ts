import express, { Request, Response } from 'express';
import { z } from 'zod';
import { ScheduledPayment } from '../models/ScheduledPayment';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const createScheduleSchema = z.object({
  userId: z.string().min(1),
  title: z.string().min(1),
  amount: z.number().positive(),
  currency: z.string().default('NGN'),
  date: z.string().min(1),
  time: z.string().min(1),
  frequency: z.enum(['once', 'daily', 'weekly', 'monthly', 'yearly']).default('once'),
  category: z.enum(['Transfer', 'Bills', 'Savings', 'Subscription', 'Rent', 'Other']).default('Other'),
  recipient: z.string().optional(),
  recipientAccount: z.string().optional(),
  recipientBank: z.string().optional(),
  description: z.string().optional(),
});

const updateScheduleSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  amount: z.number().positive().optional(),
  title: z.string().optional(),
});

/**
 * GET /api/scheduled-payments/:userId
 * Get all scheduled payments for a user
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

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

    res.json({ payments, stats });
  } catch (error: any) {
    console.error('[SCHEDULED_PAYMENTS] Fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch scheduled payments' });
  }
});

/**
 * POST /api/scheduled-payments
 * Create a new scheduled payment
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = createScheduleSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters', details: validation.error.flatten() });
    }

    const data = validation.data;
    const nextExecution = new Date(`${data.date}T${data.time}`);

    const payment = new ScheduledPayment({
      id: `SP-${uuidv4().substring(0, 8).toUpperCase()}`,
      ...data,
      nextExecution,
      status: 'upcoming',
    });

    await payment.save();

    res.json({ success: true, payment });
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
    const validation = updateScheduleSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const updateData: any = { ...validation.data };
    if (updateData.date && updateData.time) {
      updateData.nextExecution = new Date(`${updateData.date}T${updateData.time}`);
      updateData.rescheduleCount = (await ScheduledPayment.findOne({ id } as any))?.rescheduleCount || 0 + 1;
      updateData.originalDate = updateData.originalDate || (await ScheduledPayment.findOne({ id } as any))?.date;
    }

    const payment = await ScheduledPayment.findOneAndUpdate(
      { id } as any,
      updateData as any,
      { new: true } as any
    );

    if (!payment) return res.status(404).json({ error: 'Scheduled payment not found' });

    res.json({ success: true, payment });
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
    const payment = await ScheduledPayment.findOneAndUpdate(
      { id } as any,
      { status: 'cancelled' } as any,
      { new: true } as any
    );
    if (!payment) return res.status(404).json({ error: 'Scheduled payment not found' });
    res.json({ success: true, payment });
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
    const payment = await ScheduledPayment.findOne({ id } as any);

    if (!payment) return res.status(404).json({ error: 'Scheduled payment not found' });
    if (payment.status !== 'upcoming') return res.status(400).json({ error: 'Payment not in upcoming status' });

    const user = await User.findOne({ supabaseId: payment.userId } as any);
    if (!user || user.balance < payment.amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Debit user
    user.balance -= payment.amount;
    await user.save();

    // Create transaction
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

    // Update payment status
    payment.status = 'completed';
    payment.lastExecuted = new Date();
    await payment.save();

    res.json({ success: true, transaction: tx, newBalance: user.balance });
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
    await ScheduledPayment.findOneAndDelete({ id } as any);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete scheduled payment' });
  }
});

export default router;
