import express from 'express';
import { getExchangeRate, getAllAssets, getSymbols, getHistoricalData } from '../services/coinapi';
import { 
  fetchCryptoPrice, 
  fetchMultiplePrices, 
  getCachedPrices, 
  clearCache,
  fetchFromBitQuery,
  fetchMarketCapFromBitQuery,
  fetchStablecoinPrice,
  fetchMultipleFromCoinpaprika
} from '../services/multiCryptoFetcher';

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

  // Fallback prices (always return something)
  const fallbackPrices: Record<string, number> = {
    'BTC': 67000,
    'ETH': 3500,
    'SOL': 145,
    'SUI': 1.8,
    'USDT': 1,
    'USDC': 1,
    'BNB': 580,
    'XRP': 0.52,
    'ADA': 0.45,
    'DOGE': 0.15,
  };

  try {
    console.log(`[MARKET_NODE] Fetching live prices for: ${symbols.join(', ')}`);
    
    // Use multi-source fetcher with timeout
    const prices = await Promise.race([
      fetchMultiplePrices(symbols),
      new Promise<Record<string, any>>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
    ]);
    
    // Convert to simple price map (USD)
    const results: Record<string, number> = {};
    for (const symbol of symbols) {
      if (prices[symbol]) {
        results[symbol] = prices[symbol].price;
      } else if (fallbackPrices[symbol]) {
        results[symbol] = fallbackPrices[symbol];
      }
    }

    res.json(results);
  } catch (error) {
    console.error('[MARKET_NODE_CRITICAL] Global price sync failure, using fallback:', error);
    // Return fallback prices instead of 500 error
    const results: Record<string, number> = {};
    for (const symbol of symbols) {
      results[symbol] = fallbackPrices[symbol] || 0;
    }
    res.json(results);
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
    console.error('[MARKET_NODE_CRITICAL] NGN price sync failure, using fallback:', error);
    // Return fallback prices instead of 500 error
    const simulatedPegs: Record<string, number> = {
      'BTC': 67000 * NGN_RATE,
      'ETH': 3500 * NGN_RATE,
      'SOL': 145 * NGN_RATE,
      'SUI': 1.8 * NGN_RATE,
    };
    
    const results: Record<string, number> = {};
    for (const symbol of symbols) {
      results[symbol] = simulatedPegs[symbol] || 0;
    }
    res.json(results);
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

/**
 * GET /api/market/realtime/:symbol
 * Get real-time 1-second price from BitQuery
 */
router.get('/realtime/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const price = await fetchFromBitQuery(symbol);
    if (price) {
      res.json({
        symbol,
        price: price.price,
        source: 'bitquery-realtime',
        timestamp: price.timestamp,
      });
    } else {
      res.status(404).json({ error: 'Real-time price not available' });
    }
  } catch (error) {
    console.error(`[REALTIME] Failed to fetch ${symbol}:`, error);
    res.status(500).json({ error: 'Failed to fetch real-time price' });
  }
});

/**
 * GET /api/market/stablecoin/:symbol
 * Get stablecoin price from BitQuery (USDT, USDC, DAI, etc.)
 */
router.get('/stablecoin/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const price = await fetchStablecoinPrice(symbol);
    if (price) {
      res.json({
        symbol,
        price: price.price,
        source: 'bitquery-stablecoin',
        timestamp: price.timestamp,
      });
    } else {
      res.status(404).json({ error: 'Stablecoin price not available' });
    }
  } catch (error) {
    console.error(`[STABLECOIN] Failed to fetch ${symbol}:`, error);
    res.status(500).json({ error: 'Failed to fetch stablecoin price' });
  }
});

/**
 * GET /api/market/marketcap/:symbol
 * Get market cap data from BitQuery
 */
router.get('/marketcap/:symbol', async (req, res) => {
  const { symbol } = req.params;
  try {
    const data = await fetchMarketCapFromBitQuery(symbol);
    if (data) {
      res.json({
        symbol,
        price: data.price,
        marketCap: data.marketCap,
        source: 'bitquery',
        timestamp: Date.now(),
      });
    } else {
      res.status(404).json({ error: 'Market cap data not available' });
    }
  } catch (error) {
    console.error(`[MARKETCAP] Failed to fetch ${symbol}:`, error);
    res.status(500).json({ error: 'Failed to fetch market cap data' });
  }
});

/**
 * GET /api/market/batch
 * Batch fetch multiple prices using Coinpaprika (efficient)
 * Query: ?symbols=BTC,ETH,SOL,SUI
 */
router.get('/batch', async (req, res) => {
  let symbolsArg = req.query.symbols;
  let symbols: string[] = [];

  if (Array.isArray(symbolsArg)) {
    symbols = symbolsArg.map(s => String(s));
  } else if (typeof symbolsArg === 'string') {
    symbols = symbolsArg.split(',');
  } else {
    symbols = ['BTC', 'ETH', 'SOL', 'SUI', 'BNB', 'XRP'];
  }

  try {
    const prices = await fetchMultipleFromCoinpaprika(symbols);
    res.json({
      data: prices,
      count: prices.length,
      source: 'coinpaprika-batch',
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[BATCH] Failed to fetch:', error);
    res.status(500).json({ error: 'Failed to batch fetch prices' });
  }
});

/**
 * GET /api/market/sources
 * Get list of available data sources and their status
 */
router.get('/sources', (req, res) => {
  res.json({
    sources: [
      { name: 'CoinGecko', type: 'REST', requiresKey: false, status: 'active' },
      { name: 'Coinpaprika', type: 'REST', requiresKey: false, status: 'active' },
      { name: 'CCXT', type: 'Exchange', requiresKey: false, status: 'active', exchanges: ['Binance', 'Coinbase', 'Kraken'] },
      { name: 'CoinStats', type: 'REST', requiresKey: true, status: process.env.COINSTATS_API_KEY ? 'active' : 'inactive' },
      { name: 'BitQuery', type: 'GraphQL', requiresKey: true, status: process.env.BITQUERY_API_KEY ? 'active' : 'inactive', features: ['1-second streams', 'market cap', 'stablecoins'] },
      { name: 'TwelveData', type: 'REST', requiresKey: true, status: process.env.TWELVEDATA_API_KEY ? 'active' : 'inactive' },
      { name: 'Finnhub', type: 'REST', requiresKey: true, status: process.env.FINNHUB_API_KEY ? 'active' : 'inactive' },
      { name: 'AlphaVantage', type: 'REST', requiresKey: true, status: process.env.ALPHAVANTAGE_API_KEY ? 'active' : 'inactive' },
      { name: 'DexScreener', type: 'REST', requiresKey: false, status: 'active' },
    ],
    cache: {
      ttl: '30 seconds',
      currentSize: Object.keys(getCachedPrices()).length,
    },
  });
});

/**
 * GET /api/market/coingecko/search?query=QUERY
 * Proxy CoinGecko search to avoid CORS issues
 */
router.get('/coingecko/search', async (req, res) => {
  const query = req.query.query as string;
  if (!query) return res.json({ coins: [] });

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[COINGECKO_PROXY] Search error:', error);
    res.json({ coins: [] });
  }
});

/**
 * GET /api/market/coingecko/coin/:id
 * Proxy CoinGecko coin details to avoid CORS issues
 */
router.get('/coingecko/coin/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[COINGECKO_PROXY] Coin details error:', error);
    res.status(500).json({ error: 'Failed to fetch coin details' });
  }
});

/**
 * GET /api/market/coingecko/history/:id
 * Proxy CoinGecko market chart to avoid CORS issues
 */
router.get('/coingecko/history/:id', async (req, res) => {
  const { id } = req.params;
  const days = req.query.days || '7';
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[COINGECKO_PROXY] History error:', error);
    res.json({ prices: [] });
  }
});

export default router;
