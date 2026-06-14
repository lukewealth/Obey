import express from 'express';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';

const router = express.Router();

// Sync user profile
router.post('/user', async (req, res) => {
  try {
    const { supabaseId, name, email, role, phone, avatar, kycStatus, balance, promoCode, twoFactorEnabled } = req.body;
    
    const user = await User.findOneAndUpdate(
      { supabaseId },
      { 
        name, email, role, phone, avatar, kycStatus, balance, promoCode, twoFactorEnabled,
        lastSync: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    console.error('Sync user error:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Sync transactions
router.post('/transactions', async (req, res) => {
  try {
    const { userId, transactions } = req.body;
    
    const syncResults = await Promise.all(transactions.map(async (tx: any) => {
      return Transaction.findOneAndUpdate(
        { id: tx.id },
        { ...tx, userId },
        { upsert: true, new: true }
      );
    }));

    res.json({ success: true, count: syncResults.length });
  } catch (error) {
    console.error('Sync transactions error:', error);
    res.status(500).json({ error: 'Failed to sync transactions' });
  }
});

// Fallback: Get data from MongoDB if Supabase fails
router.get('/user/:supabaseId', async (req, res) => {
  try {
    console.log(`[FALLBACK] Fetching user: ${req.params.supabaseId}`);
    const user = await User.findOne({ supabaseId: req.params.supabaseId });
    if (!user) {
      console.warn(`[FALLBACK_WARN] User not found: ${req.params.supabaseId}`);
      return res.status(404).json({ error: 'User not found in fallback' });
    }
    res.json(user);
  } catch (error) {
    console.error(`[FALLBACK_ERROR] User fetch failed:`, error);
    res.status(500).json({ error: 'Fallback fetch failed' });
  }
});

router.get('/transactions/:userId', async (req, res) => {
  try {
    console.log(`[FALLBACK] Fetching transactions for: ${req.params.userId}`);
    const transactions = await Transaction.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    console.log(`[FALLBACK] Found ${transactions.length} transactions`);
    res.json(transactions);
  } catch (error) {
    console.error(`[FALLBACK_ERROR] Transactions fetch failed:`, error);
    res.status(500).json({ error: 'Fallback fetch failed' });
  }
});

export default router;
