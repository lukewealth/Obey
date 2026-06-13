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
  WalletIcon
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
      
      {/* 1. SIGHT NAVIGATION */}
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
              <span className="text-white font-black text-base uppercase">O</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#0b0e14] font-space uppercase">OBEY</span>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            {["Ecosystem", "Nodes", "Governance", "About"].map((link) => (
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
              Log In
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
            className="fixed inset-0 z-[60] bg-white p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="text-2xl font-black tracking-tighter font-space">OBEY</span>
              <button onClick={() => setMobileMenuOpen(false)}><XIcon className="w-8 h-8" /></button>
            </div>
            <nav className="space-y-10 text-center">
              {["Ecosystem", "Nodes", "Governance", "About"].map((link) => (
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
        {/* 2. SIGHT HERO: WHITE & ILLUSTIONS */}
        <section className="relative pt-40 pb-20 md:pt-56 md:pb-40 px-6 border-b border-gray-100 bg-[#fcfcfd]">
          <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-24">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="lg:w-1/2 space-y-14 text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex px-5 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-primary shadow-sm">
                Next-Gen Liquidity Node
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] text-[#0b0e14]"
              >
                Sync <br />
                Your <span className="text-primary italic">Wealth.</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-2xl text-gray-500 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
              >
                Assemble institutional wealth infrastructure with bank-grade 
                precision and sub-zero latency settlements.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-4"
              >
                <button
                  onClick={() => onNavigate(AppScreen.REGISTER)}
                  className="bg-[#0b0e14] text-white font-black text-sm uppercase tracking-widest px-14 py-7 rounded-2xl hover:bg-primary transition-all shadow-2xl shadow-gray-200 active-press"
                >
                  Create Account
                </button>
                <button
                  className="bg-white border-2 border-gray-100 text-[#0b0e14] font-black text-sm uppercase tracking-widest px-14 py-7 rounded-2xl hover:border-primary transition-all active-press"
                >
                  View Nodes
                </button>
              </motion.div>
            </motion.div>

            {/* Illustration 1 Integration: Blue/Black Analytics */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="lg:w-1/2 relative w-full"
            >
               <div className="relative aspect-square max-w-xl mx-auto flex items-center justify-center p-12 bg-white rounded-[70px] shadow-[0_80px_100px_-20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/5 opacity-40 group-hover:bg-primary/10 transition-colors duration-1000"></div>
                  <img 
                    src="https://lh3.googleusercontent.com/aida/AP1WRLutHcPnESDSgtsjZdmPdcJ8Hyel06r_xgaHB-pqd4GLpKIFHdNWm9kOWO8AJsw52-xFJzpZEoVR6HmaIrN1svxo-6z30hRNvB6PUuDxC-5UjQ8EwxMSC9veKQTo2-Pjv8EGvbjw8dbUq0zRfr1Kwu3wAIK2_MwzG11xPdPVmXOSXSaMoZkAinZqNlI-9NE9PZv7t9Ao1OiogtNjoGot3tXAoPNyLX57aiYJ40sOsy3SO0CFpnUYiTD84LNG" 
                    alt="Growth Dynamics" 
                    className="relative z-10 w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-1000"
                  />
                  {/* Floating Apple-Style Metrics */}
                  <div className="absolute bottom-10 left-10 p-6 bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-xl space-y-1 hidden sm:block">
                     <p className="text-[10px] font-black uppercase text-gray-400">BTC Node Sync</p>
                     <p className="text-2xl font-black tracking-tighter">${btcPrice.toLocaleString()}</p>
                     <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500">
                        <ZapIcon className="w-3 h-3" /> +2.42%
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* 3. TRANSACTION RICH FEATURES (Merged Previous Version) */}
        <section id="ecosystem" className="py-32 md:py-56 px-6 bg-white border-b border-gray-50">
          <div className="max-w-[1400px] mx-auto space-y-24">
             <div className="text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">Institutional <br /> <span className="text-primary italic">Apps & Nodes.</span></h2>
                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                   Liquidity modules and digital asset settlements accessible through a unified dashboard architecture.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { label: "BTC Treasury", value: `$${btcPrice.toLocaleString()}`, icon: DatabaseIcon, color: "primary", desc: "Institutional bitcoin node sync." },
                  { label: "ETH Ledger", value: `$${ethPrice.toLocaleString()}`, icon: CpuIcon, color: "secondary", desc: "Smart contract settlement engine." },
                  { label: "NGN Liquidity", value: "₦2.5B Pool", icon: WalletIcon, color: "emerald", desc: "Real-time fiat on-ramp gateway." },
                  { label: "Hedge Nodes", value: "+12.42% Yield", icon: ActivityIcon, color: "amber", desc: "Automated risk management sync." }
                ].map((node, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="p-10 bg-[#fcfcfd] rounded-[48px] border border-gray-100 flex flex-col justify-between min-h-[340px] shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group"
                  >
                     <div className={`w-14 h-14 bg-${node.color}/5 rounded-2xl flex items-center justify-center text-${node.color} group-hover:scale-110 transition-transform`}>
                        <node.icon className="w-8 h-8" />
                     </div>
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{node.label}</p>
                           <p className="text-3xl font-black tracking-tighter text-[#0b0e14]">{node.value}</p>
                        </div>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">{node.desc}</p>
                        <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-primary pt-2 group-hover:gap-3 transition-all">
                           Parameters <ChevronRightIcon className="w-4 h-4" />
                        </button>
                     </div>
                  </motion.div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
                <div className="lg:col-span-2 p-12 bg-[#0b0e14] rounded-[56px] text-white flex flex-col md:flex-row items-center gap-16 overflow-hidden relative group">
                   <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000"></div>
                   <div className="md:w-1/2 space-y-8 relative z-10 text-center md:text-left">
                      <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center">
                         <SwapIcon className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-4xl font-black tracking-tighter leading-tight">Quantum <br /> Swap Engine.</h3>
                      <p className="text-gray-400 font-medium leading-relaxed text-lg">Instant cross-asset exchange between BTC, ETH, and global fiat pools with zero spread latency.</p>
                      <button className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Launch Exchange</button>
                   </div>
                   <div className="md:w-1/2 relative z-10 flex justify-center">
                      <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-2xl w-full max-w-sm space-y-8">
                         {[
                           { label: "Gift Card Hub", icon: GiftIcon, value: "Instant Pay" },
                           { label: "Data Mesh", icon: AppIcon, value: "Sync Node" },
                           { label: "Airtime Sync", icon: CurrencyDollarIcon, value: "Active" }
                         ].map((app, i) => (
                           <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><app.icon className="w-6 h-6 text-primary" /></div>
                                 <p className="text-sm font-black">{app.label}</p>
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest py-1 px-3 bg-emerald-500/20 text-emerald-500 rounded-full">{app.value}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="p-12 bg-[#fcfcfd] rounded-[56px] border border-gray-100 flex flex-col justify-between relative group overflow-hidden">
                   <div className="space-y-6 relative z-10">
                      <div className="w-16 h-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                         <ShieldCheckIcon className="w-10 h-10" />
                      </div>
                      <h3 className="text-4xl font-black tracking-tighter leading-tight">Escrow <br /> Assurance.</h3>
                      <p className="text-gray-400 font-medium leading-relaxed">Multi-signature settlement protection for high-value marketplaces.</p>
                   </div>
                   <div className="pt-12 relative z-10">
                      <img 
                        src="https://img.freepik.com/free-vector/hand-drawn-business-characters_23-2148479261.jpg" 
                        alt="Security characters" 
                        className="w-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 mix-blend-multiply" 
                      />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* 4. OPERATIONAL INTEGRITY (Black Set Characters) */}
        <section id="nodes" className="py-32 md:py-56 px-6 bg-white overflow-hidden">
          <div className="max-w-[1400px] mx-auto">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1 relative">
                   <div className="relative p-12 bg-gray-50 rounded-[60px] border border-gray-100 overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                      <img 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLuB1E9Y2X4W5Z6v7C8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z" 
                        alt="Operations Center" 
                        className="w-full h-full object-contain mix-blend-multiply grayscale hover:grayscale-0 transition-all duration-1000 opacity-80"
                        onError={(e) => {
                          e.currentTarget.src = "https://img.freepik.com/free-vector/hand-drawn-business-characters-working_23-2148483758.jpg";
                        }}
                      />
                   </div>
                </div>
                <div className="lg:col-span-7 space-y-14 order-1 lg:order-2">
                   <div className="space-y-6 text-center lg:text-left">
                      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Operational Protocol</motion.p>
                      <h2 className="text-6xl md:text-9xl font-black tracking-tighter text-[#0b0e14] leading-[0.85]">
                        Global <br /> <span className="text-primary italic">Auditing.</span>
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        Our compliance characters represent the high-throughput processing nodes that verify 
                        every global transaction in real-time.
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                      {[
                        { title: "Escrow Logic", desc: "Automated smart contracts for security.", icon: LockIcon },
                        { title: "Market Gateway", desc: "Structured liquidity access portals.", icon: GlobeIcon }
                      ].map((feature, i) => (
                        <div key={feature.title} className="p-10 bg-[#fcfcfd] rounded-[40px] border border-gray-100 space-y-6">
                           <div className="w-12 h-12 bg-primary flex items-center justify-center text-white rounded-2xl shadow-lg shadow-primary/20">
                              <feature.icon className="w-6 h-6" />
                           </div>
                           <h4 className="text-2xl font-black tracking-tighter">{feature.title}</h4>
                           <p className="text-sm text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* 5. LIFESTYLE FINANCE (Orange Characters) */}
        <section id="about" className="py-32 md:py-56 px-6 bg-[#0b0e14] text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="max-w-[1400px] mx-auto relative z-10">
             <div className="flex flex-col lg:flex-row items-center gap-24">
                <div className="lg:w-3/5 space-y-14">
                   <div className="space-y-6 text-center lg:text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Node Community</p>
                      <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                        Finance For <br /> <span className="text-primary italic">Humanity.</span>
                      </h2>
                      <p className="text-xl md:text-3xl text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                        A digital financial story told through ease of use and premium daily rewards. 
                        Join 15M+ users redefining the boundaries of money.
                      </p>
                   </div>
                   <div className="flex flex-wrap gap-12 justify-center lg:justify-start pt-6">
                      <div className="space-y-2">
                        <p className="text-6xl font-black tracking-tighter text-primary font-space">15M+</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Active Node Users</p>
                      </div>
                      <div className="w-px h-20 bg-gray-800 hidden sm:block"></div>
                      <div className="space-y-2">
                        <p className="text-6xl font-black tracking-tighter font-space text-white">$2.5B</p>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Monthly Yield Pool</p>
                      </div>
                   </div>
                </div>
                <div className="lg:w-2/5 w-full">
                   <div className="relative aspect-[4/5] p-12 bg-white/5 rounded-[70px] border border-white/10 backdrop-blur-3xl overflow-hidden group">
                      <img 
                        src="https://lh3.googleusercontent.com/aida/AP1WRLunG8F7E6D5C4B3A2Z1Y0X9W8V7U6T5S4R3Q2P1O0N9M8L7K6J5I4H3G2F1" 
                        alt="Coffee Story" 
                        className="w-full h-full object-contain mix-blend-lighten opacity-80 group-hover:scale-105 transition-transform duration-1000"
                        onError={(e) => {
                          e.currentTarget.src = "https://img.freepik.com/free-vector/hand-drawn-coffee-time-collection_23-2148784112.jpg";
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-[#0b0e14] to-transparent pt-32">
                         <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">ONE COFFEE STORY • DAILY REWARDS</p>
                      </div>
                   </div>
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
