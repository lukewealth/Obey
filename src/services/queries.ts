import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { syncUserWithMongoDB, syncTransactionsWithMongoDB, fetchUserFallback, fetchTransactionsFallback } from './api';
import { UserProfile, Transaction } from '../types';

// Keys for institutional caching
export const QUERY_KEYS = {
  USER_PROFILE: 'user_profile',
  TRANSACTIONS: 'transactions',
  ADMIN_METRICS: 'admin_metrics'
};

// --- Hooks for Full-Stack UI/UX Caching & Node Alignment ---

/**
 * Hook to manage user profile with hybrid identifier mesh (Email/ID).
 */
export function useUserProfile(identifier: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch with institutional fallback logic
  const query = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE, identifier],
    queryFn: async () => {
      if (!identifier) return null;
      // Try to get from ecosystem depth (Hybrid: MongoDB -> Real-Time Nodes)
      const fallback = await fetchUserFallback(identifier);
      return fallback;
    },
    enabled: !!identifier,
    staleTime: 1000 * 60 * 10, // 10 minutes institutional cache
  });

  // Mutation to sync/update with ecosystem alignment
  const syncMutation = useMutation({
    mutationFn: ({ id, profile }: { id: string, profile: UserProfile }) => syncUserWithMongoDB(id, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });
    }
  });

  return { ...query, syncProfile: syncMutation.mutateAsync };
}

/**
 * Hook to manage transactions with high-fidelity depth caching.
 */
export function useTransactions(userId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, userId],
    queryFn: async () => {
      if (!userId) return [];
      return await fetchTransactionsFallback(userId);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes depth cache
  });

  const syncMutation = useMutation({
    mutationFn: ({ id, txs }: { id: string, txs: Transaction[] }) => syncTransactionsWithMongoDB(id, txs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    }
  });

  return { ...query, syncTransactions: syncMutation.mutateAsync };
}

/**
 * Hook to fetch health status with real-time node monitoring.
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: ['system_health'],
    queryFn: async () => {
      const response = await api.get('/health');
      return response.data;
    },
    refetchInterval: 15000, // Real-time pulse every 15 seconds
  });
}
