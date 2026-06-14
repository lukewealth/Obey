import express from 'express';
import { getExchangeRate } from '../services/coinapi';

const router = express.Router();

// Cache prices to avoid hitting CoinAPI limits too fast (Free tier is limited)
let priceCache: Record<string, { price: number, timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

router.get('/prices', async (req, res) => {
  const assets = ['BTC', 'ETH', 'SOL', 'SUI'];
  const results: Record<string, number> = {};

  try {
    for (const asset of assets) {
      const cached = priceCache[asset];
      if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        results[asset] = cached.price;
      } else {
        const data = await getExchangeRate(asset, 'USD');
        if (data && data.rate) {
          results[asset] = data.rate;
          priceCache[asset] = { price: data.rate, timestamp: Date.now() };
        } else {
          // Fallback to last known price if API fails
          results[asset] = cached ? cached.price : 0;
        }
      }
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data node.' });
  }
});

export default router;
