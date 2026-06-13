import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Check } from 'lucide-react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('obey-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('obey-cookie-consent', 'true');
    // Set a security cookie for backend recognition
    document.cookie = "obey_session_verified=true; max-age=31536000; path=/; SameSite=Strict; Secure";
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 right-8 z-[100] md:left-auto md:max-w-md"
        >
          <div className="bg-white border border-[#C7D2FE] rounded-[32px] p-8 shadow-[0_40px_80px_-20px_rgba(49,46,129,0.2)] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EEF2FF] rounded-full blur-3xl -z-10"></div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#6366F1] text-white rounded-2xl flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-black font-space text-[#1E1B4B]">Privacy Protocol</h4>
                <p className="text-sm text-[#312E81]/60 font-medium leading-relaxed">
                  We utilize institutional-grade cookies to optimize your node performance and secure your session data.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAccept}
                className="flex-1 bg-[#6366F1] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#4F46E5] transition-all active-press"
              >
                Accept Protocol
              </button>
              <button
                onClick={() => setShow(false)}
                className="px-6 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all active-press"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
