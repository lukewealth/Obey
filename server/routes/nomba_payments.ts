import express, { Request, Response } from 'express';
import { z } from 'zod';
import * as nomba from '../services/nomba';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { VirtualAccount } from '../models/VirtualAccount';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const checkoutSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  email: z.string().email().optional(),
  callbackUrl: z.string().url().optional(),
});

const virtualAccountSchema = z.object({
  userId: z.string(),
  accountName: z.string(),
  expectedAmount: z.number().positive().optional(),
});

const withdrawalSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  accountNumber: z.string().min(10),
  bankCode: z.string(),
  accountName: z.string(),
});

const accountLookupSchema = z.object({
  accountNumber: z.string().min(10),
  bankCode: z.string(),
});

router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const validation = checkoutSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters', details: validation.error.flatten() });
    }

    const { userId, amount, email, callbackUrl } = validation.data;

    const orderReference = uuidv4();
    const transaction = new Transaction({
      id: uuidv4(),
      userId,
      title: 'Wallet Top-up',
      category: 'Transfer',
      type: 'Credit',
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Processing',
      orderReference,
      paymentMethod: 'card',
    });
    await transaction.save();

    const result = await nomba.createCheckoutOrder({
      amount,
      email,
      callbackUrl: callbackUrl || `${process.env.APP_URL || 'https://obey-kappa.vercel.app'}/payment/callback`,
      userId,
      metadata: { userId, orderRef: orderReference },
    });

    res.json({
      success: true,
      checkoutLink: result.checkoutLink,
      orderReference: result.orderReference,
      transactionId: transaction.id,
    });
  } catch (error: any) {
    console.error('[CHECKOUT] Error:', error.message);
    res.status(500).json({ error: 'Failed to create checkout order' });
  }
});

router.get('/verify/:orderReference', async (req: Request, res: Response) => {
  try {
    const { orderReference } = req.params;

    const result = await nomba.verifyTransaction(orderReference);

    if (!result || result.code !== '00') {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const transaction = await Transaction.findOne({ orderReference } as any);

    res.json({
      status: result.data?.status || 'NOT_FOUND',
      amount: result.data?.amount,
      transaction: transaction ? {
        id: transaction.id,
        title: transaction.title,
        amount: transaction.amount,
        status: transaction.status,
      } : null,
    });
  } catch (error: any) {
    console.error('[VERIFY] Error:', error.message);
    res.status(500).json({ error: 'Verification failed' });
  }
});

router.post('/virtual-account', async (req: Request, res: Response) => {
  try {
    const validation = virtualAccountSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters', details: validation.error.flatten() });
    }

    const { userId, accountName, expectedAmount } = validation.data;

    const existingCount = await VirtualAccount.countDocuments({ userId, isActive: true });
    if (existingCount >= 2) {
      return res.status(400).json({ error: 'Maximum virtual account limit reached (2)' });
    }

    const accountRef = `OBEY-${userId.substring(0, 8).toUpperCase()}-${Date.now()}`;
    const result = await nomba.createVirtualAccount({
      accountRef,
      accountName,
      expectedAmount,
    });

    const virtualAccount = new VirtualAccount({
      userId,
      accountRef,
      accountName,
      bankAccountNumber: result.data.bankAccountNumber,
      bankName: result.data.bankName,
      currency: result.data.currency,
      expectedAmount,
      expiryDate: result.data.expiryDate,
      nombaAccountId: result.data.accountHolderId,
    });
    await virtualAccount.save();

    res.json({
      success: true,
      account: {
        bankName: virtualAccount.bankName,
        accountNumber: virtualAccount.bankAccountNumber,
        accountName: virtualAccount.accountName,
        currency: virtualAccount.currency,
      },
    });
  } catch (error: any) {
    console.error('[VIRTUAL_ACCOUNT] Error:', error.message);
    res.status(500).json({ error: 'Failed to create virtual account' });
  }
});

router.get('/virtual-accounts', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    try {
      const accounts = await VirtualAccount.find({ userId, isActive: true } as any);
      res.json({ accounts });
    } catch (dbError: any) {
      console.error('[VIRTUAL_ACCOUNTS] DB error:', dbError.message);
      res.json({ accounts: [] });
    }
  } catch (error: any) {
    console.error('[VIRTUAL_ACCOUNTS] Error:', error.message);
    res.json({ accounts: [] });
  }
});

router.get('/banks', async (req: Request, res: Response) => {
  try {
    if (!process.env.NOMBA_BASE_URL || !process.env.NOMBA_CLIENT_ID) {
      console.warn('[BANKS] Nomba env vars not configured, returning empty list');
      return res.json({ banks: [] });
    }

    const banks = await nomba.fetchBankCodes();
    res.json({ banks });
  } catch (error: any) {
    console.error('[BANKS] Error:', error.message);
    res.json({ banks: [] });
  }
});

router.post('/account-lookup', async (req: Request, res: Response) => {
  try {
    const validation = accountLookupSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    const { accountNumber, bankCode } = validation.data;
    const result = await nomba.lookupBankAccount(accountNumber, bankCode);

    res.json({
      success: true,
      accountName: result.data.accountName,
      accountNumber: result.data.accountNumber,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Account lookup failed' });
  }
});

router.post('/withdraw', async (req: Request, res: Response) => {
  try {
    const validation = withdrawalSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid parameters', details: validation.error.flatten() });
    }

    const { userId, amount, accountNumber, bankCode, accountName } = validation.data;

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    if (!user || user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const merchantTxRef = `WTH-${uuidv4().substring(0, 8).toUpperCase()}`;
    const transaction = new Transaction({
      id: uuidv4(),
      userId,
      title: 'Bank Withdrawal',
      category: 'Transfer',
      type: 'Debit',
      amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Processing',
      requestReference: merchantTxRef,
      paymentMethod: 'bank_transfer',
    });
    await transaction.save();

    user.balance -= amount;
    await user.save();

    const result = await nomba.initiateBankTransfer({
      amount,
      accountNumber,
      accountName,
      bankCode,
      merchantTxRef,
      senderName: 'Obey Fintech',
    });

    transaction.nombaTransactionId = result.data?.id;
    transaction.sessionId = result.data?.meta?.rrn;
    if (result.data?.status === 'PENDING_BILLING') {
      transaction.status = 'Processing';
    } else if (result.data?.status === 'SUCCESS') {
      transaction.status = 'Success';
    }
    await transaction.save();

    res.json({
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status,
        reference: merchantTxRef,
      },
      nombaStatus: result.data?.status,
    });
  } catch (error: any) {
    console.error('[WITHDRAW] Error:', error.message);
    res.status(500).json({ error: 'Withdrawal failed' });
  }
});

export default router;
