import express from 'express';
import { getExchangeRate, getAllAssets, getSymbols, getHistoricalData } from '../services/coinapi';

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
      .filter((a: any) => a.price_usd && (a.volume_1day_usd > 1000000 || a.type_is_crypto === 1))
      .sort((a: any, b: any) => b.volume_1day_usd - a.volume_1day_usd);

    assetsCache = { data: topAssets, timestamp: Date.now() };
    res.json(topAssets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch global asset mesh.' });
  }
});

// Search Assets
router.get('/search', async (req, res) => {
  const query = (req.query.q as string || '').toUpperCase();
  if (!query) return res.json([]);

  try {
    let allAssets = assetsCache?.data;
    if (!allAssets) {
      allAssets = await getAllAssets();
      assetsCache = { data: allAssets, timestamp: Date.now() };
    }

    const results = allAssets.filter((a: any) => 
      a.asset_id.includes(query) || (a.name && a.name.toUpperCase().includes(query))
    ).slice(0, 20);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search synchronization failure.' });
  }
});

router.get('/prices', async (req, res) => {
  let symbolsArg = req.query.symbols;
  let symbols: string[] = [];

  if (Array.isArray(symbolsArg)) {
    symbols = symbolsArg.map(s => String(s));
  } else if (typeof symbolsArg === 'string') {
    symbols = symbolsArg.split(',');
  } else {
    symbols = ['BTC', 'ETH', 'SOL', 'SUI'];
  }

  const results: Record<string, number> = {};

  try {
    console.log(`[MARKET_NODE] Synchronizing prices for: ${symbols.join(', ')}`);
    
    // Parallelize price fetching to respect Vercel's 10s execution limit
    await Promise.all(symbols.map(async (symbol) => {
      const cached = priceCache[symbol];
      if (cached && (Date.now() - cached.timestamp < PRICE_TTL)) {
        results[symbol] = cached.price;
      } else {
        try {
          const data = await getExchangeRate(symbol, 'USD');
          if (data && data.rate) {
            results[symbol] = data.rate;
            priceCache[symbol] = { price: data.rate, timestamp: Date.now() };
          } else if (cached) {
            // Fallback to expired cache if we can't get new data
            results[symbol] = cached.price;
          }
        } catch (e) {
          console.error(`[MARKET_NODE] Individual symbol sync failed: ${symbol}`, e);
          if (cached) results[symbol] = cached.price;
        }
      }
    }));
    
    // Institutional Pegs: Final safety layer for prototype stability
    const simulatedPegs: Record<string, number> = {
      'BTC': 95000000 / 1600,
      'ETH': 5000000 / 1600,
      'SOL': 250000 / 1600,
      'SUI': 5000 / 1600,
      'USDT': 1,
      'NGN': 1/1600
    };

    for (const symbol of symbols) {
      if (!(symbol in results) && simulatedPegs[symbol]) {
        results[symbol] = simulatedPegs[symbol];
      }
    }

    res.json(results);
  } catch (error) {
    console.error('[MARKET_NODE_CRITICAL] Global price sync failure:', error);
    res.status(500).json({ error: 'Failed to synchronize live price nodes.' });
  }
});

// Get Metadata and Historical Data for a specific symbol
router.get('/details/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    let rateData: any = null;
    let history: any[] = [];

    try {
      rateData = await getExchangeRate(symbol, 'USD');
    } catch (e) {
      console.error(`[DETAILS] Rate fetch failed for ${symbol}:`, e);
    }

    try {
      history = await getHistoricalData(symbol);
    } catch (e) {
      console.error(`[DETAILS] History fetch failed for ${symbol}:`, e);
    }

    const price = rateData?.rate || 0;
    const updatedAt = rateData?.time || new Date().toISOString();

    res.json({
      symbol,
      price,
      history: Array.isArray(history) ? history : [],
      updatedAt
    });
  } catch (error) {
    console.error(`[DETAILS_CRITICAL] Failed to fetch details for ${symbol}:`, error);
    res.json({
      symbol,
      price: 0,
      history: [],
      updatedAt: new Date().toISOString()
    });
  }
});

export default router;
