import React, { useState, useEffect, lazy, Suspense } from "react";
import { AppScreen, AppTab, UserProfile, Transaction, AdminMetrics } from "./types";
import MarketingPage from "./components/MarketingPage";
import AuthSystem from "./components/AuthSystem";
import AdminDashboard from "./components/AdminDashboard";
import IdentityVerification from "./components/IdentityVerification";
import OtpVerification from "./components/OtpVerification";
import TransactionSuccess from "./components/TransactionSuccess";
import ThemeToggle from "./components/ThemeToggle";
import CookieConsent from "./components/CookieConsent";
import StandardFooter from "./components/StandardFooter";
import LegalContent from "./components/LegalContent";
import SystemAlert from "./components/SystemAlert";
import GatedVerificationModal from "./components/GatedVerificationModal";
import PuppyLoading from "./components/PuppyLoading";
import AIChatAssistant from "./components/AIChatAssistant";
import AnomalyDetectionDashboard from "./components/AnomalyDetectionDashboard";
import SecuredPortal from "./components/SecuredPortal";
import AssetDetail from "./components/AssetDetail";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load heavy feature components
const DashboardHome = lazy(() => import("./components/DashboardHome"));
const WalletSystem = lazy(() => import("./components/WalletSystem"));
const AirtimeModule = lazy(() => import("./components/AirtimeModule"));
const GiftCardSystem = lazy(() => import("./components/GiftCardSystem"));
const CryptoSystem = lazy(() => import("./components/CryptoSystem"));
const VirtualCardSystem = lazy(() => import("./components/VirtualCardSystem"));
const TransactionHistory = lazy(() => import("./components/TransactionHistory"));
const AdminSystem = lazy(() => import("./components/AdminSystem"));
const UserProfileSettings = lazy(() => import("./components/UserProfileSettings"));
const BankTransfer = lazy(() => import("./components/BankTransfer"));
const KYCTierSystem = lazy(() => import("./components/KYCTierSystem"));
const NotificationSettings = lazy(() => import("./components/NotificationSettings"));
const AdminKYCManagement = lazy(() => import("./components/AdminKYCManagement"));
import { useNotification } from "./components/NotificationSystem";
import { supabase } from "./supabase";
import api from "./services/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HomeIcon, 
  WalletIcon, 
  ArrowsRightLeftIcon as SwapIcon, 
  DevicePhoneMobileIcon as AppIcon, 
  UserIcon, 
  Cog6ToothIcon as SettingsIcon, 
  SparklesIcon, 
  Bars3Icon as MenuIcon, 
  XMarkIcon as XIcon, 
  ArrowLeftOnRectangleIcon as LogOutIcon, 
  CheckBadgeIcon as VerifiedIcon, 
  ShieldExclamationIcon as ShieldAlert, 
  ChevronRightIcon,
  RectangleGroupIcon as DashboardIcon, 
  GlobeAltIcon as GlobeIcon, 
  ShieldCheckIcon as ShieldCheck, 
  BoltIcon as ZapIcon,
  ArrowPathIcon as RefreshIcon,
  CreditCardIcon,
  ShieldCheckIcon as ShieldCheckOutline,
  ClockIcon,
  BuildingLibraryIcon as BankIcon
} from "@heroicons/react/24/outline";

import { useUserProfile, useTransactions } from "./services/queries";
import { sessionService } from "./services/session";
import { auth as firebaseAuth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const { notify } = useNotification();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.MARKETING);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [tradeSubTab, setTradeSubTab] = useState<'crypto' | 'giftcard'>('crypto');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<any>(null);

  // --- React Query Hybrid Hooks (Full-Stack Caching) ---
  const { 
    syncProfile, 
    isLoading: profileLoading 
  } = useUserProfile(currentUser?.id || currentUser?.uid);

  const { 
    data: cachedTransactions = [], 
    syncTransactions, 
    isLoading: txLoading 
  } = useTransactions(currentUser?.id || currentUser?.uid);

  // --- Real-Time Initialization & Database Wakeup ---
  const [isInitializing, setIsInitializing] = useState(false);
  const [showGatedModal, setShowGatedModal] = useState(false);
  const [utilitySegment, setUtilitySegment] = useState<"airtime" | "data">("airtime");
  const wakeupRef = React.useRef<string | null>(null);

  // --- AI Smart System State ---
  const [showAIChat, setShowAIChat] = useState(false);
  const [showAnomalyDetection, setShowAnomalyDetection] = useState(false);
  const [showSecuredPortal, setShowSecuredPortal] = useState(false);
  const [portalRiskLevel, setPortalRiskLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');

  // --- Session Persistence: Restore on app load ---
  useEffect(() => {
    const restoreSession = async () => {
      if (currentUser) return;
      
      try {
        // Try to restore from httpOnly cookie session
        const sessionData = await sessionService.verifySession();
        
        if (sessionData) {
          // Try to restore Supabase session
          if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              setCurrentUser(session.user);
              setCurrentScreen(AppScreen.DASHBOARD);
              return;
            }
          }
          // Try Firebase session
          if (firebaseAuth.currentUser) {
            setCurrentUser(firebaseAuth.currentUser);
            setCurrentScreen(AppScreen.DASHBOARD);
          }
        }
      } catch (err) {
        console.warn('[SESSION_RESTORE] Failed:', err);
        await sessionService.clearSession();
      }
    };
    restoreSession();
  }, []);

  // Metadata Capture Node
  const captureMetadata = () => {
    return {
      agent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString()
    };
  };

  const syncMetadata = async (userId: string) => {
    try {
      const metadata = captureMetadata();
      await api.post('/sync/metadata', { userId, metadata });
      console.log("[SYNC] Institutional metadata node settled.");
    } catch (err) {
      console.warn("[SYNC_WARN] Metadata synchronization delayed.");
    }
  };

  // Utility for Hybrid Tracking
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  const [successTransaction, setSuccessTransaction] = useState<{ amount: number | string; type: string; id: string } | null>(null);

  const wakeupDatabase = async (force: boolean = false) => {
    const trackedEmail = getCookie('obey_user_email');
    const trackedId = getCookie('obey_user_id');
    const identifier = currentUser?.id || currentUser?.uid || trackedId || trackedEmail;

    if (!identifier || !supabase) return;

    if (!force && wakeupRef.current === identifier) return;
    wakeupRef.current = identifier;

    setIsInitializing(true);

    try {
      const [sbResult, mongoResult] = await Promise.allSettled([
        (currentUser?.id || currentUser?.uid || trackedId)
          ? supabase.from("profiles").select("*").eq("id", currentUser?.id || currentUser?.uid || trackedId).maybeSingle()
          : Promise.resolve({ data: null, error: 'skip' }),
        api.get(`/sync/user/${identifier}`).catch(() => ({ data: null }))
      ]);

      const sbProfile = sbResult.status === 'fulfilled' ? sbResult.value?.data : null;
      const mongoData = mongoResult.status === 'fulfilled' ? mongoResult.value?.data : null;

      let finalProfile: UserProfile;
      if (sbProfile) {
        finalProfile = {
          ...profile,
          ...sbProfile,
          id: sbProfile.id,
          name: sbProfile.full_name || sbProfile.name || profile.name,
          kycStatus: sbProfile.kyc_status || profile.kycStatus,
          isEmailVerified: !!sbProfile.email_confirmed_at,
          currency: sbProfile.currency || "NGN",
        };
      } else if (mongoData) {
        finalProfile = {
          ...profile,
          ...mongoData,
          id: mongoData.supabaseId || mongoData._id,
          name: mongoData.name || profile.name,
          isEmailVerified: mongoData.isEmailVerified,
          currency: mongoData.currency || "NGN",
        };
      } else {
        finalProfile = { ...profile, email: trackedEmail || profile.email };
        if (currentScreen === AppScreen.DASHBOARD) {
           setShowGatedModal(true);
        }
      }

      const isVerifiedId = finalProfile.id && finalProfile.id.length > 5;
      const isVerifiedEmail = finalProfile.email && finalProfile.email.includes("@");

      if ((!isVerifiedId || !isVerifiedEmail) && currentScreen === AppScreen.DASHBOARD) {
        setCurrentScreen(AppScreen.LOGIN);
        notify("error", "Verification Required", "Valid institutional identity not confirmed.");
        return;
      }

      setProfile(finalProfile);

      if (finalProfile.role === "admin") {
         setShowAdminDashboard(true);
      } else {
         setActiveTab(AppTab.HOME);
      }

      if (!finalProfile.isEmailVerified && currentScreen === AppScreen.DASHBOARD) {
         setCurrentScreen(AppScreen.LOGIN);
         notify("error", "Access Blocked", "Email verification required.");
      }

      Promise.allSettled([
        syncProfile({ id: finalProfile.id || identifier, profile: finalProfile }),
        syncMetadata(finalProfile.id || identifier)
      ]);
    } catch (err) {
      console.error("[WAKEUP_CRITICAL]", err);
    } finally {
      setTimeout(() => setIsInitializing(false), 800);
    }
  };

  useEffect(() => {
    wakeupDatabase();
  }, [currentUser?.id, currentUser?.uid, currentScreen, syncProfile, notify]);

  // Local state for profile (Default placeholder removed for dynamic institutional alignment)
  const [profile, setProfile] = useState<UserProfile>(() => ({
    name: "Luke Okagha",
    email: "luke@obey.finance",
    role: "user",
    phone: "+234 809 102 8824",
    avatar: "L",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    kycStatus: "Verified",
    balance: 2580340.52,
    currency: "NGN",
    promoCode: "",
    isEmailVerified: true,
    kycLevel: 2,
    tierLevel: 2,
    twoFactorEnabled: true
  }));

  const handleVerificationComplete = () => {
    setShowGatedModal(false);
    const updatedProfile: UserProfile = { ...profile, kycStatus: "Verified", kycLevel: 2 };
    setProfile(updatedProfile);
    notify("success", "Node Authorized", "Institutional access levels established.");
    if (currentUser || profile.id) {
       syncProfile({ id: profile.id || currentUser.id || currentUser.uid, profile: updatedProfile });
    }
  };

  // Role Confirmation for Admin Dashboard
  const [adminVerifying, setAdminVerifying] = useState(false);

  const handleAdminAccess = () => {
    if (profile.role !== "admin") {
      notify("error", "Access Denied", "Institutional credentials required.");
      return;
    }

    setAdminVerifying(true);
    setTimeout(() => {
      setAdminVerifying(false);
      setActiveTab(AppTab.ADMIN);
      notify("success", "Identity Confirmed", "Administrative access granted.");
    }, 1200);
  };

  const handleProfileUpdate = (updated: Partial<UserProfile>) => {
    const nextProfile = { ...profile, ...updated };
    setProfile(nextProfile);
    if (currentUser || nextProfile.id) {
      const id = nextProfile.id || currentUser?.id || currentUser?.uid;
      if (id) {
        syncProfile({ id, profile: nextProfile });
        api.post('/sync/user', {
          supabaseId: id,
          name: nextProfile.name,
          email: nextProfile.email,
          phone: nextProfile.phone,
          kycStatus: nextProfile.kycStatus,
          kycLevel: nextProfile.kycLevel,
          balance: nextProfile.balance,
          promoCode: nextProfile.promoCode,
          twoFactorEnabled: nextProfile.twoFactorEnabled,
        }).catch(() => {});
      }
    }
  };

  const triggerSuccess = (amount: number | string, type: string) => {
    setSuccessTransaction({
      amount,
      type,
      id: `OBY-${Math.floor(Math.random() * 899999) + 100000}X`
    });
  };

  const [systemAlert, setSystemAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    logs: [] as string[],
    type: "system" as any
  });

  const [btcPrice, setBtcPrice] = useState(96000000);
  const [ethPrice, setEthPrice] = useState(5200000);
  const [solPrice, setSolPrice] = useState(245000);
  const [suiPrice, setSuiPrice] = useState(5200);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await api.get('/market/prices?symbols=BTC,ETH,SOL,SUI');
        if (response.data) {
          const peg = 1600; 
          if (response.data.BTC) setBtcPrice(response.data.BTC * peg);
          if (response.data.ETH) setEthPrice(response.data.ETH * peg);
          if (response.data.SOL) setSolPrice(response.data.SOL * peg);
          if (response.data.SUI) setSuiPrice(response.data.SUI * peg);
        }
      } catch (error) {
        console.error('[MARKET_ERROR] Failed to synchronize price node:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalUsers: 1420,
    totalVolume: 2458010.55,
    monthlyRevenue: 18240.22,
    pendingKycCount: 2,
    systemStatus: "OPERATIONAL"
  });

  useEffect(() => {
    if (!supabase) return;

    const unsubscribeFirebase = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Persist session to httpOnly cookie
        await sessionService.setSession(user.uid, user.email || '');
        if (currentScreen === AppScreen.LOGIN || currentScreen === AppScreen.REGISTER) {
           setCurrentScreen(AppScreen.DASHBOARD);
           notify("success", "Access Authorized", `Welcome back to the OBEY node.`);
        }
      }
    });

    const { data: { subscription: subSupabase } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const user = session.user;
        setCurrentUser(user);
        // Persist session to httpOnly cookie
        await sessionService.setSession(user.id, user.email || '');
        if (currentScreen === AppScreen.LOGIN || currentScreen === AppScreen.REGISTER) {
           setCurrentScreen(AppScreen.DASHBOARD);
           notify("success", "Access Authorized", `Sequential ledger sync active.`);
        }
      } else {
        if (!firebaseAuth.currentUser) {
          setCurrentUser(null);
          // Clear session from httpOnly cookie
          await sessionService.clearSession();
          if (currentScreen === AppScreen.DASHBOARD) {
             setCurrentScreen(AppScreen.MARKETING);
          }
        }
      }
    });

    return () => {
      unsubscribeFirebase();
      subSupabase.unsubscribe();
    };
  }, [currentScreen, notify]);

  const handleLogout = async () => {
    await Promise.all([
      supabase.auth.signOut(),
      firebaseAuth.signOut()
    ]);
    // Clear persisted session from httpOnly cookie
    await sessionService.clearSession();
    notify("info", "Session Terminated", "Institutional access securely revoked.");
    setCurrentScreen(AppScreen.MARKETING);
    setActiveTab(AppTab.HOME);
    setMobileMenuOpen(false);
    setShowGatedModal(false);
    wakeupRef.current = null;
  };

  return (
    <div className="min-h-screen text-[#0b0e14] font-sans antialiased selection:bg-primary/20 selection:text-primary relative bg-[#fcfcfd]">
      
      <SystemAlert 
        isOpen={systemAlert.isOpen}
        onClose={() => setSystemAlert(prev => ({ ...prev, isOpen: false }))}
        title={systemAlert.title}
        message={systemAlert.message}
        logs={systemAlert.logs}
        type={systemAlert.type}
      />

      <GatedVerificationModal 
        isOpen={showGatedModal}
        onClose={() => setShowGatedModal(false)}
        onVerify={handleVerificationComplete}
        onLogout={handleLogout}
        onRefresh={() => {
           wakeupRef.current = null;
           setProfile(prev => ({ ...prev }));
        }}
        profile={profile}
      />

      <AnimatePresence>
        {successTransaction && (
          <TransactionSuccess
            amount={successTransaction.amount}
            type={successTransaction.type}
            id={successTransaction.id}
            onClose={() => {
              setSuccessTransaction(null);
              setActiveTab(AppTab.HISTORY);
            }}
          />
        )}
      </AnimatePresence>

      {currentScreen === AppScreen.MARKETING && (
        <MarketingPage 
          btcPrice={btcPrice} 
          ethPrice={ethPrice} 
          onNavigate={(screen) => setCurrentScreen(screen)} 
        />
      )}

      {showAdminDashboard && profile.role === "admin" && (
        <AdminDashboard 
          profile={profile}
          onLogout={handleLogout}
          onBackToUserDashboard={() => {
            setShowAdminDashboard(false);
            setActiveTab(AppTab.HOME);
            notify("info", "User View", "Switched to user dashboard.");
          }}
        />
      )}

      {(currentScreen === AppScreen.LOGIN || currentScreen === AppScreen.REGISTER || currentScreen === AppScreen.OTP) && (
        <AuthSystem 
          currentScreen={currentScreen} 
          onSuccess={(prof) => {
            if (prof) {
               setProfile(prev => ({ ...prev, ...prof } as UserProfile));
               setCurrentScreen(AppScreen.DASHBOARD);
            }
          }} 
          onNavigate={(screen) => setCurrentScreen(screen)} 
        />
      )}

      {currentScreen === AppScreen.PRIVACY && <LegalContent slug="privacy" onBack={() => setCurrentScreen(AppScreen.MARKETING)} />}
      {currentScreen === AppScreen.TERMS && <LegalContent slug="terms" onBack={() => setCurrentScreen(AppScreen.MARKETING)} />}
      {currentScreen === AppScreen.AMLKYC && <LegalContent slug="amlkyc" onBack={() => setCurrentScreen(AppScreen.MARKETING)} />}
      {currentScreen === AppScreen.USERDATA && <LegalContent slug="userdata" onBack={() => setCurrentScreen(AppScreen.MARKETING)} />}
      {currentScreen === AppScreen.DISCLOSURES && <LegalContent slug="disclosures" onBack={() => setCurrentScreen(AppScreen.MARKETING)} />}
      {currentScreen === AppScreen.STATUS && <LegalContent slug="status" onBack={() => setCurrentScreen(AppScreen.MARKETING)} />}

      {currentScreen === AppScreen.DASHBOARD && (
        <div className="min-h-screen flex flex-col relative bg-[var(--app-bg)] transition-colors duration-500">
          <header className="sticky top-0 z-40 bg-[var(--glass-bg)] backdrop-blur-3xl border-b border-gray-100 dark:border-white/10 px-4 md:px-8 h-16 flex items-center justify-between transition-all">
            <div className="flex items-center gap-4">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center text-[#0b0e14] dark:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-xl transition-all">
                <MenuIcon className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                className="hidden lg:flex w-10 h-10 items-center justify-center text-gray-400 hover:text-[#0b0e14] dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-xl transition-all"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2.5">
                <img src="/obey_logo.svg" alt="OBEY" className="w-8 h-8 rounded-xl shadow-sm" />
                <span className="text-lg font-bold tracking-tight text-[#0b0e14] dark:text-white">Obey</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={() => setShowAnomalyDetection(true)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#0b0e14] dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-xl transition-all"
                  title="Security"
                >
                  <ShieldAlert className="w-5 h-5" />
                </button>
              </div>

              <ThemeToggle />

              <button
                onClick={async () => {
                  setIsRefreshing(true);
                  try {
                    const userId = currentUser?.id || currentUser?.uid;
                    const [pricesRes, , , profileRes] = await Promise.allSettled([
                      api.get('/market/prices?symbols=BTC,ETH,SOL,SUI'),
                      api.get('/crypto-market/market'),
                      api.get('/giftcards/market'),
                      userId && supabase
                        ? supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
                        : Promise.resolve({ data: null })
                    ]);
                    if (pricesRes.status === 'fulfilled' && pricesRes.value?.data) {
                      const peg = 1600;
                      const d = pricesRes.value.data;
                      if (d.BTC) setBtcPrice(d.BTC * peg);
                      if (d.ETH) setEthPrice(d.ETH * peg);
                      if (d.SOL) setSolPrice(d.SOL * peg);
                      if (d.SUI) setSuiPrice(d.SUI * peg);
                    }
                    if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
                      const sbProfile = profileRes.value.data;
                      setProfile(prev => ({
                        ...prev,
                        ...sbProfile,
                        name: sbProfile.full_name || sbProfile.name || prev.name,
                        balance: sbProfile.balance ?? prev.balance,
                        currency: sbProfile.currency || prev.currency,
                      }));
                    }
                    notify("success", "Refreshed", "Balance and market data updated.");
                  } catch (err) {
                    notify("error", "Refresh Failed", "Could not update data.");
                  } finally {
                    setTimeout(() => setIsRefreshing(false), 600);
                  }
                }}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#0b0e14] dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-xl transition-all"
                title="Refresh balance & market data"
                disabled={isRefreshing}
              >
                <RefreshIcon className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Mobile Profile Menu */}
              <div className="lg:hidden relative group">
                <button className="flex items-center gap-2 p-1 pr-2 hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-xl transition-all">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {profile.avatar}
                  </div>
                </button>

                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-white/10">
                    <p className="text-sm font-semibold text-[#0b0e14] dark:text-white">{profile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{profile.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setActiveTab(AppTab.PROFILE);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab(AppTab.PROFILE);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Profile Menu */}
              <div className="hidden lg:block relative group">
                <button className="flex items-center gap-2 p-1 pr-2 hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-xl transition-all">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                    {profile.avatar}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-[#0b0e14] dark:text-white">{profile.name.split(' ')[0]}</span>
                  <ChevronRightIcon className="w-3 h-3 text-gray-400 rotate-90" />
                </button>

                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-white/10">
                    <p className="text-sm font-semibold text-[#0b0e14] dark:text-white">{profile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{profile.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => setActiveTab(AppTab.PROFILE)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all"
                    >
                      <SettingsIcon className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-grow flex">
            <aside className={`hidden lg:flex ${sidebarExpanded ? "w-64" : "w-20"} bg-[var(--app-bg)] border-r border-gray-100 dark:border-white/10 p-4 flex-col transition-all duration-300 ease-[0.22, 1, 0.36, 1]`}>
              <nav className="space-y-1 flex-1">
                {[
                  { tab: AppTab.HOME, label: "Overview", icon: HomeIcon },
                  { tab: AppTab.WALLET, label: "Savings", icon: WalletIcon },
                  { tab: AppTab.BANK, label: "Bank", icon: BankIcon },
                  { tab: AppTab.CARDS, label: "Cards", icon: CreditCardIcon },
                  { tab: AppTab.SERVICES, label: "Payments", icon: AppIcon },
                  { tab: AppTab.TRADE, label: "Trade", icon: SwapIcon },
                  { tab: AppTab.PROFILE, label: "Profile", icon: UserIcon },
                ].map((item) => {
                  const isActive = activeTab === item.tab;
                  return (
                    <motion.button 
                      key={item.label}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(item.tab)} 
                      className={`w-full flex items-center ${sidebarExpanded ? "gap-3 px-3" : "justify-center"} h-11 rounded-xl text-sm font-medium transition-all relative overflow-hidden ${
                        isActive 
                          ? "bg-[#0b0e14] dark:bg-white text-white dark:text-[#0b0e14] shadow-lg" 
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/5"
                      }`}
                      title={!sidebarExpanded ? item.label : ""}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary dark:bg-[#0b0e14] rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <item.icon className="w-5 h-5 flex-shrink-0" /> 
                      {sidebarExpanded && <span>{item.label}</span>}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-2">
                <motion.button 
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAIChat(true)}
                  className={`w-full flex items-center ${sidebarExpanded ? "gap-3 px-3" : "justify-center"} h-11 rounded-xl text-sm font-medium transition-all text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/5`}
                  title={!sidebarExpanded ? "AI Chat" : ""}
                >
                  <SparklesIcon className="w-5 h-5 flex-shrink-0" /> 
                  {sidebarExpanded && <span>AI Assistant</span>}
                </motion.button>

                <motion.button 
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(AppTab.PROFILE)}
                  className={`w-full flex items-center ${sidebarExpanded ? "gap-3 px-3" : "justify-center"} h-11 rounded-xl text-sm font-medium transition-all text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/5`}
                  title={!sidebarExpanded ? "Settings" : ""}
                >
                  <SettingsIcon className="w-5 h-5 flex-shrink-0" /> 
                  {sidebarExpanded && <span>Settings</span>}
                </motion.button>

                <motion.button 
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`w-full flex items-center ${sidebarExpanded ? "gap-3 px-3" : "justify-center"} h-11 rounded-xl text-sm font-medium transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10`}
                  title={!sidebarExpanded ? "Sign Out" : ""}
                >
                  <LogOutIcon className="w-5 h-5 flex-shrink-0" /> 
                  {sidebarExpanded && <span>Sign out</span>}
                </motion.button>
              </div>

              {profile.role === "admin" && (
                <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                  <motion.button 
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdminAccess} 
                    className={`w-full flex items-center ${sidebarExpanded ? "gap-3 px-3" : "justify-center"} h-11 rounded-xl text-sm font-medium transition-all relative overflow-hidden ${
                      activeTab === AppTab.ADMIN 
                        ? "bg-[#0b0e14] dark:bg-white text-white dark:text-[#0b0e14] shadow-lg" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/5"
                    }`}
                    title={!sidebarExpanded ? "Admin" : ""}
                  >
                    {activeTab === AppTab.ADMIN && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary dark:bg-[#0b0e14] rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <ShieldCheck className="w-5 h-5 flex-shrink-0" /> 
                    {sidebarExpanded && <span>Admin</span>}
                  </motion.button>
                </div>
              )}
            </aside>

            <main className="flex-grow p-4 md:p-12 overflow-y-auto w-full max-w-7xl mx-auto pb-32 lg:pb-12 relative">
              {(isInitializing || adminVerifying) && (
                <PuppyLoading />
              )}
              <Suspense fallback={<PuppyLoading />}>
                <AnimatePresence mode="wait">
                   <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    {activeTab === AppTab.HOME && (
                      <ErrorBoundary>
                        <DashboardHome
                          profile={profile}
                          transactions={cachedTransactions}
                          onNavigateTab={setActiveTab}
                          onSelectAction={(action) => {
                              if (action === "fund" || action === "withdraw" || action === "transfer") {
                                setActiveTab(AppTab.WALLET);
                              } else if (action === "buy-giftcard" || action === "sell-giftcard" || action === "Giftcard") {
                                setTradeSubTab('giftcard');
                                setActiveTab(AppTab.TRADE);
                              } else if (action === "Crypto") {
                                setTradeSubTab('crypto');
                                setActiveTab(AppTab.TRADE);
                              } else if (action === "airtime" || action === "buy-airtime") {
                                setUtilitySegment("airtime");
                                setActiveTab(AppTab.SERVICES);
                              } else if (action === "data" || action === "buy-data") {
                                setUtilitySegment("data");
                                setActiveTab(AppTab.SERVICES);
                              } else if (action === "history") {
                                setActiveTab(AppTab.HISTORY);
                              } else {
                                setActiveTab(AppTab.SERVICES);
                              }
                          }}
                          prices={{
                            BTC: btcPrice,
                            ETH: ethPrice,
                            SOL: solPrice,
                            SUI: suiPrice
                          }}
                        />
                      </ErrorBoundary>
                    )}
                    {activeTab === AppTab.HISTORY && (
                      <ErrorBoundary>
                        <TransactionHistory transactions={cachedTransactions} />
                      </ErrorBoundary>
                    )}
                    {activeTab === AppTab.WALLET && (
                      <ErrorBoundary>
                        <WalletSystem 
                          profile={profile} 
                          transactions={cachedTransactions} 
                          onFundWallet={(amt, details) => {
                            handleProfileUpdate({ balance: profile.balance + amt });
                            triggerSuccess(amt, "Deposit Protocol");
                          }} 
                          onWithdrawWallet={async (amt, details) => { 
                            handleProfileUpdate({ balance: profile.balance - amt }); 
                            triggerSuccess(amt, "Withdrawal Dispatch");
                            return true; 
                          }} 
                          onTransfer={async (amt, recipient) => { 
                            handleProfileUpdate({ balance: profile.balance - amt }); 
                            triggerSuccess(amt, `Transfer to ${recipient}`);
                            return true; 
                          }} 
                        />
                      </ErrorBoundary>
                    )}

                    {activeTab === AppTab.BANK && (
                      <ErrorBoundary>
                        <BankTransfer
                          profile={profile}
                          transactions={cachedTransactions}
                          onTransferComplete={async (amt, details) => {
                            handleProfileUpdate({ balance: profile.balance - amt });
                            triggerSuccess(amt, details);
                            return true;
                          }}
                        />
                      </ErrorBoundary>
                    )}

                    {activeTab === AppTab.CARDS && (
                      <ErrorBoundary>
                        <VirtualCardSystem 
                          profile={profile} 
                          onUpdateBalance={(amt) => {
                            handleProfileUpdate({ balance: profile.balance + amt });
                            triggerSuccess(amt, amt > 0 ? "Card Funding" : "Card Unloading");
                          }}
                        />
                      </ErrorBoundary>
                    )}
                    
                    {activeTab === AppTab.TRADE && (
                      <ErrorBoundary>
                        <div className="space-y-8">
                          <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-gray-100 w-fit mx-auto md:mx-0 shadow-sm">
                             <button 
                              onClick={() => setTradeSubTab('crypto')}
                              className={`px-8 py-3 rounded-xl text-[13px] font-black transition-all ${tradeSubTab === 'crypto' ? 'bg-[#0b0e14] text-white shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}
                             >
                               Digital Assets
                             </button>
                             <button 
                              onClick={() => setTradeSubTab('giftcard')}
                              className={`px-8 py-3 rounded-xl text-[13px] font-black transition-all ${tradeSubTab === 'giftcard' ? 'bg-[#0b0e14] text-white shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}
                             >
                               Gift Cards
                             </button>
                          </div>
                          
                          <AnimatePresence mode="wait">
                            {tradeSubTab === 'giftcard' ? (
                              <motion.div key="giftcard" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <GiftCardSystem profile={profile} onTradeCompleted={(amt, details, isSell) => {
                                  handleProfileUpdate({ balance: isSell ? profile.balance + amt : profile.balance - amt });
                                  triggerSuccess(amt, isSell ? `Sell ${details}` : `Buy ${details}`);
                                }} />
                              </motion.div>
                            ) : (
                              <motion.div key="crypto" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                                <CryptoSystem profile={profile} btcPrice={btcPrice} ethPrice={ethPrice} solPrice={solPrice} suiPrice={suiPrice} onTradeCompleted={(amt, details, isSell) => {
                                  handleProfileUpdate({ balance: isSell ? profile.balance + amt : profile.balance - amt });
                                  triggerSuccess(amt, isSell ? `Sell ${details}` : `Buy ${details}`);
                                }} />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </ErrorBoundary>
                    )}

                    {activeTab === AppTab.SERVICES && (
                      <ErrorBoundary>
                        <AirtimeModule 
                          profile={profile} 
                          initialSegment={utilitySegment}
                          onPurchase={async (amt) => { 
                            handleProfileUpdate({ balance: profile.balance - amt }); 
                            triggerSuccess(amt, "Service Settlement");
                            return true; 
                          }} 
                        />
                      </ErrorBoundary>
                    )}
                    {activeTab === AppTab.PROFILE && (
                      <ErrorBoundary>
                        <div className="space-y-8">
                          <UserProfileSettings profile={profile} onUpdateProfile={handleProfileUpdate} />
                          <NotificationSettings userId={profile.id} />
                          <KYCTierSystem 
                            profile={profile} 
                            onTierUpgrade={(newTier) => {
                              handleProfileUpdate({ kycLevel: newTier as any });
                              notify("success", "Tier Upgraded", `Welcome to Tier ${newTier}!`);
                            }} 
                          />
                        </div>
                      </ErrorBoundary>
                    )}
                    {activeTab === AppTab.ADMIN && profile.role === "admin" && (
                      <ErrorBoundary>
                        <div className="space-y-8">
                          <AdminSystem 
                            metrics={adminMetrics} 
                            profile={profile} 
                            onApproveKyc={() => {
                              notify("success", "Compliance Verified", "Identity node authorized.");
                              handleProfileUpdate({ kycStatus: "Verified", kycLevel: 2 });
                            }} 
                            onUpdateSystemStatus={(status) => {
                              setAdminMetrics(prev => ({ ...prev, systemStatus: status }));
                              notify("info", "System State Changed", `Master node status set to ${status}`);
                            }} 
                          />
                          <AdminKYCManagement adminId={profile.id || ""} />
                        </div>
                      </ErrorBoundary>
                     )}
                  </motion.div>
               </AnimatePresence>
              </Suspense>
            </main>
          </div>

          <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-2xl border-t border-gray-100 dark:border-white/10 px-4 py-2 flex justify-around items-center">
            {[
              { tab: AppTab.HOME, label: "Home", icon: HomeIcon },
              { tab: AppTab.WALLET, label: "Savings", icon: WalletIcon },
              { tab: AppTab.BANK, label: "Bank", icon: BankIcon },
              { tab: AppTab.TRADE, label: "Trade", icon: SwapIcon },
              { tab: AppTab.SERVICES, label: "Pay", icon: AppIcon },
            ].map((item) => (
              <button 
                key={item.label} 
                onClick={() => setActiveTab(item.tab)} 
                className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${activeTab === item.tab ? "text-primary" : "text-gray-400"}`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.tab ? "stroke-[2.5px]" : "stroke-2"}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Sidebar Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                />
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-[#1e1e1e] z-50 lg:hidden shadow-2xl overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <img src="/obey_logo.svg" alt="OBEY" className="w-10 h-10 rounded-xl shadow-sm" />
                        <span className="text-xl font-bold tracking-tight text-[#0b0e14] dark:text-white">Obey</span>
                      </div>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                      >
                        <XIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* User Profile */}
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                          {profile.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{profile.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{profile.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                      {[
                        { tab: AppTab.HOME, label: "Overview", icon: HomeIcon },
                        { tab: AppTab.WALLET, label: "Savings", icon: WalletIcon },
                        { tab: AppTab.BANK, label: "Bank", icon: BankIcon },
                        { tab: AppTab.CARDS, label: "Cards", icon: CreditCardIcon },
                        { tab: AppTab.SERVICES, label: "Payments", icon: AppIcon },
                        { tab: AppTab.TRADE, label: "Trade", icon: SwapIcon },
                        { tab: AppTab.PROFILE, label: "Profile", icon: UserIcon },
                      ].map((item) => {
                        const isActive = activeTab === item.tab;
                        return (
                          <button
                            key={item.label}
                            onClick={() => {
                              setActiveTab(item.tab);
                              setMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                              isActive
                                ? "bg-[#0b0e14] dark:bg-white text-white dark:text-[#0b0e14] shadow-lg"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/5"
                            }`}
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10 space-y-1">
                      <button
                        onClick={() => {
                          setShowAIChat(true);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/5 transition-all"
                      >
                        <SparklesIcon className="w-5 h-5" />
                        <span>AI Assistant</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab(AppTab.PROFILE);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/5 transition-all"
                      >
                        <SettingsIcon className="w-5 h-5" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                      >
                        <LogOutIcon className="w-5 h-5" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                    {profile.role === "admin" && (
                      <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/10">
                        <button
                          onClick={() => {
                            handleAdminAccess();
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            activeTab === AppTab.ADMIN
                              ? "bg-[#0b0e14] dark:bg-white text-white dark:text-[#0b0e14] shadow-lg"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-white/5"
                          }`}
                        >
                          <ShieldCheck className="w-5 h-5" />
                          <span>Admin Dashboard</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {/* AI Smart System Components */}
      <AnimatePresence>
        {showAIChat && (
          <AIChatAssistant
            userId={profile.id || currentUser?.id || currentUser?.uid || ''}
            balance={profile.balance}
            transactions={cachedTransactions}
            isOpen={showAIChat}
            onClose={() => setShowAIChat(false)}
            prices={{
              BTC: btcPrice,
              ETH: ethPrice,
              SOL: solPrice,
              SUI: suiPrice
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAnomalyDetection && (
          <AnomalyDetectionDashboard
            userId={profile.id || currentUser?.id || currentUser?.uid || ''}
            transactions={cachedTransactions}
            isOpen={showAnomalyDetection}
            onClose={() => setShowAnomalyDetection(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSecuredPortal && (
          <SecuredPortal
            isOpen={showSecuredPortal}
            onClose={() => setShowSecuredPortal(false)}
            onVerified={() => {
              notify("success", "Identity Verified", "Secure session established.");
            }}
            userId={profile.id || currentUser?.id || currentUser?.uid || ''}
            riskLevel={portalRiskLevel}
          />
        )}
      </AnimatePresence>

      <CookieConsent />
    </div>
  );
}
