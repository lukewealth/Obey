import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { syncUserWithMongoDB, syncTransactionsWithMongoDB, fetchUserFallback, fetchTransactionsFallback } from './api';
import { UserProfile, Transaction } from '../types';

// Keys for caching
export const QUERY_KEYS = {
  USER_PROFILE: 'user_profile',
  TRANSACTIONS: 'transactions',
  ADMIN_METRICS: 'admin_metrics'
};

// --- Hooks for Full-Stack UI/UX Caching ---

/**
 * Hook to manage user profile with caching and hybrid sync.
 */
export function useUserProfile(supabaseId: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch with fallback logic
  const query = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE, supabaseId],
    queryFn: async () => {
      if (!supabaseId) return null;
      // Try to get from local cache first, then fallback to MongoDB if Supabase is "assumed" to be updated via App.tsx logic
      const fallback = await fetchUserFallback(supabaseId);
      return fallback;
    },
    enabled: !!supabaseId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Mutation to sync/update
  const syncMutation = useMutation({
    mutationFn: ({ id, profile }: { id: string, profile: UserProfile }) => syncUserWithMongoDB(id, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER_PROFILE] });
    }
  });

  return { ...query, syncProfile: syncMutation.mutate };
}

/**
 * Hook to manage transactions with caching and hybrid sync.
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
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });

  const syncMutation = useMutation({
    mutationFn: ({ id, txs }: { id: string, txs: Transaction[] }) => syncTransactionsWithMongoDB(id, txs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRANSACTIONS] });
    }
  });

  return { ...query, syncTransactions: syncMutation.mutate };
}

/**
 * Hook to fetch health status (example of generic API caching)
 */
export function useSystemHealth() {
  return useQuery({
    queryKey: ['system_health'],
    queryFn: async () => {
      const response = await api.get('/health');
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
