import express from 'express';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { adminAuth } from '../middleware/adminAuth';
import * as interswitch from '../services/interswitch';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * Institutional Admin Mesh: Manage Users & KYC
 */
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ledger participants.' });
  }
});

router.post('/approve-kyc', adminAuth, async (req, res) => {
  try {
    const { userId, action } = req.body;
    
    if (action === 'APPROVE') {
      const user = await User.findOneAndUpdate(
        { $or: [{ supabaseId: userId }, { email: userId }] },
        { 
          kycStatus: 'Verified', 
          kycLevel: 2,
          lastSync: new Date()
        },
        { new: true }
      );
      
      // Simulation of Interswitch Verified Badge approval
      return res.json({ 
        success: true, 
        message: 'Institutional badge authorized.', 
        user 
      });
    } else {
      await User.findOneAndUpdate(
        { $or: [{ supabaseId: userId }, { email: userId }] },
        { kycStatus: 'Unverified', kycLevel: 0 }
      );
      return res.json({ success: true, message: 'Identity node rejected.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'KYC approval protocol failure.' });
  }
});

/**
 * OBEY to OBEY Wallet Credit Management
 * Direct adjustment of internal credit tokens.
 */
router.post('/adjust-balance', adminAuth, async (req, res) => {
  try {
    const { userId, amount, type, reason } = req.body;
    
    if (!userId || !amount || !['ADD', 'SUB'].includes(type)) {
      return res.status(400).json({ error: 'Invalid adjustment parameters.' });
    }

    const adjustmentAmount = type === 'ADD' ? amount : -amount;
    
    const user = await User.findOneAndUpdate(
      { $or: [{ supabaseId: userId }, { email: userId }] },
      { $inc: { balance: adjustmentAmount } },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User node not found.' });

    // Create Audit Transaction
    const auditTx = new Transaction({
      id: `OBY-ADM-ADJ-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: user.supabaseId,
      title: `Admin Adjustment: ${reason || 'Institutional Balancing'}`,
      category: 'System',
      type: type === 'ADD' ? 'Credit' : 'Debit',
      amount: amount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Completed',
      brand: 'OBEY'
    });
    await auditTx.save();

    res.json({ 
      success: true, 
      message: 'Institutional ledger adjusted.', 
      newBalance: user.balance,
      auditId: auditTx.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Balance adjustment protocol failure.' });
  }
});

/**
 * Push Notification Mesh (Simulated)
 */
router.post('/push-notification', adminAuth, async (req, res) => {
  try {
    const { title, message, target } = req.body;
    console.log(`[PUSH_MESH] Dispatched: ${title} to ${target}`);
    // In a real app, integrate with FCM or OneSignal here
    res.json({ success: true, message: 'Broadcast signal dispatched across mesh.' });
  } catch (error) {
    res.status(500).json({ error: 'Broadcast failure.' });
  }
});

/**
 * Escrow Vault & Service Management
 */
router.get('/vault-metrics', adminAuth, async (req, res) => {
  try {
    const escrowTransactions = await Transaction.find({ 
      status: { $in: ['Escrow', 'Processing', 'Awaiting Audit'] } 
    });
    
    const totalLocked = escrowTransactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);
    
    res.json({
      lockedReserves: totalLocked,
      activeNodes: escrowTransactions.length,
      escrowTransactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync vault metrics.' });
  }
});

export default router;
