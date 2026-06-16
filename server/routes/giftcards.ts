import express from 'express';
import { z } from 'zod';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { GiftCardListing } from '../models/GiftCardListing';
import { CryptoListing } from '../models/CryptoListing';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const marketLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: { error: 'Marketplace rate limit exceeded.' },
  standardHeaders: true,
  legacyHeaders: false,
});

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

router.get('/market', async (req, res) => {
  try {
    const listings = await GiftCardListing.find({ status: 'OPEN' } as any).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marketplace nodes.' });
  }
});

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
    res.status(500).json({ error: 'Listing terminal failure.' });
  }
});

router.post('/purchase', marketLimiter, async (req, res) => {
  try {
    const { buyerId, listingId } = purchaseSchema.parse(req.body);
    const listing = await GiftCardListing.findOne({ id: listingId, status: 'OPEN' } as any);

    if (!listing) return res.status(404).json({ error: 'Listing no longer available.' });
    if (listing.sellerId === buyerId) return res.status(400).json({ error: 'Cannot purchase your own asset node.' });

    const buyer = await User.findOne({ supabaseId: buyerId } as any);
    if (!buyer || buyer.balance < listing.price) {
      return res.status(400).json({ error: 'Insufficient vault reserves.' });
    }

    await User.findOneAndUpdate({ supabaseId: buyerId } as any, { $inc: { balance: -listing.price } } as any, { new: true } as any);

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

    listing.status = 'PENDING';
    listing.buyerId = buyerId;
    listing.transactionId = tx.id;
    await listing.save();

    res.json({ success: true, transaction: tx });
  } catch (error) {
    res.status(500).json({ error: 'Purchase execution failed.' });
  }
});

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
      const user = await User.findOne({ supabaseId: userId } as any);
      if (!user || user.balance < totalAmount) return res.status(400).json({ error: 'Insufficient liquidity.' });
      await User.findOneAndUpdate({ supabaseId: userId } as any, { $inc: { balance: -totalAmount } } as any, { new: true } as any);
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

router.post('/admin/settle', async (req, res) => {
  try {
    const { txId, action } = req.body;
    const tx = await Transaction.findOne({ id: txId } as any);
    if (!tx) return res.status(404).json({ error: 'Transaction node not found.' });

    if (action === 'RELEASE') {
      tx.status = 'Success';
      await tx.save();

      const listing = await GiftCardListing.findOne({ transactionId: txId } as any);
      if (listing) {
        listing.status = 'COMPLETED';
        await listing.save();
        await User.findOneAndUpdate({ supabaseId: listing.sellerId } as any, { $inc: { balance: listing.price } } as any, { new: true } as any);
      } else {
        const cryptoListing = await CryptoListing.findOne({ transactionId: txId } as any);
        if (cryptoListing) {
          cryptoListing.status = 'COMPLETED';
          await cryptoListing.save();
          await User.findOneAndUpdate({ supabaseId: cryptoListing.sellerId } as any, { $inc: { balance: cryptoListing.priceInUSD } } as any, { new: true } as any);
        } else if (tx.type === 'Credit') {
           await User.findOneAndUpdate({ supabaseId: tx.userId } as any, { $inc: { balance: tx.amount } } as any, { new: true } as any);
        }
      }
    } else if (action === 'REJECT') {
      tx.status = 'Failed';
      await tx.save();

      const listing = await GiftCardListing.findOne({ transactionId: txId } as any);
      if (listing) {
        listing.status = 'OPEN';
        listing.buyerId = undefined;
        listing.transactionId = undefined;
        await listing.save();
        await User.findOneAndUpdate({ supabaseId: tx.userId } as any, { $inc: { balance: tx.amount } } as any, { new: true } as any);
      } else {
        const cryptoListing = await CryptoListing.findOne({ transactionId: txId } as any);
        if (cryptoListing) {
          cryptoListing.status = 'OPEN';
          cryptoListing.buyerId = undefined;
          cryptoListing.transactionId = undefined;
          await cryptoListing.save();
          await User.findOneAndUpdate({ supabaseId: tx.userId } as any, { $inc: { balance: tx.amount } } as any, { new: true } as any);
        } else if (tx.type === 'Debit') {
           await User.findOneAndUpdate({ supabaseId: tx.userId } as any, { $inc: { balance: tx.amount } } as any, { new: true } as any);
        }
      }
    }

    res.json({ success: true, status: tx.status });
  } catch (error) {
    res.status(500).json({ error: 'Failed to settle escrow node.' });
  }
});

export default router;
