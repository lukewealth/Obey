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

    // GraphQL query for latest price across multiple chains
    const query = `
      query GetLatestPrice($symbol: String!) {
        ethereum(network: ethereum) {
          dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: $symbol}
          ) {
            price
            priceUSD
            tradeAmount
            block {
              timestamp
            }
          }
        }
        bsc(network: bsc) {
          dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: $symbol}
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
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      }
    );

    // Try Ethereum first, then BSC
    const ethTrades = response.data?.data?.ethereum?.dexTrades;
    const bscTrades = response.data?.data?.bsc?.dexTrades;
    
    const latestTrade = ethTrades?.[0] || bscTrades?.[0];
    
    if (latestTrade) {
      return {
        symbol,
        price: latestTrade.priceUSD || latestTrade.price || 0,
        change24h: 0,
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
 * Fetch market cap and supply from BitQuery BSC
 * Based on: https://ide.bitquery.io/Total-Supply-and-onchain-Marketcap-of-a-specific-token-bsc_1
 */
async function fetchMarketCapFromBitQuery(symbol: string): Promise<{ price: number; marketCap: number; supply: number } | null> {
  try {
    const apiKey = process.env.BITQUERY_API_KEY;
    if (!apiKey) return null;

    // Map common symbols to BSC contract addresses
    const bscContracts: Record<string, string> = {
      BTC: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      ETH: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      USDT: '0x55d398326f99059ff775485246999027b3197955',
      USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      BNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      SOL: '0x570a5d26f7765ecb712c0924e4de545b89dd4325',
    };

    const contractAddress = bscContracts[symbol];
    
    // For native tokens like BNB, use a different query
    if (symbol === 'BNB') {
      const query = `
        query GetBNBMarketData {
          bsc(network: bsc) {
            dexTrades(
              options: {desc: ["block.height", "transaction.index"], limit: 1}
              baseCurrency: {is: "BNB"}
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
        { query },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 10000,
        }
      );

      const trades = response.data?.data?.bsc?.dexTrades;
      if (trades && trades.length > 0) {
        return {
          price: trades[0].priceUSD || trades[0].price || 0,
          marketCap: 0,
          supply: 0,
        };
      }
      return null;
    }

    if (!contractAddress) return null;

    // Query for token supply and market cap on BSC
    const query = `
      query GetTokenMarketData($address: String!) {
        bsc(network: bsc) {
          dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: $address}
          ) {
            price
            priceUSD
            tradeAmount
            block {
              timestamp
            }
          }
        }
        bsc(network: bsc) {
          tokenTransfers(
            options: {desc: "block.height", limit: 1}
            currency: {is: $address}
          ) {
            currency {
              address
              name
              symbol
              decimals
              totalSupply
            }
          }
        }
      }
    `;

    const response = await axios.post(
      'https://streaming.bitquery.io/graphql',
      {
        query,
        variables: { address: contractAddress },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      }
    );

    const trades = response.data?.data?.bsc?.dexTrades;
    const transfers = response.data?.data?.bsc?.tokenTransfers;
    
    const price = trades?.[0]?.priceUSD || trades?.[0]?.price || 0;
    const totalSupply = transfers?.[0]?.currency?.totalSupply || 0;
    const decimals = transfers?.[0]?.currency?.decimals || 18;
    
    // Calculate market cap: price * circulating supply
    const supply = totalSupply / Math.pow(10, decimals);
    const marketCap = price * supply;

    return {
      price,
      marketCap,
      supply,
    };
  } catch (error) {
    console.error(`[BitQuery] Failed to fetch market cap for ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch wallet balance from BitQuery
 * Based on: https://ide.bitquery.io/balance-of-a-wallet_1
 */
async function fetchWalletBalance(address: string, symbol?: string): Promise<{ balance: number; balanceUSD: number } | null> {
  try {
    const apiKey = process.env.BITQUERY_API_KEY;
    if (!apiKey) return null;

    if (symbol) {
      // Fetch specific token balance
      const bscContracts: Record<string, string> = {
        BTC: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
        ETH: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
        USDT: '0x55d398326f99059ff775485246999027b3197955',
        USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      };

      const contractAddress = bscContracts[symbol];
      if (!contractAddress) return null;

      const query = `
        query GetTokenBalance($address: String!, $tokenAddress: String!) {
          bsc(network: bsc) {
            balance: balanceUpdates(
              options: {desc: "block.height", limit: 1}
              address: {is: $address}
              currency: {is: $tokenAddress}
            ) {
              balance
              currency {
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
          variables: { address, tokenAddress: contractAddress },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 10000,
        }
      );

      const balanceData = response.data?.data?.bsc?.balance?.[0];
      if (balanceData) {
        const decimals = balanceData.currency?.decimals || 18;
        const balance = balanceData.balance / Math.pow(10, decimals);
        return { balance, balanceUSD: 0 };
      }
    } else {
      // Fetch native BNB balance
      const query = `
        query GetNativeBalance($address: String!) {
          bsc(network: bsc) {
            balance: balanceUpdates(
              options: {desc: "block.height", limit: 1}
              address: {is: $address}
              currency: {is: "BNB"}
            ) {
              balance
            }
          }
        }
      `;

      const response = await axios.post(
        'https://streaming.bitquery.io/graphql',
        {
          query,
          variables: { address },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 10000,
        }
      );

      const balanceData = response.data?.data?.bsc?.balance?.[0];
      if (balanceData) {
        const balance = balanceData.balance / 1e18; // BNB has 18 decimals
        return { balance, balanceUSD: 0 };
      }
    }
    return null;
  } catch (error) {
    console.error(`[BitQuery] Failed to fetch wallet balance:`, error.message);
    return null;
  }
}

/**
 * Fetch 1-minute price change from BitQuery
 * Based on: https://ide.bitquery.io/1-minute-price-change-api_1
 */
async function fetchPriceChange(symbol: string, minutes: number = 1): Promise<{ currentPrice: number; previousPrice: number; change: number; changePercent: number } | null> {
  try {
    const apiKey = process.env.BITQUERY_API_KEY;
    if (!apiKey) return null;

    const timeAgo = new Date(Date.now() - minutes * 60 * 1000).toISOString();

    const query = `
      query GetPriceChange($symbol: String!, $timeAgo: ISO8601DateTime) {
        ethereum(network: ethereum) {
          currentPrice: dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: $symbol}
          ) {
            priceUSD
            block {
              timestamp
            }
          }
          previousPrice: dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: $symbol}
            time: {since: $timeAgo}
          ) {
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
        variables: { symbol, timeAgo },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      }
    );

    const currentPriceData = response.data?.data?.ethereum?.currentPrice?.[0];
    const previousPriceData = response.data?.data?.ethereum?.previousPrice?.[0];

    if (currentPriceData && previousPriceData) {
      const currentPrice = currentPriceData.priceUSD || 0;
      const previousPrice = previousPriceData.priceUSD || currentPrice;
      const change = currentPrice - previousPrice;
      const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;

      return {
        currentPrice,
        previousPrice,
        change,
        changePercent,
      };
    }
    return null;
  } catch (error) {
    console.error(`[BitQuery] Failed to fetch price change for ${symbol}:`, error.message);
    return null;
  }
}

/**
 * Fetch Bitcoin price across multiple chains
 * Based on: https://ide.bitquery.io/Latest-bitcoin-price-on-across-chains_5
 */
async function fetchBitcoinPriceAcrossChains(): Promise<{ chain: string; price: number; timestamp: string }[]> {
  try {
    const apiKey = process.env.BITQUERY_API_KEY;
    if (!apiKey) return [];

    const query = `
      query GetBitcoinPriceAcrossChains {
        ethereum(network: ethereum) {
          dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: "BTC"}
          ) {
            priceUSD
            block {
              timestamp
            }
          }
        }
        bsc(network: bsc) {
          dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: "BTC"}
          ) {
            priceUSD
            block {
              timestamp
            }
          }
        }
        polygon(network: polygon) {
          dexTrades(
            options: {desc: ["block.height", "transaction.index"], limit: 1}
            baseCurrency: {is: "BTC"}
          ) {
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
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      }
    );

    const results: { chain: string; price: number; timestamp: string }[] = [];

    const chains = ['ethereum', 'bsc', 'polygon'];
    for (const chain of chains) {
      const trades = response.data?.data?.[chain]?.dexTrades;
      if (trades && trades.length > 0) {
        results.push({
          chain,
          price: trades[0].priceUSD || 0,
          timestamp: trades[0].block?.timestamp || new Date().toISOString(),
        });
      }
    }

    return results;
  } catch (error) {
    console.error(`[BitQuery] Failed to fetch Bitcoin price across chains:`, error.message);
    return [];
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
          Authorization: `Bearer ${apiKey}`,
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
export { 
  fetchFromBitQuery, 
  fetchMarketCapFromBitQuery, 
  fetchStablecoinPrice, 
  fetchMultipleFromCoinpaprika,
  fetchWalletBalance,
  fetchPriceChange,
  fetchBitcoinPriceAcrossChains
};
