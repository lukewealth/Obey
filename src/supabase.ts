import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase credentials missing. The application will not function correctly without VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Only initialize if URL is present to prevent Uncaught Error: supabaseUrl is required
export const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  kyc_status: 'Pending' | 'Verified';
  balance: number;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  title: string;
  category: 'Airtime' | 'Data' | 'Crypto' | 'GiftCard' | 'Transfer';
  type: 'Credit' | 'Debit';
  amount: number;
  fee: number;
  status: 'Success' | 'Pending' | 'Failed';
  created_at: string;
};
