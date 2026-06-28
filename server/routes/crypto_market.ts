import express from 'express';
import { z } from 'zod';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { CryptoListing } from '../models/CryptoListing';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const marketLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: { error: 'Crypto Marketplace rate limit exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const listSchema = z.object({
  sellerId: z.string(),
  sellerName: z.string(),
  assetSymbol: z.string(),
  amount: z.number().positive(),
  priceInUSD: z.number().positive(),
});

const purchaseSchema = z.object({
  buyerId: z.string(),
  listingId: z.string(),
});

// Fetch Active Crypto Listings
router.get('/market', async (req, res) => {
  try {
    const listings = await CryptoListing.find({ status: 'OPEN' } as any).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error: any) {
    console.error('[CRYPTO_MARKET] DB error:', error.message);
    res.json([]);
  }
});

// List Crypto for Sale (Locking in Escrow)
router.post('/list', marketLimiter, async (req, res) => {
  try {
    const { sellerId, sellerName, assetSymbol, amount, priceInUSD } = listSchema.parse(req.body);
    
    const listing = new CryptoListing({
      id: `CRY-LST-${uuidv4().substring(0, 6).toUpperCase()}`,
      sellerId,
      sellerName,
      assetSymbol,
      amount,
      priceInUSD,
      rate: priceInUSD / amount,
      status: 'OPEN'
    });

    await listing.save();
    res.json({ success: true, listing });
  } catch (error) {
    res.status(500).json({ error: 'Failed to broadcast crypto node.' });
  }
});

// Purchase Crypto Listing (Escrow)
router.post('/purchase', marketLimiter, async (req, res) => {
  try {
    const { buyerId, listingId } = purchaseSchema.parse(req.body);
    const listing = await CryptoListing.findOne({ id: listingId, status: 'OPEN' } as any);

    if (!listing) return res.status(404).json({ error: 'Listing expired or filled.' });
    if (listing.sellerId === buyerId) return res.status(400).json({ error: 'Self-acquisition blocked.' });

    const buyer = await User.findOne({ supabaseId: buyerId } as any);
    if (!buyer || buyer.balance < listing.priceInUSD) {
      return res.status(400).json({ error: 'Insufficient vault liquidity.' });
    }

    // 1. Debit Buyer
    await User.findOneAndUpdate({ supabaseId: buyerId } as any, { $inc: { balance: -listing.priceInUSD } } as any, { new: true } as any);

    // 2. Create Escrow Node
    const tx = new Transaction({
      id: `OBY-C-ESC-${uuidv4().substring(0, 8).toUpperCase()}`,
      userId: buyerId,
      title: `Escrow: ${listing.amount} ${listing.assetSymbol} Acquisition`,
      category: 'Crypto',
      type: 'Debit',
      amount: listing.priceInUSD,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Escrow',
      brand: listing.assetSymbol
    });
    await tx.save();

    // 3. Update Listing
    listing.status = 'PENDING';
    listing.buyerId = buyerId;
    listing.transactionId = tx.id;
    await listing.save();

    res.json({ success: true, message: 'Institutional escrow established.', transaction: tx });
  } catch (error) {
    res.status(500).json({ error: 'Purchase execution failed.' });
  }
});

export default router;
