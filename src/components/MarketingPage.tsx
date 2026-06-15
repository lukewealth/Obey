import React, { useEffect, useState } from "react";
import { AppScreen } from "../types";
import AboutUs from "./AboutUs";
import StandardFooter from "./StandardFooter";
import LandingLoader from "./LandingLoader";
import ThemeToggle from "./ThemeToggle";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  UserIcon,
  WifiIcon,
  Battery50Icon
} from "@heroicons/react/24/outline";

interface MarketingPageProps {
  onNavigate: (screen: AppScreen) => void;
  btcPrice: number;
  ethPrice: number;
}

const MobileAppMockup = () => (
  <div className="p-5 md:p-8 space-y-5 md:space-y-6 h-full bg-white dark:bg-black flex flex-col text-left transition-colors duration-500">
    {/* Status Bar */}
    <div className="flex justify-between items-center text-[9px] md:text-[10px] font-bold text-gray-400 px-2">
       <span>9:41</span>
       <div className="flex items-center gap-1 md:gap-1.5">
          <WifiIcon className="w-2.5 h-2.5 md:w-3 md:h-3" />
          <div className="w-4 h-2 md:w-5 md:h-2.5 border border-gray-300 dark:border-white/20 rounded-[2px] md:rounded-[3px] p-[1px] relative">
             <div className="h-full bg-[#0b0e14] dark:bg-white w-[60%] rounded-[1px]"></div>
             <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-0.5 h-0.5 md:h-1 bg-gray-300 dark:bg-white/20 rounded-full"></div>
          </div>
       </div>
    </div>

    <div className="flex justify-between items-center text-[#0b0e14] dark:text-white">
       <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl bg-[#0b0e14] dark:bg-primary flex items-center justify-center text-white font-black text-[10px] md:text-xs">O</div>
          <span className="text-[11px] md:text-[13px] font-black uppercase tracking-widest">Obey</span>
       </div>
       <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center">
             <BellIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" />
          </div>
          <CheckBadgeIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
       </div>
    </div>

    <div className="space-y-0.5 md:space-y-1 pt-1 md:pt-2">
       <p className="text-[8px] md:text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.2em]">Current Balance</p>
       <div className="space-y-0.5">
          <p className="text-3xl md:text-4xl font-black font-space text-[#0b0e14] dark:text-white tracking-tighter leading-tight">$40,500.80</p>
          <div className="flex items-center gap-1.5 md:gap-2 text-emerald-500 font-bold text-[8px] md:text-[9px]">
             <span className="px-1 md:px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-md">+2.4%</span>
             <span className="uppercase tracking-widest opacity-70">Today's Profit</span>
          </div>
       </div>
    </div>

    {/* Action Grid */}
    <div className="grid grid-cols-4 gap-2 md:gap-3">
       {[
          { icon: BanknotesIcon, label: "Fund", color: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
          { icon: SwapIcon, label: "Trade", color: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" },
          { icon: ZapIcon, label: "VTU", color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
          { icon: GiftIcon, label: "Gifts", color: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" }
       ].map((act, i) => (
          <div key={i} className="space-y-1.5 md:space-y-2 text-center group cursor-pointer">
             <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl md:rounded-[1.2rem] ${act.color} flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm mx-auto`}>
                <act.icon className="w-4 h-4 md:w-5 md:h-5" />
             </div>
             <p className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-gray-500 dark:text-gray-400">{act.label}</p>
          </div>
       ))}
    </div>

    {/* Mini Chart Mockup */}
    <div className="bg-gray-50 dark:bg-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-5 space-y-3 md:space-y-4">
       <div className="flex justify-between items-center">
          <p className="text-[8px] md:text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">Asset Performance</p>
          <ChartBarIcon className="w-3 md:w-3.5 h-3 md:h-4 text-primary" />
       </div>
       <div className="h-12 md:h-16 w-full flex items-end gap-1 md:gap-1.5">
          {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 1, 0.7, 0.9].map((h, i) => (
             <motion.div 
               key={i} 
               initial={{ height: 0 }}
               whileInView={{ height: `${h * 100}%` }}
               transition={{ delay: i * 0.1, duration: 0.5 }}
               className="flex-grow bg-primary/20 rounded-t-lg" 
             />
          ))}
       </div>
    </div>

    {/* Recent Transactions */}
    <div className="space-y-3 md:space-y-4 flex-grow overflow-hidden">
       <p className="text-[8px] md:text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest">Recent Activity</p>
       <div className="space-y-2 md:space-y-3">
          {[
             { label: "Amazon Card", sub: "Marketplace", val: "+$500.00", color: "text-emerald-500", icon: "A" },
             { label: "BTC Purchase", sub: "Exchange", val: "-$1,200.00", color: "text-[#0b0e14] dark:text-white", icon: "B" }
          ].map((tx, i) => (
             <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 md:gap-3">
                   <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center font-black text-[9px] md:text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{tx.icon}</div>
                   <div className="overflow-hidden">
                      <p className="text-[8px] md:text-[9px] font-black uppercase text-[#0b0e14] dark:text-white truncate">{tx.label}</p>
                      <p className="text-[6px] md:text-[7px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate">{tx.sub}</p>
                   </div>
                </div>
                <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-tighter shrink-0 ${tx.color}`}>{tx.val}</p>
             </div>
          ))}
       </div>
    </div>
  </div>
);

export default function MarketingPage({ onNavigate, btcPrice, ethPrice }: MarketingPageProps) {
  const [activeHeader, setActiveHeader] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActiveHeader(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    const timer = setTimeout(() => setIsLoaded(true), 2400);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-[#0b0e14] dark:text-white selection:bg-primary/10 selection:text-primary overflow-x-hidden font-inter transition-colors duration-500">
      
      <AnimatePresence>
         {!isLoaded && (
            <motion.div 
               exit={{ opacity: 0, scale: 1.1 }}
               transition={{ duration: 0.8, ease: "easeInOut" }}
               className="fixed inset-0 z-[100]"
            >
               <LandingLoader />
            </motion.div>
         )}
      </AnimatePresence>

      {/* 1. SIGHT NAVIGATION */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 h-16 md:h-24 flex items-center ${
          activeHeader
            ? "bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border-b border-gray-100 dark:border-white/10 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 w-full flex items-center justify-between">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 bg-[#0b0e14] dark:bg-primary flex items-center justify-center rounded-[8px] md:rounded-[10px] group-hover:rotate-[10deg] transition-transform shadow-lg overflow-hidden shrink-0">
              <img src="/obey_logo.svg" className="w-full h-full object-cover" alt="OBEY Logo" />
            </div>
            <span className="text-lg md:text-2xl font-black tracking-tighter text-[#0b0e14] dark:text-white font-space uppercase">OBEY</span>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {[
              { label: "Ecosystem", id: "#features" },
              { label: "Security", id: "#about" },
              { label: "Compliance", id: "#compliance" },
              { label: "Institutional", id: "#institutional" }
            ].map((link) => (
              <a key={link.label} href={link.id} className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] text-[#0b0e14]/60 dark:text-white/60 hover:text-[#0b0e14] dark:hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <ThemeToggle />
            <button
              onClick={() => onNavigate(AppScreen.LOGIN)}
              className="hidden sm:block text-[11px] md:text-[13px] font-black text-[#0b0e14] dark:text-white hover:opacity-60 transition-all uppercase tracking-[0.2em]"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate(AppScreen.REGISTER)}
              className="bg-[#0b0e14] dark:bg-primary text-white py-2.5 md:py-3.5 px-6 md:px-8 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all shrink-0"
            >
              Open Account
            </button>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#0b0e14] dark:text-white shrink-0"
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
            className="fixed inset-0 z-[60] bg-white dark:bg-[#121212] p-6 md:p-8 flex flex-col font-inter overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12 md:mb-16">
              <span className="text-xl md:text-2xl font-black tracking-tighter font-space uppercase">OBEY</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2"><XIcon className="w-8 h-8" /></button>
            </div>
            <nav className="space-y-8 md:space-y-10 text-center flex-grow flex flex-col justify-center">
              {["Ecosystem", "Security", "Compliance", "Institutional"].map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block text-4xl md:text-6xl font-black tracking-tighter hover:text-primary transition-colors">
                  {link}
                </a>
              ))}
            </nav>
            <div className="mt-12 space-y-4">
               <button onClick={() => onNavigate(AppScreen.REGISTER)} className="w-full py-5 md:py-6 bg-[#0b0e14] dark:bg-primary text-white rounded-[20px] md:rounded-2xl font-black uppercase tracking-widest text-sm active-press shadow-xl">Start Onboarding</button>
               <button onClick={() => onNavigate(AppScreen.LOGIN)} className="w-full py-5 md:py-6 border border-gray-100 dark:border-white/10 rounded-[20px] md:rounded-2xl font-black uppercase tracking-widest text-sm active-press">Access Console</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* 2. HIGH-FIDELITY HERO */}
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-40 px-4 md:px-6 overflow-hidden">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-20">
            
            {/* Phone Mockup Section */}
            <div className="lg:w-1/2 relative flex justify-center order-2 lg:order-1 scale-75 sm:scale-90 md:scale-100">
               <motion.div 
                  initial={{ rotateX: 20, rotateY: -10, y: 100, opacity: 0 }}
                  whileInView={{ rotateX: 0, rotateY: 0, y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-[280px] sm:w-[320px] md:w-[400px] aspect-[1/2] rounded-[3rem] md:rounded-[3.5rem] border-[8px] md:border-[10px] border-[#0b0e14] dark:border-primary bg-white dark:bg-black shadow-[0_120px_100px_-50px_rgba(0,0,0,0.12)] overflow-hidden shrink-0"
               >
                  <div className="absolute top-0 inset-x-0 h-8 md:h-10 flex items-center justify-center z-10">
                     <div className="w-20 md:w-28 h-5 md:h-6 bg-[#0b0e14] dark:bg-primary rounded-b-2xl md:rounded-b-3xl"></div>
                  </div>
                  <MobileAppMockup />
               </motion.div>

               {/* Floating Feature Cards */}
               <motion.div 
                 animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-10 -left-8 sm:-left-12 md:-left-24 p-5 md:p-6 bg-white dark:bg-[#1E1E1E] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_40px_80px_-10px_rgba(0,0,0,0.08)] border border-gray-100 dark:border-white/10 space-y-3 md:space-y-4 hidden sm:block z-20"
               >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-xl md:rounded-2xl flex items-center justify-center text-[#0b0e14] shadow-xl"><AppIcon className="w-5 h-5 md:w-6 md:h-6" /></div>
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-relaxed">One app <br /> for all</p>
               </motion.div>

               {/* Virtual Card Overlay */}
               <motion.div 
                 animate={{ y: [0, 15, 0], rotate: [0, -3, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute top-[35%] -right-8 sm:-right-12 md:-right-24 p-6 md:p-8 bg-[#0b0e14] dark:bg-primary text-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)] space-y-5 md:space-y-6 hidden sm:block w-60 md:w-72 z-20 overflow-hidden"
               >
                  <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-primary/20 rounded-full blur-3xl"></div>
                  <div className="flex justify-between items-center relative z-10">
                     <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest opacity-40 italic">Obey</span>
                     <span className="text-[10px] md:text-[12px] font-black italic">VISA</span>
                  </div>
                  <div className="space-y-0.5 md:space-y-1 relative z-10 pt-2 md:pt-4">
                     <p className="text-[8px] md:text-[10px] font-bold uppercase opacity-30 tracking-widest">Card holder</p>
                     <p className="text-base md:text-lg font-black tracking-tighter uppercase whitespace-nowrap">Luke Okagha</p>
                  </div>
                  <div className="flex justify-between items-end relative z-10">
                     <div className="space-y-0.5 md:space-y-1">
                        <p className="text-[8px] md:text-[10px] font-bold uppercase opacity-30 tracking-widest">Account ID</p>
                        <p className="text-xs md:text-sm font-black font-mono">**** 9934</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] md:text-[10px] font-bold uppercase opacity-30 tracking-widest">VALID</p>
                        <p className="text-xs md:text-sm font-black font-mono">05/28</p>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* Typography Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-10 md:space-y-14 text-center lg:text-left order-1 lg:order-2 px-2 md:px-0"
            >
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[0.95] md:leading-[0.88] text-[#0b0e14] dark:text-white"
              >
                Control your <br className="hidden sm:block" />
                financial <br className="hidden sm:block" />
                future with <span className="text-primary italic">OBEY.</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl lg:text-2xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
              >
                Next-generation digital asset management and institutional liquidity infrastructure. 
                Unified wallet, utility recharge, and digital marketplaces.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start pt-2 md:pt-4"
              >
                <button
                  onClick={() => onNavigate(AppScreen.REGISTER)}
                  className="bg-yellow-400 text-[#0b0e14] font-black text-[13px] md:text-[15px] uppercase tracking-widest px-10 md:px-14 py-5 md:py-7 rounded-full hover:bg-black dark:hover:bg-primary hover:text-white transition-all shadow-[0_30px_60px_-10px_rgba(250,204,21,0.5)] active-press"
                >
                  Open account
                </button>
                <button
                  className="bg-white dark:bg-white/5 border-2 border-gray-100 dark:border-white/10 text-[#0b0e14] dark:text-white font-black text-[13px] md:text-[15px] uppercase tracking-widest px-10 md:px-14 py-5 md:py-7 rounded-full hover:border-black dark:hover:border-primary transition-all active-press"
                >
                  Request card
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-8 md:pt-10">
                 <div className="flex -space-x-3 md:-space-x-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[4px] md:border-[6px] border-white dark:border-[#121212] bg-gray-100 dark:bg-white/10 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
                         <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-[4px] md:border-[6px] border-white dark:border-[#121212] bg-primary flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0">+</div>
                 </div>
                 <div className="space-y-1 text-center sm:text-left">
                    <p className="text-3xl md:text-4xl font-black tracking-tighter leading-none flex items-center justify-center sm:justify-start gap-2 md:gap-3 dark:text-white">
                       <ZapIcon className="w-5 h-5 md:w-6 md:h-6 text-primary fill-primary" /> 15M+
                    </p>
                    <p className="text-[9px] md:text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Trusted by satisfied global node users</p>
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 3. FEATURE GRID */}
        <section id="features" className="py-24 md:py-56 px-4 md:px-6 bg-white dark:bg-[#121212] border-y border-gray-50 dark:border-white/5 transition-colors duration-500">
           <div className="max-w-[1400px] mx-auto space-y-16 md:space-y-24">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center space-y-4 md:space-y-6"
              >
                 <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight px-2 dark:text-white">Premium features for <br className="hidden sm:block" /> institutional flow</h2>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                 {/* Card Feature 1 */}
                 <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 md:p-14 bg-gray-50 dark:bg-white/5 rounded-[3rem] md:rounded-[4rem] border border-gray-100 dark:border-white/10 space-y-10 md:space-y-12 group hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all duration-700 overflow-hidden relative"
                 >
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-[#0b0e14] dark:group-hover:bg-primary group-hover:text-white transition-all"><CreditCardIcon className="w-7 h-7 md:w-8 md:h-8" /></div>
                    <div className="space-y-4 md:space-y-6 relative z-10">
                       <h3 className="text-3xl md:text-4xl font-black tracking-tighter dark:text-white">Custom virtual node, <br /> make it unique</h3>
                       <p className="text-base md:text-lg text-gray-400 dark:text-gray-500 font-medium leading-relaxed max-w-sm">Create a custom digital card node that reflects your unique style. Choose from patterns with instant generation.</p>
                    </div>
                    <div className="relative pt-6 md:pt-10 h-56 md:h-64">
                       <div className="absolute top-0 -right-16 md:-right-20 w-full max-w-[360px] md:max-w-[400px] aspect-[1.6/1] bg-[#0b0e14] dark:bg-primary rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between shadow-2xl rotate-[-10deg] group-hover:rotate-0 transition-transform duration-700">
                          <p className="text-xs md:text-sm font-black italic text-white opacity-40">Obey Node</p>
                          <div className="space-y-3 md:space-y-4">
                             <div className="w-12 h-8 md:w-14 md:h-10 bg-yellow-400/20 rounded-lg"></div>
                             <p className="text-xl md:text-2xl text-white font-black tracking-tighter">Institutional Node</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>

                 {/* Card Feature 2 */}
                 <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 md:p-14 bg-gray-50 dark:bg-white/5 rounded-[3rem] md:rounded-[4rem] border border-gray-100 dark:border-white/10 space-y-10 md:space-y-12 group hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all duration-700 overflow-hidden relative"
                 >
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-[#0b0e14] dark:group-hover:bg-primary group-hover:text-white transition-all"><ActivityIcon className="w-7 h-7 md:w-8 md:h-8" /></div>
                    <div className="space-y-4 md:space-y-6 relative z-10">
                       <h3 className="text-3xl md:text-4xl font-black tracking-tighter dark:text-white">Institutional nodes <br /> and goals</h3>
                       <p className="text-base md:text-lg text-gray-400 dark:text-gray-500 font-medium leading-relaxed max-w-sm">Track your spending patterns across wallet, utility, and marketplace modules with automated reporting.</p>
                    </div>
                    <div className="relative bg-white dark:bg-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-xl border border-gray-50 dark:border-white/5 group-hover:scale-105 transition-transform duration-700">
                       <div className="flex justify-between items-end mb-6 md:mb-8">
                          <div className="space-y-0.5 md:space-y-1">
                             <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Node Reserves</p>
                             <p className="text-2xl md:text-3xl font-black tracking-tighter dark:text-white">$15,500.00</p>
                          </div>
                          <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white"><CheckBadgeIcon className="w-5 h-5 md:w-6 md:h-6" /></div>
                       </div>
                       <div className="h-16 md:h-24 w-full flex items-end gap-1 md:gap-1.5">
                          {[0.3, 0.6, 0.4, 0.8, 0.5, 0.9, 0.7, 1].map((h, i) => (
                            <motion.div 
                              key={i} 
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h * 100}%` }}
                              className="flex-grow bg-primary/10 dark:bg-primary/30 rounded-t-lg md:rounded-t-xl" 
                            />
                          ))}
                       </div>
                    </div>
                 </motion.div>

                 {/* Feature 3 (Long Horizontal) */}
                 <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-2 p-8 md:p-14 bg-gray-50 dark:bg-white/5 rounded-[3rem] md:rounded-[4rem] border border-gray-100 dark:border-white/10 flex flex-col lg:flex-row items-center gap-10 md:gap-16 group hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all duration-700"
                 >
                    <div className="lg:w-1/2 space-y-8 md:space-y-10 text-center lg:text-left w-full">
                       <div className="w-14 h-14 md:w-16 md:h-16 bg-white dark:bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-[#0b0e14] dark:group-hover:bg-primary group-hover:text-white transition-all mx-auto lg:mx-0"><CurrencyDollarIcon className="w-7 h-7 md:w-8 md:h-8" /></div>
                       <div className="space-y-4 md:space-y-6">
                          <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight text-[#0b0e14] dark:text-white">Global settlements anywhere <br className="hidden sm:block" /> around the world</h3>
                          <p className="text-base md:text-lg text-gray-400 dark:text-gray-500 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">Experience the freedom of hassle-free money node transfers with our institutional mesh. Cross-border settlements in seconds.</p>
                       </div>
                    </div>
                    <div className="lg:w-1/2 w-full max-w-lg">
                       <div className="p-8 md:p-10 bg-white dark:bg-white/10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl border border-gray-50 dark:border-white/5 space-y-8 md:space-y-10 group-hover:scale-[1.02] transition-transform duration-700">
                          <div className="flex items-center justify-between pb-6 border-b border-gray-50 dark:border-white/10">
                             <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#0b0e14] dark:bg-primary flex items-center justify-center text-white shrink-0"><BuildingLibraryIcon className="w-5 h-5 md:w-6 md:h-6" /></div>
                                <div className="overflow-hidden">
                                   <p className="text-xs md:text-sm font-black uppercase dark:text-white truncate">Institutional Node</p>
                                   <p className="text-[9px] md:text-[10px] font-bold text-gray-400 dark:text-gray-500 truncate">Sequential Ledger Sync</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-1.5 md:gap-2 px-2.5 py-1 bg-primary/5 rounded-full text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest shrink-0">Active</div>
                          </div>
                          <div className="flex justify-between items-center">
                             <div className="space-y-0.5 md:space-y-1">
                                <p className="text-[9px] md:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Magnitude</p>
                                <p className="text-3xl md:text-4xl font-black font-space tracking-tighter leading-none dark:text-white">$1,500.00</p>
                             </div>
                             <button className="w-14 h-14 md:w-16 md:h-16 bg-[#0b0e14] dark:bg-primary text-white rounded-[20px] md:rounded-3xl flex items-center justify-center shadow-xl active-press hover:bg-primary transition-all shrink-0"><ArrowRightIcon className="w-6 h-6 md:w-7 md:h-7" /></button>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        {/* 4. LOGO CLOUD */}
        <section id="compliance" className="pt-32 pb-32 md:pt-48 md:pb-64 bg-white dark:bg-[#121212] text-center relative overflow-hidden transition-colors duration-500">

           {/* Pervasive Grey Fadeout Effect */}
           <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-transparent to-gray-50/50 dark:from-black/10 dark:via-transparent dark:to-black/10 pointer-events-none z-0"></div>

           {/* Walking Animations Container */}
           <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ amount: 0.3, margin: "-100px" }}
              transition={{ duration: 1.5 }}
              className="max-w-[1400px] mx-auto relative h-[450px] md:h-[650px] overflow-hidden z-10 flex flex-col justify-center"
           >
              {/* The Line - Centered Vertically */}
              <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-gray-200 dark:bg-white/10 -translate-y-1/2 z-0"></div>

              {/* Cat Animation - walking Right side top extreme corner toward Left */}
              <motion.div
                animate={{ 
                  x: ["100%", "-120%"],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ 
                  duration: 25, repeat: Infinity, ease: "linear" 
                }}
                className="w-48 h-48 md:w-64 md:h-64 absolute top-4 right-0 z-10"
              >
                <DotLottieReact
                  src="https://lottie.host/6d95a1ca-1d49-4ffb-860c-0564fad1ed7b/bWISUhwM4y.lottie"
                  loop
                  autoplay
                  style={{ transform: 'scaleX(-1)' }}
                />
              </motion.div>

              {/* Bird Animation - flying from extreme Left side toward Right on top of line */}
              <motion.div
                animate={{ 
                  x: ["-100%", "120%"],
                  opacity: [0, 0.6, 0.6, 0]
                }}
                transition={{ 
                  duration: 35, repeat: Infinity, ease: "linear" 
                }}
                className="w-32 h-32 md:w-48 md:h-48 absolute top-1/2 left-0 -translate-y-[65%] z-10 filter grayscale dark:invert"
              >
                <DotLottieReact
                  src="https://lottie.host/60e2c41b-b933-4d0e-a9fb-0228b60517cc/8BwkHq1W4z.lottie"
                  loop
                  autoplay
                  style={{ transform: 'scaleX(-1)' }}
                />
              </motion.div>
           </motion.div>

           <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 md:space-y-6 relative z-10 mt-8 md:mt-12 px-4"
           >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter dark:text-white leading-tight">
                Institutional-grade <br className="hidden sm:block" /> 
                nodes trust OBEY
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed">
                Many companies have settled using OBEY and they trust <br className="hidden sm:block" /> the safety of their digital assets.
              </p>
           </motion.div>

           <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 grayscale opacity-20 group px-4 relative z-10 mt-24 md:mt-40">
              {['Airbnb', 'Slack', 'Stripe', 'Airwallex', 'Spotify', 'Booking', 'Gusto', 'Coinbase'].map(c => (
                <div key={c} className="h-10 md:h-12 flex items-center justify-center font-black text-2xl md:text-4xl tracking-tighter hover:text-black dark:hover:text-white transition-all cursor-pointer truncate dark:text-white/40">{c}</div>
              ))}
           </div>
        </section>


        {/* 5. JOIN TRUST SECTION */}
        <section id="institutional" className="py-24 md:py-56 px-4 md:px-6 bg-gray-50 dark:bg-white/5 overflow-hidden relative transition-colors duration-500">
           <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-16 md:gap-24">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="lg:w-1/2 w-full max-w-lg md:max-w-none"
              >
                 <div className="relative rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-[6px] md:border-[10px] border-white dark:border-white/10 group">
                    <motion.img 
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 1.5 }}
                      src="/success_character.jpg" 
                      alt="Success Character" 
                      className="w-full h-full object-cover aspect-[4/5] sm:aspect-auto" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 </div>
              </motion.div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="lg:w-1/2 space-y-10 md:space-y-12 text-center lg:text-left"
              >
                 <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight text-[#0b0e14] dark:text-white">Join 15+ million <br className="hidden sm:block" /> who already trust <br className="hidden sm:block" /> our nodes</motion.h2>
                 <motion.p variants={itemVariants} className="text-lg md:text-xl lg:text-2xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic max-w-xl mx-auto lg:mx-0">
                    "Overall, this app has been a life-changer for me. It has revolutionized the way I approach my finances, 
                    providing me with the security node I need."
                 </motion.p>
                 <motion.div variants={itemVariants} className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10">
                    <div className="text-left">
                       <p className="text-xl md:text-2xl font-black text-[#0b0e14] dark:text-white">Ellena Putri</p>
                       <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest pt-1">Node Strategist</p>
                    </div>
                    <div className="flex gap-3 md:gap-4">
                       <button className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-black dark:hover:bg-primary hover:text-white transition-all shadow-sm"><ArrowRightIcon className="w-5 h-5 md:w-6 md:h-6 rotate-180" /></button>
                       <button className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-yellow-400 text-[#0b0e14] flex items-center justify-center shadow-lg active-press"><ArrowRightIcon className="w-5 h-5 md:w-6 md:h-6" /></button>
                    </div>
                 </motion.div>
              </motion.div>
           </div>
        </section>

        {/* 6. MOBILE APP SYNC */}
        <section className="py-24 md:py-56 px-4 md:px-6 bg-white dark:bg-[#121212] overflow-hidden transition-colors duration-500">
           <div className="max-w-[1400px] mx-auto text-center space-y-16 md:space-y-24">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6 md:space-y-8"
              >
                 <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight text-[#0b0e14] dark:text-white">Get the OBEY node app.</h2>
                 <p className="text-lg md:text-xl text-gray-400 dark:text-gray-500 font-medium max-w-xl mx-auto px-4">With this platform, you can access your account anywhere, anytime for balance and so much more.</p>
                 <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
                    <button className="h-14 md:h-16 px-8 bg-black dark:bg-primary text-white rounded-full flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl active-press group w-full sm:w-auto">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-5 h-5 invert" />
                       <div className="text-left">
                          <p className="text-[7px] md:text-[8px] font-bold uppercase opacity-50 leading-none">Download on the</p>
                          <p className="text-[11px] md:text-[12px] font-black uppercase tracking-widest leading-none">App Store</p>
                       </div>
                    </button>
                    <button className="h-14 md:h-16 px-8 bg-black dark:bg-primary text-white rounded-full flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl active-press group w-full sm:w-auto">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google" className="w-5 h-5" />
                       <div className="text-left">
                          <p className="text-[7px] md:text-[8px] font-bold uppercase opacity-50 leading-none">Get it on</p>
                          <p className="text-[11px] md:text-[12px] font-black uppercase tracking-widest leading-none">Google Play</p>
                       </div>
                    </button>
                 </div>
              </motion.div>

              <div className="relative flex justify-center pt-10 md:pt-20">
                 <div className="flex -space-x-8 sm:-space-x-16 md:-space-x-32 justify-center items-end px-4">
                    {/* Left Phone: App Preview 1 */}
                    <motion.div 
                       initial={{ x: -100, rotate: -25, opacity: 0 }}
                       whileInView={{ x: 0, rotate: -12, opacity: 1 }}
                       viewport={{ once: true }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       className="relative w-[180px] sm:w-[240px] md:w-[340px] aspect-[1/2] rounded-[2rem] md:rounded-[3rem] border-[6px] md:border-[8px] border-[#0b0e14] dark:border-primary bg-white dark:bg-black shadow-2xl scale-90 overflow-hidden hidden sm:block group shrink-0"
                    >
                       <img src="/app_preview_1.jpg" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="App Preview 1" />
                       <div className="absolute inset-0 bg-[#0b0e14]/5"></div>
                    </motion.div>

                    {/* Center Phone: Complete coded 3D UI */}
                    <motion.div 
                       initial={{ y: 150, opacity: 0 }}
                       whileInView={{ y: 0, opacity: 1 }}
                       viewport={{ once: true }}
                       transition={{ duration: 1, delay: 0.2 }}
                       className="relative w-[220px] sm:w-[300px] md:w-[420px] aspect-[1/2] rounded-[2.5rem] md:rounded-[4rem] border-[8px] md:border-[12px] border-[#0b0e14] dark:border-primary bg-white dark:bg-black shadow-[0_80px_100px_-40px_rgba(0,0,0,0.3)] z-10 hover:scale-[1.02] transition-transform duration-1000 overflow-hidden shrink-0 mx-auto sm:mx-0"
                    >
                       <MobileAppMockup />
                    </motion.div>

                    {/* Right Phone: App Preview 2 */}
                    <motion.div 
                       initial={{ x: 100, rotate: 25, opacity: 0 }}
                       whileInView={{ x: 0, rotate: 12, opacity: 1 }}
                       viewport={{ once: true }}
                       transition={{ duration: 1.5, ease: "easeOut" }}
                       className="relative w-[180px] sm:w-[240px] md:w-[340px] aspect-[1/2] rounded-[2rem] md:rounded-[3rem] border-[6px] md:border-[8px] border-[#0b0e14] dark:border-primary bg-white dark:bg-black shadow-2xl scale-90 overflow-hidden hidden sm:block shrink-0"
                    >
                       <MobileAppMockup />
                    </motion.div>
                 </div>
              </div>

              <motion.h3 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter text-[#0b0e14] dark:text-white pt-12 md:pt-20 leading-none px-4"
              >
                Save smart. Achieve more.
              </motion.h3>
           </div>
        </section>

        <section className="px-4 md:px-6 pb-24 md:pb-32">
           <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-[1400px] mx-auto bg-[#0b0e14] dark:bg-primary rounded-[3rem] md:rounded-[4rem] p-8 md:p-24 text-white overflow-hidden relative group"
           >
              <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/20 dark:bg-white/10 rounded-full blur-[100px] md:blur-[150px] -z-10 group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 relative z-10">
                 <div className="space-y-6 md:space-y-10 text-center lg:text-left">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center text-yellow-400 shadow-xl mx-auto lg:mx-0"><StarIcon className="w-7 h-7 md:w-8 md:h-8 fill-yellow-400" /></div>
                    <h2 className="text-4xl sm:text-5xl md:text-[5.5rem] font-black tracking-tighter leading-[0.95] md:leading-[0.9]">Keep up with the <br className="hidden md:block" /> latest node</h2>
                    <p className="text-sm md:text-lg text-gray-400 dark:text-white/60 font-medium max-w-sm mx-auto lg:mx-0">Join our newsletter to stay up to date on features and node releases.</p>
                 </div>
                 <div className="w-full max-w-lg bg-white/5 border border-white/10 p-3 md:p-4 rounded-[24px] md:rounded-3xl flex flex-col md:flex-row gap-3 md:gap-4 items-center backdrop-blur-xl">
                    <input type="email" placeholder="Enter your email" className="bg-transparent border-none focus:ring-0 text-white font-bold placeholder:text-gray-400 px-4 md:px-6 py-3 md:py-4 flex-grow w-full md:w-auto outline-none" />
                    <button className="bg-yellow-400 text-[#0b0e14] font-black uppercase tracking-widest text-[11px] md:text-sm px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl w-full md:w-auto hover:bg-white transition-all active-press shadow-2xl shadow-yellow-400/20">Subscribe</button>
                 </div>
              </div>
           </motion.div>
        </section>

        <AboutUs />
      </main>

      <StandardFooter onNavigate={onNavigate} />

    </div>
  );
}
