import express from 'express';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get current rates (Mocked for now, could be dynamic from a provider)
router.get('/rates', (req, res) => {
  res.json([
    { id: "itunes", brand: "Apple", region: "Global", buyRate: 1480, sellRate: 1520, trend: "+2.4%", logoUrl: "A" },
    { id: "amazon", brand: "Amazon", region: "USA/UK", buyRate: 1350, sellRate: 1420, trend: "+1.8%", logoUrl: "Z" },
    { id: "steam", brand: "Steam", region: "Global", buyRate: 1515, sellRate: 1560, trend: "-0.5%", logoUrl: "S" },
    { id: "google", brand: "Google Play", region: "Global", buyRate: 1530, sellRate: 1585, trend: "+3.1%", logoUrl: "G" },
  ]);
});

// Process Buy/Sell
router.post('/trade', async (req, res) => {
  try {
    const { userId, type, brand, amount, totalAmount, details } = req.body;

    // 1. Create Transaction Record
    const tx = new Transaction({
      id: uuidv4(),
      userId,
      title: `${type === 'buy' ? 'Purchased' : 'Sold'} ${brand} Gift Card`,
      category: 'GiftCard',
      type: type === 'buy' ? 'Debit' : 'Credit',
      amount: totalAmount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Success',
      brand: brand
    });

    await tx.save();

    // 2. Update User Balance in MongoDB (Sync with Supabase happens in frontend)
    await User.findOneAndUpdate(
      { supabaseId: userId },
      { $inc: { balance: type === 'buy' ? -totalAmount : totalAmount } }
    );

    res.json({ success: true, transaction: tx });
  } catch (error) {
    console.error('Gift card trade error:', error);
    res.status(500).json({ error: 'Failed to process trade' });
  }
});

export default router;
