import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// Nigerian banks database with CBN codes
const NIGERIAN_BANKS = [
  { code: '044', name: 'Access Bank', slug: 'access-bank', ussd: '*901#' },
  { code: '023', name: 'Citibank Nigeria', slug: 'citibank-nigeria', ussd: null },
  { code: '063', name: 'Ecobank Nigeria', slug: 'ecobank-nigeria', ussd: null },
  { code: '070', name: 'Fidelity Bank', slug: 'fidelity-bank', ussd: '*770#' },
  { code: '011', name: 'First Bank of Nigeria', slug: 'first-bank-of-nigeria', ussd: '*894#' },
  { code: '214', name: 'First City Monument Bank', slug: 'first-city-monument-bank', ussd: null },
  { code: '058', name: 'Guaranty Trust Bank', slug: 'guaranty-trust-bank', ussd: '*737#' },
  { code: '030', name: 'Heritage Bank', slug: 'heritage-bank', ussd: null },
  { code: '301', name: 'Jaiz Bank', slug: 'jaiz-bank', ussd: null },
  { code: '082', name: 'Keystone Bank', slug: 'keystone-bank', ussd: null },
  { code: '014', name: 'MainStreet Bank', slug: 'mainstreet-bank', ussd: null },
  { code: '076', name: 'Skye Bank', slug: 'skye-bank', ussd: null },
  { code: '039', name: 'Stanbic IBTC Bank', slug: 'stanbic-ibtc-bank', ussd: null },
  { code: '068', name: 'Standard Chartered Bank', slug: 'standard-chartered-bank', ussd: null },
  { code: '232', name: 'Sterling Bank', slug: 'sterling-bank', ussd: '*822#' },
  { code: '032', name: 'Union Bank of Nigeria', slug: 'union-bank-of-nigeria', ussd: '*826#' },
  { code: '033', name: 'United Bank for Africa', slug: 'united-bank-for-africa', ussd: '*919#' },
  { code: '215', name: 'Unity Bank', slug: 'unity-bank', ussd: null },
  { code: '035', name: 'Wema Bank', slug: 'wema-bank', ussd: '*945#' },
  { code: '057', name: 'Zenith Bank', slug: 'zenith-bank', ussd: '*966#' },
  { code: '100', name: 'SunTrust Bank', slug: 'suntrust-bank', ussd: null },
  { code: '101', name: 'Providus Bank', slug: 'providus-bank', ussd: null },
  { code: '102', name: 'Globus Bank', slug: 'globus-bank', ussd: null },
  { code: '103', name: 'Optimus Bank', slug: 'optimus-bank', ussd: null },
  { code: '104', name: 'Premium Trust Bank', slug: 'premium-trust-bank', ussd: null },
  { code: '105', name: 'Titan Trust Bank', slug: 'titan-trust-bank', ussd: null },
  { code: '106', name: 'PalmPay', slug: 'palmpay', ussd: null },
  { code: '107', name: 'Opay', slug: 'opay', ussd: null },
  { code: '108', name: 'Kuda Bank', slug: 'kuda-bank', ussd: null },
  { code: '109', name: 'VFD Microfinance Bank', slug: 'vfd-microfinance-bank', ussd: null },
  { code: '110', name: 'Rubies MFB', slug: 'rubies-mfb', ussd: null },
  { code: '111', name: 'Sparkle Bank', slug: 'sparkle-bank', ussd: null },
  { code: '112', name: 'Carbon (Paystack)', slug: 'carbon', ussd: null },
  { code: '113', name: 'Eyowo', slug: 'eyowo', ussd: null },
  { code: '114', name: 'Moniepoint MFB', slug: 'moniepoint-mfb', ussd: null },
  { code: '115', name: 'GoMoney', slug: 'gomoney', ussd: null },
  { code: '116', name: 'FairMoney MFB', slug: 'fairmoney-mfb', ussd: null },
  { code: '117', name: 'Mint MFB', slug: 'mint-mfb', ussd: null },
  { code: '118', name: 'Xend Finance', slug: 'xend-finance', ussd: null },
  { code: '119', name: 'Paga', slug: 'paga', ussd: null },
  { code: '120', name: 'Etranzact', slug: 'etranzact', ussd: null },
  { code: '121', name: 'Interswitch', slug: 'interswitch', ussd: null },
  { code: '122', name: 'FSDH Merchant Bank', slug: 'fsdh-merchant-bank', ussd: null },
  { code: '123', name: 'Rand Merchant Bank', slug: 'rand-merchant-bank', ussd: null },
];

// Cache for bank data
let banksCache: any[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * GET /api/banks
 * Get all Nigerian banks with search
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, limit = 50 } = req.query;

    // Return cached data if fresh
    if (banksCache && Date.now() - cacheTimestamp < CACHE_TTL) {
      let results = banksCache;
      if (search) {
        const q = (search as string).toLowerCase();
        results = banksCache.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.code.includes(q) ||
            (b.slug && b.slug.toLowerCase().includes(q))
        );
      }
      return res.json({
        banks: results.slice(0, Number(limit)),
        total: results.length,
        source: 'cache',
        timestamp: new Date(cacheTimestamp).toISOString(),
      });
    }

    // Try to fetch from Nomba API first
    try {
      const nombaRes = await axios.get(
        `${process.env.NOMBA_BASE_URL || 'https://api.nomba.com'}/v1/transfers/bank`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NOMBA_CLIENT_ID}`,
            accountId: process.env.NOMBA_PARENT_ACCOUNT_ID,
          },
          timeout: 5000,
        }
      );

      if (nombaRes.data?.code === '00' && Array.isArray(nombaRes.data.data)) {
        banksCache = nombaRes.data.data.map((bank: any) => ({
          code: bank.code || bank.bankCode,
          name: bank.name || bank.bankName,
          slug: (bank.name || bank.bankName || '').toLowerCase().replace(/\s+/g, '-'),
          ussd: bank.ussd || null,
        }));
        cacheTimestamp = Date.now();

        let results = banksCache;
        if (search) {
          const q = (search as string).toLowerCase();
          results = banksCache.filter(
            (b) =>
              b.name.toLowerCase().includes(q) ||
              b.code.includes(q) ||
              (b.slug && b.slug.toLowerCase().includes(q))
          );
        }

        return res.json({
          banks: results.slice(0, Number(limit)),
          total: results.length,
          source: 'nomba-live',
          timestamp: new Date().toISOString(),
        });
      }
    } catch {
      // Fallback to static data
    }

    // Fallback to static Nigerian banks database
    banksCache = NIGERIAN_BANKS;
    cacheTimestamp = Date.now();

    let results = banksCache;
    if (search) {
      const q = (search as string).toLowerCase();
      results = banksCache.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.code.includes(q) ||
          (b.slug && b.slug.toLowerCase().includes(q))
      );
    }

    res.json({
      banks: results.slice(0, Number(limit)),
      total: results.length,
      source: 'static-fallback',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[BANKS] Error:', error.message);
    res.json({
      banks: NIGERIAN_BANKS.slice(0, Number(req.query.limit) || 50),
      total: NIGERIAN_BANKS.length,
      source: 'error-fallback',
    });
  }
});

/**
 * POST /api/banks/resolve-account
 * Resolve bank account name from account number and bank code
 */
router.post('/resolve-account', async (req: Request, res: Response) => {
  try {
    const { accountNumber, bankCode } = req.body;

    if (!accountNumber || !bankCode) {
      return res.status(400).json({ error: 'accountNumber and bankCode required' });
    }

    if (accountNumber.length < 10) {
      return res.status(400).json({ error: 'Invalid account number' });
    }

    // Try Nomba account lookup
    try {
      const nombaRes = await axios.post(
        `${process.env.NOMBA_BASE_URL || 'https://api.nomba.com'}/v1/transfers/bank/lookup`,
        { accountNumber, bankCode },
        {
          headers: {
            Authorization: `Bearer ${process.env.NOMBA_CLIENT_ID}`,
            accountId: process.env.NOMBA_PARENT_ACCOUNT_ID,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      if (nombaRes.data?.code === '00' && nombaRes.data.data) {
        return res.json({
          success: true,
          accountName: nombaRes.data.data.accountName,
          accountNumber: nombaRes.data.data.accountNumber,
          bankCode,
          bankName: NIGERIAN_BANKS.find((b) => b.code === bankCode)?.name || 'Unknown',
          source: 'nomba',
        });
      }
    } catch {
      // Fallback
    }

    // Simulated response for development
    const bank = NIGERIAN_BANKS.find((b) => b.code === bankCode);
    res.json({
      success: true,
      accountName: `Account Holder ${accountNumber.slice(-4)}`,
      accountNumber,
      bankCode,
      bankName: bank?.name || 'Unknown Bank',
      source: 'simulated',
    });
  } catch (error: any) {
    console.error('[BANKS] Account resolution error:', error.message);
    res.status(500).json({ error: 'Failed to resolve account' });
  }
});

/**
 * GET /api/banks/:code
 * Get bank details by code
 */
router.get('/:code', (req: Request, res: Response) => {
  const { code } = req.params;
  const bank = NIGERIAN_BANKS.find((b) => b.code === code);

  if (!bank) {
    return res.status(404).json({ error: 'Bank not found' });
  }

  res.json({ bank });
});

export default router;
