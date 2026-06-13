import React, { useEffect, useState } from "react";
import { AppScreen } from "../types";
import AboutUs from "./AboutUs";
import StandardFooter from "./StandardFooter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bars3Icon as MenuIcon, 
  XMarkIcon as XIcon, 
  ChevronRightIcon,
  ShieldCheckIcon,
  GlobeAltIcon as GlobeIcon,
  BoltIcon as ZapIcon,
  DevicePhoneMobileIcon as AppIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon as SwapIcon,
  GiftIcon,
  UserGroupIcon as UsersIcon,
  LockClosedIcon as LockIcon,
  ChartBarIcon,
  PresentationChartLineIcon as ActivityIcon,
  CpuChipIcon as CpuIcon,
  CircleStackIcon as DatabaseIcon,
  WalletIcon,
  ArrowRightIcon,
  StarIcon,
  AcademicCapIcon,
  CheckBadgeIcon,
  BriefcaseIcon,
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  FaceSmileIcon,
  BellIcon,
  HomeIcon,
  UserIcon
} from "@heroicons/react/24/outline";

interface MarketingPageProps {
  onNavigate: (screen: AppScreen) => void;
  btcPrice: number;
  ethPrice: number;
}

export default function MarketingPage({ onNavigate, btcPrice, ethPrice }: MarketingPageProps) {
  const [activeHeader, setActiveHeader] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActiveHeader(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-white text-[#0b0e14] selection:bg-primary/10 selection:text-primary overflow-x-hidden font-inter">
      
      {/* 1. SIGHT NAVIGATION */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 h-20 md:h-24 flex items-center ${
          activeHeader
            ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-9 h-9 bg-[#0b0e14] flex items-center justify-center rounded-[10px] group-hover:rotate-[10deg] transition-transform shadow-lg">
              <span className="text-white font-black text-base uppercase">O</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#0b0e14] font-space uppercase">OBEY</span>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {["Products", "Company", "Features", "Pricing", "Support"].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="text-[13px] font-black uppercase tracking-[0.2em] text-[#0b0e14]/60 hover:text-[#0b0e14] transition-colors">
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate(AppScreen.LOGIN)}
              className="hidden sm:block text-[13px] font-black text-[#0b0e14] hover:opacity-60 transition-all uppercase tracking-[0.2em]"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate(AppScreen.REGISTER)}
              className="bg-[#0b0e14] text-white py-3.5 px-8 rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
            >
              Open Account
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#0b0e14]"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-white p-8 flex flex-col font-inter"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-2xl font-black tracking-tighter font-space uppercase">OBEY</span>
              <button onClick={() => setMobileMenuOpen(false)}><XIcon className="w-8 h-8" /></button>
            </div>
            <nav className="space-y-10 text-center">
              {["Products", "Company", "Features", "Pricing"].map((link) => (
                <a key={link} href="#" onClick={() => setMobileMenuOpen(false)} className="block text-5xl font-black tracking-tighter">
                  {link}
                </a>
              ))}
            </nav>
            <div className="mt-auto space-y-4">
               <button onClick={() => onNavigate(AppScreen.REGISTER)} className="w-full py-6 bg-[#0b0e14] text-white rounded-2xl font-black uppercase tracking-widest text-sm active-press">Start Onboarding</button>
               <button onClick={() => onNavigate(AppScreen.LOGIN)} className="w-full py-6 border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-sm active-press">Access Console</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* 2. HIGH-FIDELITY HERO (Pixel Perfect to Image) */}
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-40 px-6 overflow-hidden">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-20">
            
            {/* Phone Mockup Section */}
            <div className="lg:w-1/2 relative flex justify-center order-2 lg:order-1 scale-90 md:scale-100">
               <div className="relative w-[320px] md:w-[400px] aspect-[1/2] rounded-[3.5rem] border-[10px] border-[#0b0e14] bg-white shadow-[0_120px_100px_-50px_rgba(0,0,0,0.12)] overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-10 flex items-center justify-center z-10">
                     <div className="w-28 h-6 bg-[#0b0e14] rounded-b-3xl"></div>
                  </div>
                  <div className="p-8 pt-16 space-y-8 h-full bg-white">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black">LO</div>
                           <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Welcome back,</p>
                              <p className="text-sm font-black uppercase">Luke Okagha</p>
                           </div>
                        </div>
                        <BellIcon className="w-5 h-5 text-gray-400" />
                     </div>
                     
                     <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Main Account</p>
                           <ChevronRightIcon className="w-3 h-3 text-gray-400" />
                        </div>
                        <p className="text-4xl font-black font-space tracking-tight text-[#0b0e14]">$142,580.42</p>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <button className="h-12 bg-[#0b0e14] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active-press flex items-center justify-center gap-2 shadow-lg shadow-black/20">
                           <SwapIcon className="w-4 h-4 rotate-90" /> Request
                        </button>
                        <button className="h-12 border border-gray-100 text-[#0b0e14] rounded-2xl font-black text-[10px] uppercase tracking-widest active-press flex items-center justify-center gap-2">
                           <ArrowRightIcon className="w-4 h-4 -rotate-45" /> Send
                        </button>
                     </div>

                     <div className="space-y-4 pt-4">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Transaction</p>
                        <div className="space-y-4">
                           {[
                              { label: "Transfer to Felix", val: "-$4,020.00", icon: "FA" },
                              { label: "BTC Inflow", val: "+$1,300.00", icon: "W", color: "text-emerald-500" }
                           ].map((tx, i) => (
                             <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center font-black text-[10px] group-hover:bg-primary/5 transition-colors">{tx.icon}</div>
                                   <p className="text-[11px] font-black uppercase tracking-tight">{tx.label}</p>
                                </div>
                                <p className={`text-[11px] font-black ${tx.color || "text-[#0b0e14]"}`}>{tx.val}</p>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="mt-auto pt-6 flex justify-around items-center border-t border-gray-50 opacity-40">
                        <HomeIcon className="w-5 h-5" />
                        <ChartBarIcon className="w-5 h-5" />
                        <ActivityIcon className="w-5 h-5" />
                        <UserIcon className="w-5 h-5" />
                     </div>
                  </div>
               </div>

               {/* Floating Feature Cards */}
               <motion.div 
                 animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-10 -left-12 md:-left-24 p-6 bg-white rounded-[2.5rem] shadow-[0_40px_80px_-10px_rgba(0,0,0,0.08)] border border-gray-100 space-y-4 hidden md:block z-20"
               >
                  <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-[#0b0e14] shadow-xl"><AppIcon className="w-6 h-6" /></div>
                  <p className="text-xs font-black uppercase tracking-widest leading-relaxed">One app <br /> for all</p>
               </motion.div>

               {/* Virtual Card Overlay */}
               <motion.div 
                 animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute top-[35%] -right-12 md:-right-24 p-8 bg-[#0b0e14] text-white rounded-[3rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] space-y-6 hidden md:block w-72 z-20 overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                  <div className="flex justify-between items-center relative z-10">
                     <span className="text-[11px] font-black uppercase tracking-widest opacity-40 italic">Obey</span>
                     <span className="text-[12px] font-black italic">VISA</span>
                  </div>
                  <div className="space-y-1 relative z-10 pt-4">
                     <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">Card holder</p>
                     <p className="text-lg font-black tracking-tighter uppercase whitespace-nowrap">Luke Okagha</p>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">Account number</p>
                        <p className="text-sm font-black font-mono">**** 9934</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">Valid Thru</p>
                        <p className="text-sm font-black font-mono">05/28</p>
                     </div>
                  </div>
               </motion.div>

               <motion.div 
                 animate={{ x: [-10, 10, -10] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute bottom-20 -left-12 md:-left-32 p-6 bg-white rounded-[2.5rem] shadow-[0_40px_80px_-10px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-5 hidden md:flex z-20"
               >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600"><LockIcon className="w-6 h-6" /></div>
                  <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Secure <br /> payments</p>
               </motion.div>
            </div>

            {/* Typography Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:w-1/2 space-y-14 text-center lg:text-left order-1 lg:order-2"
            >
              <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-[5.5rem] font-black tracking-tighter leading-[0.88] text-[#0b0e14]"
              >
                Control your <br />
                financial <br />
                future easily
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-500 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
              >
                From easy money management, to financial goals and investments. 
                Open your account in a flash.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4"
              >
                <button
                  onClick={() => onNavigate(AppScreen.REGISTER)}
                  className="bg-yellow-400 text-[#0b0e14] font-black text-[15px] uppercase tracking-widest px-14 py-7 rounded-full hover:bg-black hover:text-white transition-all shadow-[0_30px_60px_-10px_rgba(250,204,21,0.5)] active-press"
                >
                  Open account
                </button>
                <button
                  className="bg-white border-2 border-gray-100 text-[#0b0e14] font-black text-[15px] uppercase tracking-widest px-14 py-7 rounded-full hover:border-black transition-all active-press"
                >
                  Generate your card
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-6 pt-10">
                 <div className="flex -space-x-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-14 h-14 rounded-full border-[6px] border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                         <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-14 h-14 rounded-full border-[6px] border-white bg-primary flex items-center justify-center text-white text-xs font-black shadow-sm">+</div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-4xl font-black tracking-tighter leading-none flex items-center gap-3">
                       <ZapIcon className="w-6 h-6 text-primary fill-primary" /> 15 Million+
                    </p>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">Trusted by satisfied global node users</p>
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 3. FEATURE GRID (Feel the best experience) */}
        <section id="features" className="py-32 md:py-56 px-6 bg-white border-y border-gray-50">
           <div className="max-w-[1400px] mx-auto space-y-24">
              <div className="text-center space-y-6">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">Feel the best experience <br /> with our features</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Card Feature 1 */}
                 <div className="p-14 bg-gray-50 rounded-[4rem] border border-gray-100 space-y-12 group hover:bg-white hover:shadow-2xl transition-all duration-700 overflow-hidden relative">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-[#0b0e14] group-hover:text-white transition-all"><CreditCardIcon className="w-8 h-8" /></div>
                    <div className="space-y-6">
                       <h3 className="text-4xl font-black tracking-tighter">Custom and design your card, <br /> make it unique</h3>
                       <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-sm">Create a custom card that reflects your unique style and personality. Choose from colors and patterns.</p>
                    </div>
                    <div className="relative pt-10 h-64">
                       <div className="absolute top-0 -right-20 w-[400px] aspect-[1.6/1] bg-[#0b0e14] rounded-[2.5rem] p-10 flex flex-col justify-between shadow-2xl rotate-[-10deg] group-hover:rotate-0 transition-transform duration-700">
                          <p className="text-sm font-black italic text-white opacity-40">Obey Card</p>
                          <div className="space-y-4">
                             <div className="w-14 h-10 bg-yellow-400/20 rounded-lg"></div>
                             <p className="text-2xl text-white font-black tracking-tighter">Luke Okagha</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Card Feature 2 */}
                 <div className="p-14 bg-gray-50 rounded-[4rem] border border-gray-100 space-y-12 group hover:bg-white hover:shadow-2xl transition-all duration-700 overflow-hidden relative">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-[#0b0e14] group-hover:text-white transition-all"><ActivityIcon className="w-8 h-8" /></div>
                    <div className="space-y-6">
                       <h3 className="text-4xl font-black tracking-tighter">Personalized your financial <br /> insights and goals</h3>
                       <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-sm">Track your spending patterns, analyze income or expenses easily, and receive personalized recommendations.</p>
                    </div>
                    <div className="relative bg-white rounded-[3rem] p-8 shadow-xl border border-gray-50 group-hover:scale-105 transition-transform duration-700">
                       <div className="flex justify-between items-end mb-8">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Savings</p>
                             <p className="text-3xl font-black tracking-tighter">$15,500.00</p>
                          </div>
                          <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white"><CheckBadgeIcon className="w-6 h-6" /></div>
                       </div>
                       <div className="h-24 w-full flex items-end gap-2">
                          {[0.3, 0.6, 0.4, 0.8, 0.5, 0.9, 0.7, 1].map((h, i) => (
                            <div key={i} className="flex-grow bg-primary/10 rounded-t-xl" style={{ height: `${h * 100}%` }}></div>
                          ))}
                       </div>
                    </div>
                 </div>

                 {/* Feature 3 (Long Horizontal) */}
                 <div className="lg:col-span-2 p-14 bg-gray-50 rounded-[4rem] border border-gray-100 flex flex-col lg:flex-row items-center gap-16 group hover:bg-white hover:shadow-2xl transition-all duration-700">
                    <div className="lg:w-1/2 space-y-10">
                       <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-[#0b0e14] group-hover:text-white transition-all"><CurrencyDollarIcon className="w-8 h-8" /></div>
                       <div className="space-y-6">
                          <h3 className="text-4xl font-black tracking-tighter leading-tight text-[#0b0e14]">Free transfer anywhere <br /> around the world</h3>
                          <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-md">Experience the freedom of hassle-free money transfers with our free platform administrator fee. Say goodbye to unnecessary fees.</p>
                       </div>
                    </div>
                    <div className="lg:w-1/2 w-full">
                       <div className="p-10 bg-white rounded-[3.5rem] shadow-xl border border-gray-50 space-y-10 group-hover:scale-[1.02] transition-transform duration-700">
                          <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#0b0e14] flex items-center justify-center text-white"><BuildingLibraryIcon className="w-6 h-6" /></div>
                                <div>
                                   <p className="text-sm font-black uppercase">Bank transfer</p>
                                   <p className="text-[10px] font-bold text-gray-400">Institutional Sync</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-[10px] font-black text-primary uppercase tracking-widest">Free</div>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</p>
                                <p className="text-4xl font-black font-space tracking-tighter">$1,500.00</p>
                             </div>
                             <button className="w-16 h-16 bg-[#0b0e14] text-white rounded-3xl flex items-center justify-center shadow-xl active-press hover:bg-primary transition-all"><ArrowRightIcon className="w-6 h-6" /></button>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Grid 3 - Currencies */}
                 <div className="p-12 bg-gray-50 rounded-[4rem] border border-gray-100 space-y-10 group hover:bg-white hover:shadow-2xl transition-all duration-700">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-[#0b0e14] group-hover:text-white transition-all"><GlobeIcon className="w-8 h-8" /></div>
                    <h3 className="text-4xl font-black tracking-tighter">Hold money in 30+ <br /> currencies</h3>
                    <div className="flex flex-wrap gap-4">
                       {['USD', 'EUR', 'GBP', 'NGN', 'BTC', 'ETH'].map(c => (
                         <div key={c} className="px-6 py-3 bg-white rounded-2xl border border-gray-100 font-black text-xs uppercase tracking-widest shadow-sm group-hover:border-primary/20 transition-all">{c}</div>
                       ))}
                    </div>
                 </div>

                 {/* Grid 4 - Subscriptions */}
                 <div className="p-12 bg-gray-50 rounded-[4rem] border border-gray-100 space-y-10 group hover:bg-white hover:shadow-2xl transition-all duration-700">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-[#0b0e14] group-hover:text-white transition-all"><BriefcaseIcon className="w-8 h-8" /></div>
                    <h3 className="text-4xl font-black tracking-tighter">Subscriptions you <br /> control in one place</h3>
                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#0b0e14] rounded-xl flex items-center justify-center text-white"><FaceSmileIcon className="w-6 h-6" /></div>
                          <div>
                             <p className="text-sm font-black uppercase">Figma Pro</p>
                             <p className="text-[10px] font-bold text-gray-400">Monthly Node Sync</p>
                          </div>
                       </div>
                       <p className="text-lg font-black font-space">$12.00</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 4. LOGO CLOUD (200+ Growing company) */}
        <section className="py-32 px-6 bg-white text-center space-y-20">
           <div className="space-y-6">
              <h2 className="text-5xl font-black tracking-tighter">200+ The fastest growing <br /> company use OBEY</h2>
              <p className="text-gray-400 font-medium">Many companies have tried using OBEY and they trust <br /> the safety of their money.</p>
           </div>
           <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 grayscale opacity-30 group">
              {['Airbnb', 'Slack', 'Stripe', 'Airwallex', 'Spotify', 'Booking', 'Gusto', 'Coinbase'].map(c => (
                <div key={c} className="h-12 flex items-center justify-center font-black text-2xl tracking-tighter hover:text-black transition-all cursor-pointer">{c}</div>
              ))}
           </div>
        </section>

        {/* 5. JOIN TRUST SECTION */}
        <section className="py-32 md:py-56 px-6 bg-gray-50 overflow-hidden relative">
           <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-24">
              <div className="lg:w-1/2">
                 <div className="relative rounded-[4rem] overflow-hidden shadow-2xl border-[10px] border-white">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                      alt="Success Character" 
                      className="w-full h-full object-cover" 
                    />
                 </div>
              </div>
              <div className="lg:w-1/2 space-y-12">
                 <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight text-[#0b0e14]">Join 15+ million people <br /> who already trust us <br /> with their money</h2>
                 <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed italic">
                    "Overall, this app has been a life-changer for me. It has revolutionized the way I approach my finances, 
                    providing me with the tools, insights, and security I need to unlock my financial freedom."
                 </p>
                 <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <div>
                       <p className="text-2xl font-black text-[#0b0e14]">Ellena Putri</p>
                       <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest pt-1">Node Strategist</p>
                    </div>
                    <div className="flex gap-4">
                       <button className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all"><ArrowRightIcon className="w-6 h-6 rotate-180" /></button>
                       <button className="w-14 h-14 rounded-full bg-yellow-400 text-[#0b0e14] flex items-center justify-center shadow-lg active-press"><ArrowRightIcon className="w-6 h-6" /></button>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 6. MOBILE APP SYNC (Finsy Style) */}
        <section className="py-32 md:py-56 px-6 bg-white overflow-hidden">
           <div className="max-w-[1400px] mx-auto text-center space-y-24">
              <div className="space-y-8">
                 <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight text-[#0b0e14]">Get the OBEY mobile app.</h2>
                 <p className="text-xl text-gray-400 font-medium max-w-xl mx-auto">With this platform, you can access your account anywhere, anytime for balance and so much more.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="h-14 px-8 bg-black text-white rounded-full flex items-center gap-4 hover:scale-105 transition-all shadow-xl active-press group">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-5 h-5 invert" />
                       <span className="text-[12px] font-black uppercase tracking-widest">App Store</span>
                    </button>
                    <button className="h-14 px-8 bg-black text-white rounded-full flex items-center gap-4 hover:scale-105 transition-all shadow-xl active-press group">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google" className="w-5 h-5" />
                       <span className="text-[12px] font-black uppercase tracking-widest">Google Play</span>
                    </button>
                 </div>
              </div>

              <div className="relative flex justify-center pt-20">
                 <div className="flex -space-x-12 md:-space-x-32 justify-center items-end">
                    <div className="relative w-[280px] md:w-[380px] aspect-[1/2] rounded-[3.5rem] border-[10px] border-[#0b0e14] bg-white shadow-2xl scale-90 -rotate-[10deg] opacity-40 hover:opacity-100 hover:scale-100 hover:rotate-0 transition-all duration-1000"></div>
                    <div className="relative w-[280px] md:w-[420px] aspect-[1/2] rounded-[4rem] border-[12px] border-[#0b0e14] bg-white shadow-[0_80px_100px_-40px_rgba(0,0,0,0.3)] z-10 hover:scale-[1.02] transition-transform duration-1000">
                       <div className="p-10 space-y-8">
                          <div className="flex justify-between items-center text-[#0b0e14]">
                             <span className="text-sm font-black uppercase tracking-widest">Obey</span>
                             <CheckBadgeIcon className="w-8 h-8 text-primary" />
                          </div>
                          <div className="space-y-2 pt-10">
                             <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Your balance</p>
                             <p className="text-5xl font-black font-space">$40,500.80</p>
                          </div>
                       </div>
                    </div>
                    <div className="relative w-[280px] md:w-[380px] aspect-[1/2] rounded-[3.5rem] border-[10px] border-[#0b0e14] bg-white shadow-2xl scale-90 rotate-[10deg] opacity-40 hover:opacity-100 hover:scale-100 hover:rotate-0 transition-all duration-1000"></div>
                 </div>
              </div>

              <h3 className="text-5xl md:text-9xl font-black tracking-tighter text-[#0b0e14] pt-20">Save smart. Achieve more.</h3>
           </div>
        </section>

        <section className="px-6 pb-32">
           <div className="max-w-[1400px] mx-auto bg-[#0b0e14] rounded-[4rem] p-12 md:p-24 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -z-10 group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                 <div className="space-y-10 text-center lg:text-left">
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-yellow-400 shadow-xl"><StarIcon className="w-8 h-8 fill-yellow-400" /></div>
                    <h2 className="text-6xl md:text-[5.5rem] font-black tracking-tighter leading-[0.9]">Keep up with the <br /> latest</h2>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto lg:mx-0">Join our newsletter to stay up to date on features and node releases.</p>
                 </div>
                 <div className="w-full max-w-lg bg-white/5 border border-white/10 p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center backdrop-blur-xl">
                    <input type="email" placeholder="Enter your email" className="bg-transparent border-none focus:ring-0 text-white font-bold placeholder:text-gray-600 px-6 py-4 flex-grow w-full md:w-auto" />
                    <button className="bg-yellow-400 text-[#0b0e14] font-black uppercase tracking-widest text-sm px-10 py-5 rounded-2xl w-full md:w-auto hover:bg-white transition-all active-press shadow-2xl shadow-yellow-400/20">Subscribe</button>
                 </div>
              </div>
           </div>
        </section>

        <AboutUs />
      </main>

      <StandardFooter onNavigate={onNavigate} />

    </div>
  );
}
