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
  CheckBadgeIcon
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
              <span className="text-2xl font-black tracking-tighter font-space">OBEY</span>
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
               <button onClick={() => onNavigate(AppScreen.REGISTER)} className="w-full py-6 bg-[#0b0e14] text-white rounded-2xl font-black uppercase tracking-widest text-sm">Start Onboarding</button>
               <button onClick={() => onNavigate(AppScreen.LOGIN)} className="w-full py-6 border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-sm">Access Console</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* 2. HIGH-FIDELITY HERO (From images) */}
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-40 px-6 overflow-hidden">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-20">
            
            {/* Phone Mockup Section */}
            <div className="lg:w-1/2 relative flex justify-center order-2 lg:order-1">
               <div className="relative w-[320px] md:w-[420px] aspect-[1/2] rounded-[3rem] border-[12px] border-[#0b0e14] bg-white shadow-[0_100px_100px_-50px_rgba(0,0,0,0.1)] overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-8 bg-[#0b0e14] flex items-center justify-center">
                     <div className="w-24 h-4 bg-[#0b0e14] rounded-full"></div>
                  </div>
                  <div className="p-6 pt-12 space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-black">LO</div>
                        <div>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Welcome back,</p>
                           <p className="text-sm font-black uppercase">Luke Okagha</p>
                        </div>
                     </div>
                     <div className="p-6 bg-[#0b0e14] rounded-[2rem] text-white space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Treasury</p>
                        <p className="text-3xl font-black font-space tracking-tighter">$142,580.42</p>
                     </div>
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Live Feed</p>
                        {[1, 2].map(i => (
                          <div key={i} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-100/50">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm"><SwapIcon className="w-4 h-4" /></div>
                                <p className="text-[11px] font-black uppercase">BTC Transfer</p>
                             </div>
                             <p className="text-[11px] font-black text-emerald-500">+$1,300</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Floating Feature Cards */}
               <motion.div 
                 animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                 transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute -top-10 -left-10 md:-left-20 p-6 bg-white rounded-[2rem] shadow-2xl border border-gray-50 space-y-4 hidden md:block"
               >
                  <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-xl"><AppIcon className="w-6 h-6" /></div>
                  <p className="text-sm font-black uppercase tracking-widest">One app <br /> for all</p>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 className="absolute top-1/2 -right-10 md:-right-20 p-6 bg-[#0b0e14] text-white rounded-[2rem] shadow-2xl space-y-4 hidden md:block"
               >
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Obey Card</span>
                     <span className="text-[10px] font-black italic">VISA</span>
                  </div>
                  <p className="text-xl font-black tracking-tighter">Luke Okagha</p>
                  <p className="text-[10px] font-mono opacity-50">**** 9934</p>
               </motion.div>

               <motion.div 
                 animate={{ x: [-10, 10, -10] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute bottom-10 -left-10 md:-left-24 p-5 bg-white rounded-[2rem] shadow-2xl border border-gray-50 flex items-center gap-4 hidden md:flex"
               >
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white"><LockIcon className="w-5 h-5" /></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Secure <br /> payments</p>
               </motion.div>
            </div>

            {/* Typography Content */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:w-1/2 space-y-12 text-center lg:text-left order-1 lg:order-2"
            >
              <motion.h1 
                variants={itemVariants}
                className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-[#0b0e14]"
              >
                Control your <br />
                <span className="text-primary italic">financial</span> <br />
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
                  className="bg-yellow-400 text-[#0b0e14] font-black text-sm uppercase tracking-widest px-14 py-7 rounded-full hover:bg-black hover:text-white transition-all shadow-2xl shadow-yellow-200 active-press"
                >
                  Open account
                </button>
                <button
                  className="bg-white border-2 border-gray-100 text-[#0b0e14] font-black text-sm uppercase tracking-widest px-14 py-7 rounded-full hover:border-black transition-all active-press"
                >
                  Generate your card
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-6 pt-10">
                 <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
                      </div>
                    ))}
                 </div>
                 <div className="space-y-1">
                    <p className="text-3xl font-black tracking-tighter">15 Million+</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trusted global node users</p>
                 </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 3. APP DOWNLOAD SECTION (Neck Style) */}
        <section className="py-24 md:py-40 bg-gray-50 border-y border-gray-100">
           <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
              <div className="md:w-1/2 space-y-8 text-center md:text-left">
                 <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-[#0b0e14]">Power up <br /> your finances</h2>
                 <p className="text-xl text-gray-500 font-medium max-w-md">Manage expenses easier with OBEY node mesh. Available on all platforms.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button className="h-16 px-8 bg-black text-white rounded-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-xl active-press group">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="w-6 h-6 invert group-hover:scale-110 transition-transform" />
                       <div className="text-left">
                          <p className="text-[9px] font-bold uppercase opacity-50">Download for</p>
                          <p className="text-sm font-black uppercase tracking-wider">App Store</p>
                       </div>
                    </button>
                    <button className="h-16 px-8 bg-black text-white rounded-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-xl active-press group">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google" className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                       <div className="text-left">
                          <p className="text-[9px] font-bold uppercase opacity-50">Download for</p>
                          <p className="text-sm font-black uppercase tracking-wider">Google Play</p>
                       </div>
                    </button>
                 </div>
              </div>
              <div className="md:w-1/2 relative flex justify-center">
                 <div className="relative w-full max-w-lg aspect-square flex items-center justify-center p-12 bg-white rounded-[4rem] shadow-2xl border border-white">
                    <img 
                      src="https://img.freepik.com/free-vector/hand-drawn-coffee-time-collection_23-2148784112.jpg" 
                      alt="Lifestyle Finance" 
                      className="w-full object-contain grayscale hover:grayscale-0 transition-all duration-1000 opacity-80" 
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* 4. NET WORTH TRACKING (Data Viz Style) */}
        <section className="py-32 md:py-56 px-6 bg-white">
           <div className="max-w-[1400px] mx-auto space-y-24">
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                 <div className="inline-flex px-5 py-2 bg-primary/5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary">Functionality</div>
                 <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-tight text-[#0b0e14]">Tracking your net <br /> <span className="text-primary italic">worth & cash flow.</span></h2>
                 <p className="text-xl text-gray-400 font-medium leading-relaxed">
                    We have developed 7 proprietary financial categories to summarize 
                    wellbeing into digestible node clusters.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-12 bg-gray-50 rounded-[4rem] border border-gray-100 flex flex-col justify-between min-h-[460px] group hover:bg-white hover:shadow-2xl hover:border-gray-200 transition-all">
                    <div className="flex justify-between items-start">
                       <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-[#0b0e14] group-hover:text-white transition-all"><ChartBarIcon className="w-8 h-8" /></div>
                       <div className="text-right space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Yield Sync</p>
                          <p className="text-4xl font-black tracking-tighter font-space">$8,549</p>
                       </div>
                    </div>
                    <div className="h-48 w-full flex items-end gap-3 px-4">
                       {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 1].map((h, i) => (
                         <motion.div 
                           key={i}
                           initial={{ height: 0 }}
                           whileInView={{ height: `${h * 100}%` }}
                           transition={{ delay: i * 0.1, duration: 1 }}
                           className={`flex-grow rounded-t-2xl ${i === 6 ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-200 group-hover:bg-gray-300'}`}
                         ></motion.div>
                       ))}
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t border-gray-200/50">
                       <p className="text-sm font-black uppercase text-[#0b0e14]">October Insights</p>
                       <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-[#0b0e14] hover:text-white transition-all"><ArrowRightIcon className="w-4 h-4" /></button>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      { label: "Assets", val: "$222,342.20", trend: "+2%", icon: WalletIcon },
                      { label: "Loans", val: "$221,000.20", trend: "24%", icon: ShieldCheckIcon },
                      { label: "Investments", val: "$343,342.20", trend: "1.5%", icon: CpuIcon },
                      { label: "Retirement", val: "$283,342.20", trend: "+12%", icon: AcademicCapIcon }
                    ].map((card, i) => (
                      <div key={i} className="p-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all flex flex-col justify-between">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary transition-all"><card.icon className="w-5 h-5" /></div>
                         <div className="space-y-1 pt-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{card.label}</p>
                            <p className="text-xl font-black tracking-tighter">{card.val}</p>
                         </div>
                         <div className="flex items-center gap-2 pt-4">
                            <div className="h-1 flex-grow bg-gray-100 rounded-full overflow-hidden">
                               <div className="h-full bg-primary w-2/3"></div>
                            </div>
                            <span className="text-[10px] font-black text-gray-400">{card.trend}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* 5. VIRTUAL CARD DESIGN SECTION (Branding) */}
        <section className="py-32 md:py-56 px-6 bg-[#0b0e14] overflow-hidden relative">
           <div className="absolute inset-0 bg-primary/5 -z-10"></div>
           <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-24">
              <div className="lg:w-1/2 space-y-10 text-center lg:text-left text-white">
                 <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">Obey <br /> <span className="text-primary italic">Virtual.</span></h2>
                 <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-xl mx-auto lg:mx-0">
                    Generate an institutional-grade virtual card for instant retail liquidation. 
                    Compatible with Apple Pay and Google Wallet globally.
                 </p>
                 <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-6">
                    <button className="px-12 py-7 bg-white text-[#0b0e14] rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all active-press">Generate Card</button>
                    <button className="px-12 py-7 border-2 border-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:border-white transition-all active-press">Learn More</button>
                 </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                 <motion.div 
                   whileHover={{ rotateY: 20, rotateX: 10, scale: 1.05 }}
                   className="relative w-full max-w-md aspect-[1.6/1] rounded-[2.5rem] bg-gradient-to-br from-white/20 to-white/5 border border-white/20 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] p-10 flex flex-col justify-between overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10"></div>
                    <div className="flex justify-between items-start">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white"><span className="text-sm font-black uppercase tracking-tighter">O</span></div>
                          <span className="text-lg font-black tracking-tighter uppercase tracking-widest">Obey</span>
                       </div>
                       <span className="text-2xl font-black italic opacity-50 tracking-tighter">VISA</span>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex gap-2">
                          <div className="w-12 h-10 bg-yellow-400/20 rounded-lg border border-yellow-400/30 flex items-center justify-center overflow-hidden">
                             <div className="w-full h-full bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent animate-shimmer"></div>
                          </div>
                       </div>
                       <p className="text-2xl font-black tracking-[0.2em] font-mono">**** **** **** 9934</p>
                       <div className="flex justify-between items-end">
                          <div>
                             <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Card Holder</p>
                             <p className="text-lg font-black uppercase tracking-widest">Luke Okagha</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-bold uppercase opacity-50 mb-1">Valid Thru</p>
                             <p className="text-lg font-black font-mono">05/28</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              </div>
           </div>
        </section>

        <AboutUs />
      </main>

      <StandardFooter onNavigate={onNavigate} />

    </div>
  );
}
