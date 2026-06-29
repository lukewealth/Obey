export enum AppScreen {
  MARKETING = "MARKETING",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  OTP = "OTP",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  DASHBOARD = "DASHBOARD",
  PRIVACY = "PRIVACY",
  TERMS = "TERMS",
  AMLKYC = "AMLKYC",
  USERDATA = "USERDATA",
  DISCLOSURES = "DISCLOSURES",
  STATUS = "STATUS"
}

export enum AppTab {
  HOME = "HOME",
  WALLET = "WALLET",
  BANK = "BANK",
  TRADE = "TRADE",
  SERVICES = "SERVICES",
  PROFILE = "PROFILE",
  ADMIN = "ADMIN",
  CARDS = "CARDS",
  HISTORY = "HISTORY",
  AI = "AI",
  SCHEDULE = "SCHEDULE"
}

export enum GiftCardTab {
  BUY = "BUY",
  SELL = "SELL"
}

export interface UserProfile {
  id?: string;
  obeyId?: string; // Unique Node Identifier (e.g. OBEY-82F1X)
  name: string;
  email: string;
  role: "user" | "admin";
  phone: string;
  avatar: string;
  avatarUrl?: string; // Support for official avatar icons
  kycStatus: "Unverified" | "Pending" | "Verified" | "Rejected";
  kycLevel: 0 | 1 | 2; // Support for tiered verification levels
  tierLevel: number; // 1: Standard, 2: Institutional/Premium
  isEmailVerified: boolean;
  balance: number;
  currency: "NGN" | "USD"; // Official currency support
  promoCode: string;
  twoFactorEnabled: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  category: "Electronics" | "Transfer" | "Dining" | "Travel" | "Food" | "Crypto" | "Airtime" | "Data" | "GiftCard";
  type: "Debit" | "Credit";
  amount: number;
  currency: "NGN" | "USD"; // Transaction specific currency
  fee: number;
  date: string;
  time: string;
  status: "Success" | "Processing" | "Failed" | "Awaiting Audit" | "Escrow" | "Disputed";
  recipientWallet?: string;
  network?: string;
  brand?: string;
  assetName?: string;
  faceValue?: number;
  requestReference?: string;
  paymentMethod?: 'bank_transfer' | 'card' | 'wallet' | 'crypto' | 'giftcard' | 'airtime' | 'data';
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number; // Price in NGN by default in the new node
  priceUSD?: number;
  prevPrice: number;
  priceChangePercent: number;
  logo: string;
  logoUrl?: string; // Official symbol URL
  balance: number;
  history: number[];
}

export interface GiftCardAsset {
  id: string;
  name: string;
  buyRate: number; 
  sellRate: number;
  logo: string;
  logoUrl?: string;
  popularity: number;
  trending: boolean;
}

export interface AdminMetrics {
  totalUsers: number;
  totalVolume: number;
  monthlyRevenue: number;
  pendingKycCount: number;
  systemStatus: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE";
}

export interface ScheduledPayment {
  id: string;
  title: string;
  amount: number;
  currency: "NGN" | "USD";
  date: string;
  time: string;
  frequency: "once" | "daily" | "weekly" | "monthly" | "yearly";
  category: "Transfer" | "Bills" | "Savings" | "Subscription" | "Rent" | "Other";
  status: "upcoming" | "completed" | "rescheduled" | "cancelled" | "failed";
  recipient?: string;
  description?: string;
  originalDate?: string;
  rescheduleCount?: number;
}

export interface WeeklyPin {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: "Personal" | "Bills" | "Savings" | "Transfer";
  description?: string;
}
