export enum AppScreen {
  MARKETING = "MARKETING",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  OTP = "OTP",
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
  TRADE = "TRADE",
  SERVICES = "SERVICES",
  PROFILE = "PROFILE",
  ADMIN = "ADMIN"
}

export enum GiftCardTab {
  BUY = "BUY",
  SELL = "SELL"
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: "user" | "admin";
  phone: string;
  avatar: string;
  avatarUrl?: string; // Support for official avatar icons
  kycStatus: "Unverified" | "Pending" | "Verified";
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
