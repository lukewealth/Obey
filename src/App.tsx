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
import UserProfileSettings from "./components/UserProfileSettings";
import { supabase } from "./supabase";
import { 
  Home, Wallet, RefreshCw, Smartphone, User, Settings, Bell, 
  Sparkles, Menu, X, LogOut, CheckCircle2, ShieldAlert, ChevronRight,
  LayoutDashboard, Globe, ShieldCheck, Zap
} from "lucide-react";

export default function App() {
  // Global Navigation states
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.MARKETING);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Crypto price ticks
  const [btcPrice, setBtcPrice] = useState(64231.80);
  const [ethPrice, setEthPrice] = useState(3452.12);

  // Auth User state
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Compliance and Profile States
  const [profile, setProfile] = useState<UserProfile>({
    name: "Felix Anderson",
    email: "felix@obey.finance",
    phone: "+234 809 102 8824",
    avatar: "FA",
    kycStatus: "Verified",
    balance: 142580.42,
    promoCode: "OBEY-ELITE",
    twoFactorEnabled: true
  });

  // Financial transactions ledger lines
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Ecosystem metric levels
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalUsers: 1420,
    totalVolume: 2458010.55,
    monthlyRevenue: 18240.22,
    pendingKycCount: 2,
    systemStatus: "OPERATIONAL"
  });

  // Live Supabase connection check
  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const user = session.user;
        setCurrentUser(user);
        setCurrentScreen(AppScreen.DASHBOARD);

        const fetchProfile = async () => {
          const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          if (data) {
            setProfile(prev => ({
              ...prev,
              name: data.full_name,
              email: data.email,
              phone: data.phone,
              avatar: data.avatar_url || data.full_name[0],
              kycStatus: data.kyc_status,
              balance: data.balance,
            }));
          }
        };
        fetchProfile();
      } else {
        setCurrentUser(null);
        setCurrentScreen(AppScreen.MARKETING);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Global price variations
  useEffect(() => {
    const timer = setInterval(() => {
      setBtcPrice(prev => prev * (1 + (Math.random() * 0.1 - 0.05) / 100));
      setEthPrice(prev => prev * (1 + (Math.random() * 0.1 - 0.05) / 100));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentScreen(AppScreen.MARKETING);
    setActiveTab(AppTab.HOME);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen text-[#111827] font-sans antialiased selection:bg-primary/20 selection:text-primary relative">
      
      {/* 1. MARKETING SCREEN */}
      {currentScreen === AppScreen.MARKETING && (
        <MarketingPage 
          btcPrice={btcPrice} 
          ethPrice={ethPrice} 
          onNavigate={(screen) => setCurrentScreen(screen)} 
        />
      )}

      {/* 2. AUTHENTICATION SYSTEMS */}
      {(currentScreen === AppScreen.LOGIN || currentScreen === AppScreen.REGISTER || currentScreen === AppScreen.OTP) && (
        <AuthSystem 
          currentScreen={currentScreen} 
          onSuccess={() => {}} 
          onNavigate={(screen) => setCurrentScreen(screen)} 
        />
      )}

      {/* 3. DASHBOARD CONSOLE */}
      {currentScreen === AppScreen.DASHBOARD && (
        <div className="min-h-screen flex flex-col relative">
          
          {/* Global Background Gradient */}
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-bg-white)_0%,_var(--color-accent-blue)_50%,_var(--color-accent-yellow)_100%)] -z-20"></div>

          {/* Top Bar Header */}
          <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-3xl border-b border-white/50 px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-12 h-12 flex items-center justify-center text-gray-500 hover:text-primary hover:bg-white rounded-2xl transition-all active-press border border-transparent hover:border-gray-100"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black tracking-tighter text-primary">OBEY</span>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  SUI NODE: {adminMetrics.systemStatus}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="hidden md:flex items-center gap-4 pr-6 border-r border-gray-100">
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Status</p>
                  <p className="text-sm font-bold text-gray-900">Trading Open</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab(AppTab.PROFILE)}
                className="flex items-center gap-3 pl-2 cursor-pointer group select-none"
              >
                <div className="w-11 h-11 rounded-[18px] bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-white rounded-[16px] flex items-center justify-center font-black text-primary text-sm uppercase">
                    {profile.avatar}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{profile.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tier 2 Verified</p>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-grow flex">
            
            {/* Left Sidebar */}
            <aside className="hidden lg:flex w-72 bg-white/40 backdrop-blur-2xl border-r border-white/50 p-8 flex-col justify-between">
              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] pl-4">Management</p>
                  <nav className="space-y-1.5">
                    {[
                      { tab: AppTab.HOME, label: "Console", icon: LayoutDashboard },
                      { tab: AppTab.WALLET, label: "Treasury", icon: Wallet },
                      { tab: AppTab.TRADE, label: "Exchange", icon: RefreshCw },
                      { tab: AppTab.SERVICES, label: "Services", icon: Smartphone },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setActiveTab(item.tab)}
                        className={`w-full sidebar-item gap-4 ${activeTab === item.tab ? "active" : ""}`}
                      >
                        <item.icon size={20} /> {item.label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] pl-4">System</p>
                  <nav className="space-y-1.5">
                    {[
                      { tab: AppTab.PROFILE, label: "Settings", icon: User },
                      { tab: AppTab.ADMIN, label: "Compliance", icon: ShieldCheck },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setActiveTab(item.tab)}
                        className={`w-full sidebar-item gap-4 ${activeTab === item.tab ? "active" : ""}`}
                      >
                        <item.icon size={20} /> {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bento-card bg-white/60 border-white/80 shadow-none">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Kyc Score</p>
                    <span className="text-xs font-bold text-primary">85%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%] rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium mt-3 leading-relaxed">
                    Complete institutional verification to unlock higher limits.
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full h-14 rounded-[22px] bg-white border border-gray-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 text-gray-400 active-press shadow-sm"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-6 md:p-12 overflow-y-auto w-full max-w-7xl mx-auto pb-32 lg:pb-12 scroll-smooth">
              {activeTab === AppTab.HOME && (
                <DashboardHome 
                  profile={profile} 
                  transactions={transactions} 
                  onNavigateTab={setActiveTab}
                  onSelectAction={(action) => {
                    if (action === "fund" || action === "withdraw" || action === "transfer") setActiveTab(AppTab.WALLET);
                    else setActiveTab(AppTab.SERVICES);
                  }}
                />
              )}

              {activeTab === AppTab.WALLET && (
                <WalletSystem 
                  profile={profile} 
                  transactions={transactions} 
                  onFundWallet={() => {}}
                  onWithdrawWallet={async () => true}
                  onTransfer={async () => true}
                />
              )}

              {activeTab === AppTab.TRADE && (
                <CryptoSystem 
                  profile={profile} 
                  btcPrice={btcPrice} 
                  ethPrice={ethPrice} 
                  onTradeCompleted={() => {}} 
                />
              )}

              {activeTab === AppTab.SERVICES && (
                <AirtimeModule 
                  profile={profile} 
                  onPurchase={async () => true} 
                />
              )}

              {activeTab === AppTab.PROFILE && (
                <UserProfileSettings 
                  profile={profile} 
                  onUpdateProfile={() => {}} 
                />
              )}

              {activeTab === AppTab.ADMIN && (
                <AdminSystem 
                  metrics={adminMetrics} 
                  profile={profile} 
                  onApproveKyc={() => {}} 
                  onUpdateSystemStatus={() => {}}
                />
              )}
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/70 backdrop-blur-2xl border-t border-white/50 px-6 py-4 flex justify-around items-center">
            {[
              { tab: AppTab.HOME, label: "Home", icon: Home },
              { tab: AppTab.WALLET, label: "Wallet", icon: Wallet },
              { tab: AppTab.TRADE, label: "Trade", icon: RefreshCw },
              { tab: AppTab.SERVICES, label: "Apps", icon: Smartphone },
            ].map((item) => (
              <button 
                key={item.label}
                onClick={() => setActiveTab(item.tab)}
                className={`flex flex-col items-center gap-1.5 transition-all ${
                  activeTab === item.tab ? "text-primary scale-110" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <item.icon size={22} />
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Mobile Drawer Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <div className="fixed inset-0 z-50 flex">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)} 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                ></motion.div>
                
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="relative w-80 bg-white shadow-2xl p-10 flex flex-col justify-between h-full"
                >
                  <div className="space-y-12">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-black text-primary tracking-tighter">OBEY</span>
                      <button 
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <nav className="space-y-2">
                      {[
                        { tab: AppTab.HOME, label: "Console", icon: LayoutDashboard },
                        { tab: AppTab.WALLET, label: "Treasury", icon: Wallet },
                        { tab: AppTab.TRADE, label: "Exchange", icon: RefreshCw },
                        { tab: AppTab.SERVICES, label: "Services", icon: Smartphone },
                        { tab: AppTab.PROFILE, label: "Settings", icon: User },
                        { tab: AppTab.ADMIN, label: "Compliance", icon: ShieldCheck },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => { setActiveTab(item.tab); setMobileMenuOpen(false); }}
                          className={`w-full flex items-center gap-4 px-6 h-14 rounded-[20px] text-sm font-black transition-all ${
                            activeTab === item.tab ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-primary hover:bg-accent-blue"
                          }`}
                        >
                          <item.icon size={20} /> {item.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full py-5 bg-red-50 text-red-500 rounded-[20px] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 active-press"
                  >
                    <LogOut size={18} /> Exit Account
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
