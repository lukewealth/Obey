import React, { useEffect, useState } from "react";
import { AppScreen } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Zap, Globe, Heart, 
  ChevronRight, Play, Star,
  Smartphone, CreditCard, RefreshCw, BarChart3,
  CheckCircle2, ShieldCheck, User, Layout, 
  Search, Filter, Share2, Layers, Cpu, Wallet,
  TrendingUp, ArrowUpRight, Lock, Bell, PieChart,
  Activity, Database, Cloud, Code2, Bitcoin,
  Home
} from "lucide-react";

interface MarketingPageProps {
  onNavigate: (screen: AppScreen) => void;
  btcPrice: number;
  ethPrice: number;
}

export default function MarketingPage({ onNavigate, btcPrice, ethPrice }: MarketingPageProps) {
  const [activeHeader, setActiveHeader] = useState(false);

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
    <div className="min-h-screen bg-[#EEF2FF] text-[#1E1B4B] selection:bg-[#6366F1]/20 selection:text-[#6366F1] overflow-x-hidden font-inter">
      
      {/* 1. MINIMAL SINGLE COLUMN NAVIGATION */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 h-20 md:h-32 flex items-center ${
          activeHeader
            ? "bg-[#EEF2FF]/80 backdrop-blur-xl border-b border-[#C7D2FE]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-8 md:px-16 w-full flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-10 h-10 bg-[#6366F1] flex items-center justify-center rounded-[12px] group-hover:rotate-[15deg] transition-transform shadow-lg shadow-[#6366F1]/20">
              <span className="text-white font-black text-lg">O</span>
            </div>
            <span className="text-3xl font-black tracking-tighter text-[#312E81] font-space">OBEY</span>
          </motion.div>

          <div className="flex items-center gap-10">
            <button
              onClick={() => onNavigate(AppScreen.LOGIN)}
              className="text-[15px] font-bold text-[#312E81] hover:text-[#6366F1] transition-colors uppercase tracking-widest"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigate(AppScreen.REGISTER)}
              className="bg-[#16A34A] text-white hover:bg-[#15803d] transition-all py-4 px-10 rounded-full text-[14px] font-black uppercase tracking-widest shadow-xl shadow-[#16A34A]/20 active-press"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 2. EXAGGERATED MINIMALISM HERO */}
        <section className="relative pt-40 pb-20 md:pt-64 md:pb-40 px-8">
          <div className="max-w-[1400px] mx-auto text-center space-y-16">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              <motion.div variants={itemVariants} className="inline-flex px-6 py-2 bg-white border border-[#C7D2FE] rounded-full text-[12px] font-black uppercase tracking-[0.3em] text-[#6366F1] shadow-sm">
                Next Generation Liquidity
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="display-title text-[#1E1B4B]"
              >
                Control your <br />
                <span className="text-gradient">financial</span> <br />
                future easily.
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-xl md:text-3xl text-[#312E81]/60 max-w-3xl mx-auto font-medium leading-relaxed"
              >
                Assemble your wealth infrastructure with bank-grade 
                precision and institutional institutional speed.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
              >
                <button
                  onClick={() => onNavigate(AppScreen.REGISTER)}
                  className="bg-[#6366F1] text-white font-black text-lg uppercase tracking-widest px-16 py-8 rounded-full hover:bg-[#4F46E5] transition-all shadow-2xl shadow-[#6366F1]/30 active-press"
                >
                  Create Account
                </button>
                <button
                  onClick={() => onNavigate(AppScreen.LOGIN)}
                  className="bg-white border-2 border-[#C7D2FE] text-[#312E81] font-black text-lg uppercase tracking-widest px-16 py-8 rounded-full hover:border-[#6366F1] transition-all active-press"
                >
                  Ecosystem Tour
                </button>
              </motion.div>
            </motion.div>

            {/* 3D Visual Synthesis */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="pt-20 relative"
            >
               <div className="relative w-full max-w-5xl mx-auto">
                  <div className="absolute inset-0 bg-[#6366F1]/5 rounded-full blur-[120px] -z-10"></div>
                  
                  {/* High-Fidelity Dashboard Mockup */}
                  <div className="relative z-10 bg-white/40 backdrop-blur-2xl border-[3px] border-white rounded-[48px] shadow-[0_80px_160px_-20px_rgba(49,46,129,0.15)] overflow-hidden">
                     <div className="p-8 md:p-16 space-y-12">
                        <div className="flex justify-between items-center">
                           <div className="space-y-2">
                              <p className="text-[10px] font-black uppercase text-[#6366F1] tracking-widest">Total Treasury</p>
                              <p className="text-5xl font-black font-space text-[#1E1B4B]">$1,425,582.50</p>
                           </div>
                           <div className="flex -space-x-4">
                              {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-14 h-14 rounded-full border-[4px] border-white bg-[#E0E7FF] flex items-center justify-center text-[#6366F1] font-bold">
                                   <User size={24} />
                                </div>
                              ))}
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {[
                              { label: "BTC/USD", val: "$64,231.80", trend: "+2.4%", color: "text-emerald-500" },
                              { label: "ETH/USD", val: "$3,452.12", trend: "+1.8%", color: "text-emerald-500" },
                              { label: "NGN/USD", val: "₦1,425.00", trend: "-0.4%", color: "text-red-500" }
                           ].map((stat, i) => (
                             <div key={i} className="p-8 bg-white border border-[#C7D2FE] rounded-[32px] space-y-3 shadow-sm hover:border-[#6366F1] transition-all cursor-pointer group">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <div className="flex justify-between items-end">
                                   <p className="text-2xl font-black text-[#1E1B4B] font-space">{stat.val}</p>
                                   <p className={`text-xs font-bold ${stat.color} group-hover:translate-x-1 transition-transform`}>{stat.trend} →</p>
                                </div>
                             </div>
                           ))}
                        </div>

                        <div className="relative h-64 bg-gray-50 rounded-[32px] border border-dashed border-[#C7D2FE] flex items-center justify-center">
                           <div className="flex flex-col items-center gap-4 text-[#6366F1]/40">
                              <Activity size={48} strokeWidth={1} />
                              <p className="text-sm font-bold uppercase tracking-widest">Real-time Node Activity</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Floating 3D Cards */}
                  <motion.div 
                    animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-16 -left-16 w-64 p-8 bg-[#312E81] rounded-[32px] shadow-2xl text-white space-y-6 hidden lg:block"
                  >
                     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <Lock size={24} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-2xl font-bold">Secure Node</p>
                        <p className="text-xs opacity-60 leading-relaxed">End-to-end encrypted ledger architecture.</p>
                     </div>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-16 -right-16 w-64 p-8 bg-[#16A34A] rounded-[32px] shadow-2xl text-white space-y-6 hidden lg:block"
                  >
                     <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <TrendingUp size={24} />
                     </div>
                     <div className="space-y-2">
                        <p className="text-2xl font-bold">142.5% ROI</p>
                        <p className="text-xs opacity-80 leading-relaxed">Average performance of institutional nodes.</p>
                     </div>
                  </motion.div>
               </div>
            </motion.div>
          </div>
        </section>

        {/* 3. EXAGGERATED ANALYTICS (Neck / Data Viz) */}
        <section id="features" className="py-40 md:py-64 bg-white border-y border-[#C7D2FE]">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-end">
               <div className="lg:col-span-7 space-y-8">
                  <div className="inline-flex px-6 py-2 bg-[#EEF2FF] rounded-full text-[12px] font-black uppercase tracking-[0.3em] text-[#6366F1]">
                     Deep Intelligence
                  </div>
                  <h2 className="text-6xl md:text-8xl font-black text-[#1E1B4B] font-space tracking-tighter leading-[0.9]">
                     Visualize your <br />
                     <span className="text-[#6366F1]">wealth flow.</span>
                  </h2>
               </div>
               <div className="lg:col-span-5 pb-4">
                  <p className="text-xl md:text-2xl text-[#312E81]/60 font-medium leading-relaxed">
                     Proprietary financial categories summarize your 
                     wellbeing into digestible node clusters.
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
               <div className="bento-card bg-[#EEF2FF]/50 space-y-12">
                  <div className="flex justify-between items-start">
                     <div className="w-16 h-16 bg-[#6366F1] text-white rounded-[24px] flex items-center justify-center shadow-lg shadow-[#6366F1]/20">
                        <BarChart3 size={32} />
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Yield</p>
                        <p className="text-4xl font-black font-space text-[#1E1B4B]">+$24,582</p>
                     </div>
                  </div>
                  
                  {/* Dynamic SVG Graph */}
                  <div className="h-64 w-full relative">
                     <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                        <motion.path 
                           d="M0,150 Q50,20 100,100 T200,60 T300,120 T400,20" 
                           fill="transparent" stroke="#6366F1" strokeWidth="6" strokeLinecap="round"
                           initial={{ pathLength: 0 }}
                           whileInView={{ pathLength: 1 }}
                           transition={{ duration: 2, ease: "easeInOut" }}
                        />
                        <motion.path 
                           d="M0,150 Q50,20 100,100 T200,60 T300,120 T400,20 V150 H0 Z" 
                           fill="url(#indigo-grad)" opacity="0.1"
                        />
                        <defs>
                           <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6366F1" />
                              <stop offset="100%" stopColor="transparent" />
                           </linearGradient>
                        </defs>
                     </svg>
                  </div>
                  
                  <div className="flex justify-between items-center pt-8 border-t border-[#C7D2FE]">
                     <div className="flex gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl border border-[#C7D2FE] flex items-center justify-center">
                           <RefreshCw size={20} className="text-[#6366F1]" />
                        </div>
                        <div className="w-12 h-12 bg-white rounded-2xl border border-[#C7D2FE] flex items-center justify-center">
                           <ShieldCheck size={20} className="text-emerald-500" />
                        </div>
                     </div>
                     <button className="text-sm font-black uppercase tracking-widest text-[#6366F1] hover:translate-x-2 transition-transform flex items-center gap-2">
                        View Details <ArrowRight size={16} />
                     </button>
                  </div>
               </div>

               <div className="space-y-8">
                  {[
                     { label: "Digital Assets", amount: "$842,501.20", pct: "+12.4%", icon: Bitcoin },
                     { label: "Liquidity Pool", amount: "$245,000.00", pct: "+8.5%", icon: Database },
                     { label: "Hedge Nodes", amount: "$158,240.50", pct: "+3.2%", icon: Cpu }
                  ].map((asset, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="p-10 bg-white border-2 border-transparent hover:border-[#6366F1] rounded-[40px] shadow-sm flex items-center justify-between transition-all cursor-pointer group"
                    >
                       <div className="flex items-center gap-8">
                          <div className="w-20 h-20 bg-[#EEF2FF] text-[#6366F1] rounded-[28px] flex items-center justify-center group-hover:rotate-6 transition-transform">
                             <asset.icon size={36} strokeWidth={1.5} />
                          </div>
                          <div className="space-y-2">
                             <p className="text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">{asset.label}</p>
                             <p className="text-3xl font-black text-[#1E1B4B] font-space">{asset.amount}</p>
                          </div>
                       </div>
                       <div className="text-right space-y-2">
                          <div className="inline-flex px-4 py-1.5 bg-emerald-50 text-[#16A34A] rounded-full text-xs font-black">
                             {asset.pct}
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Live Index</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* 4. INSTITUTIONAL SERVICES (Minimal Single Column Patterns) */}
        <section id="services" className="py-40 md:py-64 px-8 bg-[#EEF2FF]">
           <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-32">
              <div className="lg:col-span-5 space-y-20">
                 <div className="space-y-8">
                    <h2 className="text-4xl font-bold uppercase tracking-[0.4em] text-[#C7D2FE] font-space">Services</h2>
                    <p className="text-5xl md:text-6xl font-black text-[#1E1B4B] font-space tracking-tight leading-[0.95]">
                       The Standard for <br /> Digital Banking.
                    </p>
                    <p className="text-xl text-[#312E81]/60 font-medium max-w-md">
                       Engineered for high-throughput institutional financial operations.
                    </p>
                 </div>

                 <div className="grid grid-cols-2 gap-12 pt-12">
                    <div className="space-y-4">
                       <p className="text-8xl font-black text-[#6366F1] font-space">24</p>
                       <p className="text-sm font-bold uppercase tracking-widest text-[#312E81]">Nodes Online</p>
                    </div>
                    <div className="space-y-4">
                       <p className="text-8xl font-black text-[#16A34A] font-space">100</p>
                       <p className="text-sm font-bold uppercase tracking-widest text-[#312E81]">Uptime %</p>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                 {[
                    { title: "Laser Beam Treasury", desc: "Precision liquidity management for enterprise scale.", icon: Zap },
                    { title: "No-stress Institutional", desc: "Bank-grade infrastructure for secure cloud nodes.", icon: ShieldCheck },
                    { title: "Quantum Ledger", desc: "Sub-zero latency transaction settlement architecture.", icon: Activity },
                    { title: "Superstar Analytics", desc: "Advanced visualization for complex multi-asset wealth.", icon: PieChart },
                    { title: "Tsar Data Cloud", desc: "High-performance hosting for digital financial assets.", icon: Cloud },
                    { title: "Burning Machine AI", desc: "ML-driven fraud detection and risk model engineering.", icon: Cpu }
                 ].map((service, i) => (
                   <div key={i} className="group space-y-8">
                      <div className="w-16 h-16 border-[3px] border-[#312E81] rounded-2xl flex items-center justify-center group-hover:bg-[#6366F1] group-hover:border-[#6366F1] group-hover:text-white transition-all group-hover:-translate-y-2">
                         <service.icon size={32} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-4">
                         <h4 className="text-2xl font-black text-[#1E1B4B] font-space">{service.title}</h4>
                         <p className="text-[#312E81]/60 font-medium leading-relaxed">{service.desc}</p>
                         <button className="text-[11px] font-black uppercase tracking-[0.2em] text-[#6366F1] border-b-2 border-transparent hover:border-[#6366F1] transition-all pt-2 pb-1">
                            Learn Parameters →
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 5. FINAL CTA (Loud Minimalist) */}
        <section className="py-40 md:py-80 bg-white px-8 text-center overflow-hidden relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-full opacity-5 pointer-events-none">
              <p className="text-[20rem] font-black font-space text-[#6366F1] leading-none select-none">OBEY OBEY OBEY</p>
           </div>
           
           <div className="max-w-5xl mx-auto space-y-16 relative z-10">
              <h2 className="display-title text-[#1E1B4B]">
                 Ready for <br />
                 <span className="text-[#6366F1]">Elevation?</span>
              </h2>
              <p className="text-2xl md:text-4xl text-[#312E81]/40 font-bold max-w-3xl mx-auto font-space">
                 Join 15M+ users redefining the boundaries of money.
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center pt-10">
                 <button
                   onClick={() => onNavigate(AppScreen.REGISTER)}
                   className="bg-[#16A34A] text-white font-black text-2xl uppercase tracking-widest px-20 py-10 rounded-full shadow-3xl shadow-[#16A34A]/20 hover:scale-105 transition-all active-press"
                 >
                    Join Obey
                 </button>
                 <button
                   onClick={() => onNavigate(AppScreen.LOGIN)}
                   className="bg-[#312E81] text-white font-black text-2xl uppercase tracking-widest px-20 py-10 rounded-full hover:bg-[#1E1B4B] transition-all active-press"
                 >
                    Sign In
                 </button>
              </div>
           </div>
        </section>
      </main>

      {/* 6. MINIMAL FOOTER */}
      <footer className="bg-[#EEF2FF] py-32 px-8 border-t border-[#C7D2FE]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-20">
           <div className="md:col-span-5 space-y-10">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-[#312E81] flex items-center justify-center rounded-[14px]">
                    <span className="text-white font-black text-xl">O</span>
                 </div>
                 <span className="text-4xl font-black tracking-tighter text-[#312E81] font-space">OBEY</span>
              </div>
              <p className="text-xl text-[#312E81]/60 font-medium leading-relaxed max-w-sm">
                 The modern standard for digital asset management and institutional liquidity.
              </p>
           </div>

           <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-16">
              {[
                 { title: "Protocol", links: ["Nodes", "Yield", "Governance", "Docs"] },
                 { title: "Company", links: ["About", "Press", "Careers", "Legal"] },
                 { title: "Network", links: ["Status", "Sui Mainnet", "Security", "Contact"] }
              ].map((group) => (
                <div key={group.title} className="space-y-8">
                   <h5 className="text-[12px] font-black uppercase tracking-[0.3em] text-[#312E81]">{group.title}</h5>
                   <ul className="space-y-5">
                      {group.links.map((link) => (
                        <li key={link}>
                           <a href="#" className="text-sm font-bold text-gray-400 hover:text-[#6366F1] transition-colors">{link}</a>
                        </li>
                      ))}
                   </ul>
                </div>
              ))}
           </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto mt-32 pt-12 border-t border-[#C7D2FE] flex flex-col md:flex-row justify-between items-center gap-10 text-[12px] font-black uppercase tracking-[0.2em] text-[#C7D2FE]">
           <p>© 2026 OBEY FINANCIAL TECHNOLOGIES.</p>
           <div className="flex gap-12">
              <a href="#" className="hover:text-[#6366F1] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#6366F1] transition-colors">Compliance</a>
              <a href="#" className="hover:text-[#6366F1] transition-colors">Status</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
