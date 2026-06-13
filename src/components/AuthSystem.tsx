import React, { useState, useRef, useEffect } from "react";
import { AppScreen, UserProfile } from "../types";
import { Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, RefreshCw, Smartphone, Chrome } from "lucide-react";
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
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") throw profileError;

        let profileData: any = profile;
        if (!profile) {
          profileData = {
            id: data.user.id,
            full_name: email.split("@")[0],
            email: email,
            phone: "",
            avatar_url: email[0].toUpperCase(),
            kyc_status: "Pending",
            balance: 142580.42,
          };
          await supabase.from("profiles").insert([profileData]);
        }
        
        onSuccess(profileData);
        onNavigate(AppScreen.DASHBOARD);
      } else {
        // Phone login - fallback to design sandbox mockup
        onSuccess({
          name: "Felix Anderson",
          email: "phone_user@obey.finance",
          phone: phone,
          kycStatus: "Verified",
          balance: 142580.42,
          twoFactorEnabled: false,
          promoCode: "",
          avatar: "FA"
        });
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
      const { data, error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: {
          data: {
            full_name: regName,
            phone: regPhone,
          }
        }
      });

      if (error) throw error;
      
      onNavigate(AppScreen.OTP);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Google Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const cleaned = value.replace(/[^0-9]/g, "");
    if (!cleaned) return;

    const newOtp = [...otpValues];
    newOtp[index] = cleaned[0];
    setOtpValues(newOtp);

    // Shift focus forward
    if (index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const newOtp = [...otpValues];
      newOtp[index] = "";
      setOtpValues(newOtp);

      // Shift focus backward
      if (index > 0) {
        otpRefs[index - 1].current?.focus();
      }
    }
  };

  const verifyOtpCode = async () => {
    const code = otpValues.join("");
    if (code.length === 6) {
      setVerifying(true);
      try {
        // In Supabase, OTP usually happens via email or phone confirmation.
        // For this prototype, we simulate a successful verification.
        setVerifiedOverlay(true);
        setTimeout(() => {
          setVerifying(false);
          setVerifiedOverlay(false);
          onNavigate(AppScreen.DASHBOARD);
        }, 1600);
      } catch (error) {
        setVerifying(false);
        console.error(error);
        alert(error instanceof Error ? error.message : "Verification failed");
      }
    }
  };

  const resendOtpCode = () => {
    setOtpValue(119);
    setTimerActive(true);
    setOtpValues(["", "", "", "", "", ""]);
    otpRefs[0].current?.focus();
  };

  const formattedTimer = () => {
    const min = Math.floor(otpTimer / 60);
    const sec = otpTimer % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  if (currentScreen === AppScreen.LOGIN) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex flex-col justify-between text-[#f8faff] md:pt-16">
        {/* Navigation Header */}
        <header className="fixed top-0 w-full z-50 bg-[#0b1220]/80 backdrop-blur-md">
          <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto h-16">
            <button onClick={() => onNavigate(AppScreen.MARKETING)} className="text-xl font-bold tracking-widest text-[#0057FF]">OBEY</button>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 hidden sm:inline">New to OBEY?</span>
              <button
                onClick={() => onNavigate(AppScreen.REGISTER)}
                className="text-xs font-bold text-[#0057FF] hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        </header>

        {/* Auth grid */}
        <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Promo visuals */}
            <div className="hidden lg:flex flex-col space-y-8 pr-12">
              <div className="space-y-4">
                <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight">
                  One Unified Wallet. Unlimited Digital Liquidity.
                </h1>
                <p className="text-gray-400 font-light leading-relaxed">
                  Fast mobile utility coverage, global cryptocurrency trading desk, and premium marketplace operations in a high-fidelity system designed for professional stability.
                </p>
              </div>

              <div className="relative aspect-square max-w-md w-full bg-gradient-to-tr from-[#0057FF]/5 to-transparent rounded-3xl border border-white/5 p-8 flex flex-col justify-center gap-6 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00C6FF]/10 rounded-full blur-[80px] -z-10"></div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Compliance</p>
                    <p className="text-sm font-bold text-white">Institutional Grade Security</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl ml-8">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <RefreshCw size={24} className="animate-spin" style={{ animationDuration: "12s" }} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Processing</p>
                    <p className="text-sm font-bold text-white">Real-time Settlement Hub</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login form shell */}
            <div className="flex justify-center w-full">
              <div className="w-full max-w-md bg-[#111928]/90 border border-white/5 shadow-2xl rounded-3xl p-8 space-y-6 relative overflow-hidden backdrop-blur-md">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0057FF]/10 blur-3xl rounded-full"></div>
                <div className="space-y-2 relative z-10">
                  <h2 className="text-2xl font-black text-white">Welcome back</h2>
                  <p className="text-xs text-gray-400">Sign in to manage your digital treasury balances.</p>
                </div>

                {/* Account toggle tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 relative z-10">
                  <button
                    onClick={() => setLoginType("email")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      loginMethod === "email"
                        ? "bg-[#0057FF] text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Email address
                  </button>
                  <button
                    onClick={() => setLoginType("phone")}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                      loginMethod === "phone"
                        ? "bg-[#0057FF] text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Phone number
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
                  {loginMethod === "email" ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400" htmlFor="email">Email Address</label>
                      <div className="relative group">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                          <Mail size={16} />
                        </span>
                        <input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="block w-full h-12 pl-10 pr-4 bg-[#0a0f1d] border border-white/5 focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-medium outline-none transition-all placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-gray-400" htmlFor="phone">Phone Number</label>
                      <div className="relative group flex">
                        <div className="flex items-center px-3 bg-[#0a0f1d] border-r border-white/5 rounded-l-xl text-xs text-gray-400 font-bold">
                          +234
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="800 000 0000"
                          className="block w-full h-12 px-4 bg-[#0a0f1d] border border-white/5 focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-r-xl text-sm font-medium outline-none transition-all placeholder:text-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-gray-400" htmlFor="password">Password</label>
                      <a href="#" className="text-xs font-bold text-[#0057FF] hover:underline">Forgot?</a>
                    </div>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                        <Lock size={16} />
                      </span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full h-12 pl-10 pr-10 bg-[#0a0f1d] border border-white/5 focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-medium outline-none transition-all placeholder:text-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-[#0057FF] hover:bg-blue-600 active-press text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 flex items-center justify-center"
                  >
                    {loading ? (
                      <RefreshCw className="animate-spin mr-2" size={16} />
                    ) : "Sign In Securely"}
                  </button>
                </form>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-gray-500 uppercase tracking-widest font-black">or continue with</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                {/* Social Login elements */}
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center h-12 bg-white/5 border border-white/5 hover:bg-white/10 active-press rounded-xl text-xs font-semibold text-gray-300 transition-colors"
                  >
                    <Chrome className="w-4 h-4 mr-2 text-red-400" />
                    Google
                  </button>
                  <button
                    onClick={() => {
                      onSuccess({ name: "Felix Anderson", email: "felix@apple.com", kycStatus: "Verified" });
                      onNavigate(AppScreen.DASHBOARD);
                    }}
                    className="flex items-center justify-center h-12 bg-white/5 border border-white/5 hover:bg-white/10 active-press rounded-xl text-xs font-semibold text-gray-300 transition-colors"
                  >
                    <Smartphone className="w-4 h-4 mr-2 text-gray-400" />
                    Apple CLI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          SECURE CLOUD INFRASTRUCTURE • © 2026 OBEY FINTECH
        </footer>
      </div>
    );
  }

  // Registration Section
  if (currentScreen === AppScreen.REGISTER) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex flex-col justify-between text-[#f8faff] md:pt-16">
        <header className="fixed top-0 w-full z-50 bg-[#0b1220]/80 backdrop-blur-md">
          <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto h-16">
            <button onClick={() => onNavigate(AppScreen.MARKETING)} className="text-xl font-bold tracking-widest text-[#0057FF]">OBEY</button>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">Already registered?</span>
              <button
                onClick={() => onNavigate(AppScreen.LOGIN)}
                className="text-xs font-bold text-[#0057FF] hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
          <div className="w-full max-w-md bg-[#111928]/90 border border-white/5 shadow-2xl rounded-3xl p-8 space-y-6 relative overflow-hidden backdrop-blur-md">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0057FF]/10 blur-3xl rounded-full"></div>
            
            <div className="space-y-1.5 relative z-10">
              <h2 className="text-2xl font-black text-white">Create Account</h2>
              <p className="text-xs text-gray-400">Join OBEY digital assets and liquid wallet networks.</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 relative z-10">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Felix Anderson"
                  className="block w-full h-12 px-4 bg-[#0a0f1d] border border-white/5 focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="block w-full h-12 px-4 bg-[#0a0f1d] border border-white/5 focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="block w-full h-12 px-4 bg-[#0a0f1d] border border-white/5 focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Password</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full h-12 px-4 bg-[#0a0f1d] border border-white/5 focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Promo Code (Optional)</label>
                <input
                  type="text"
                  value={regPromo}
                  onChange={(e) => setRegPromo(e.target.value)}
                  placeholder="OBEY-PROMO"
                  className="block w-full h-12 px-4 bg-[#0a0f1d] border border-white/5 focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#0057FF] hover:bg-blue-600 active-press text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 flex items-center justify-center pt-1"
              >
                {loading ? <RefreshCw className="animate-spin mr-2" size={16} /> : "Send Verification Code"}
              </button>
            </form>
          </div>
        </main>

        <footer className="py-6 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          SECURE CLOUD INFRASTRUCTURE • © 2026 OBEY FINTECH
        </footer>
      </div>
    );
  }

  // OTP Code Screen
  if (currentScreen === AppScreen.OTP) {
    const isCompleted = otpValues.every((val) => val !== "");

    return (
      <div className="min-h-screen bg-[#0b1220] flex flex-col justify-between text-[#f8faff] md:pt-16 relative">
        <header className="fixed top-0 w-full z-50 bg-[#0b1220]/80 backdrop-blur-md">
          <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto h-16">
            <button onClick={() => onNavigate(AppScreen.MARKETING)} className="text-xl font-bold tracking-widest text-[#0057FF]">OBEY</button>
            <button onClick={() => onNavigate(AppScreen.REGISTER)} className="text-xs font-bold text-gray-400 hover:text-white">Cancel</button>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-6">
          <div className="w-full max-w-sm flex flex-col items-center">
            {/* Header info */}
            <div className="text-center space-y-3 mb-8">
              <h2 className="text-2xl font-black text-white">Security Verification</h2>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                Please enter the 6-digit security pin code dispatched to your registered phone or device profile.
              </p>
            </div>

            {/* Verification block */}
            <section className="bg-[#111928] border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden w-full">
              {/* Timer Progress Indicator */}
              <div
                className="absolute top-0 left-0 h-1 bg-[#0057FF] transition-all duration-1000 ease-linear"
                style={{ width: `${(otpTimer / 119) * 100}%` }}
              ></div>

              <div className="flex flex-col gap-6 items-center pt-4">
                {/* OTP Boxes */}
                <div className="flex gap-2 justify-center" id="otp-container">
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
                      className="w-11 h-14 sm:w-12 sm:h-16 text-center font-bold text-xl rounded-xl bg-[#0a0f1d] border border-white/5 focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="w-full space-y-4 pt-2">
                  <button
                    onClick={verifyOtpCode}
                    disabled={!isCompleted || verifying}
                    className={`w-full h-14 bg-[#0057FF] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 active-press transition-opacity ${
                      !isCompleted ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-600"
                    }`}
                  >
                    {verifying ? (
                      <RefreshCw className="animate-spin mr-2" size={16} />
                    ) : (
                      <>
                        Verify Securely
                        <ShieldCheck size={18} />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="inline-flex items-center gap-1.5 font-mono text-gray-500">
                      <Smartphone size={14} />
                      {otpTimer > 0 ? `Expiring in ${formattedTimer()}` : "Pin Code Expired"}
                    </span>
                    <button
                      onClick={resendOtpCode}
                      disabled={otpTimer > 0}
                      className="text-[#0057FF] hover:underline disabled:text-gray-700 disabled:no-underline font-bold"
                    >
                      Resend Secret Code
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Badge */}
            <div className="mt-8 flex flex-col items-center gap-2 opacity-50 px-4 text-center">
              <span className="text-[10px] uppercase tracking-widest font-black flex items-center gap-1">
                <Lock size={12} className="text-emerald-500" />
                256-Bit SSL AES Encryption
              </span>
              <p className="text-[10px] text-gray-500 font-light">
                OBEY financial protocol operates on multi-signature cloud infrastructure. No transactional secrets leave your offline secure sandbox.
              </p>
            </div>
          </div>
        </main>

        {/* Success Feedback Overlay */}
        {verifiedOverlay && (
          <div className="fixed inset-0 bg-[#0b1220]/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 bg-[#12B76A]/10 border border-[#12B76A]/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <ShieldCheck className="text-[#12B76A]" size={48} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Identity Verified</h2>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Your security protocol has been authorized. Re-directing safely to the liquid asset dashboard...
            </p>
          </div>
        )}

        <footer className="py-6 text-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          SECURE CLOUD INFRASTRUCTURE • © 2026 OBEY FINTECH
        </footer>
      </div>
    );
  }

  return null;
}
