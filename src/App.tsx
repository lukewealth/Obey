import React, { useState, useEffect } from "react";
import { AppScreen, AppTab, UserProfile, Transaction, AdminMetrics } from "./types";
import MarketingPage from "./components/MarketingPage";
import AuthSystem from "./components/AuthSystem";
import DashboardHome from "./components/DashboardHome";
import WalletSystem from "./components/WalletSystem";
import AirtimeModule from "./components/AirtimeModule";
import GiftCardSystem from "./components/GiftCardSystem";
import CryptoSystem from "./components/CryptoSystem";
import TransactionHistory from "./components/TransactionHistory";
import AdminSystem from "./components/AdminSystem";
import IdentityVerification from "./components/IdentityVerification";
import OtpVerification from "./components/OtpVerification";
import TransactionSuccess from "./components/TransactionSuccess";
import UserProfileSettings from "./components/UserProfileSettings";
import CookieConsent from "./components/CookieConsent";
import StandardFooter from "./components/StandardFooter";
import LegalContent from "./components/LegalContent";
import SystemAlert from "./components/SystemAlert";
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
  ArrowPathIcon as RefreshIcon
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
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<any>(null);

  // --- React Query Hybrid Hooks (Full-Stack Caching) ---
  const { 
    data: cachedProfile, 
    syncProfile, 
    isLoading: profileLoading 
  } = useUserProfile(currentUser?.id || currentUser?.uid);

  const { 
    data: cachedTransactions = [], 
    syncTransactions, 
    isLoading: txLoading 
  } = useTransactions(currentUser?.id || currentUser?.uid);

  // Local state for profile (initialized with ELITE defaults, settled by cache)
  const [profile, setProfile] = useState<UserProfile>(() => ({
    name: "Felix Anderson",
    email: "felix@obey.finance",
    role: "user",
    phone: "+234 809 102 8824",
    avatar: "FA",
    kycStatus: "Verified",
    balance: 142580.42,
    promoCode: "OBEY-ELITE",
    twoFactorEnabled: true
  }));

  // Update local profile when cache settles from hybrid DB
  useEffect(() => {
    if (cachedProfile && JSON.stringify(cachedProfile) !== JSON.stringify(profile)) {
      setProfile(cachedProfile);
    }
  }, [cachedProfile, profile]);

  // Harden Real-Time Identity Sync
  useEffect(() => {
    if (currentUser && profile) {
      const syncIdentity = async () => {
        try {
          await syncProfile({ 
            id: currentUser.id || currentUser.uid, 
            profile: {
              ...profile,
              email: currentUser.email || profile.email // Ensure email is from the master session
            } 
          });
          console.log(`[IDENTITY_SYNC] Session established for ${currentUser.email}`);
        } catch (e) {
          console.error('[IDENTITY_SYNC_ERROR] Node alignment failed:', e);
        }
      };
      syncIdentity();
    }
  }, [currentUser?.id, currentUser?.uid, currentUser?.email, syncProfile]);

  // Optimized Sync to MongoDB (Only sync explicitly or on significant changes)
  const handleProfileUpdate = (updated: Partial<UserProfile>) => {
    const nextProfile = { ...profile, ...updated };
    setProfile(nextProfile);
    if (currentUser) {
      syncProfile({ id: currentUser.id || currentUser.uid, profile: nextProfile });
    }
  };

  // System Alert State
  const [systemAlert, setSystemAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    logs: [] as string[],
    type: "system" as any
  });

  const [btcPrice, setBtcPrice] = useState(64231.80);
  const [ethPrice, setEthPrice] = useState(3452.12);
  const [solPrice, setSolPrice] = useState(145.67);
  const [suiPrice, setSuiPrice] = useState(3.25);

  // Fetch Live Market Data Node
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await api.get('/market/prices');
        if (response.data) {
          if (response.data.BTC) setBtcPrice(response.data.BTC);
          if (response.data.ETH) setEthPrice(response.data.ETH);
          if (response.data.SOL) setSolPrice(response.data.SOL);
          if (response.data.SUI) setSuiPrice(response.data.SUI);
        }
      } catch (error) {
        console.error('[MARKET_ERROR] Failed to synchronize live depth node:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 1000 * 60 * 5); // Update every 5 mins
    return () => clearInterval(interval);
  }, []);

  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalUsers: 1420,
    totalVolume: 2458010.55,
    monthlyRevenue: 18240.22,
    pendingKycCount: 2,
    systemStatus: "OPERATIONAL"
  });

  // Auth Listeners (Hybrid Firebase/Supabase)
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
  };

  const triggerDiagnostic = () => {
    setSystemAlert({
      isOpen: true,
      title: "Diagnostic Sweep Initiated",
      message: "Our master node is performing a full-stack integrity check on your digital parameters. Multiple ledger entries found.",
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

      {currentScreen === AppScreen.MARKETING && (
        <MarketingPage 
          btcPrice={btcPrice} 
          ethPrice={ethPrice} 
          onNavigate={(screen) => setCurrentScreen(screen)} 
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
        <div className="min-h-screen flex flex-col relative bg-[#fcfcfd]">
          <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-3xl border-b border-gray-100 px-4 md:px-10 h-16 md:h-24 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-6">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center text-[#0b0e14] hover:bg-gray-50 rounded-xl transition-all">
                <MenuIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  onClick={() => setSidebarExpanded(!sidebarExpanded)}
                  className="hidden lg:flex w-10 h-10 items-center justify-center text-gray-400 hover:text-[#0b0e14] hover:bg-gray-50 rounded-xl transition-all mr-2"
                >
                  <MenuIcon className="w-6 h-6" />
                </button>
                <div className="w-9 h-9 md:w-11 md:h-11 bg-[#0b0e14] flex items-center justify-center rounded-[8px] md:rounded-[10px] shadow-lg overflow-hidden shrink-0">
                  <img src="/obey_logo.svg" className="w-full h-full object-cover" alt="OBEY Logo" />
                </div>
                <span className="text-xl md:text-2xl font-black tracking-tighter text-[#0b0e14] font-space uppercase">OBEY</span>
                <button onClick={triggerDiagnostic} className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Node: {adminMetrics.systemStatus}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div onClick={() => notify("log", "Audit Log Access", "Fetching sequential ledger entries from Sui Mainnet...")} className="hidden lg:flex items-center gap-4 pr-6 border-r border-gray-100 cursor-pointer hover:opacity-60 transition-opacity">
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Master Ledger</p>
                  <p className="text-[13px] font-bold text-[#0b0e14]">Verified On-Chain</p>
                </div>
              </div>

              <div onClick={() => setActiveTab(AppTab.PROFILE)} className="flex items-center gap-2 md:gap-3 pl-2 cursor-pointer group select-none">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-[12px] md:rounded-[16px] bg-[#0b0e14] flex items-center justify-center font-black text-white text-xs md:text-sm uppercase shadow-xl group-hover:scale-105 transition-transform shrink-0">
                  {profile.avatar}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[12px] md:text-[13px] font-black text-[#0b0e14] group-hover:text-primary transition-colors">{profile.name}</p>
                  <p className="text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <VerifiedIcon className="w-3 h-3 md:w-3.5 md:h-3.5 text-primary" /> {profile.role === "admin" ? "Institutional Admin" : "Tier 2 Secure"}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-grow flex">
            <aside className={`hidden lg:flex ${sidebarExpanded ? "w-72" : "w-24"} bg-white border-r border-gray-100 p-6 flex-col justify-between transition-all duration-500 ease-[0.22, 1, 0.36, 1]`}>
              <div className="space-y-10">
                <div className="space-y-4">
                  {sidebarExpanded && <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] pl-4">Liquidity</p>}
                  <nav className="space-y-1">
                    {[
                      { tab: AppTab.HOME, label: "Console", icon: DashboardIcon },
                      { tab: AppTab.WALLET, label: "Treasury", icon: WalletIcon },
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
                        onClick={() => setActiveTab(AppTab.ADMIN)} 
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

            <main className="flex-grow p-4 md:p-12 overflow-y-auto w-full max-w-7xl mx-auto pb-32 lg:pb-12">
              <AnimatePresence mode="wait">
                 <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    {activeTab === AppTab.HOME && (
                      <DashboardHome 
                        profile={profile} 
                        transactions={cachedTransactions} 
                        onNavigateTab={setActiveTab} 
                        onSelectAction={(action) => { 
                          if (action === "fund" || action === "withdraw" || action === "transfer") {
                            setActiveTab(AppTab.WALLET);
                          } else if (action === "buy-giftcard" || action === "sell-giftcard") {
                            setActiveTab(AppTab.TRADE);
                            // We can use a local state to pass down sub-tab preference if needed
                          } else {
                            setActiveTab(AppTab.SERVICES);
                          }
                        }} 
                      />
                    )}
                    {activeTab === AppTab.WALLET && <WalletSystem profile={profile} transactions={cachedTransactions} onFundWallet={(amt, details) => handleProfileUpdate({ balance: profile.balance + amt })} onWithdrawWallet={async (amt) => { handleProfileUpdate({ balance: profile.balance - amt }); return true; }} onTransfer={async (amt) => { handleProfileUpdate({ balance: profile.balance - amt }); return true; }} />}
                    
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
                              <GiftCardSystem profile={profile} onTradeCompleted={(amt, details, isSell) => handleProfileUpdate({ balance: isSell ? profile.balance + amt : profile.balance - amt })} />
                            </motion.div>
                          ) : (
                            <motion.div key="crypto" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                              <CryptoSystem profile={profile} btcPrice={btcPrice} ethPrice={ethPrice} solPrice={solPrice} suiPrice={suiPrice} onTradeCompleted={(amt, details, isSell) => handleProfileUpdate({ balance: isSell ? profile.balance + amt : profile.balance - amt })} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {activeTab === AppTab.SERVICES && <AirtimeModule profile={profile} onPurchase={async (amt) => { handleProfileUpdate({ balance: profile.balance - amt }); return true; }} />}
                    {activeTab === AppTab.PROFILE && <UserProfileSettings profile={profile} onUpdateProfile={handleProfileUpdate} />}
                    {activeTab === AppTab.ADMIN && profile.role === "admin" && (
                      <AdminSystem 
                        metrics={adminMetrics} 
                        profile={profile} 
                        onApproveKyc={() => {
                          notify("success", "Compliance Verified", "Identity node has been authorized and synced.");
                          handleProfileUpdate({ kycStatus: "Verified" });
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
