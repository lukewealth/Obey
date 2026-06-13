import React, { useState, useRef, useEffect } from "react";
import { AppScreen, UserProfile } from "../types";
import { 
  Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, RefreshCw, 
  Smartphone, Chrome, ChevronLeft, ArrowRight, CheckCircle2,
  Zap, Star, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";

interface AuthSystemProps {
  onSuccess: (profile: Partial<UserProfile>) => void;
  onNavigate: (screen: AppScreen) => void;
  currentScreen: AppScreen;
}

export default function AuthSystem({ onSuccess, onNavigate, currentScreen }: AuthSystemProps) {
  // Login State
  const [loginMethod, setLoginType] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Register State
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPromo, setRegPromo] = useState("");

  // OTP State
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpTimer, setOtpValue] = useState(119); // 2 minutes
  const [timerActive, setTimerActive] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifiedOverlay, setVerifiedOverlay] = useState(false);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentScreen === AppScreen.OTP && timerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpValue((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [currentScreen, timerActive, otpTimer]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (loginMethod === "email") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
        let profileData: any = profile;
        if (!profile) {
          profileData = { id: data.user.id, full_name: email.split("@")[0], email, avatar_url: email[0].toUpperCase(), kyc_status: "Pending", balance: 142580.42 };
          await supabase.from("profiles").insert([profileData]);
        }
        onSuccess(profileData);
        onNavigate(AppScreen.DASHBOARD);
      } else {
        onSuccess({ name: "Felix Anderson", email: "phone@obey.finance", kycStatus: "Verified", balance: 142580.42, avatar: "FA" });
        onNavigate(AppScreen.DASHBOARD);
      }
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email: regEmail, password: regPassword, options: { data: { full_name: regName, phone: regPhone } } });
      if (error) throw error;
      onNavigate(AppScreen.OTP);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (!cleaned) return;
    const newOtp = [...otpValues];
    newOtp[index] = cleaned[0];
    setOtpValues(newOtp);
    if (index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpValues];
      newOtp[index] = "";
      setOtpValues(newOtp);
      if (index > 0) otpRefs[index - 1].current?.focus();
    }
  };

  const verifyOtpCode = async () => {
    const code = otpValues.join("");
    if (code.length === 6) {
      setVerifying(true);
      setVerifiedOverlay(true);
      setTimeout(() => {
        setVerifying(false);
        setVerifiedOverlay(false);
        onNavigate(AppScreen.DASHBOARD);
      }, 1600);
    }
  };

  const formattedTimer = () => {
    const min = Math.floor(otpTimer / 60);
    const sec = otpTimer % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-gray-900 selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Global Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-bg-white)_0%,_var(--color-accent-blue)_50%,_var(--color-accent-yellow)_100%)] -z-20"></div>

      {/* Auth Header */}
      <header className="fixed top-0 w-full z-50 h-20 px-6 md:px-12 flex items-center justify-between">
        <button onClick={() => onNavigate(AppScreen.MARKETING)} className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary transition-all">
             <ChevronLeft size={20} />
          </div>
          <span className="text-xl font-black tracking-tighter text-primary">OBEY</span>
        </button>
        
        {currentScreen === AppScreen.LOGIN && (
          <div className="flex items-center gap-4">
             <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest hidden sm:inline">New to the network?</span>
             <button onClick={() => onNavigate(AppScreen.REGISTER)} className="text-sm font-black text-primary hover:underline underline-offset-4">Create Account</button>
          </div>
        )}
        {currentScreen === AppScreen.REGISTER && (
          <div className="flex items-center gap-4">
             <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest hidden sm:inline">Already a member?</span>
             <button onClick={() => onNavigate(AppScreen.LOGIN)} className="text-sm font-black text-primary hover:underline underline-offset-4">Sign In</button>
          </div>
        )}
      </header>

      <main className="flex-grow flex items-center justify-center p-6 pt-24 pb-12">
        <AnimatePresence mode="wait">
          {currentScreen === AppScreen.LOGIN && (
            <motion.div 
              key="login"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg"
            >
              <div className="bento-card p-10 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/40 rounded-full blur-[80px] -z-10 group-hover:scale-110 transition-transform duration-[2s]"></div>
                 
                 <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-4xl font-black tracking-tighter text-gray-900">Sign In.</h2>
                    <p className="text-gray-500 font-medium">Manage your digital treasury nodes.</p>
                 </div>

                 <div className="flex bg-gray-100 p-1.5 rounded-[22px] border border-gray-200/50">
                    <button onClick={() => setLoginType("email")} className={`flex-1 py-4 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${loginMethod === "email" ? "bg-white text-primary shadow-sm" : "text-gray-400"}`}>Email</button>
                    <button onClick={() => setLoginType("phone")} className={`flex-1 py-4 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${loginMethod === "phone" ? "bg-white text-primary shadow-sm" : "text-gray-400"}`}>Phone</button>
                 </div>

                 <form onSubmit={handleLoginSubmit} className="space-y-6">
                    {loginMethod === "email" ? (
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Account ID</label>
                        <div className="relative">
                           <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                           <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@obey.finance" className="w-full h-16 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Mobile Node</label>
                        <div className="flex group">
                           <div className="bg-gray-100 border border-gray-100 border-r-0 rounded-l-[22px] px-6 flex items-center text-xs font-black text-gray-400 transition-colors group-focus-within:bg-white group-focus-within:border-primary/10">+234</div>
                           <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="809 102 8824" className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-r-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-4">
                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Access Code</label>
                        <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</button>
                      </div>
                      <div className="relative">
                         <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                         <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-16 pl-14 pr-14 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                         </button>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press">
                       {loading ? <RefreshCw className="animate-spin" size={20} /> : (
                         <div className="flex items-center gap-3">Authorize Access <ArrowRight size={20} /></div>
                       )}
                    </button>
                 </form>

                 <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="mx-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Institutional Single Sign-On</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <button className="flex items-center justify-center gap-3 h-16 bg-white border border-gray-100 hover:bg-gray-50 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all active-press">
                       <Chrome size={18} className="text-red-500" /> Google
                    </button>
                    <button onClick={() => { onSuccess({ name: "Felix Anderson", email: "felix@apple.com" }); onNavigate(AppScreen.DASHBOARD); }} className="flex items-center justify-center gap-3 h-16 bg-white border border-gray-100 hover:bg-gray-50 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all active-press">
                       <Smartphone size={18} /> Apple CLI
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {currentScreen === AppScreen.REGISTER && (
            <motion.div 
              key="register"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-lg"
            >
              <div className="bento-card p-10 md:p-12 shadow-2xl space-y-10 relative overflow-hidden">
                 <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-4xl font-black tracking-tighter text-gray-900">Onboard.</h2>
                    <p className="text-gray-500 font-medium">Join the institutional liquidity network.</p>
                 </div>

                 <form onSubmit={handleRegisterSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Legal Name</label>
                      <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Felix Anderson" className="w-full h-16 px-8 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-3">
                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Account ID (Email)</label>
                         <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="name@company.com" className="w-full h-16 px-8 bg-gray-50 border border-gray-100 rounded-[22px] text-base font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Mobile Node</label>
                         <input type="tel" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="+234 809 102 8824" className="w-full h-16 px-8 bg-gray-50 border border-gray-100 rounded-[22px] text-base font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                       </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Access Code</label>
                      <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="••••••••" className="w-full h-16 px-8 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press">
                       {loading ? <RefreshCw className="animate-spin" size={20} /> : "Initiate Verification"}
                    </button>
                 </form>

                 <div className="p-6 bg-accent-blue/30 rounded-[32px] border border-blue-100 flex items-center gap-5">
                    <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shrink-0">
                       <ShieldCheck size={24} />
                    </div>
                    <p className="text-[11px] text-blue-800 font-bold leading-relaxed uppercase tracking-widest">
                       All accounts are protected by multi-signature cold storage and bank-grade encryption protocols.
                    </p>
                 </div>
              </div>
            </motion.div>
          )}

          {currentScreen === AppScreen.OTP && (
            <motion.div 
              key="otp"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="bento-card p-10 md:p-12 shadow-2xl text-center space-y-10 relative overflow-hidden">
                 <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(otpTimer/119)*100}%` }} transition={{ duration: 1, ease: "linear" }} className="h-full bg-primary"></motion.div>
                 </div>
                 
                 <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tighter text-gray-900">Verification.</h2>
                    <p className="text-gray-500 font-medium">Enter the 6-digit node authorization secret.</p>
                 </div>

                 <div className="flex gap-3 justify-center">
                    {otpValues.map((value, i) => (
                      <input
                        key={i}
                        ref={otpRefs[i]}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-12 h-16 sm:w-14 sm:h-20 text-center font-black text-2xl rounded-[18px] bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-inner"
                      />
                    ))}
                 </div>

                 <div className="space-y-6">
                    <button onClick={verifyOtpCode} disabled={!otpValues.every(v => v !== "") || verifying} className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press disabled:opacity-50">
                       {verifying ? <RefreshCw className="animate-spin" size={20} /> : "Authorize Settlement"}
                    </button>
                    
                    <div className="flex items-center justify-between px-2">
                       <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                          <Smartphone size={14} /> {otpTimer > 0 ? formattedTimer() : "Expired"}
                       </div>
                       <button className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4 disabled:opacity-20" disabled={otpTimer > 0}>Resend Code</button>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-gray-100 flex flex-col items-center gap-3 opacity-40">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
                       <Shield size={12} className="text-emerald-500" /> AES-256 Bit Encryption
                    </div>
                    <p className="text-[9px] text-gray-500 font-medium leading-relaxed max-w-xs mx-auto">
                       Node authorization secrets are dispatched via institutional grade cloud pipes and expire automatically.
                    </p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Verified Success Overlay */}
      <AnimatePresence>
        {verifiedOverlay && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-inner">
               <CheckCircle2 size={64} className="animate-fade-in" />
            </div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Identity Authorized.</h2>
            <p className="text-xl text-gray-500 font-medium max-w-md leading-relaxed">
               Secure protocol established. Redirecting to the institutional control console...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-10 text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
         SECURE CLOUD NODES • © 2026 OBEY FINANCIAL TECHNOLOGIES
      </footer>
    </div>
  );
}
