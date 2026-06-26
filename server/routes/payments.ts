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
  recipientIdentifier: z.string(),
  amount: z.number().positive(),
});

router.post('/transfer', async (req: Request, res: Response) => {
  try {
    const validation = transferSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid transfer parameters',
        details: validation.error.flatten().fieldErrors 
      });
    }

    const { senderId, recipientIdentifier, amount } = validation.data;
    const requestReference = `P2P-${uuidv4().substring(0, 8).toUpperCase()}`;

    const sender = await User.findOne({ $or: [{ supabaseId: senderId }, { email: senderId }] } as any);
    const recipient = await User.findOne({ 
      $or: [
        { email: recipientIdentifier.toLowerCase() }, 
        { obeyId: recipientIdentifier.toUpperCase() }
      ] 
    } as any);

    if (!sender || !recipient) {
      return res.status(404).json({ error: 'Sender or recipient node not found.' });
    }
    if (sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient liquidity in sender account.' });
    }

    sender.balance -= amount;
    recipient.balance += amount;

    const senderTx = new Transaction({
      id: uuidv4(),
      userId: sender.supabaseId,
      title: `Transfer to ${recipient.name}`,
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
      title: `Transfer from ${sender.name}`,
      category: "Transfer",
      type: "Credit",
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: "Success",
      requestReference
    });

    await Promise.all([sender.save(), recipient.save(), senderTx.save(), recipientTx.save()]);

    res.json({ success: true, recipientName: recipient.name, transactionId: senderTx.id });
  } catch (error: any) {
    console.error('[TRANSFER_ERROR]', error.message);
    res.status(500).json({ 
      error: 'Transfer settlement failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal settlement error'
    });
  }
});

router.post('/topup-card', async (req: Request, res: Response) => {
  try {
    const validation = cardTopupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid payment data',
        details: validation.error.flatten().fieldErrors 
      });
    }

    const { userId, amount, cardNumber, expiryMonth, expiryYear, cvv } = validation.data;
    const requestReference = `TOP-${uuidv4().substring(0, 8).toUpperCase()}`;

    const paymentResult = await interswitch.processCardPayment({
      amount: amount * 100,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      requestReference
    });

    if (paymentResult.responseCode === "00") {
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
      await User.findOneAndUpdate(
        { $or: [{ supabaseId: userId }, { email: userId }] } as any, 
        { $inc: { balance: amount } } as any, 
        { new: true } as any
      );
      return res.json({ success: true, transaction: tx });
    }
    
    res.status(400).json({ 
      error: 'Payment declined',
      code: paymentResult.responseCode || 'UNKNOWN'
    });
  } catch (error: any) {
    console.error('[CARD_TOPUP_ERROR]', error.message);
    res.status(500).json({ 
      error: 'Card payment processing failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Payment gateway error'
    });
  }
});

router.post('/withdraw', async (req: Request, res: Response) => {
  try {
    const validation = withdrawalSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Invalid withdrawal data',
        details: validation.error.flatten().fieldErrors 
      });
    }

    const { userId, amount, bankCode, accountNumber } = validation.data;
    const requestReference = `WTH-${uuidv4().substring(0, 8).toUpperCase()}`;

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    if (!user) {
      return res.status(404).json({ error: 'User account not found' });
    }
    if (user.balance < amount) {
      return res.status(400).json({ 
        error: 'Insufficient funds',
        available: user.balance,
        requested: amount
      });
    }

    const payoutResult = await interswitch.processWithdrawal({
      amount: amount * 100,
      bankCode: bankCode || "044",
      accountNumber,
      requestReference
    });

    if (payoutResult.responseCode === "00") {
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
      user.balance -= amount;
      await user.save();
      return res.json({ success: true, transaction: tx });
    }
    
    res.status(400).json({ 
      error: 'Withdrawal declined',
      code: payoutResult.responseCode || 'UNKNOWN'
    });
  } catch (error: any) {
    console.error('[WITHDRAWAL_ERROR]', error.message);
    res.status(500).json({ 
      error: 'Withdrawal processing failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Payout gateway error'
    });
  }
});

export default router;
