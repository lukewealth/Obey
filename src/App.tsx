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
  Sparkles, Menu, X, LogOut, CheckCircle2, ShieldAlert
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

  // Live Supabase connection check & real-time state synchronization subscriptions
  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client not initialized. Real-time features and Auth will be unavailable.");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const user = session.user;
        setCurrentUser(user);
        setCurrentScreen(AppScreen.DASHBOARD);

        // 1. Fetch and Subscribe to User Profile
        const fetchProfile = async () => {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (data) {
            setProfile({
              name: data.full_name,
              email: data.email,
              phone: data.phone,
              avatar: data.avatar_url || data.full_name[0],
              kycStatus: data.kyc_status,
              balance: data.balance,
              promoCode: "",
              twoFactorEnabled: false
            });
          }
        };
        fetchProfile();

        const profileSub = supabase
          .channel('public:profiles')
          .on('postgres_changes', { event: '*', filter: `id=eq.${user.id}`, table: 'profiles' }, payload => {
            const data = payload.new as any;
            setProfile(prev => ({
              ...prev,
              name: data.full_name,
              balance: data.balance,
              kycStatus: data.kyc_status,
            }));
          })
          .subscribe();

        // 2. Fetch and Subscribe to Transactions
        const fetchTransactions = async () => {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (data) {
            setTransactions(data.map(t => ({
              id: t.id,
              title: t.title,
              category: t.category,
              type: t.type,
              amount: t.amount,
              fee: t.fee,
              date: new Date(t.created_at).toLocaleDateString(),
              time: new Date(t.created_at).toLocaleTimeString(),
              status: t.status
            })));
          }
        };
        fetchTransactions();

        const txSub = supabase
          .channel('public:transactions')
          .on('postgres_changes', { event: 'INSERT', filter: `user_id=eq.${user.id}`, table: 'transactions' }, payload => {
            const t = payload.new as any;
            setTransactions(prev => [{
              id: t.id,
              title: t.title,
              category: t.category,
              type: t.type,
              amount: t.amount,
              fee: t.fee,
              date: new Date(t.created_at).toLocaleDateString(),
              time: new Date(t.created_at).toLocaleTimeString(),
              status: t.status
            }, ...prev]);
          })
          .subscribe();

        return () => {
          profileSub.unsubscribe();
          txSub.unsubscribe();
        };
      } else {
        setCurrentUser(null);
        setCurrentScreen(AppScreen.MARKETING);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Global price variations
  useEffect(() => {
    const timer = setInterval(() => {
      setBtcPrice(prev => prev * (1 + (Math.random() * 0.1 - 0.05) / 100));
      setEthPrice(prev => prev * (1 + (Math.random() * 0.1 - 0.05) / 100));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auth synchronization profiles
  const handleAuthSuccess = (partialProfile: Partial<UserProfile>) => {
    // Supabase Auth change listener handles this
  };

  // Capital ledger operations with Supabase persistence
  const handleFundWallet = async (amount: number, details: string) => {
    if (!currentUser) return;
    try {
      const { data: profileData } = await supabase.from('profiles').select('balance').eq('id', currentUser.id).single();
      const newBalance = (profileData?.balance || 0) + amount;

      await supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);
      
      await supabase.from('transactions').insert([{
        user_id: currentUser.id,
        title: details,
        category: 'Transfer',
        type: 'Credit',
        amount: amount,
        fee: 0,
        status: 'Success'
      }]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWithdrawWallet = async (amount: number, details: string): Promise<boolean> => {
    if (!currentUser || amount > profile.balance) return false;
    try {
      const { data: profileData } = await supabase.from('profiles').select('balance').eq('id', currentUser.id).single();
      const newBalance = (profileData?.balance || 0) - amount;

      await supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);

      await supabase.from('transactions').insert([{
        user_id: currentUser.id,
        title: details,
        category: 'Transfer',
        type: 'Debit',
        amount: amount,
        fee: 1.50,
        status: 'Success'
      }]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handlePeerTransfer = async (amount: number, recipient: string): Promise<boolean> => {
    if (!currentUser || amount > profile.balance) return false;
    try {
      const { data: profileData } = await supabase.from('profiles').select('balance').eq('id', currentUser.id).single();
      const newBalance = (profileData?.balance || 0) - amount;

      await supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);

      await supabase.from('transactions').insert([{
        user_id: currentUser.id,
        title: `Transfer to ${recipient}`,
        category: 'Transfer',
        type: 'Debit',
        amount: amount,
        fee: 0.00,
        status: 'Success'
      }]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleGenericPurchase = async (amount: number, description: string): Promise<boolean> => {
    if (!currentUser || amount > profile.balance) return false;
    try {
      const typeLabel = description.includes("Airtime") ? "Airtime" : description.includes("Data") ? "Data" : "GiftCard";
      const { data: profileData } = await supabase.from('profiles').select('balance').eq('id', currentUser.id).single();
      const newBalance = (profileData?.balance || 0) - amount;

      await supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);

      await supabase.from('transactions').insert([{
        user_id: currentUser.id,
        title: description.split(" delivered")[0],
        category: typeLabel,
        type: 'Debit',
        amount: amount,
        fee: 0.00,
        status: 'Success'
      }]);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleCryptoTrade = async (amount: number, details: string, isSell: boolean) => {
    if (!currentUser) return;
    try {
      const { data: profileData } = await supabase.from('profiles').select('balance').eq('id', currentUser.id).single();
      const newBalance = isSell ? (profileData?.balance || 0) + amount : (profileData?.balance || 0) - amount;

      await supabase.from('profiles').update({ balance: newBalance }).eq('id', currentUser.id);

      await supabase.from('transactions').insert([{
        user_id: currentUser.id,
        title: details,
        category: 'Crypto',
        type: isSell ? 'Credit' : 'Debit',
        amount: amount,
        fee: 0,
        status: 'Success'
      }]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProfile = async (updatedFields: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      await supabase.from('profiles').update({
        full_name: updatedFields.name,
        phone: updatedFields.phone,
      }).eq('id', currentUser.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveKycAdmin = async () => {
    if (!currentUser) return;
    try {
      await supabase.from('profiles').update({ kyc_status: 'Verified' }).eq('id', currentUser.id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSystemStatus = async (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => {
    setAdminMetrics(prev => ({ ...prev, systemStatus: status }));
  };

  const handleSelectQuickAction = (action: string) => {
    if (action === "buy-airtime" || action === "buy-data") {
      setActiveTab(AppTab.SERVICES);
    } else if (action === "buy-giftcard" || action === "sell-giftcard") {
      setActiveTab(AppTab.WALLET); 
    } else {
      setActiveTab(AppTab.WALLET);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentScreen(AppScreen.MARKETING);
    setActiveTab(AppTab.HOME);
    setMobileMenuOpen(false);
  };

  return (
    <div className="bg-[#0b1220] min-h-screen text-[#f8faff] font-sans antialiased overflow-x-hidden selection:bg-[#0057FF]/30 selection:text-white">
      
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
          onSuccess={handleAuthSuccess} 
          onNavigate={(screen) => setCurrentScreen(screen)} 
        />
      )}

      {/* 3. DOCK CONSOLE SYSTEM PANEL */}
      {currentScreen === AppScreen.DASHBOARD && (
        <div className="min-h-screen flex flex-col">
          
          {/* Main Console Top Bar Header */}
          <header className="sticky top-0 z-30 bg-[#0B1220]/90 border-b border-[#242F41] backdrop-blur-md px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                aria-label="Toggle menu"
              >
                <Menu size={20} />
              </button>
              <span className="text-xl font-black text-white tracking-widest uppercase">OBEY</span>
              
              {/* Operational Banner */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-[#242F41] text-[#12B76A] rounded-lg text-[10px] uppercase font-bold tracking-wider">
                <span className="w-1.5 h-1.5 bg-[#12B76A] rounded-full animate-pulse"></span>
                CHANNEL: {adminMetrics.systemStatus}
              </div>
            </div>

            {/* Profile cards widgets header */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all outline-none">
                <Bell size={18} />
              </button>

              <div 
                onClick={() => { setActiveTab(AppTab.PROFILE); }}
                className="flex items-center gap-2.5 pl-3.5 border-l border-[#242F41] cursor-pointer select-none group"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0057FF] to-[#00C6FF] font-black text-xs text-white flex items-center justify-center">
                  {profile.avatar}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-white group-hover:text-[#00C6FF] transition-colors">{profile.name}</p>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">KYC: {profile.kycStatus}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Large layout container */}
          <div className="flex-grow flex">
            
            {/* Desktop Left Static Sidebar */}
            <aside className="hidden lg:flex w-64 bg-[#0a0f1c]/40 border-r border-[#242F41] p-6 flex-col justify-between">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-3">Main Directory</p>
                <nav className="space-y-1.5">
                  <button
                    onClick={() => setActiveTab(AppTab.HOME)}
                    className={`w-full sidebar-item gap-3.5 font-bold text-xs ${
                      activeTab === AppTab.HOME ? "active" : ""
                    }`}
                  >
                    <Home size={16} /> Home Console
                  </button>
                  <button
                    onClick={() => setActiveTab(AppTab.WALLET)}
                    className={`w-full sidebar-item gap-3.5 font-bold text-xs ${
                      activeTab === AppTab.WALLET ? "active" : ""
                    }`}
                  >
                    <Wallet size={16} /> Treasury Wallet
                  </button>
                  <button
                    onClick={() => setActiveTab(AppTab.TRADE)}
                    className={`w-full sidebar-item gap-3.5 font-bold text-xs ${
                      activeTab === AppTab.TRADE ? "active" : ""
                    }`}
                  >
                    <RefreshCw size={16} /> Crypto Desk
                  </button>
                  <button
                    onClick={() => setActiveTab(AppTab.SERVICES)}
                    className={`w-full sidebar-item gap-3.5 font-bold text-xs ${
                      activeTab === AppTab.SERVICES ? "active" : ""
                    }`}
                  >
                    <Smartphone size={16} /> Airtime / Utility
                  </button>
                  <button
                    onClick={() => setActiveTab(AppTab.PROFILE)}
                    className={`w-full sidebar-item gap-3.5 font-bold text-xs ${
                      activeTab === AppTab.PROFILE ? "active" : ""
                    }`}
                  >
                    <User size={16} /> Bio Settings
                  </button>
                  <button
                    onClick={() => setActiveTab(AppTab.ADMIN)}
                    className={`w-full sidebar-item gap-3.5 font-bold text-xs ${
                      activeTab === AppTab.ADMIN ? "active" : ""
                    }`}
                  >
                    <Settings size={16} /> Compliance Admin
                  </button>
                </nav>
              </div>

              <div className="space-y-4">
                {/* Visual KYC Level Mini-Bento Status */}
                <div className="p-4 bg-[#161F30] border border-[#242F41] rounded-[16px]">
                  <p className="text-xs text-slate-400 mb-1 font-medium">KYC Clearance: {profile.kycStatus === "Verified" ? "Level 2" : "Level 1"}</p>
                  <div className="w-full bg-[#242F41] h-1.5 rounded-full">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        profile.kycStatus === "Verified" ? "bg-[#12B76A] w-full" : "bg-yellow-500 w-[40%]"
                      }`}
                    ></div>
                  </div>
                  <p className="text-[10px] mt-2 text-slate-400 opacity-80 font-medium">
                    Secured Node: {profile.twoFactorEnabled ? "2FA Enabled" : "2FA Disabled"}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full h-12 rounded-xl bg-white/5 border border-[#242F41] hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-gray-400 active-press"
                >
                  <LogOut size={16} /> Log Out Desk
                </button>
              </div>
            </aside>

            {/* Mobile / Tablet Bottom Navigation Bar overlay */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#0c1322]/95 border-t border-white/5 py-2.5 px-4 flex justify-around items-center backdrop-blur-md">
              <button 
                onClick={() => setActiveTab(AppTab.HOME)}
                className={`flex flex-col items-center gap-1 ${activeTab === AppTab.HOME ? "text-[#00C6FF]" : "text-gray-500"}`}
              >
                <Home size={18} />
                <span className="text-[9px] font-extrabold uppercase tracking-wide">Home</span>
              </button>
              <button 
                onClick={() => setActiveTab(AppTab.WALLET)}
                className={`flex flex-col items-center gap-1 ${activeTab === AppTab.WALLET ? "text-[#00C6FF]" : "text-gray-500"}`}
              >
                <Wallet size={18} />
                <span className="text-[9px] font-extrabold uppercase tracking-wide">Wallet</span>
              </button>
              <button 
                onClick={() => setActiveTab(AppTab.TRADE)}
                className={`flex flex-col items-center gap-1 ${activeTab === AppTab.TRADE ? "text-[#00C6FF]" : "text-gray-500"}`}
              >
                <RefreshCw size={18} />
                <span className="text-[9px] font-extrabold uppercase tracking-wide">Crypto</span>
              </button>
              <button 
                onClick={() => setActiveTab(AppTab.SERVICES)}
                className={`flex flex-col items-center gap-1 ${activeTab === AppTab.SERVICES ? "text-[#00C6FF]" : "text-gray-500"}`}
              >
                <Smartphone size={18} />
                <span className="text-[9px] font-extrabold uppercase tracking-wide">Utility</span>
              </button>
            </nav>

            {/* Main scrollable body viewport */}
            <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full pb-24 lg:pb-12">
              
              {activeTab === AppTab.HOME && (
                <DashboardHome 
                  profile={profile} 
                  transactions={transactions} 
                  onNavigateTab={setActiveTab}
                  onSelectAction={handleSelectQuickAction}
                />
              )}

              {activeTab === AppTab.WALLET && (
                <div className="space-y-8">
                  <WalletSystem 
                    profile={profile} 
                    transactions={transactions} 
                    onFundWallet={handleFundWallet}
                    onWithdrawWallet={handleWithdrawWallet}
                    onTransfer={handlePeerTransfer}
                  />

                  {/* Nested Gift Card Module and Ledger inside Wallet screen */}
                  <div className="border-t border-white/5 pt-8">
                    <GiftCardSystem 
                      profile={profile} 
                      onTradeCompleted={handleCryptoTrade} 
                    />
                  </div>

                  <div className="border-t border-white/5 pt-8">
                    <TransactionHistory transactions={transactions} />
                  </div>
                </div>
              )}

              {activeTab === AppTab.TRADE && (
                <CryptoSystem 
                  profile={profile} 
                  btcPrice={btcPrice} 
                  ethPrice={ethPrice} 
                  onTradeCompleted={handleCryptoTrade} 
                />
              )}

              {activeTab === AppTab.SERVICES && (
                <AirtimeModule 
                  profile={profile} 
                  onPurchase={handleGenericPurchase} 
                />
              )}

              {activeTab === AppTab.PROFILE && (
                <UserProfileSettings 
                  profile={profile} 
                  onUpdateProfile={handleUpdateProfile} 
                />
              )}

              {activeTab === AppTab.ADMIN && (
                <AdminSystem 
                  metrics={adminMetrics} 
                  profile={profile} 
                  onApproveKyc={handleApproveKycAdmin} 
                  onUpdateSystemStatus={handleUpdateSystemStatus}
                />
              )}

            </main>
          </div>

          {/* Connected Drawer dialog context sheet for responsiveness */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex">
              <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-[#0b1220]/80 backdrop-blur-md"></div>
              
              <div className="relative w-72 bg-[#161F30] border-r border-[#242F41] p-6 space-y-8 flex flex-col justify-between h-full animate-slide-right shadow-2xl">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black text-white tracking-widest uppercase">OBEY NAV</span>
                    <button 
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1.5 bg-[#0B1220] hover:bg-slate-800 rounded-xl border border-[#242F41]"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <nav className="space-y-1.5">
                    <button
                      onClick={() => { setActiveTab(AppTab.HOME); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3.5 px-4 h-12 rounded-xl text-xs font-bold transition-all ${
                        activeTab === AppTab.HOME ? "bg-[#0057FF] text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Home size={16} /> Home Dashboard
                    </button>
                    <button
                      onClick={() => { setActiveTab(AppTab.WALLET); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3.5 px-4 h-12 rounded-xl text-xs font-bold transition-all ${
                        activeTab === AppTab.WALLET ? "bg-[#0057FF] text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Wallet size={16} /> Treasury Wallet
                    </button>
                    <button
                      onClick={() => { setActiveTab(AppTab.TRADE); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3.5 px-4 h-12 rounded-xl text-xs font-bold transition-all ${
                        activeTab === AppTab.TRADE ? "bg-[#0057FF] text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <RefreshCw size={16} /> Trade Crypto
                    </button>
                    <button
                      onClick={() => { setActiveTab(AppTab.SERVICES); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3.5 px-4 h-12 rounded-xl text-xs font-bold transition-all ${
                        activeTab === AppTab.SERVICES ? "bg-[#0057FF] text-white" : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Smartphone size={16} /> Airtime / Data
                    </button>
                    <button
                      onClick={() => { setActiveTab(AppTab.PROFILE); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3.5 px-4 h-12 rounded-xl text-xs font-bold transition-all ${
                        activeTab === AppTab.PROFILE ? "bg-[#0057FF] text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <User size={16} /> Profile Accounts
                    </button>
                    <button
                      onClick={() => { setActiveTab(AppTab.ADMIN); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3.5 px-4 h-12 rounded-xl text-xs font-bold transition-all ${
                        activeTab === AppTab.ADMIN ? "bg-[#0057FF] text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Settings size={16} /> Compliance Admin
                    </button>
                  </nav>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-white/5 border border-[#242F41] hover:bg-red-500/10 hover:text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Exit Account Console
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
