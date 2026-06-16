import React, { useState, useRef, useEffect } from "react";
import { ShieldCheck, RefreshCw, ChevronLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OtpVerificationProps {
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  phone?: string;
  email?: string;
}

export default function OtpVerification({ onVerify, onResend, onBack, phone, email }: OtpVerificationProps) {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(119);
  const [timerActive, setTimerActive] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const otpRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

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

  const handleVerify = async () => {
    const code = otpValues.join("");
    if (code.length !== 6) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setSuccess(true);
      setTimeout(() => onVerify(code), 1500);
    }, 1600);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-6">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 md:space-y-10"
          >
             <div className="w-24 h-24 md:w-32 md:h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={48} className="md:w-16 md:h-16" />
             </div>
             <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">Node Authorized.</h2>
                <p className="text-base md:text-xl text-gray-500 font-medium">Establishing secure protocol...</p>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="otp-form"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <div className="bento-card p-8 md:p-12 shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={24} className="md:w-8 md:h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Security Code</h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
                  Enter the 6-digit node authorization code sent to your registered device.
                </p>
              </div>

              <div className="flex gap-2 md:gap-3 justify-center">
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
                    className="w-10 h-14 sm:w-14 sm:h-20 text-center font-black text-xl md:text-2xl rounded-[14px] md:rounded-[18px] bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              <div className="space-y-6">
                <button
                  onClick={handleVerify}
                  disabled={!otpValues.every((v) => v !== "") || verifying}
                  className="w-full h-16 md:h-20 bg-primary hover:bg-primary/90 text-white rounded-[22px] md:rounded-[28px] font-black text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press disabled:opacity-50"
                >
                  {verifying ? <RefreshCw className="animate-spin" size={20} /> : (
                    <div className="flex items-center gap-3">
                      Verify Node <ArrowRight size={18} className="md:w-5 md:h-5" />
                    </div>
                  )}
                </button>

                <div className="text-center space-y-4">
                  {timerActive ? (
                    <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest">
                      Request new code in <span className="text-primary">{formatTimer(timer)}</span>
                    </p>
                  ) : (
                    <button
                      onClick={() => { setTimer(119); setTimerActive(true); onResend(); }}
                      className="text-[10px] md:text-xs font-black text-primary uppercase tracking-widest hover:underline underline-offset-4"
                    >
                      Resend Authorization Code
                    </button>
                  )}
                  
                  <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest mx-auto hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft size={14} /> Back to Sign In
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
