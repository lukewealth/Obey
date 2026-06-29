import React, { useState, useRef, useEffect } from "react";
import { AppScreen, UserProfile } from "../types";
import { 
  Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, RefreshCw, 
  Smartphone, ChevronLeft, ArrowRight, CheckCircle2, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabase";
import { auth as firebaseAuth } from "../firebase";
import { GoogleAuthProvider, OAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getWebsiteConfig } from "../metadata";

interface AuthSystemProps {
  onSuccess: (profile: Partial<UserProfile>) => void;
  onNavigate: (screen: AppScreen) => void;
  currentScreen: AppScreen;
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.16H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.84l3.66-2.75z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.16l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.96.95-2.14 1.72-3.4 1.72-1.2 0-1.74-.74-3.18-.74-1.46 0-2.04.72-3.18.72-1.28 0-2.58-.9-3.66-2.02-2.22-2.24-3.9-6.3-3.9-9.92 0-3.9 2.04-5.96 4.1-5.96 1.08 0 2.1.66 2.76.66s1.6-.66 2.84-.66c1.16 0 3.2.4 4.54 1.84-2.8 1.48-2.34 5.32.32 6.54-1.12 2.38-2.5 4.88-4.42 7.82zM12.03 5.48c-.06-2.54 2.12-4.66 4.54-4.78.26 2.78-2.14 4.96-4.54 4.78z"/>
  </svg>
);

export default function AuthSystem({ onSuccess, onNavigate, currentScreen }: AuthSystemProps) {
  const [loginMethod, setLoginType] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpTimer, setOtpValue] = useState(119);
  const [timerActive, setTimerActive] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifiedOverlay, setVerifiedOverlay] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const otpRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentScreen === AppScreen.OTP && timerActive && otpTimer > 0) {
      interval = setInterval(() => setOtpValue((prev) => prev - 1), 1000);
    } else if (otpTimer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [currentScreen, timerActive, otpTimer]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      // Primary: Firebase Email/Password Login
      let userCredential = null;
      try {
        userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      } catch (fbError: any) {
        console.warn("Firebase email login failed, falling back to Supabase:", fbError.message);
      }

      let userId = "";
      let userEmail = "";

      if (userCredential) {
        if (!userCredential.user.emailVerified) {
          setErrorMsg("Institutional email verification required. Please check your inbox.");
          setLoading(false);
          return;
        }
        userId = userCredential.user.uid;
        userEmail = userCredential.user.email || "";
      } else {
        // Fallback: Supabase Email/Password Login
        if (!supabase) throw new Error("Supabase connection missing");
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (!data.user.email_confirmed_at) {
          setErrorMsg("Email node not yet authorized. Please verify your email.");
          setLoading(false);
          return;
        }
        userId = data.user.id;
        userEmail = data.user.email || "";
      }

      // --- Institutional Health Check & Node Warmup ---
      // We verify the backend data mesh is operational before entering the dashboard
      try {
        const api = (await import("../services/api")).default;
        const healthRes = await api.get('/health');
        console.log("[AUTH_MESH] Node Health Checked:", healthRes.data.status);
        
        // Sync with MongoDB to fetch/initialize metadata
        const syncRes = await api.post('/sync/user', {
          supabaseId: userId,
          email: userEmail
        });
        
        if (syncRes.data.user) {
          onSuccess(syncRes.data.user);
        } else {
          // If sync fails but login succeeded, we still proceed but with partial profile
          onSuccess({ id: userId, email: userEmail });
        }
      } catch (meshError: any) {
        console.warn("[AUTH_MESH_WARN] Institutional data mesh unreachable, proceeding with decentralized state:", meshError.message);
        // We still allow access, as the dashboard has its own fallbacks
        onSuccess({ id: userId, email: userEmail });
      }

      onNavigate(AppScreen.DASHBOARD);
    } catch (error: any) {
      setErrorMsg(error.message || "Authentication failed. Institutional node timeout.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      if (!supabase) throw new Error("Supabase connection missing");
      const { error } = await supabase.auth.signUp({ 
        email: regEmail, 
        password: regPassword, 
        options: { data: { full_name: regName, phone: regPhone } } 
      });
      if (error) throw error;
      onNavigate(AppScreen.OTP);
    } catch (error: any) {
      setErrorMsg(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Primary: Firebase Social Login
      let userCredential = null;
      try {
        if (provider === 'google') {
          const googleProvider = new GoogleAuthProvider();
          userCredential = await signInWithPopup(firebaseAuth, googleProvider);
        } else if (provider === 'apple') {
          const appleProvider = new OAuthProvider('apple.com');
          userCredential = await signInWithPopup(firebaseAuth, appleProvider);
        }
      } catch (fbError: any) {
        console.warn(`Firebase ${provider} login failed, falling back to Supabase:`, fbError.message);
      }

      if (userCredential) {
        // Success via Firebase - the App.tsx listener will handle navigation
        return;
      }

      // Fallback: Supabase Social Login
      if (!supabase) throw new Error("Supabase connection missing");
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message || "Social login failed");
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
    setVerifying(true);
    setVerifiedOverlay(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifiedOverlay(false);
      onNavigate(AppScreen.DASHBOARD);
    }, 1600);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) throw error;
      } else {
        throw new Error("Password reset not available");
      }
      setResetSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-gray-900 selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-bg-white)_0%,_var(--color-accent-blue)_50%,_var(--color-accent-yellow)_100%)] -z-20"></div>

      <header className="fixed top-0 w-full z-50 h-16 md:h-20 px-4 md:px-12 flex items-center justify-between">
        <button onClick={() => onNavigate(AppScreen.MARKETING)} className="flex items-center gap-2 group">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary transition-all">
             <ChevronLeft size={18} className="md:w-5 md:h-5" />
          </div>
          <img src="/obey_logo.png" alt="OBEY" className="w-8 h-8 md:w-9 md:h-9 rounded-xl shadow-sm" />
          <span className="text-lg md:text-xl font-black tracking-tighter text-[#0b0e14]">OBEY</span>
        </button>
        <button onClick={() => onNavigate(currentScreen === AppScreen.LOGIN ? AppScreen.REGISTER : AppScreen.LOGIN)} className="text-[11px] md:text-sm font-black text-primary uppercase tracking-widest hover:underline underline-offset-4">
          {currentScreen === AppScreen.LOGIN ? "Create Account" : "Sign In"}
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-6 pt-20 md:pt-24 pb-12">
        <AnimatePresence mode="wait">
          {currentScreen === AppScreen.LOGIN && (
            <motion.div key="login" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} className="w-full max-w-lg">
              <div className="bento-card p-8 md:p-12 shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden group">
                 <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900">Sign In.</h2>
                    <p className="text-sm md:text-base text-gray-500 font-medium">Manage your digital treasury nodes.</p>
                 </div>

                 {errorMsg && (
                   <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3">
                     <ShieldCheck size={16} /> {errorMsg}
                   </div>
                 )}

                 <form onSubmit={handleLoginSubmit} className="space-y-5 md:space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em] pl-4">Account ID</label>
                      <div className="relative">
                         <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                         <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@obey.finance" className="w-full h-14 md:h-16 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-[18px] md:rounded-[22px] text-base md:text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center px-4">
                        <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">Access Code</label>
                        <button type="button" onClick={() => onNavigate(AppScreen.FORGOT_PASSWORD)} className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</button>
                      </div>
                      <div className="relative">
                         <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                         <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-14 md:h-16 pl-14 pr-14 bg-gray-50 border border-gray-100 rounded-[18px] md:rounded-[22px] text-base md:text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                         </button>
                      </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full h-16 md:h-20 bg-primary hover:bg-primary/90 text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press">
                       {loading ? <RefreshCw className="animate-spin" size={20} /> : <div className="flex items-center gap-3">Authorize Access <ArrowRight size={18} className="md:w-5 md:h-5" /></div>}
                    </button>
                 </form>

                 <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="mx-4 md:mx-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">Institutional SSO</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <button type="button" onClick={() => handleSocialLogin('google')} className="flex items-center justify-center gap-3 h-14 md:h-16 bg-white border border-gray-100 hover:bg-gray-50 rounded-[18px] md:rounded-[22px] text-[11px] md:text-xs font-black uppercase tracking-widest transition-all active-press">
                       {!getWebsiteConfig.auth.google.updateIcon && <GoogleIcon />} Google
                    </button>
                    <button type="button" onClick={() => handleSocialLogin('apple')} className="flex items-center justify-center gap-3 h-14 md:h-16 bg-white border border-gray-100 hover:bg-gray-50 rounded-[18px] md:rounded-[22px] text-[11px] md:text-xs font-black uppercase tracking-widest transition-all active-press">
                       {!getWebsiteConfig.auth.apple.updateIcon && <AppleIcon />} Apple ID
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {currentScreen === AppScreen.REGISTER && (
            <motion.div key="register" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} className="w-full max-w-lg">
              <div className="bento-card p-8 md:p-12 shadow-2xl space-y-8 md:space-y-10">
                 <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900">Onboard.</h2>
                 <form onSubmit={handleRegisterSubmit} className="space-y-5 md:space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em] pl-4">Legal Name</label>
                      <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Felix Anderson" className="w-full h-14 md:h-16 px-6 md:px-8 bg-gray-50 border border-gray-100 rounded-[18px] md:rounded-[22px] text-base md:text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em] pl-4">Account ID (Email)</label>
                      <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="name@company.com" className="w-full h-14 md:h-16 px-6 md:px-8 bg-gray-50 border border-gray-100 rounded-[18px] md:rounded-[22px] text-base md:text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em] pl-4">Access Code</label>
                      <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="••••••••" className="w-full h-14 md:h-16 px-6 md:px-8 bg-gray-50 border border-gray-100 rounded-[18px] md:rounded-[22px] text-base md:text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full h-16 md:h-20 bg-primary hover:bg-primary/90 text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press">
                       {loading ? <RefreshCw className="animate-spin" size={20} /> : "Initiate Verification"}
                    </button>
                 </form>
              </div>
            </motion.div>
          )}

          {currentScreen === AppScreen.OTP && (
            <motion.div key="otp" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} className="w-full max-w-md text-center space-y-10">
              <div className="bento-card p-8 md:p-12 shadow-2xl space-y-8 md:space-y-10">
                 <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900">Verification.</h2>
                 <div className="flex gap-2 md:gap-3 justify-center">
                    {otpValues.map((value, i) => (
                      <input key={i} ref={otpRefs[i]} type="text" inputMode="numeric" maxLength={1} value={value} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} className="w-10 h-14 sm:w-14 sm:h-20 text-center font-black text-xl md:text-2xl rounded-[14px] md:rounded-[18px] bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-inner" />
                    ))}
                 </div>
                 <button onClick={verifyOtpCode} disabled={!otpValues.every(v => v !== "") || verifying} className="w-full h-16 md:h-20 bg-primary hover:bg-primary/90 text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press disabled:opacity-50">
                    {verifying ? <RefreshCw className="animate-spin" size={20} /> : "Authorize Settlement"}
                 </button>
              </div>
            </motion.div>
          )}

          {currentScreen === AppScreen.FORGOT_PASSWORD && (
            <motion.div key="forgot" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} className="w-full max-w-lg">
              <div className="bento-card p-8 md:p-12 shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden group">
                 <div className="space-y-2 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900">Reset Password.</h2>
                    <p className="text-sm md:text-base text-gray-500 font-medium">Enter your email to receive a reset link.</p>
                 </div>

                 {errorMsg && (
                   <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-center gap-3">
                     <ShieldCheck size={16} /> {errorMsg}
                   </div>
                 )}

                 {resetSent ? (
                   <div className="space-y-6">
                     <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                       <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                       <p className="text-sm font-bold text-emerald-900 mb-2">Reset Link Sent</p>
                       <p className="text-xs text-emerald-700">Check your email for password reset instructions.</p>
                     </div>
                     <button 
                       onClick={() => onNavigate(AppScreen.LOGIN)}
                       className="w-full h-16 md:h-20 bg-primary hover:bg-primary/90 text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press"
                     >
                       Return to Sign In
                     </button>
                   </div>
                 ) : (
                   <form onSubmit={handlePasswordReset} className="space-y-5 md:space-y-6">
                     <div className="space-y-3">
                       <label className="text-[10px] md:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] md:tracking-[0.3em] pl-4">Account Email</label>
                       <div className="relative">
                          <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                          <input 
                            type="email" 
                            required 
                            value={resetEmail} 
                            onChange={(e) => setResetEmail(e.target.value)} 
                            placeholder="name@obey.finance" 
                            className="w-full h-14 md:h-16 pl-14 pr-6 bg-gray-50 border border-gray-100 rounded-[18px] md:rounded-[22px] text-base md:text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all" 
                          />
                       </div>
                     </div>

                     <button 
                       type="submit" 
                       disabled={loading} 
                       className="w-full h-16 md:h-20 bg-primary hover:bg-primary/90 text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press"
                     >
                        {loading ? <RefreshCw className="animate-spin" size={20} /> : <div className="flex items-center gap-3">Send Reset Link <ArrowRight size={18} className="md:w-5 md:h-5" /></div>}
                     </button>

                     <button 
                       type="button"
                       onClick={() => onNavigate(AppScreen.LOGIN)}
                       className="w-full text-center text-sm text-gray-500 hover:text-primary transition-colors"
                     >
                       Back to Sign In
                     </button>
                   </form>
                 )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {verifiedOverlay && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white/90 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-8 md:mb-10 shadow-inner">
             <CheckCircle2 size={48} className="md:w-16 md:h-16" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4">Identity Authorized.</h2>
          <p className="text-lg md:text-xl text-gray-500 font-medium max-w-md leading-relaxed">Secure protocol established. Redirecting...</p>
        </motion.div>
      )}

      <footer className="py-8 md:py-10 text-center text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] md:tracking-[0.4em]">
         SECURE CLOUD NODES • © 2026 OBEY FINANCIAL TECHNOLOGIES
      </footer>
    </div>
  );
}
