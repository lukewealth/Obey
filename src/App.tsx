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

import { syncUserWithMongoDB, syncTransactionsWithMongoDB, fetchUserFallback, fetchTransactionsFallback } from "./services/api";
import { auth as firebaseAuth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const { notify } = useNotification();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.MARKETING);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  
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

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [profile, setProfile] = useState<UserProfile>(() => {
    const cached = localStorage.getItem("obey-profile-cache");
    return cached ? JSON.parse(cached) : {
      name: "Felix Anderson",
      email: "felix@obey.finance",
      role: "user",
      phone: "+234 809 102 8824",
      avatar: "FA",
      kycStatus: "Verified",
      balance: 142580.42,
      promoCode: "OBEY-ELITE",
      twoFactorEnabled: true
    };
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalUsers: 1420,
    totalVolume: 2458010.55,
    monthlyRevenue: 18240.22,
    pendingKycCount: 2,
    systemStatus: "OPERATIONAL"
  });

  // Sync with MongoDB
  useEffect(() => {
    if (currentUser) {
      syncUserWithMongoDB(currentUser.id || currentUser.uid, profile);
    }
  }, [profile, currentUser]);

  useEffect(() => {
    if (currentUser && transactions.length > 0) {
      syncTransactionsWithMongoDB(currentUser.id || currentUser.uid, transactions);
    }
  }, [transactions, currentUser]);

  // Auth Listener
  useEffect(() => {
    if (!supabase) return;

    const handleProfileSync = async (user: any) => {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id || user.uid).single();
        
        if (data) {
          const updatedProfile: UserProfile = {
            name: data.full_name,
            email: data.email,
            role: data.role || (data.email === "contact@tricode.pro" ? "admin" : "user"),
            phone: data.phone,
            avatar: data.avatar_url || data.full_name?.[0] || user.email?.[0].toUpperCase(),
            kycStatus: data.kyc_status,
            balance: data.balance,
            promoCode: "OBEY-ELITE",
            twoFactorEnabled: true
          };
          setProfile(updatedProfile);
          localStorage.setItem("obey-profile-cache", JSON.stringify(updatedProfile));
          return;
        }

        // If data is missing (not found), try fallback or create new
        const fallback = await fetchUserFallback(user.id || user.uid);
        if (fallback) {
          setProfile(fallback);
          localStorage.setItem("obey-profile-cache", JSON.stringify(fallback));
          return;
        }

        const newProfile: any = {
          id: user.id || user.uid,
          full_name: user.displayName || user.user_metadata?.full_name || user.email?.split("@")[0],
          email: user.email,
          role: user.email === "contact@tricode.pro" ? "admin" : "user",
          avatar_url: user.photoURL || user.user_metadata?.avatar_url || user.email?.[0].toUpperCase(),
          kyc_status: "Pending",
          balance: 142580.42
        };

        await supabase.from('profiles').upsert([newProfile]);
        setProfile({
          name: newProfile.full_name,
          email: newProfile.email,
          role: newProfile.role,
          phone: "",
          avatar: newProfile.avatar_url,
          kycStatus: "Pending",
          balance: 142580.42,
          promoCode: "OBEY-ELITE",
          twoFactorEnabled: false
        });
      } catch (error: any) {
        console.warn("⚠️ Profile Sync Warning:", error.message);
      }
    };

    const unsubscribeFirebase = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        setCurrentUser(user);
        if (currentScreen === AppScreen.LOGIN || currentScreen === AppScreen.REGISTER) {
           setCurrentScreen(AppScreen.DASHBOARD);
           notify("success", "Access Authorized", `Welcome back, ${user.email}`);
        }
        await handleProfileSync(user);
      }
    });

    const { data: { subscription: subSupabase } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const user = session.user;
        setCurrentUser(user);
        if (currentScreen === AppScreen.LOGIN || currentScreen === AppScreen.REGISTER) {
           setCurrentScreen(AppScreen.DASHBOARD);
           notify("success", "Access Authorized", `Welcome back, ${user.email}`);
        }
        await handleProfileSync(user);
      } else {
        if (!firebaseAuth.currentUser) {
          setCurrentUser(null);
          if (currentScreen === AppScreen.DASHBOARD) {
             setCurrentScreen(AppScreen.MARKETING);
          }
          localStorage.removeItem("obey-profile-cache");
        }
      }
    });

    return () => {
      unsubscribeFirebase();
      subSupabase.unsubscribe();
    };
  }, [currentScreen]);

  const handleLogout = async () => {
    await Promise.all([
      supabase.auth.signOut(),
      firebaseAuth.signOut()
    ]);
    notify("info", "Session Terminated", "Your institutional access has been securely revoked.");
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
          <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-3xl border-b border-gray-100 px-6 md:px-10 h-20 md:h-24 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-11 h-11 flex items-center justify-center text-[#0b0e14] hover:bg-gray-50 rounded-xl transition-all">
                <MenuIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black tracking-tighter text-[#0b0e14] font-space uppercase">OBEY</span>
                <button onClick={triggerDiagnostic} className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Node: {adminMetrics.systemStatus}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div onClick={() => notify("log", "Audit Log Access", "Fetching sequential ledger entries from Sui Mainnet...")} className="hidden lg:flex items-center gap-4 pr-6 border-r border-gray-100 cursor-pointer hover:opacity-60 transition-opacity">
                <div className="text-right">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Master Ledger</p>
                  <p className="text-[13px] font-bold text-[#0b0e14]">Verified On-Chain</p>
                </div>
              </div>

              <div onClick={() => setActiveTab(AppTab.PROFILE)} className="flex items-center gap-3 pl-2 cursor-pointer group select-none">
                <div className="w-11 h-11 rounded-[16px] bg-[#0b0e14] flex items-center justify-center font-black text-white text-sm uppercase shadow-xl group-hover:scale-105 transition-transform">
                  {profile.avatar}
                </div>
                <div className="hidden lg:block">
                  <p className="text-[13px] font-black text-[#0b0e14] group-hover:text-primary transition-colors">{profile.name}</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <VerifiedIcon className="w-3.5 h-3.5 text-primary" /> {profile.role === "admin" ? "Institutional Admin" : "Tier 2 Secure"}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-grow flex">
            <aside className="hidden lg:flex w-72 bg-white border-r border-gray-100 p-8 flex-col justify-between">
              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] pl-4">Liquidity</p>
                  <nav className="space-y-1">
                    {[
                      { tab: AppTab.HOME, label: "Console", icon: DashboardIcon },
                      { tab: AppTab.WALLET, label: "Treasury", icon: WalletIcon },
                      { tab: AppTab.TRADE, label: "Exchange", icon: RefreshIcon },
                      { tab: AppTab.SERVICES, label: "Services", icon: AppIcon },
                    ].map((item) => (
                      <button key={item.label} onClick={() => setActiveTab(item.tab)} className={`w-full flex items-center gap-4 px-4 h-14 rounded-2xl text-[13px] font-black transition-all ${activeTab === item.tab ? "bg-[#0b0e14] text-white shadow-xl shadow-gray-200" : "text-gray-400 hover:text-[#0b0e14] hover:bg-gray-50"}`}>
                        <item.icon className="w-5 h-5" /> {item.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] pl-4">Ecosystem</p>
                  <nav className="space-y-1">
                    <button onClick={() => setActiveTab(AppTab.PROFILE)} className={`w-full flex items-center gap-4 px-4 h-14 rounded-2xl text-[13px] font-black transition-all ${activeTab === AppTab.PROFILE ? "bg-[#0b0e14] text-white shadow-xl shadow-gray-200" : "text-gray-400 hover:text-[#0b0e14] hover:bg-gray-50"}`}>
                      <SettingsIcon className="w-5 h-5" /> Parameters
                    </button>
                    {profile.role === "admin" && (
                      <button onClick={() => setActiveTab(AppTab.ADMIN)} className={`w-full flex items-center gap-4 px-4 h-14 rounded-2xl text-[13px] font-black transition-all ${activeTab === AppTab.ADMIN ? "bg-[#0b0e14] text-white shadow-xl shadow-gray-200" : "text-gray-400 hover:text-[#0b0e14] hover:bg-gray-50"}`}>
                        <ShieldCheck className="w-5 h-5" /> Compliance
                      </button>
                    )}



                  </nav>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100">
                <button onClick={handleLogout} className="w-full h-14 rounded-[22px] bg-white border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 text-gray-400 active-press shadow-sm">
                  <LogOutIcon className="w-5 h-5" /> Sign Out
                </button>
              </div>
            </aside>

            <main className="flex-grow p-6 md:p-12 overflow-y-auto w-full max-w-7xl mx-auto pb-32 lg:pb-12">
              <AnimatePresence mode="wait">
                 <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    {activeTab === AppTab.HOME && <DashboardHome profile={profile} transactions={transactions} onNavigateTab={setActiveTab} onSelectAction={(action) => { if (action === "fund" || action === "withdraw" || action === "transfer") setActiveTab(AppTab.WALLET); else setActiveTab(AppTab.SERVICES); }} />}
                    {activeTab === AppTab.WALLET && <WalletSystem profile={profile} transactions={transactions} onFundWallet={() => {}} onWithdrawWallet={async () => true} onTransfer={async () => true} />}
                    {activeTab === AppTab.TRADE && <CryptoSystem profile={profile} btcPrice={btcPrice} ethPrice={ethPrice} onTradeCompleted={() => {}} />}
                    {activeTab === AppTab.SERVICES && <AirtimeModule profile={profile} onPurchase={async () => true} />}
                    {activeTab === AppTab.PROFILE && <UserProfileSettings profile={profile} onUpdateProfile={() => {}} />}
                    {activeTab === AppTab.ADMIN && profile.role === "admin" && <AdminSystem metrics={adminMetrics} profile={profile} onApproveKyc={() => {}} onUpdateSystemStatus={() => {}} />}
                 </motion.div>
              </AnimatePresence>
            </main>
          </div>

          <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/90 backdrop-blur-2xl border-t border-gray-100 px-6 py-5 flex justify-around items-center">
            {[
              { tab: AppTab.HOME, label: "Home", icon: HomeIcon },
              { tab: AppTab.WALLET, label: "Wallet", icon: WalletIcon },
              { tab: AppTab.TRADE, label: "Trade", icon: RefreshIcon },
              { tab: AppTab.SERVICES, label: "Apps", icon: AppIcon },
            ].map((item) => (
              <button key={item.label} onClick={() => setActiveTab(item.tab)} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === item.tab ? "text-primary scale-110 font-black" : "text-gray-400"}`}>
                <item.icon className="w-6 h-6" />
                <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
      <CookieConsent />
    </div>
  );
}
