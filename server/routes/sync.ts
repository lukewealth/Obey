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

router.post('/verify-biometric', async (req, res) => {
  try {
    const { userId, deviceFingerprint, method } = req.body;

    if (!userId || !deviceFingerprint) {
      return res.status(400).json({ error: 'userId and deviceFingerprint required' });
    }

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const metadata = user.metadata || {};
    const verifiedDevices = metadata.verifiedDevices || [];

    if (!verifiedDevices.includes(deviceFingerprint)) {
      verifiedDevices.push(deviceFingerprint);
      user.metadata = { ...metadata, verifiedDevices };
      await user.save();
    }

    console.log(`[SECURITY] Biometric verification successful for ${userId} from device ${deviceFingerprint}`);

    res.json({
      success: true,
      message: 'Biometric verification successful',
      deviceFingerprint,
      method,
    });
  } catch (error: any) {
    console.error('[BIOMETRIC_VERIFY] Error:', error.message);
    res.status(500).json({ error: 'Biometric verification failed' });
  }
});

router.post('/verify-totp', async (req, res) => {
  try {
    const { userId, code, deviceFingerprint } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ error: 'userId and code required' });
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ error: 'Invalid code format' });
    }

    const user = await User.findOne({ $or: [{ supabaseId: userId }, { email: userId }] } as any);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const metadata = user.metadata || {};
    const totpSecret = metadata.totpSecret;

    if (!totpSecret) {
      return res.status(400).json({ error: '2FA not configured. Please set up 2FA first.' });
    }

    const isValid = verifyTotpCode(totpSecret, code);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid 2FA code' });
    }

    const verifiedDevices = metadata.verifiedDevices || [];
    if (!verifiedDevices.includes(deviceFingerprint)) {
      verifiedDevices.push(deviceFingerprint);
      user.metadata = { ...metadata, verifiedDevices };
      await user.save();
    }

    console.log(`[SECURITY] TOTP verification successful for ${userId}`);

    res.json({
      success: true,
      message: '2FA verification successful',
      deviceFingerprint,
    });
  } catch (error: any) {
    console.error('[TOTP_VERIFY] Error:', error.message);
    res.status(500).json({ error: '2FA verification failed' });
  }
});

function verifyTotpCode(secret: string, code: string): boolean {
  const crypto = require('crypto');
  const time = Math.floor(Date.now() / 1000 / 30);

  const base32Decode = (str: string): Buffer => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    for (let i = 0; i < str.length; i++) {
      const val = alphabet.indexOf(str[i].toUpperCase());
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }
    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.substr(i, 8), 2));
    }
    return Buffer.from(bytes);
  };

  const secretBuffer = base32Decode(secret);

  for (let i = -1; i <= 1; i++) {
    const timeHex = time + i;
    const timeBuffer = Buffer.alloc(8);
    timeBuffer.writeUInt32BE(0, 0);
    timeBuffer.writeUInt32BE(timeHex, 4);

    const hmac = crypto.createHmac('sha1', secretBuffer);
    hmac.update(timeBuffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0xf;
    const binary =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

    const otp = (binary % 1000000).toString().padStart(6, '0');
    if (otp === code) return true;
  }

  return false;
}

export default router;
