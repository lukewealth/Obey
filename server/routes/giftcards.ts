import express from 'express';
import { z } from 'zod';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { GiftCardListing } from '../models/GiftCardListing';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Secure Rate Limit: 10 marketplace actions per 5 minutes
const marketLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { error: 'Marketplace rate limit exceeded. Please wait before next operation.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input Validation Schemas
const listSchema = z.object({
  sellerId: z.string(),
  sellerName: z.string(),
  assetName: z.string(),
  faceValue: z.number().positive(),
  price: z.number().positive(),
  claimCode: z.string().optional(),
});

const purchaseSchema = z.object({
  buyerId: z.string(),
  listingId: z.string(),
});

// --- P2P Marketplace Endpoints ---

// Browse Active Listings
router.get('/market', async (req, res) => {
  try {
    const listings = await GiftCardListing.find({ status: 'OPEN' }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace nodes.' });
  }
});

// Create a Listing
router.post('/list', marketLimiter, async (req, res) => {
  try {
    const data = listSchema.parse(req.body);
    const listing = new GiftCardListing({
      id: `LST-${uuidv4().substring(0, 6).toUpperCase()}`,
      ...data,
      status: 'OPEN'
    });
    await listing.save();
    res.json({ success: true, listing });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Invalid listing data.', details: error.issues });
    res.status(500).json({ error: 'Listing terminal failure.' });
  }
});

// Purchase a Listing (Escrow)
router.post('/purchase', marketLimiter, async (req, res) => {
  try {
    const { buyerId, listingId } = purchaseSchema.parse(req.body);
    const listing = await GiftCardListing.findOne({ id: listingId, status: 'OPEN' });

    if (!listing) return res.status(404).json({ error: 'Listing no longer available.' });
    if (listing.sellerId === buyerId) return res.status(400).json({ error: 'Cannot purchase your own asset node.' });

    const buyer = await User.findOne({ supabaseId: buyerId });
    if (!buyer || buyer.balance < listing.price) {
      return res.status(400).json({ error: 'Insufficient vault reserves for this acquisition.' });
    }

    // 1. Lock Funds from Buyer
    await User.findOneAndUpdate({ supabaseId: buyerId }, { $inc: { balance: -listing.price } });

    // 2. Create Escrow Transaction
    const tx = new Transaction({
      id: `OBY-ESC-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: buyerId,
      title: `Escrow: ${listing.assetName} Purchase`,
      category: 'GiftCard',
      type: 'Debit',
      amount: listing.price,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Escrow',
      brand: listing.assetName
    });
    await tx.save();

    // 3. Update Listing Status
    listing.status = 'PENDING';
    listing.buyerId = buyerId;
    listing.transactionId = tx.id;
    await listing.save();

    res.json({ 
      success: true, 
      message: 'Funds locked in high-fidelity escrow. Awaiting node verification.',
      transaction: tx 
    });
  } catch (error) {
    if (error instanceof z.ZodError) return res.status(400).json({ error: 'Invalid purchase request.' });
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase execution failed.' });
  }
});

// --- Legacy/Centralized Trade Endpoints ---

// Existing trade schema for compatibility
const tradeSchema = z.object({
  userId: z.string(),
  type: z.enum(['BUY', 'SELL']),
  assetName: z.string(),
  faceValue: z.number().positive(),
  totalAmount: z.number().positive(),
  claimCode: z.string().nullable().optional(),
});

router.post('/trade', async (req, res) => {
  try {
    const { userId, type, assetName, faceValue, totalAmount, claimCode } = tradeSchema.parse(req.body);
    
    if (type === 'BUY') {
      const user = await User.findOne({ supabaseId: userId });
      if (!user || user.balance < totalAmount) return res.status(400).json({ error: 'Insufficient liquidity.' });
      await User.findOneAndUpdate({ supabaseId: userId }, { $inc: { balance: -totalAmount } });
    }

    const tx = new Transaction({
      id: `OBY-GC-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId,
      title: `${type === 'BUY' ? 'Acquired' : 'Liquidated'} ${assetName} Card`,
      category: 'GiftCard',
      type: type === 'BUY' ? 'Debit' : 'Credit',
      amount: totalAmount,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: type === 'SELL' ? 'Awaiting Audit' : 'Processing',
      assetName,
      faceValue,
      claimCode
    });
    await tx.save();

    res.json({ success: true, transaction: tx });
  } catch (error) {
    res.status(500).json({ error: 'Trade terminal failure.' });
  }
});

// Admin Control: Release/Reject Escrow (Updated for P2P)
router.post('/admin/settle', async (req, res) => {
  try {
    const { txId, action } = req.body;
    const tx = await Transaction.findOne({ id: txId });
    if (!tx) return res.status(404).json({ error: 'Transaction node not found.' });

    if (action === 'RELEASE') {
      tx.status = 'Success';
      await tx.save();

      // Find associated listing if P2P
      const listing = await GiftCardListing.findOne({ transactionId: txId });
      if (listing) {
        listing.status = 'COMPLETED';
        await listing.save();
        // Credit the seller
        await User.findOneAndUpdate({ supabaseId: listing.sellerId }, { $inc: { balance: listing.price } });
      } else if (tx.type === 'Credit') {
        // Centralized SELL: credit the user
        await User.findOneAndUpdate({ supabaseId: tx.userId }, { $inc: { balance: tx.amount } });
      }
    } else if (action === 'REJECT') {
      tx.status = 'Failed';
      await tx.save();

      const listing = await GiftCardListing.findOne({ transactionId: txId });
      if (listing) {
        listing.status = 'OPEN'; // Return to market
        listing.buyerId = undefined;
        listing.transactionId = undefined;
        await listing.save();
        // Refund the buyer
        await User.findOneAndUpdate({ supabaseId: tx.userId }, { $inc: { balance: tx.amount } });
      } else if (tx.type === 'Debit') {
        // Centralized BUY: refund the user
        await User.findOneAndUpdate({ supabaseId: tx.userId }, { $inc: { balance: tx.amount } });
      }
    }

    res.json({ success: true, status: tx.status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to settle escrow node.' });
  }
});

export default router;
