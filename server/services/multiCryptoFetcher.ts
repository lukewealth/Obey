import ccxt from 'ccxt';
import axios from 'axios';

// Initialize CCXT exchanges
const exchanges = {
  binance: new ccxt.binance(),
  coinbase: new ccxt.coinbase(),
  kraken: new ccxt.kraken(),
};

// Cache for storing prices (in-memory for now, can be replaced with Redis)
const priceCache: Record<string, { price: number; timestamp: number; source: string }> = {};
const CACHE_TTL = 30000; // 30 seconds

interface CryptoPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
  source: string;
  timestamp: number;
}

/**
 * Fetch price from CoinGecko API
 */
async function fetchFromCoinGecko(symbol: string): Promise<CryptoPrice | null> {
  try {
    const coinGeckoIds: Record<string, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      SOL: 'solana',
      SUI: 'sui',
    };

    const coinId = coinGeckoIds[symbol];
    if (!coinId) return null;

    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`,
      { timeout: 5000 }
    );

    const data = response.data;
    return {
      symbol,
      price: data.market_data.current_price.usd,
      change24h: data.market_data.price_change_percentage_24h,
      volume24h: data.market_data.total_volume.usd,
      marketCap: data.market_data.market_cap.usd,
      source: 'coingecko',
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error(`[CoinGecko] Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch price from CCXT exchanges
 */
async function fetchFromCCXT(symbol: string): Promise<CryptoPrice | null> {
  try {
    const ccxtSymbol = `${symbol}/USDT`;
    
    // Try multiple exchanges in order
    for (const [exchangeName, exchange] of Object.entries(exchanges)) {
      try {
        const ticker = await exchange.fetchTicker(ccxtSymbol);
        if (ticker && ticker.last) {
          return {
            symbol,
            price: ticker.last,
            change24h: ticker.percentage || 0,
            volume24h: ticker.baseVolume || 0,
            source: `ccxt-${exchangeName}`,
            timestamp: Date.now(),
          };
        }
      } catch (err) {
        continue; // Try next exchange
      }
    }
    return null;
  } catch (error) {
    console.error(`[CCXT] Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch price from TwelveData API
 */
async function fetchFromTwelveData(symbol: string): Promise<CryptoPrice | null> {
  try {
    const apiKey = process.env.TWELVEDATA_API_KEY;
    if (!apiKey) return null;

    const response = await axios.get(
      `https://api.twelvedata.com/price?symbol=${symbol}/USD&apikey=${apiKey}`,
      { timeout: 5000 }
    );

    if (response.data && response.data.price) {
      return {
        symbol,
        price: parseFloat(response.data.price),
        change24h: 0, // TwelveData doesn't provide 24h change in this endpoint
        volume24h: 0,
        source: 'twelvedata',
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`[TwelveData] Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch price from Finnhub API
 */
async function fetchFromFinnhub(symbol: string): Promise<CryptoPrice | null> {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) return null;

    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}USD&token=${apiKey}`,
      { timeout: 5000 }
    );

    if (response.data && response.data.c) {
      return {
        symbol,
        price: response.data.c,
        change24h: response.data.dp || 0,
        volume24h: 0,
        source: 'finnhub',
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`[Finnhub] Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch price from AlphaVantage API
 */
async function fetchFromAlphaVantage(symbol: string): Promise<CryptoPrice | null> {
  try {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    if (!apiKey) return null;

    const response = await axios.get(
      `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${apiKey}`,
      { timeout: 5000 }
    );

    const data = response.data['Realtime Currency Exchange Rate'];
    if (data) {
      return {
        symbol,
        price: parseFloat(data['5. Exchange Rate']),
        change24h: 0,
        volume24h: 0,
        source: 'alphavantage',
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`[AlphaVantage] Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch price from CoinStats API
 */
async function fetchFromCoinStats(symbol: string): Promise<CryptoPrice | null> {
  try {
    const apiKey = process.env.COINSTATS_API_KEY;
    if (!apiKey) return null;

    const coinStatsIds: Record<string, string> = {
      BTC: 'bitcoin',
      ETH: 'ethereum',
      SOL: 'solana',
      SUI: 'sui',
    };

    const coinId = coinStatsIds[symbol];
    if (!coinId) return null;

    const response = await axios.get(
      `https://openapiv1.coinstats.app/coins/${coinId}`,
      {
        headers: { 'X-API-KEY': apiKey },
        timeout: 5000,
      }
    );

    if (response.data && response.data.result) {
      const data = response.data.result;
      return {
        symbol,
        price: data.price,
        change24h: data.priceChange1d || 0,
        volume24h: data.volume || 0,
        marketCap: data.marketCap,
        source: 'coinstats',
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`[CoinStats] Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch price from DexScreener API
 */
async function fetchFromDexScreener(symbol: string): Promise<CryptoPrice | null> {
  try {
    const response = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${symbol}`,
      { timeout: 5000 }
    );

    if (response.data && response.data.pairs && response.data.pairs.length > 0) {
      const pair = response.data.pairs[0];
      return {
        symbol,
        price: pair.priceUsd ? parseFloat(pair.priceUsd) : 0,
        change24h: pair.priceChange?.h24 || 0,
        volume24h: pair.volume?.h24 || 0,
        source: 'dexscreener',
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`[DexScreener] Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch price from Coinpaprika API (Free, no API key required)
 * https://api.coinpaprika.com/v1
 */
async function fetchFromCoinpaprika(symbol: string): Promise<CryptoPrice | null> {
  try {
    const coinpaprikaIds: Record<string, string> = {
      BTC: 'btc-bitcoin',
      ETH: 'eth-ethereum',
      SOL: 'sol-solana',
      SUI: 'sui-sui',
      BNB: 'bnb-binance-coin',
      XRP: 'xrp-xrp',
      ADA: 'ada-cardano',
      DOGE: 'doge-dogecoin',
      DOT: 'dot-polkadot',
      MATIC: 'matic-polygon',
    };

    const coinId = coinpaprikaIds[symbol];
    if (!coinId) return null;

    const response = await axios.get(
      `https://api.coinpaprika.com/v1/coins/${coinId}`,
      { timeout: 5000 }
    );

    const data = response.data;
    const quotes = data.quotes?.USD;
    
    if (quotes) {
      return {
        symbol,
        price: quotes.price || 0,
        change24h: quotes.percent_change_24h || 0,
        volume24h: quotes.volume_24h || 0,
        marketCap: quotes.market_cap || 0,
        source: 'coinpaprika',
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`[Coinpaprika] Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch multiple coins from Coinpaprika in a single request
 * More efficient for fetching multiple assets
 */
async function fetchMultipleFromCoinpaprika(symbols: string[]): Promise<CryptoPrice[]> {
  try {
    const response = await axios.get(
      'https://api.coinpaprika.com/v1/tickers',
      { timeout: 10000 }
    );

    const coinpaprikaIds: Record<string, string> = {
      BTC: 'btc-bitcoin',
      ETH: 'eth-ethereum',
      SOL: 'sol-solana',
      SUI: 'sui-sui',
      BNB: 'bnb-binance-coin',
      XRP: 'xrp-xrp',
      ADA: 'ada-cardano',
      DOGE: 'doge-dogecoin',
      DOT: 'dot-polkadot',
      MATIC: 'matic-polygon',
    };

    const results: CryptoPrice[] = [];
    const tickers = response.data;

    for (const symbol of symbols) {
      const coinId = coinpaprikaIds[symbol];
      if (!coinId) continue;

      const ticker = tickers.find((t: any) => t.id === coinId);
      if (ticker && ticker.quotes?.USD) {
        const quotes = ticker.quotes.USD;
        results.push({
          symbol,
          price: quotes.price || 0,
          change24h: quotes.percent_change_24h || 0,
          volume24h: quotes.volume_24h || 0,
          marketCap: quotes.market_cap || 0,
          source: 'coinpaprika',
          timestamp: Date.now(),
        });
      }
    }

    return results;
  } catch (error) {
    console.error(`[Coinpaprika] Failed to fetch multiple:`, error.message);
    return [];
  }
}

/**
 * Fetch real-time price from BitQuery GraphQL API
 * https://docs.bitquery.io/
 * Provides 1-second price streams for crypto assets
 */
async function fetchFromBitQuery(symbol: string): Promise<CryptoPrice | null> {
  try {
    const apiKey = process.env.BITQUERY_API_KEY;
    if (!apiKey) {
      console.warn('[BitQuery] API key not configured');
      return null;
    }

    // GraphQL query for 1-second price stream
    const query = `
      query GetCryptoPrice($symbol: String!) {
        ethereum(network: ethereum) {
          dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: $symbol}
          ) {
            tradeAmount
            price
            priceUSD
            block {
              timestamp
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://streaming.bitquery.io/graphql',
      {
        query,
        variables: { symbol },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
        },
        timeout: 10000,
      }
    );

    const trades = response.data?.data?.ethereum?.dexTrades;
    if (trades && trades.length > 0) {
      const latestTrade = trades[0];
      return {
        symbol,
        price: latestTrade.priceUSD || latestTrade.price || 0,
        change24h: 0, // BitQuery provides raw price, calculate change separately
        volume24h: 0,
        source: 'bitquery',
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`[BitQuery] Failed to fetch ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch market cap and price from BitQuery
 * Based on: https://ide.bitquery.io/1-second-crypto-price-stream-with-mcap
 */
async function fetchMarketCapFromBitQuery(symbol: string): Promise<{ price: number; marketCap: number } | null> {
  try {
    const apiKey = process.env.BITQUERY_API_KEY;
    if (!apiKey) return null;

    const query = `
      query GetMarketCap($symbol: String!) {
        ethereum(network: ethereum) {
          dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: $symbol}
          ) {
            priceUSD
            tradeAmount
            block {
              timestamp
            }
          }
        }
        # Get circulating supply from token info
        ethereum(network: ethereum) {
          tokenTransfers(
            options: {desc: ["block.height"], limit: 1}
            currency: {is: $symbol}
          ) {
            currency {
              address
              name
              symbol
              decimals
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://streaming.bitquery.io/graphql',
      {
        query,
        variables: { symbol },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
        },
        timeout: 10000,
      }
    );

    const trades = response.data?.data?.ethereum?.dexTrades;
    if (trades && trades.length > 0) {
      return {
        price: trades[0].priceUSD || 0,
        marketCap: 0, // Would need additional calculation with supply
      };
    }
    return null;
  } catch (error) {
    console.error(`[BitQuery] Failed to fetch market cap for ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch stablecoin prices from BitQuery
 * Based on: https://ide.bitquery.io/stablecoin-1-second-price-stream
 */
async function fetchStablecoinPrice(symbol: string): Promise<CryptoPrice | null> {
  try {
    const apiKey = process.env.BITQUERY_API_KEY;
    if (!apiKey) return null;

    const stablecoins = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD'];
    if (!stablecoins.includes(symbol)) return null;

    const query = `
      query GetStablecoinPrice($symbol: String!) {
        ethereum(network: ethereum) {
          dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: $symbol}
            quoteCurrency: {is: "USD"}
          ) {
            price
            priceUSD
            tradeAmount
            block {
              timestamp
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://streaming.bitquery.io/graphql',
      {
        query,
        variables: { symbol },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey,
        },
        timeout: 10000,
      }
    );

    const trades = response.data?.data?.ethereum?.dexTrades;
    if (trades && trades.length > 0) {
      return {
        symbol,
        price: trades[0].priceUSD || trades[0].price || 1, // Stablecoins should be ~$1
        change24h: 0,
        volume24h: 0,
        source: 'bitquery-stablecoin',
        timestamp: Date.now(),
      };
    }
    return null;
  } catch (error) {
    console.error(`[BitQuery] Failed to fetch stablecoin ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Multi-source price fetcher with fallback strategy
 * Tries multiple sources in order of reliability
 */
export async function fetchCryptoPrice(symbol: string): Promise<CryptoPrice | null> {
  // Check cache first
  const cached = priceCache[symbol];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      symbol,
      price: cached.price,
      change24h: 0,
      volume24h: 0,
      source: cached.source,
      timestamp: cached.timestamp,
    };
  }

  // Try sources in order of reliability
  const sources = [
    fetchFromCoinGecko,
    fetchFromCoinpaprika, // NEW: Free, no API key required
    fetchFromCCXT,
    fetchFromCoinStats,
    fetchFromBitQuery, // NEW: 1-second price streams
    fetchFromTwelveData,
    fetchFromFinnhub,
    fetchFromAlphaVantage,
    fetchFromDexScreener,
  ];

  for (const fetcher of sources) {
    try {
      const result = await fetcher(symbol);
      if (result && result.price > 0) {
        // Update cache
        priceCache[symbol] = {
          price: result.price,
          timestamp: result.timestamp,
          source: result.source,
        };
        return result;
      }
    } catch (error) {
      continue; // Try next source
    }
  }

  // Fallback to simulated prices if all sources fail
  console.warn(`[MultiFetcher] All sources failed for ${symbol}, using fallback`);
  const fallbackPrices: Record<string, number> = {
    BTC: 67000,
    ETH: 3500,
    SOL: 145,
    SUI: 1.8,
  };

  if (fallbackPrices[symbol]) {
    return {
      symbol,
      price: fallbackPrices[symbol],
      change24h: 0,
      volume24h: 0,
      source: 'fallback',
      timestamp: Date.now(),
    };
  }

  return null;
}

/**
 * Fetch multiple crypto prices in parallel
 * Uses Coinpaprika batch endpoint for efficiency when available
 */
export async function fetchMultiplePrices(symbols: string[]): Promise<Record<string, CryptoPrice>> {
  const results: Record<string, CryptoPrice> = {};
  
  // Try Coinpaprika batch fetch first (most efficient)
  try {
    const coinpaprikaResults = await fetchMultipleFromCoinpaprika(symbols);
    for (const result of coinpaprikaResults) {
      results[result.symbol] = result;
      priceCache[result.symbol] = {
        price: result.price,
        timestamp: result.timestamp,
        source: result.source,
      };
    }
  } catch (error) {
    console.error('[MultiFetcher] Coinpaprika batch fetch failed:', error);
  }

  // Fetch remaining symbols individually
  const remainingSymbols = symbols.filter(s => !results[s]);
  
  await Promise.all(
    remainingSymbols.map(async (symbol) => {
      const price = await fetchCryptoPrice(symbol);
      if (price) {
        results[symbol] = price;
      }
    })
  );

  return results;
}

/**
 * Get cached prices (for quick access)
 */
export function getCachedPrices(): Record<string, { price: number; timestamp: number; source: string }> {
  return { ...priceCache };
}

/**
 * Clear cache
 */
export function clearCache(): void {
  Object.keys(priceCache).forEach(key => delete priceCache[key]);
}

// Export BitQuery functions for direct access
export { fetchFromBitQuery, fetchMarketCapFromBitQuery, fetchStablecoinPrice, fetchMultipleFromCoinpaprika };
