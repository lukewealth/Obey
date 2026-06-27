import express from 'express';
import { User } from '../models/User';
import { Transaction } from '../models/Transaction';
import * as interswitch from '../services/interswitch';
import { syncUserNode } from '../mesh/id_user';
import { saveTransactionNode } from '../mesh/save';
import { syncCryptoAsset } from '../mesh/crypto';
import { syncMetadataNode } from '../mesh/metadatabse';

const router = express.Router();

/**
 * Enhanced Sync Node: Handles cross-state management between Supabase, MongoDB, and local cookies.
 */
router.post('/user', async (req, res) => {
  try {
    const { supabaseId, email, name, phone, kycStatus, kycLevel, balance, promoCode, twoFactorEnabled } = req.body;

    if (!supabaseId && !email) {
      return res.status(400).json({ error: 'Missing required sync parameters.' });
    }

    const updatePayload: any = { supabaseId, email };
    if (name !== undefined) updatePayload.name = name;
    if (phone !== undefined) updatePayload.phone = phone;
    if (kycStatus !== undefined) updatePayload.kycStatus = kycStatus;
    if (kycLevel !== undefined) updatePayload.kycLevel = kycLevel;
    if (balance !== undefined) updatePayload.balance = balance;
    if (promoCode !== undefined) updatePayload.promoCode = promoCode;
    if (twoFactorEnabled !== undefined) updatePayload.twoFactorEnabled = twoFactorEnabled;

    const user = await syncUserNode(updatePayload);

    if (user) {
      res.cookie('obey_user_email', user.email || '', { maxAge: 900000, httpOnly: true, secure: true, sameSite: 'none' });
      res.cookie('obey_user_id', user.supabaseId || '', { maxAge: 900000, httpOnly: true, secure: true, sameSite: 'none' });
    }

    res.json({ success: true, user });
  } catch (error: any) {
    console.error('[SYNC_ERROR]', error.message);
    res.status(500).json({ error: 'Failed to synchronize ecosystem nodes' });
  }
});

/**
 * Metadata Sync Node: Captures institutional metadata and aligns with user profile.
 */
router.post('/metadata', async (req, res) => {
  try {
    const { userId, metadata } = req.body;
    
    if (!userId || !metadata) {
      return res.status(400).json({ error: 'Missing userId or metadata payload' });
    }

    const result = await syncMetadataNode(userId, metadata);
    res.json({ success: true, node: result });
  } catch (error) {
    res.status(500).json({ error: 'Metadata node synchronization failed' });
  }
});

/**
 * Identity Verification Node (Interswitch Mesh)
 */
router.post('/verify-kyc', async (req, res) => {
  try {
    const { userId, idType, idNumber, livenessScore } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId for KYC verification" });
    }

    const kycResult = await interswitch.validateIdentity({
      userId,
      idType,
      idNumber,
      livenessScore: livenessScore || 0.95
    });

    if (kycResult.responseCode === "00") {
      const user = await syncUserNode({
        supabaseId: userId,
        kycStatus: "Verified",
        kycLevel: kycResult.kycLevel || 2
      });

      res.json({
        success: true,
        message: "Identity Node Settled",
        kycLevel: user?.kycLevel || kycResult.kycLevel || 2,
        kycStatus: "Verified",
        auditId: kycResult.auditId
      });
    } else {
      res.status(400).json({ error: "Identity validation failed", details: kycResult.message });
    }
  } catch (error: any) {
    console.error('KYC Verification Error:', error.message);
    res.status(500).json({ error: "Internal compliance failure" });
  }
});

// Sync transactions
router.post('/transactions', async (req, res) => {
  try {
    const { userId, transactions } = req.body;
    
    if (!userId || !Array.isArray(transactions)) {
      return res.status(400).json({ error: 'Missing userId or invalid transactions array' });
    }

    const syncResults = await Promise.all(transactions.map(async (tx: any) => {
      // Use Mesh Save Node for real-time transaction synchronization
      return saveTransactionNode({ ...tx, userId });
    }));

    res.json({ success: true, count: syncResults.length });
  } catch (error: any) {
    console.error('Sync transactions error:', error.message);
    res.status(500).json({ error: 'Failed to sync transactions' });
  }
});

/**
 * Real-Time Asset Data Node: Triggers CoinAPI pull and Mesh alignment.
 */
router.get('/asset-sync/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const assetData = await syncCryptoAsset(symbol);
    res.json(assetData);
  } catch (error) {
    res.status(500).json({ error: 'Asset synchronization failed' });
  }
});

// Fallback: Get data from MongoDB if Supabase fails
router.get('/user/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    console.log(`[FALLBACK] Fetching user: ${identifier}`);
    
    // Construct a safe query mesh
    const query: any = {
      $or: [
        { supabaseId: identifier }, 
        { email: identifier }
      ]
    };

    // Only add _id search if it's a valid MongoDB ObjectId (24 char hex)
    if (identifier && identifier.length === 24 && /^[0-9a-fA-F]{24}$/.test(identifier)) {
      query.$or.push({ _id: identifier });
    }

    const user = await User.findOne(query);

    if (!user) {
      console.warn(`[FALLBACK_WARN] User not found: ${identifier}`);
      return res.status(404).json({ error: 'User not found in ecosystem depth' });
    }
    res.json(user);
  } catch (error: any) {
    console.error(`[FALLBACK_ERROR] User fetch failed for ${req.params.identifier}:`, error.message);
    res.status(500).json({ 
      error: 'Fallback fetch failed', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

router.get('/transactions/:userId', async (req, res) => {
  try {
    console.log(`[FALLBACK] Fetching transactions for: ${req.params.userId}`);
    const transactions = await Transaction.find({ userId: req.params.userId } as any).sort({ createdAt: -1 });
    console.log(`[FALLBACK] Found ${transactions.length} transactions`);
    res.json(transactions);
  } catch (error) {
    console.error(`[FALLBACK_ERROR] Transactions fetch failed:`, error);
    res.status(500).json({ error: 'Fallback fetch failed' });
  }
});

export default router;
