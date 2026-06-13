import React, { useState, useRef, useEffect } from "react";
import { ShieldAlert, RefreshCw, CheckCircle2, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OtpVerificationProps {
  onSuccess: () => void;
  onResend: () => void;
  emailOrPhone: string;
}

export default function OtpVerification({ onSuccess, onResend, emailOrPhone }: OtpVerificationProps) {
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(119);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setSuccess(true);
      setTimeout(onSuccess, 1500);
    }, 1500);
  };

  const formattedTimer = () => {
    const min = Math.floor(timer / 60);
    const sec = timer % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-10 md:p-12 rounded-[40px] border border-gray-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-50">
           <motion.div 
             initial={{ width: "100%" }}
             animate={{ width: `${(timer / 119) * 100}%` }}
             className="h-full bg-primary"
           />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tighter text-gray-900">Secure Verification.</h2>
          <p className="text-gray-500 font-medium">Enter the 6-digit code sent to {emailOrPhone}</p>
        </div>

        <div className="flex gap-3 justify-center">
          {otpValues.map((val, i) => (
            <input
              key={i}
              ref={otpRefs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className="w-12 h-16 sm:w-14 sm:h-20 text-center font-black text-2xl rounded-[18px] bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/10 outline-none transition-all shadow-inner"
            />
          ))}
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleVerify}
            disabled={!otpValues.every(v => v !== "") || verifying}
            className="w-full h-20 bg-primary text-white rounded-[28px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press disabled:opacity-50"
          >
            {verifying ? <RefreshCw className="animate-spin" size={20} /> : "Authorize Settlement"}
          </button>
          
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2 text-xs font-black text-gray-400">
                <ShieldAlert size={14} /> {timer > 0 ? `Expiring in ${formattedTimer()}` : "Expired"}
             </div>
             <button 
               onClick={onResend}
               disabled={timer > 0}
               className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline disabled:opacity-20"
             >
               Resend Code
             </button>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col items-center gap-3 opacity-40">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em]">
              <Shield size={12} className="text-emerald-500" /> AES-256 Bit Encryption
           </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-32 h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-inner">
               <CheckCircle2 size={64} />
            </div>
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Authorized.</h2>
            <p className="text-xl text-gray-500 font-medium max-w-md leading-relaxed">
               Secure protocol established. Redirecting...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
