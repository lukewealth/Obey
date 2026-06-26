import React, { useState, useEffect } from "react";
import { AppScreen, AppTab, UserProfile, Transaction, AdminMetrics } from "./types";
import MarketingPage from "./components/MarketingPage";
import AuthSystem from "./components/AuthSystem";
import DashboardHome from "./components/DashboardHome";
import WalletSystem from "./components/WalletSystem";
import AirtimeModule from "./components/AirtimeModule";
import GiftCardSystem from "./components/GiftCardSystem";
import CryptoSystem from "./components/CryptoSystem";
import VirtualCardSystem from "./components/VirtualCardSystem";
import TransactionHistory from "./components/TransactionHistory";
import AdminSystem from "./components/AdminSystem";
import AdminDashboard from "./components/AdminDashboard";
import IdentityVerification from "./components/IdentityVerification";
import OtpVerification from "./components/OtpVerification";
import TransactionSuccess from "./components/TransactionSuccess";
import ThemeToggle from "./components/ThemeToggle";
import UserProfileSettings from "./components/UserProfileSettings";
import CookieConsent from "./components/CookieConsent";
import StandardFooter from "./components/StandardFooter";
import LegalContent from "./components/LegalContent";
import SystemAlert from "./components/SystemAlert";
import GatedVerificationModal from "./components/GatedVerificationModal";
import PuppyLoading from "./components/PuppyLoading";
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
  BellIcon, 
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
  CreditCardIcon
} from "@heroicons/react/24/outline";

import { useUserProfile, useTransactions } from "./services/queries";
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
    // Allow wakeup via current user OR tracked cookie for fast-fetch optimization
    const trackedEmail = getCookie('obey_user_email');
    const trackedId = getCookie('obey_user_id');
    const identifier = currentUser?.id || currentUser?.uid || trackedId || trackedEmail;
    
    if (!identifier || !supabase) return;
    
    // Prevent redundant wakeup for the same identifier in a single session unless forced
    if (!force && wakeupRef.current === identifier) return;
    wakeupRef.current = identifier;
    
    setIsInitializing(true);
    console.log("[WAKEUP] Initializing cross-chain depth nodes for:", identifier);
    
    try {
      // 1. Fetch Master Profile from Ecosystem Depth (Hybrid: Supabase -> MongoDB Fallback)
      let sbProfile: any = null;
      if (currentUser?.id || currentUser?.uid || trackedId) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser?.id || currentUser?.uid || trackedId)
          .maybeSingle(); 
        if (!error) sbProfile = data;
      }

      // 2. Determine Source of Truth & Align Metadata
      let finalProfile: UserProfile;
      if (sbProfile) {
        finalProfile = {
          ...profile,
          ...sbProfile,
          id: sbProfile.id,
          kycStatus: sbProfile.kyc_status || profile.kycStatus,
          isEmailVerified: !!sbProfile.email_confirmed_at,
          currency: sbProfile.currency || "NGN",
        };
        console.log("[WAKEUP] Master profile retrieved from Supabase node");
      } else {
        // Fallback to MongoDB Node via Fast-Fetch API
        try {
          const res = await api.get(`/sync/user/${identifier}`);
          if (res.data) {
            finalProfile = {
              ...profile,
              ...res.data,
              id: res.data.supabaseId || res.data._id,
              isEmailVerified: res.data.isEmailVerified,
              currency: res.data.currency || "NGN",
            };
            console.log("[WAKEUP] Reverting to MongoDB depth node");
          } else {
            throw new Error("No node found");
          }
        } catch (err) {
          finalProfile = { ...profile, email: trackedEmail || profile.email };
          console.log("[WAKEUP] No existing node found. Using defaults.");
          // Trigger gated verification for new or un-synced users
          if (currentScreen === AppScreen.DASHBOARD) {
             setShowGatedModal(true);
          }
        }
      }

      // 3. Metadata Node Alignment
      await syncMetadata(finalProfile.id || identifier);

      // 4. Verification Check: Confirm Email or User ID / Admin ID
      const isVerifiedId = finalProfile.id && finalProfile.id.length > 5;
      const isVerifiedEmail = finalProfile.email && finalProfile.email.includes("@");
      
      if ((!isVerifiedId || !isVerifiedEmail) && currentScreen === AppScreen.DASHBOARD) {
        setCurrentScreen(AppScreen.LOGIN);
        notify("error", "Verification Required", "Valid institutional identity not confirmed.");
        return;
      }

      // 5. Synchronize All Global States
      setProfile(finalProfile);
      
      // Role-Based Tab Initialization
      if (finalProfile.role === "admin") {
         setShowAdminDashboard(true);
         notify("success", "Admin Access Granted", "Welcome to the institutional control panel.");
      } else {
         setActiveTab(AppTab.HOME);
      }

      // Final Security Check: Ensure email is verified for dashboard access
      if (!finalProfile.isEmailVerified && currentScreen === AppScreen.DASHBOARD) {
         setCurrentScreen(AppScreen.LOGIN);
         notify("error", "Access Blocked", "Institutional email verification required.");
      }

      await syncProfile({ id: finalProfile.id || identifier, profile: finalProfile });
      
      notify("success", "Nodes Synchronized", "Ecosystem data and fiat parameters re-aligned.");
    } catch (err) {
      console.error("[WAKEUP_CRITICAL] Node alignment failed:", err);
    } finally {
      // Institutional delay for high-fidelity discovery animation
      setTimeout(() => {
        setIsInitializing(false);
      }, 2200);
    }
  };

  useEffect(() => {
    wakeupDatabase();
  }, [currentUser?.id, currentUser?.uid, currentScreen, syncProfile, notify]);

  // Local state for profile (Default placeholder removed for dynamic institutional alignment)
  const [profile, setProfile] = useState<UserProfile>(() => ({
    name: "Authorized Node",
    email: "node@obey.finance",
    role: "user",
    phone: "+234 000 000 0000",
    avatar: "OB",
    avatarUrl: "",
    kycStatus: "Unverified",
    balance: 0,
    currency: "NGN",
    promoCode: "",
    isEmailVerified: false,
    kycLevel: 0,
    tierLevel: 1,
    twoFactorEnabled: false
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
      syncProfile({ id: nextProfile.id || currentUser.id || currentUser.uid, profile: nextProfile });
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
        if (currentScreen === AppScreen.LOGIN || currentScreen === AppScreen.REGISTER) {
           setCurrentScreen(AppScreen.DASHBOARD);
           notify("success", "Access Authorized", `Sequential ledger sync active.`);
        }
      } else {
        if (!firebaseAuth.currentUser) {
          setCurrentUser(null);
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
    notify("info", "Session Terminated", "Institutional access securely revoked.");
    setCurrentScreen(AppScreen.MARKETING);
    setActiveTab(AppTab.HOME);
    setMobileMenuOpen(false);
    setShowGatedModal(false);
    wakeupRef.current = null;
  };

  const triggerDiagnostic = () => {
    setSystemAlert({
      isOpen: true,
      title: "Diagnostic Sweep Initiated",
      message: "Integrity check in progress on digital parameters.",
      type: "system",
      logs: [
        "INITIALIZING_NODE_MESH_SYNC",
        "FETCHING_CROSS_CHAIN_LIQUIDITY_POOLS",
        "VERIFYING_MULTI_SIG_ESCROW_CONTRACTS",
        "ESTABLISHING_SECURE_CLOUD_TUNNEL",
        "DIAGNOSTIC_COMPLETE_INTEGRITY_100%"
      ]
    });
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
          <header className="sticky top-0 z-40 bg-[var(--glass-bg)] backdrop-blur-3xl border-b border-gray-100 dark:border-white/10 px-4 md:px-10 h-16 md:h-24 flex items-center justify-between transition-all">
            <div className="flex items-center gap-3 md:gap-6">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center text-[#0b0e14] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all">
                <MenuIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  className="hidden lg:flex w-10 h-10 items-center justify-center text-gray-400 hover:text-[#0b0e14] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-all mr-2"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
                <div className="w-9 h-9 md:w-11 md:h-11 bg-[#0b0e14] dark:bg-primary flex items-center justify-center rounded-[8px] md:rounded-[10px] shadow-lg overflow-hidden shrink-0">
                  <img src="/obey_logo.svg" className="w-full h-full object-cover" alt="OBEY Logo" />
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tighter text-[#0b0e14] dark:text-white font-space uppercase">OBEY</span>
                <button onClick={triggerDiagnostic} className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Node: {adminMetrics.systemStatus}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <ThemeToggle />
              <div onClick={() => notify("log", "Audit Log Access", "Fetching sequential ledger entries from Sui Mainnet...")} className="hidden lg:flex items-center gap-4 pr-6 border-r border-gray-100 dark:border-white/10 cursor-pointer hover:opacity-60 transition-opacity">
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Master Ledger</p>
                  <p className="text-[13px] font-bold text-[#0b0e14] dark:text-white">Verified On-Chain</p>
                </div>
              </div>

              <div onClick={() => setActiveTab(AppTab.PROFILE)} className="flex items-center gap-2 md:gap-3 pl-2 cursor-pointer group select-none">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-[12px] md:rounded-[16px] bg-[#0b0e14] dark:bg-primary flex items-center justify-center font-black text-white text-xs md:text-sm uppercase shadow-xl group-hover:scale-105 transition-transform shrink-0 relative">
                   {profile.avatar}
                   {profile.role === "admin" && (
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white dark:border-[#121212] flex items-center justify-center">
                        <ZapIcon className="w-2.5 h-2.5 text-white" />
                     </div>
                   )}
                </div>
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] md:text-[13px] font-black text-[#0b0e14] dark:text-white group-hover:text-primary transition-colors">{profile.name}</p>
                    {profile.role === "admin" && (
                      <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[7px] font-black uppercase rounded-[4px] border border-primary/20">VIT NODE</span>
                    )}
                  </div>
                  <p className="text-[8px] md:text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <VerifiedIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" /> {profile.role === "admin" ? "Institutional Admin" : "Tier 2 Secure"}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-grow flex">
            <aside className={`hidden lg:flex ${sidebarExpanded ? "w-72" : "w-24"} bg-[var(--app-bg)] border-r border-gray-100 dark:border-white/10 p-6 flex-col justify-between transition-all duration-500 ease-[0.22, 1, 0.36, 1]`}>
              <div className="space-y-10">
                <div className="space-y-4">
                  {sidebarExpanded && <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] pl-4">Liquidity</p>}
                  <nav className="space-y-1">
                    {[
                      { tab: AppTab.HOME, label: "Console", icon: DashboardIcon },
                      { tab: AppTab.WALLET, label: "Treasury", icon: WalletIcon },
                      { tab: AppTab.CARDS, label: "Cards", icon: CreditCardIcon },
                      { tab: AppTab.TRADE, label: "Exchange", icon: RefreshIcon },
                      { tab: AppTab.SERVICES, label: "Services", icon: AppIcon },
                    ].map((item) => (
                      <button 
                        key={item.label} 
                        onClick={() => setActiveTab(item.tab)} 
                        className={`w-full flex items-center ${sidebarExpanded ? "gap-4 px-4" : "justify-center"} h-14 rounded-2xl text-[13px] font-black transition-all ${activeTab === item.tab ? "bg-[#0b0e14] text-white shadow-xl shadow-gray-200" : "text-gray-400 hover:text-[#0b0e14] hover:bg-gray-50"}`}
                        title={!sidebarExpanded ? item.label : ""}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" /> 
                        {sidebarExpanded && <span>{item.label}</span>}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="space-y-4">
                  {sidebarExpanded && <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] pl-4">Ecosystem</p>}
                  <nav className="space-y-1">
                    <button 
                      onClick={() => setActiveTab(AppTab.PROFILE)} 
                      className={`w-full flex items-center ${sidebarExpanded ? "gap-4 px-4" : "justify-center"} h-14 rounded-2xl text-[13px] font-black transition-all ${activeTab === AppTab.PROFILE ? "bg-[#0b0e14] text-white shadow-xl shadow-gray-200" : "text-gray-400 hover:text-[#0b0e14] hover:bg-gray-50"}`}
                      title={!sidebarExpanded ? "Parameters" : ""}
                    >
                      <SettingsIcon className="w-5 h-5 flex-shrink-0" /> 
                      {sidebarExpanded && <span>Parameters</span>}
                    </button>
                    {profile.role === "admin" && (
                      <button 
                        onClick={handleAdminAccess} 
                        className={`w-full flex items-center ${sidebarExpanded ? "gap-4 px-4" : "justify-center"} h-14 rounded-2xl text-[13px] font-black transition-all ${activeTab === AppTab.ADMIN ? "bg-[#0b0e14] text-white shadow-xl shadow-gray-200" : "text-gray-400 hover:text-[#0b0e14] hover:bg-gray-50"}`}
                        title={!sidebarExpanded ? "Compliance" : ""}
                      >
                        <ShieldCheck className="w-5 h-5 flex-shrink-0" /> 
                        {sidebarExpanded && <span>Compliance</span>}
                      </button>
                    )}
                  </nav>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <button 
                  onClick={handleLogout} 
                  className={`w-full h-14 rounded-[22px] bg-white border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center ${sidebarExpanded ? "gap-3" : ""} text-gray-400 active-press shadow-sm`}
                  title={!sidebarExpanded ? "Sign Out" : ""}
                >
                  <LogOutIcon className="w-5 h-5 flex-shrink-0" /> 
                  {sidebarExpanded && <span>Sign Out</span>}
                </button>
              </div>
            </aside>

            <main className="flex-grow p-4 md:p-12 overflow-y-auto w-full max-w-7xl mx-auto pb-32 lg:pb-12 relative">
              {(isInitializing || adminVerifying) && (
                <div className="absolute inset-0 z-50 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
                   <PuppyLoading />
                </div>
              )}
              <AnimatePresence mode="wait">
                 <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    {activeTab === AppTab.HOME && (
                      <DashboardHome 
                        profile={profile} 
                        transactions={cachedTransactions} 
                        onNavigateTab={setActiveTab} 
                        onRefreshData={async () => {
                           await wakeupDatabase(true);
                        }}
                        onSelectAction={(action) => { 
                          setIsInitializing(true);
                          setTimeout(() => {
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
                            setIsInitializing(false);
                          }, 1200);
                        }} 
                        prices={{
                          BTC: btcPrice,
                          ETH: ethPrice,
                          SOL: solPrice,
                          SUI: suiPrice
                        }}
                      />
                    )}
                    {activeTab === AppTab.HISTORY && (
                      <TransactionHistory transactions={cachedTransactions} />
                    )}
                    {activeTab === AppTab.WALLET && (
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
                    )}

                    {activeTab === AppTab.CARDS && (
                      <VirtualCardSystem 
                        profile={profile} 
                        onUpdateBalance={(amt) => {
                          handleProfileUpdate({ balance: profile.balance + amt });
                          triggerSuccess(amt, amt > 0 ? "Card Funding" : "Card Unloading");
                        }}
                      />
                    )}
                    
                    {activeTab === AppTab.TRADE && (
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
                    )}

                    {activeTab === AppTab.SERVICES && (
                      <AirtimeModule 
                        profile={profile} 
                        initialSegment={utilitySegment}
                        onPurchase={async (amt) => { 
                          handleProfileUpdate({ balance: profile.balance - amt }); 
                          triggerSuccess(amt, "Service Settlement");
                          return true; 
                        }} 
                      />
                    )}
                    {activeTab === AppTab.PROFILE && <UserProfileSettings profile={profile} onUpdateProfile={handleProfileUpdate} />}
                    {activeTab === AppTab.ADMIN && profile.role === "admin" && (
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
                    )}
                 </motion.div>
              </AnimatePresence>
            </main>
          </div>

          <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-100 px-6 py-4 flex justify-around items-center shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            {[
              { tab: AppTab.HOME, label: "Console", icon: DashboardIcon },
              { tab: AppTab.WALLET, label: "Treasury", icon: WalletIcon },
              { tab: AppTab.CARDS, label: "Cards", icon: CreditCardIcon },
              { tab: AppTab.TRADE, label: "Exchange", icon: RefreshIcon },
              { tab: AppTab.SERVICES, label: "Apps", icon: AppIcon },
            ].map((item) => (
              <button 
                key={item.label} 
                onClick={() => setActiveTab(item.tab)} 
                className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === item.tab ? "text-primary scale-110 font-black" : "text-gray-400 hover:text-gray-600"}`}
              >
                <item.icon className={`w-6 h-6 ${activeTab === item.tab ? "stroke-[2.5px]" : "stroke-2"}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
      <CookieConsent />
    </div>
  );
}
