import express from 'express';
import { getExchangeRate, getAllAssets, getSymbols, getHistoricalData } from '../services/coinapi';
import { fetchCryptoPrice, fetchMultiplePrices, getCachedPrices, clearCache } from '../services/multiCryptoFetcher';

const router = express.Router();

// Cache for assets
let assetsCache: { data: any[], timestamp: number } | null = null;
const ASSETS_TTL = 1000 * 60 * 60 * 24; // 24 hours

// NGN conversion rate (approximate)
const NGN_RATE = 1600;

/**
 * GET /api/market/assets
 * Get top crypto assets with metadata
 */
router.get('/assets', async (req, res) => {
  try {
    if (assetsCache && (Date.now() - assetsCache.timestamp < ASSETS_TTL)) {
      return res.json(assetsCache.data);
    }

    const allAssets = await getAllAssets();
    const topAssets = allAssets
      .filter((a: any) => a.price_usd && (a.volume_1day_usd > 1000000 || a.type_is_crypto === 1))
      .sort((a: any, b: any) => b.volume_1day_usd - a.volume_1day_usd);

    assetsCache = { data: topAssets, timestamp: Date.now() };
    res.json(topAssets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch global asset mesh.' });
  }
});

/**
 * GET /api/market/search?q=QUERY
 * Search for crypto assets
 */
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

/**
 * GET /api/market/prices?symbols=BTC,ETH,SOL,SUI
 * Get live prices for multiple symbols using multi-source fetcher
 */
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

  try {
    console.log(`[MARKET_NODE] Fetching live prices for: ${symbols.join(', ')}`);
    
    // Use multi-source fetcher
    const prices = await fetchMultiplePrices(symbols);
    
    // Convert to simple price map (USD)
    const results: Record<string, number> = {};
    for (const symbol of symbols) {
      if (prices[symbol]) {
        results[symbol] = prices[symbol].price;
      }
    }

    // Fallback to simulated prices if any are missing
    const simulatedPegs: Record<string, number> = {
      'BTC': 67000,
      'ETH': 3500,
      'SOL': 145,
      'SUI': 1.8,
      'USDT': 1,
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

/**
 * GET /api/market/prices-ngn?symbols=BTC,ETH,SOL,SUI
 * Get live prices in NGN
 */
router.get('/prices-ngn', async (req, res) => {
  let symbolsArg = req.query.symbols;
  let symbols: string[] = [];

  if (Array.isArray(symbolsArg)) {
    symbols = symbolsArg.map(s => String(s));
  } else if (typeof symbolsArg === 'string') {
    symbols = symbolsArg.split(',');
  } else {
    symbols = ['BTC', 'ETH', 'SOL', 'SUI'];
  }

  try {
    const prices = await fetchMultiplePrices(symbols);
    
    const results: Record<string, number> = {};
    for (const symbol of symbols) {
      if (prices[symbol]) {
        results[symbol] = prices[symbol].price * NGN_RATE;
      }
    }

    // Fallback
    const simulatedPegs: Record<string, number> = {
      'BTC': 67000 * NGN_RATE,
      'ETH': 3500 * NGN_RATE,
      'SOL': 145 * NGN_RATE,
      'SUI': 1.8 * NGN_RATE,
    };

    for (const symbol of symbols) {
      if (!(symbol in results) && simulatedPegs[symbol]) {
        results[symbol] = simulatedPegs[symbol];
      }
    }

    res.json(results);
  } catch (error) {
    console.error('[MARKET_NODE_CRITICAL] NGN price sync failure:', error);
    res.status(500).json({ error: 'Failed to synchronize live price nodes.' });
  }
});

/**
 * GET /api/market/details/:symbol
 * Get detailed info for a specific symbol including live price
 */
router.get('/details/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    // Fetch live price from multi-source
    const livePrice = await fetchCryptoPrice(symbol);
    
    // Fetch historical data
    let history: any[] = [];
    try {
      history = await getHistoricalData(symbol);
    } catch (e) {
      console.error(`[DETAILS] History fetch failed for ${symbol}:`, e);
    }

    const price = livePrice?.price || 0;
    const change24h = livePrice?.change24h || 0;
    const volume24h = livePrice?.volume24h || 0;
    const source = livePrice?.source || 'unknown';
    const updatedAt = new Date(livePrice?.timestamp || Date.now()).toISOString();

    res.json({
      symbol,
      price,
      priceNGN: price * NGN_RATE,
      change24h,
      volume24h,
      source,
      history: Array.isArray(history) ? history : [],
      updatedAt
    });
  } catch (error) {
    console.error(`[DETAILS_CRITICAL] Failed to fetch details for ${symbol}:`, error);
    res.json({
      symbol,
      price: 0,
      priceNGN: 0,
      change24h: 0,
      volume24h: 0,
      source: 'error',
      history: [],
      updatedAt: new Date().toISOString()
    });
  }
});

/**
 * GET /api/market/cache
 * Get current cache state (for debugging)
 */
router.get('/cache', (req, res) => {
  const cache = getCachedPrices();
  res.json({
    cachedSymbols: Object.keys(cache),
    cacheAge: Object.fromEntries(
      Object.entries(cache).map(([symbol, data]) => [
        symbol,
        {
          price: data.price,
          source: data.source,
          age: Date.now() - data.timestamp,
        }
      ])
    ),
  });
});

/**
 * POST /api/market/cache/clear
 * Clear the price cache
 */
router.post('/cache/clear', (req, res) => {
  clearCache();
  res.json({ success: true, message: 'Cache cleared' });
});

export default router;
