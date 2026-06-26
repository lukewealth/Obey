import axios from 'axios';
import { UserProfile, Transaction } from '../types';

// Detect production environment and use relative path to avoid localhost:5001 failures in production
const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const API_BASE_URL = isProd 
  ? '/api' 
  : ((import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const syncUserWithMongoDB = async (supabaseId: string, profile: UserProfile) => {
  try {
    await api.post('/sync/user', {
      supabaseId,
      ...profile
    });
    console.log('[SYNC] Profile synced with MongoDB Atlas');
  } catch (error) {
    console.warn('[SYNC_WARN] MongoDB Sync Failed (User):', error);
  }
};

export const syncTransactionsWithMongoDB = async (userId: string, transactions: Transaction[]) => {
  try {
    await api.post('/sync/transactions', {
      userId,
      transactions
    });
    console.log('[SYNC] Transactions synced with MongoDB Atlas');
  } catch (error) {
    console.warn('[SYNC_WARN] MongoDB Sync Failed (Transactions):', error);
  }
};

export const fetchUserFallback = async (supabaseId: string): Promise<UserProfile | null> => {
  try {
    const response = await api.get(`/sync/user/${supabaseId}`);
    return response.data;
  } catch (error) {
    console.error('[SYNC_ERROR] Fallback Fetch Failed (User):', error);
    return null;
  }
};

export const fetchTransactionsFallback = async (userId: string): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/sync/transactions/${userId}`);
    return response.data;
  } catch (error) {
    console.error('[SYNC_ERROR] Fallback Fetch Failed (Transactions):', error);
    return [];
  }
};

// --- Admin Helper Node Endpoints ---

export const settleEscrowTrade = async (txId: string, action: 'RELEASE' | 'REJECT') => {
  return api.post('/giftcards/admin/settle', { txId, action });
};

export const adjustUserBalance = async (userId: string, amount: number, type: 'ADD' | 'SUB') => {
  return api.post('/sync/admin/adjust-balance', { userId, amount, type });
};

// --- Nomba Payment Endpoints ---

export const createCheckoutOrder = async (params: {
  userId: string;
  amount: number;
  email?: string;
  callbackUrl?: string;
}) => {
  return api.post('/nomba/checkout', params);
};

export const verifyTransaction = async (orderReference: string) => {
  return api.get(`/nomba/verify/${orderReference}`);
};

export const createVirtualAccount = async (params: {
  userId: string;
  accountName: string;
  expectedAmount?: number;
}) => {
  return api.post('/nomba/virtual-account', params);
};

export const fetchVirtualAccounts = async (userId: string) => {
  return api.get('/nomba/virtual-accounts', { params: { userId } });
};

export const fetchBankCodes = async () => {
  return api.get('/nomba/banks');
};

export const lookupBankAccount = async (accountNumber: string, bankCode: string) => {
  return api.post('/nomba/account-lookup', { accountNumber, bankCode });
};

export const initiateWithdrawal = async (params: {
  userId: string;
  amount: number;
  accountNumber: string;
  bankCode: string;
  accountName: string;
}) => {
  return api.post('/nomba/withdraw', params);
};

// --- AI Insights Endpoints ---

export const getAIInsights = async (params: {
  userId: string;
  transactions?: any[];
  balance: number;
}) => {
  return api.post('/ai/insights', params);
};

export const checkFraud = async (transaction: any, userHistory: any) => {
  return api.post('/ai/fraud-check', { transaction, userHistory });
};

export const categorizeTransaction = async (description: string, amount: number) => {
  return api.post('/ai/categorize', { description, amount });
};

export const predictCashFlow = async (history: any[], days: number = 30) => {
  return api.post('/ai/cashflow-prediction', { history, days });
};

// --- Rewards Endpoints ---

export const getUserRewards = async (userId: string) => {
  return api.get(`/rewards/${userId}`);
};

export const earnRewards = async (params: {
  userId: string;
  type: 'TRANSACTION' | 'REFERRAL' | 'STREAK' | 'MILESTONE' | 'DAILY_LOGIN' | 'KYC_COMPLETE';
  amount?: number;
  reference?: string;
}) => {
  return api.post('/rewards/earn', params);
};

export const redeemRewards = async (userId: string, points: number, reason: string) => {
  return api.post('/rewards/redeem', { userId, points, reason });
};

export const getLeaderboard = async (limit: number = 10) => {
  return api.get(`/rewards/leaderboard/${limit}`);
};

export const claimDailyLogin = async (userId: string) => {
  return api.post('/rewards/daily-login', { userId });
};

export default api;
