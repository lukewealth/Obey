import React, { useEffect, useState } from "react";
import { AppScreen } from "../types";
import AboutUs from "./AboutUs";
import StandardFooter from "./StandardFooter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bars3Icon as MenuIcon, 
  XMarkIcon as XIcon, 
  ArrowRightIcon, 
  ChevronRightIcon,
  ShieldCheckIcon,
  GlobeAltIcon as GlobeIcon,
  BoltIcon as ZapIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon as SwapIcon,
  GiftIcon,
  UserGroupIcon as UsersIcon,
  LockClosedIcon as LockIcon,
  ChartBarIcon,
  PresentationChartLineIcon as ActivityIcon
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
    <div className="min-h-screen bg-[#fcfcfd] text-[#0b0e14] selection:bg-primary/10 selection:text-primary overflow-x-hidden font-inter">
      
      {/* 1. SIGHT BANKING NAVIGATION */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 h-20 md:h-24 flex items-center ${
          activeHeader
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-9 h-9 bg-[#0b0e14] flex items-center justify-center rounded-[10px] group-hover:rotate-[10deg] transition-transform shadow-lg">
              <span className="text-white font-black text-base">O</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#0b0e14] font-space uppercase">OBEY</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {["Services", "Yield", "Governance", "About"].map((link) => (
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
              Sign In
            </button>
            <button
              onClick={() => onNavigate(AppScreen.REGISTER)}
              className="bg-primary text-white py-3.5 px-8 rounded-full text-[12px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all"
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
            className="fixed inset-0 z-[60] bg-white p-6 flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-2xl font-black tracking-tighter font-space">OBEY</span>
              <button onClick={() => setMobileMenuOpen(false)}><XIcon className="w-8 h-8" /></button>
            </div>
            <nav className="space-y-8">
              {["Services", "Yield", "Governance", "About"].map((link) => (
                <a key={link} href="#" onClick={() => setMobileMenuOpen(false)} className="block text-4xl font-black tracking-tighter">
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
        {/* 2. SIGHT HERO: HIGH CONTRAST */}
        <section className="relative pt-40 pb-20 md:pt-56 md:pb-40 px-6 border-b border-gray-100 bg-[#fcfcfd]">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-20">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:w-1/2 space-y-12"
            >
              <motion.div variants={itemVariants} className="inline-flex px-5 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-sm">
                Next-Gen Liquidity Node
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-[#0b0e14]"
              >
                Control <br />
                Your <span className="text-primary italic">Wealth.</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-500 max-w-xl font-medium leading-relaxed"
              >
                Assemble institutional wealth infrastructure with bank-grade 
                precision and sub-zero latency settlements.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 pt-4"
              >
                <button
                  onClick={() => onNavigate(AppScreen.REGISTER)}
                  className="bg-[#0b0e14] text-white font-black text-sm uppercase tracking-widest px-12 py-7 rounded-2xl hover:bg-primary transition-all shadow-2xl shadow-gray-200 active-press"
                >
                  Create Account
                </button>
                <button
                  className="bg-white border-2 border-gray-100 text-[#0b0e14] font-black text-sm uppercase tracking-widest px-12 py-7 rounded-2xl hover:border-primary transition-all active-press"
                >
                  View Yields
                </button>
              </motion.div>
            </motion.div>

            {/* Illustration 1 Integration: Blue/Black Set (Analytics) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="lg:w-1/2 relative"
            >
               <div className="relative aspect-square max-w-xl mx-auto flex items-center justify-center p-12 bg-white rounded-[60px] shadow-[0_80px_100px_-20px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/5 opacity-40"></div>
                  <img 
                    src="https://lh3.googleusercontent.com/aida/AP1WRLv6W9U0C_1kX7D8M-R0H6p8L5N2rW5z_J-Y7N6_Y-X8Y7N6_Y-X8Y7N6_Y-X8Y7N6_Y-X8Y7N6_Y-X8Y7N6_Y-X8" 
                    alt="Institutional Growth" 
                    className="relative z-10 w-full h-full object-contain mix-blend-multiply opacity-90"
                    onError={(e) => {
                      // Fallback if the temporary URL expires
                      e.currentTarget.src = "https://img.freepik.com/free-vector/hand-drawn-business-characters_23-2148479261.jpg";
                    }}
                  />
                  {/* Floating Card UI */}
                  <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 right-10 p-6 bg-[#0b0e14] text-white rounded-3xl shadow-2xl space-y-3 hidden sm:block"
                  >
                    <ActivityIcon className="w-8 h-8 text-primary" />
                    <p className="text-[10px] font-black uppercase opacity-60">Master Node Status</p>
                    <p className="text-2xl font-black tracking-tighter">Active Sync</p>
                  </motion.div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* 3. VALUE PROPOSITION: Character Integration (Black Set - Operations) */}
        <section id="services" className="py-32 md:py-56 px-6 bg-white">
          <div className="max-w-[1400px] mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1">
                   <div className="relative p-12 bg-gray-50 rounded-[48px] border border-gray-100 overflow-hidden">
                      <img 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLuB1E9Y2X4W5Z6v7C8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z" 
                        alt="Operations" 
                        className="w-full h-full object-contain grayscale hover:grayscale-0 transition-all duration-700 opacity-80"
                        onError={(e) => {
                          e.currentTarget.src = "https://img.freepik.com/free-vector/hand-drawn-business-characters-working_23-2148483758.jpg";
                        }}
                      />
                   </div>
                </div>
                <div className="lg:col-span-7 space-y-12 order-1 lg:order-2">
                   <div className="space-y-6">
                      <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#0b0e14] leading-[0.9]">
                        Operational <br /> <span className="text-primary">Integrity.</span>
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl">
                        Our compliance nodes use proprietary auditing characters to ensure 
                        zero-risk entry for all global digital assets.
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {[
                        { title: "Escrow Logic", desc: "Automated smart contracts for marketplace safety.", icon: LockIcon },
                        { title: "Gift Card Hub", desc: "Premium liquidation for institutional retail assets.", icon: GiftIcon },
                        { title: "Payment Mesh", desc: "Instant settlement across 140+ countries.", icon: SwapIcon },
                        { title: "Vault Custody", desc: "Multi-signature cold storage for treasury.", icon: ShieldCheckIcon }
                      ].map((feature, i) => (
                        <div key={i} className="group p-8 bg-[#fcfcfd] rounded-[32px] border border-transparent hover:border-primary transition-all">
                           <feature.icon className="w-10 h-10 text-[#0b0e14] mb-6 group-hover:text-primary transition-colors" />
                           <h4 className="text-xl font-black text-[#0b0e14] mb-3">{feature.title}</h4>
                           <p className="text-sm text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* 4. CASUAL FINANCE: Character Integration (Orange Set - Lifestyle) */}
        <section id="yield" className="py-32 md:py-56 px-6 bg-[#0b0e14] text-white overflow-hidden relative">
          <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/2 translate-y-1/2"></div>
          
          <div className="max-w-[1400px] mx-auto">
             <div className="flex flex-col lg:flex-row items-center gap-24">
                <div className="lg:w-3/5 space-y-12">
                   <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.85]">
                     Finance For <br /> <span className="text-primary">Humanity.</span>
                   </h2>
                   <p className="text-xl md:text-3xl text-gray-400 font-medium leading-relaxed max-w-2xl">
                     A digital financial story told through ease of use and premium daily rewards. 
                     Join 15M+ users redefining the boundaries of money.
                   </p>
                   <div className="flex flex-wrap gap-8 pt-6">
                      <div className="space-y-2">
                        <p className="text-6xl font-black tracking-tighter text-primary font-space">15M+</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Active Node Users</p>
                      </div>
                      <div className="w-px h-20 bg-gray-800"></div>
                      <div className="space-y-2">
                        <p className="text-6xl font-black tracking-tighter font-space text-white">$2.5B</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Monthly Yield Pool</p>
                      </div>
                   </div>
                </div>
                <div className="lg:w-2/5">
                   <div className="relative p-12 bg-white/5 rounded-[60px] border border-white/10 backdrop-blur-3xl overflow-hidden group">
                      <img 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLunG8F7E6D5C4B3A2Z1Y0X9W8V7U6T5S4R3Q2P1O0N9M8L7K6J5I4H3G2F1" 
                        alt="Casual Finance" 
                        className="w-full h-full object-contain mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-1000"
                        onError={(e) => {
                          e.currentTarget.src = "https://img.freepik.com/free-vector/hand-drawn-coffee-time-collection_23-2148784112.jpg";
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-[#0b0e14] to-transparent pt-20">
                         <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">ONE COFFEE STORY • DAILY REWARDS</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* 5. ADMIN PORTAL TEASER (Escrow & Control) */}
        <section className="py-32 md:py-56 px-6 bg-[#fcfcfd]">
           <div className="max-w-[1400px] mx-auto text-center space-y-16">
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-[#0b0e14]">Escrow-Backed <br /> Security.</h2>
                <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
                   Our marketplace escrow admin control portal ensures every gift card and 
                   crypto settlement is audited before final release.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { label: "Account Control", value: "Real-time auditing of user balances.", icon: UsersIcon },
                   { label: "Escrow Logic", value: "Multi-sig approval for large settlements.", icon: ShieldCheckIcon },
                   { label: "Market Access", value: "Structured global gateway for all regions.", icon: GlobeIcon }
                 ].map((card, i) => (
                   <motion.div 
                     key={i}
                     whileHover={{ y: -10 }}
                     className="p-12 bg-white rounded-[40px] shadow-[0_50px_80px_-20px_rgba(0,0,0,0.04)] border border-gray-100 text-left space-y-6"
                   >
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#0b0e14]">
                        <card.icon className="w-8 h-8" />
                      </div>
                      <h4 className="text-2xl font-black tracking-tighter text-[#0b0e14]">{card.label}</h4>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed">{card.value}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>

        <AboutUs />
      </main>

      <StandardFooter />

    </div>
  );
}
