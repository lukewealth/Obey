import express, { Request, Response } from 'express';
import { z } from 'zod';
import { Transaction } from '../models/Transaction';
import { User } from '../models/User';
import { RewardsService } from '../services/rewards';
import { fetchCryptoPrice, fetchMultiplePrices } from '../services/multiCryptoFetcher';
import { v4 as uuidv4 } from 'uuid';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const tradeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Trade rate limit exceeded. Please wait.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const tradeSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  symbol: z.string().min(1, 'symbol is required'),
  type: z.enum(['buy', 'sell']),
  fiatAmount: z.number().positive('fiatAmount must be positive'),
});

const COINGECKO_IDS: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  SUI: 'sui',
  BNB: 'binancecoin',
  XRP: 'ripple',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  UNI: 'uniswap',
  ATOM: 'cosmos',
  LTC: 'litecoin',
  NEAR: 'near',
  APT: 'aptos',
  ARB: 'arbitrum',
  OP: 'optimism',
  FIL: 'filecoin',
  USDC: 'usd-coin',
  USDT: 'tether',
  DAI: 'dai',
  SHIB: 'shiba-inu',
  PEPE: 'pepe',
  WIF: 'dogwifcoin',
  BONK: 'bonk',
  TRX: 'tron',
  TON: 'the-open-network',
  XLM: 'stellar',
};

const SYMBOL_NAMES: Record<string, string> = {
  BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana', SUI: 'Sui',
  BNB: 'BNB', XRP: 'XRP', ADA: 'Cardano', DOGE: 'Dogecoin',
  DOT: 'Polkadot', AVAX: 'Avalanche', MATIC: 'Polygon', LINK: 'Chainlink',
  UNI: 'Uniswap', ATOM: 'Cosmos', LTC: 'Litecoin', NEAR: 'NEAR Protocol',
  APT: 'Aptos', ARB: 'Arbitrum', OP: 'Optimism', FIL: 'Filecoin',
  USDC: 'USD Coin', USDT: 'Tether', DAI: 'Dai', SHIB: 'Shiba Inu',
  PEPE: 'Pepe', WIF: 'dogwifcoin', BONK: 'Bonk', TRX: 'Tron',
  TON: 'Toncoin', XLM: 'Stellar',
};

const TRADING_FEE_PERCENT = 0.5;
const PLATFORM_FEE_PERCENT = 0.25;
const NGN_PEG = 1600;

function getCoinGeckoId(symbol: string): string {
  return COINGECKO_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
}

function getSymbolName(symbol: string): string {
  return SYMBOL_NAMES[symbol.toUpperCase()] || symbol.toUpperCase();
}

/**
 * GET /api/crypto-trade/price/:symbol
 * Get live price for a symbol with full metadata
 */
router.get('/price/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const upperSymbol = symbol.toUpperCase();

    const priceData = await fetchCryptoPrice(upperSymbol);

    if (!priceData || priceData.price <= 0) {
      return res.status(404).json({
        error: 'Price not available',
        symbol: upperSymbol,
      });
    }

    const priceNGN = priceData.price * NGN_PEG;
    const feePercent = TRADING_FEE_PERCENT;
    const platformFeePercent = PLATFORM_FEE_PERCENT;

    res.json({
      symbol: upperSymbol,
      name: getSymbolName(upperSymbol),
      coingeckoId: getCoinGeckoId(upperSymbol),
      priceUSD: priceData.price,
      priceNGN,
      change24h: priceData.change24h || 0,
      volume24h: priceData.volume24h || 0,
      marketCap: priceData.marketCap || 0,
      source: priceData.source,
      timestamp: priceData.timestamp,
      fees: {
        tradingFeePercent: feePercent,
        platformFeePercent: platformFeePercent,
        totalFeePercent: feePercent + platformFeePercent,
      },
      updatedAt: new Date(priceData.timestamp).toISOString(),
    });
  } catch (error: any) {
    console.error('[CRYPTO_TRADE] Price fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

/**
 * POST /api/crypto-trade/execute
 * Execute a buy or sell trade with live pricing
 */
router.post('/execute', tradeLimiter, async (req: Request, res: Response) => {
  try {
    const validation = tradeSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid trade parameters',
        details: validation.error.flatten().fieldErrors,
      });
    }

    const { userId, symbol, type, fiatAmount } = validation.data;
    const upperSymbol = symbol.toUpperCase();

    // 1. Fetch live price
    const priceData = await fetchCryptoPrice(upperSymbol);
    if (!priceData || priceData.price <= 0) {
      return res.status(400).json({ error: 'Live price unavailable for ' + upperSymbol });
    }

    const priceUSD = priceData.price;
    const priceNGN = priceUSD * NGN_PEG;

    // 2. Calculate fees
    const tradingFee = fiatAmount * (TRADING_FEE_PERCENT / 100);
    const platformFee = fiatAmount * (PLATFORM_FEE_PERCENT / 100);
    const totalFee = tradingFee + platformFee;
    const netAmount = type === 'buy' ? fiatAmount - totalFee : fiatAmount;
    const cryptoAmount = netAmount / priceUSD;

    // 3. Find user
    const user = await User.findOne({
      $or: [{ supabaseId: userId }, { email: userId }],
    } as any);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 4. Validate balance
    if (type === 'buy' && user.balance < fiatAmount) {
      return res.status(400).json({
        error: 'Insufficient balance',
        available: user.balance,
        required: fiatAmount,
      });
    }

    // 5. Execute trade
    const txId = `CRY-${uuidv4().substring(0, 8).toUpperCase()}`;
    const txType = type === 'buy' ? 'Debit' : 'Credit';
    const txCategory = 'Crypto' as const;

    // Update user balance
    const balanceChange = type === 'buy' ? -fiatAmount : fiatAmount;
    user.balance = (user.balance || 0) + balanceChange;
    await user.save();

    // Create transaction record
    const tx = new Transaction({
      id: txId,
      userId: user.supabaseId,
      title: `${type === 'buy' ? 'Buy' : 'Sell'} ${upperSymbol} (${getSymbolName(upperSymbol)})`,
      category: txCategory,
      type: txType,
      amount: fiatAmount,
      fee: totalFee,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      status: 'Success',
      brand: upperSymbol,
      network: 'Crypto',
      paymentMethod: type === 'buy' ? 'wallet' : 'crypto',
      requestReference: `OBY-${txId}`,
    });
    await tx.save();

    // 6. Process rewards
    let rewardsResult = null;
    try {
      rewardsResult = await RewardsService.processReward({
        userId: user.supabaseId,
        type: 'TRANSACTION',
        amount: fiatAmount,
        reference: txId,
        metadata: {
          tradeType: type,
          symbol: upperSymbol,
          cryptoAmount,
          priceUSD,
        },
      });
    } catch (rewardErr) {
      console.warn('[CRYPTO_TRADE] Reward processing failed:', rewardErr);
    }

    // 7. Track admin earnings (platform fee)
    try {
      const adminTx = new Transaction({
        id: `ADM-${uuidv4().substring(0, 8).toUpperCase()}`,
        userId: 'system',
        title: `Platform Fee: ${upperSymbol} ${type}`,
        category: 'System',
        type: 'Credit',
        amount: platformFee,
        fee: 0,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        status: 'Success',
        brand: 'OBEY',
        network: 'Platform',
      });
      await adminTx.save();
    } catch (adminErr) {
      console.warn('[CRYPTO_TRADE] Admin earnings tracking failed:', adminErr);
    }

    res.json({
      success: true,
      transaction: {
        id: txId,
        type,
        symbol: upperSymbol,
        name: getSymbolName(upperSymbol),
        fiatAmount,
        cryptoAmount: parseFloat(cryptoAmount.toFixed(8)),
        priceUSD,
        priceNGN,
        fees: {
          tradingFee: parseFloat(tradingFee.toFixed(2)),
          platformFee: parseFloat(platformFee.toFixed(2)),
          totalFee: parseFloat(totalFee.toFixed(2)),
        },
        netAmount: parseFloat(netAmount.toFixed(2)),
        status: 'Success',
        timestamp: new Date().toISOString(),
      },
      userBalance: user.balance,
      rewards: rewardsResult ? {
        pointsEarned: rewardsResult.pointsEarned,
        newBalance: rewardsResult.newBalance,
        level: rewardsResult.level,
        tier: rewardsResult.tier,
      } : null,
    });
  } catch (error: any) {
    console.error('[CRYPTO_TRADE] Execution error:', error.message);
    res.status(500).json({
      error: 'Trade execution failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal error',
    });
  }
});

/**
 * GET /api/crypto-trade/symbols
 * Get list of all supported symbols with metadata
 */
router.get('/symbols', async (req: Request, res: Response) => {
  try {
    const symbols = Object.keys(COINGECKO_IDS).map((symbol) => ({
      symbol,
      name: getSymbolName(symbol),
      coingeckoId: getCoinGeckoId(symbol),
    }));

    res.json({ symbols, count: symbols.length });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch symbols' });
  }
});

/**
 * GET /api/crypto-trade/admin-earnings
 * Get admin earnings summary (platform fees collected)
 */
router.get('/admin-earnings', async (req: Request, res: Response) => {
  try {
    const adminTransactions = await Transaction.find({
      userId: 'system',
      category: 'System',
      type: 'Credit',
    } as any).sort({ createdAt: -1 }).limit(100);

    const totalEarnings = adminTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const today = new Date().toLocaleDateString();
    const todayEarnings = adminTransactions
      .filter((tx) => tx.date === today)
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    res.json({
      totalEarnings: parseFloat(totalEarnings.toFixed(2)),
      todayEarnings: parseFloat(todayEarnings.toFixed(2)),
      transactionCount: adminTransactions.length,
      recentTransactions: adminTransactions.slice(0, 10),
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch admin earnings' });
  }
});

export default router;
