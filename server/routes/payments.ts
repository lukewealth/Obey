import express, { Request, Response } from 'express';
import { z } from 'zod';
import * as interswitch from '../services/interswitch';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const cardTopupSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  cardNumber: z.string().min(16),
  expiryMonth: z.string().length(2),
  expiryYear: z.string().length(2),
  cvv: z.string().min(3),
});

const withdrawalSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  bankName: z.string(),
  bankCode: z.string().optional(),
  accountNumber: z.string().min(10),
});

const transferSchema = z.object({
  senderId: z.string(),
  recipientEmail: z.string().email(),
  amount: z.number().positive(),
});

/**
 * Peer-to-Peer (P2P) Asset Transfer Node
 * Enables Obey-2-Obey internal settlement via email target.
 */
router.post('/transfer', async (req: Request, res: Response) => {
  try {
    const validation = transferSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid transfer parameters', details: validation.error.flatten().fieldErrors });
    }

    const { senderId, recipientEmail, amount } = validation.data;
    const requestReference = `P2P-${uuidv4().substring(0, 8).toUpperCase()}`;

    // 1. Locate nodes in the mesh
    const [sender, recipient] = await Promise.all([
      User.findOne({ $or: [{ supabaseId: senderId }, { email: senderId }] }),
      User.findOne({ email: recipientEmail })
    ]);

    if (!sender) return res.status(404).json({ error: 'Sender node not found.' });
    if (!recipient) return res.status(404).json({ error: 'Target node (recipient email) not found.' });
    if (sender.balance < amount) return res.status(400).json({ error: 'Insufficient liquidity in sender node.' });
    if (sender.email === recipientEmail) return res.status(400).json({ error: 'Self-transfer protocol blocked.' });

    // 2. Atomic Settlement
    sender.balance -= amount;
    recipient.balance += amount;

    const txId = uuidv4();
    const senderTx = new Transaction({
      id: txId,
      userId: sender.supabaseId,
      title: `Transfer to ${recipientEmail}`,
      category: "Transfer",
      type: "Debit",
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: "Success",
      requestReference
    });

    const recipientTx = new Transaction({
      id: uuidv4(),
      userId: recipient.supabaseId,
      title: `Transfer from ${sender.email}`,
      category: "Transfer",
      type: "Credit",
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: "Success",
      requestReference
    });

    await Promise.all([sender.save(), recipient.save(), senderTx.save(), recipientTx.save()]);

    res.json({ success: true, transaction: senderTx });
  } catch (error) {
    console.error('[P2P_ERROR] Settlement failed:', error);
    res.status(500).json({ error: 'Internal mesh settlement failure.' });
  }
});

// Top-up with Virtual/Physical Card via Interswitch
router.post('/topup-card', async (req: Request, res: Response) => {
  try {
    const validation = cardTopupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid payment data', details: validation.error.flatten().fieldErrors });
    }

    const { userId, amount, cardNumber, expiryMonth, expiryYear, cvv } = validation.data;
    const requestReference = `TOP-${uuidv4().substring(0, 8).toUpperCase()}`;

    // 1. Process via Interswitch
    const paymentResult = await interswitch.processCardPayment({
      amount: amount * 100, // Kobo
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      requestReference
    });

    if (paymentResult.responseCode === "00") {
      // 2. Create Transaction
      const tx = new Transaction({
        id: uuidv4(),
        userId,
        title: "Card Top-up",
        category: "Transfer",
        type: "Credit",
        amount,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: "Success",
        requestReference
      });
      await tx.save();

      // 3. Update User Balance in MongoDB
      await User.findOneAndUpdate({ $or: [{ supabaseId: userId }, { email: userId }] }, { $inc: { balance: amount } });

      return res.json({ success: true, transaction: tx });
    } else {
      return res.status(400).json({ error: 'Payment authorization failed', message: paymentResult.message });
    }
  } catch (error) {
    console.error('Top-up Error:', error);
    res.status(500).json({ error: 'Internal system error' });
  }
});

// Account Withdrawal via Interswitch Payout
router.post('/withdraw', async (req: Request, res: Response) => {
  try {
    const validation = withdrawalSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid withdrawal data', details: validation.error.flatten().fieldErrors });
    }

    const { userId, amount, bankCode, accountNumber } = validation.data;
    const requestReference = `WTH-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Check user balance first
    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] });
    if (!user || user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient liquidity in node' });
    }

    // 1. Process via Interswitch Transfer
    const payoutResult = await interswitch.processWithdrawal({
      amount: amount * 100, // Kobo
      bankCode: bankCode || "044", // Default bank code
      accountNumber,
      requestReference
    });

    if (payoutResult.responseCode === "00") {
      // 2. Create Transaction
      const tx = new Transaction({
        id: uuidv4(),
        userId: user.supabaseId,
        title: "Account Withdrawal",
        category: "Transfer",
        type: "Debit",
        amount,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: "Success",
        requestReference
      });
      await tx.save();

      // 3. Update User Balance in MongoDB
      user.balance -= amount;
      await user.save();

      return res.json({ success: true, transaction: tx });
    } else {
      return res.status(400).json({ error: 'Withdrawal dispatch failed', message: payoutResult.message });
    }
  } catch (error) {
    console.error('Withdrawal Error:', error);
    res.status(500).json({ error: 'Internal system error' });
  }
});

export default router;
