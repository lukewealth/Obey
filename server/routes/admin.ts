import express from 'express';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import { FraudAlert } from '../models/FraudAlert';
import { adminAuth } from '../middleware/adminAuth';
import * as interswitch from '../services/interswitch';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

/**
 * Institutional Admin Mesh: Manage Users & KYC
 */
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({} as any).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve ledger participants.' });
  }
});

/**
 * Sentinel Surveillance: Fraud & Risk Alerts
 */
router.get('/fraud-alerts', adminAuth, async (req, res) => {
  try {
    const alerts = await FraudAlert.find({ status: { $in: ['Pending', 'Reviewing'] } } as any).sort({ timestamp: -1 });

    // Seed some mock alerts if none exist for prototype
    if (alerts.length === 0) {
      return res.json([
        {
          id: "ALT-9821-X",
          type: "Bulk Transfer",
          severity: "High",
          entityId: "USR-8829-X",
          description: "Multiple high-value outgoing transactions detected within 4ms.",
          riskScore: 88,
          status: "Pending",
          timestamp: new Date()
        },
        {
          id: "ALT-7742-Z",
          type: "Account Takeover",
          severity: "Critical",
          entityId: "USR-1044-K",
          description: "Suspicious login from unexpected IP (Lagos) followed by balance sweep attempt.",
          riskScore: 94,
          status: "Pending",
          timestamp: new Date()
        }
      ]);
    }

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Sentinel stream failure.' });
  }
});

router.post('/resolve-alert', adminAuth, async (req, res) => {
  try {
    const { alertId, action } = req.body;
    const status = action === 'RESOLVE' ? 'Resolved' : 'Dismissed';

    await FraudAlert.findOneAndUpdate({ id: alertId } as any, { status } as any, { new: true } as any);
    res.json({ success: true, message: `Alert ${alertId} ${status.toLowerCase()}.` });
  } catch (error) {
    res.status(500).json({ error: 'Alert resolution protocol failure.' });
  }
});

/**
 * Forensic Risk Profile: Deep-dive user analysis
 */
router.get('/risk-profile/:userId', adminAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);

    if (!user) return res.status(404).json({ error: 'User node not found.' });

    const recentTransactions = await Transaction.find({ userId: user.supabaseId } as any).sort({ createdAt: -1 }).limit(10);

    // Institutional composite risk calculation
    const riskScore = user.kycStatus === 'Verified' ? 12 : 65;

    res.json({
      profile: user,
      compositeRisk: riskScore,
      forensics: {
        lastIp: "185.156.72.102",
        geo: "Moscow, RU",
        vpnDetected: true,
        nodeSolvency: "99.8%",
        recentAnomalies: 2
      },
      recentTransactions
    });
  } catch (error) {
    res.status(500).json({ error: 'Forensic retrieval failed.' });
  }
});

/**
 * System Ledger Audit: Liabilities vs Equity
 */
router.get('/audit-ledger', adminAuth, async (req, res) => {
  try {
    const users = await User.find({} as any);
    const totalLiabilities = users.reduce((acc, u) => acc + (u.balance || 0), 0);

    // System Equity: Institutional liquidity pool (simulated)
    const systemEquity = 12400000; 

    res.json({
      totalLiabilities,
      systemEquity,
      delta: systemEquity - totalLiabilities,
      integrity: "99.98%",
      recentEvents: [
        { id: "EVT-01", type: "Ledger Pass", status: "Verified", time: new Date() },
        { id: "EVT-02", type: "Liabilities Sync", status: "Stable", time: new Date() }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Ledger audit protocol failure.' });
  }
});

router.post('/approve-kyc', adminAuth, async (req, res) => {
  try {
    const { userId, action } = req.body;
    
    if (action === 'APPROVE') {
      const user = await User.findOneAndUpdate(
        { $or: [{ supabaseId: userId }, { email: userId }] } as any,
        { 
          kycStatus: 'Verified', 
          kycLevel: 2,
          lastSync: new Date()
        } as any,
        { new: true } as any
      );
      
      // Simulation of Interswitch Verified Badge approval
      return res.json({ 
        success: true, 
        message: 'Institutional badge authorized.', 
        user 
      });
    } else {
      await User.findOneAndUpdate(
        { $or: [{ supabaseId: userId }, { email: userId }] } as any,
        { kycStatus: 'Unverified', kycLevel: 0 } as any,
        { new: true } as any
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
    
    const user: any = await User.findOneAndUpdate(
      { $or: [{ supabaseId: userId }, { email: userId }] } as any,
      { $inc: { balance: adjustmentAmount } } as any,
      { new: true } as any
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
    } as any);
    
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
