import axios from 'axios';
import { UserProfile, Transaction } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const syncUserWithMongoDB = async (supabaseId: string, profile: UserProfile) => {
  try {
    await api.post('/sync/user', {
      supabaseId,
      ...profile
    });
    console.log('🔄 Profile synced with MongoDB Atlas');
  } catch (error) {
    console.warn('⚠️ MongoDB Sync Failed (User):', error);
  }
};

export const syncTransactionsWithMongoDB = async (userId: string, transactions: Transaction[]) => {
  try {
    await api.post('/sync/transactions', {
      userId,
      transactions
    });
    console.log('🔄 Transactions synced with MongoDB Atlas');
  } catch (error) {
    console.warn('⚠️ MongoDB Sync Failed (Transactions):', error);
  }
};

export const fetchUserFallback = async (supabaseId: string): Promise<UserProfile | null> => {
  try {
    const response = await api.get(`/sync/user/${supabaseId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Fallback Fetch Failed (User):', error);
    return null;
  }
};

export const fetchTransactionsFallback = async (userId: string): Promise<Transaction[]> => {
  try {
    const response = await api.get(`/sync/transactions/${userId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Fallback Fetch Failed (Transactions):', error);
    return [];
  }
};

export default api;
