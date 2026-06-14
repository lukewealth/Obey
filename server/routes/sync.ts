import express from 'express';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import * as interswitch from '../services/interswitch';

const router = express.Router();

/**
 * Enhanced Sync Node: Handles cross-state management between Supabase, MongoDB, and local cookies.
 */
router.post('/user', async (req, res) => {
  try {
    const { supabaseId, email, name, role, phone, avatar, kycStatus, kycLevel, balance, promoCode, twoFactorEnabled } = req.body;
    
    // 1. Synchronize with MongoDB Atlas Node
    const user = await User.findOneAndUpdate(
      { $or: [{ supabaseId }, { email }] }, // Link by ID or Email
      { 
        supabaseId, name, email, role, phone, avatar, kycStatus, kycLevel, balance, promoCode, twoFactorEnabled,
        lastSync: new Date()
      },
      { upsert: true, new: true }
    );

    // 2. Set Tracking Cookies for Hybrid Load Optimization
    res.cookie('obey_user_email', email, { maxAge: 900000, httpOnly: true, secure: true, sameSite: 'none' });
    res.cookie('obey_user_id', supabaseId, { maxAge: 900000, httpOnly: true, secure: true, sameSite: 'none' });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Sync user error:', error);
    res.status(500).json({ error: 'Failed to synchronize ecosystem nodes' });
  }
});

/**
 * Identity Verification Node (Interswitch Mesh)
 */
router.post('/verify-kyc', async (req, res) => {
  try {
    const { userId, idType, idNumber, livenessScore } = req.body;
    
    // 1. Validate against Interswitch Identity Node
    const kycResult = await interswitch.validateIdentity({
      userId,
      idType,
      idNumber,
      livenessScore: livenessScore || 0.95
    });

    if (kycResult.responseCode === "00") {
      // 2. Update User Node Level
      const user = await User.findOneAndUpdate(
        { $or: [{ supabaseId: userId }, { email: userId }] },
        { 
          kycStatus: "Verified",
          kycLevel: kycResult.kycLevel || 2,
          lastSync: new Date()
        },
        { new: true }
      );

      res.json({ 
        success: true, 
        message: "Identity Node Settled", 
        kycLevel: user?.kycLevel,
        auditId: kycResult.auditId 
      });
    } else {
      res.status(400).json({ error: "Identity validation failed", details: kycResult.message });
    }
  } catch (error) {
    console.error('KYC Verification Error:', error);
    res.status(500).json({ error: "Internal compliance failure" });
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
router.get('/user/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    console.log(`[FALLBACK] Fetching user: ${identifier}`);
    
    // Look up by Supabase ID, MongoDB ID, or Email
    const user = await User.findOne({ 
      $or: [
        { supabaseId: identifier }, 
        { email: identifier },
        { _id: identifier.length === 24 ? identifier : undefined }
      ].filter(Boolean) as any
    });

    if (!user) {
      console.warn(`[FALLBACK_WARN] User not found: ${identifier}`);
      return res.status(404).json({ error: 'User not found in ecosystem depth' });
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
