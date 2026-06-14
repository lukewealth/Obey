import express from 'express';
import { getExchangeRate, getAllAssets } from '../services/coinapi';

const router = express.Router();

// Cache prices to avoid hitting CoinAPI limits too fast
let priceCache: Record<string, { price: number, timestamp: number }> = {};
let assetsCache: { data: any[], timestamp: number } | null = null;

const PRICE_TTL = 1000 * 60 * 5; // 5 minutes
const ASSETS_TTL = 1000 * 60 * 60 * 24; // 24 hours (Asset list doesn't change often)

// Get Top Assets (Filtered for UI performance)
router.get('/assets', async (req, res) => {
  try {
    if (assetsCache && (Date.now() - assetsCache.timestamp < ASSETS_TTL)) {
      return res.json(assetsCache.data);
    }

    const allAssets = await getAllAssets();
    // Filter for assets with a price and notable popularity (example filter)
    const topAssets = allAssets
      .filter((a: any) => a.price_usd && a.volume_1day_usd > 1000000)
      .slice(0, 100); // Return top 100 for prototype fidelity

    assetsCache = { data: topAssets, timestamp: Date.now() };
    res.json(topAssets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch global asset mesh.' });
  }
});

router.get('/prices', async (req, res) => {
  const symbols = (req.query.symbols as string || 'BTC,ETH,SOL,SUI').split(',');
  const results: Record<string, number> = {};

  try {
    for (const symbol of symbols) {
      const cached = priceCache[symbol];
      if (cached && (Date.now() - cached.timestamp < PRICE_TTL)) {
        results[symbol] = cached.price;
      } else {
        const data = await getExchangeRate(symbol, 'USD');
        if (data && data.rate) {
          results[symbol] = data.rate;
          priceCache[symbol] = { price: data.rate, timestamp: Date.now() };
        } else if (cached) {
          results[symbol] = cached.price;
        }
      }
    }
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to synchronize live price nodes.' });
  }
});

export default router;
