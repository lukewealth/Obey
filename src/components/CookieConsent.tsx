import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Check, ChevronDown, ChevronUp, Cookie } from 'lucide-react';
import { AppScreen } from '../types';

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [categories, setCategories] = useState<CookieCategory[]>([
    {
      id: 'essential',
      name: 'Essential',
      description: 'Required for core functionality like authentication, security, and session management. Cannot be disabled.',
      required: true,
      enabled: true,
    },
    {
      id: 'performance',
      name: 'Performance & Analytics',
      description: 'Help us understand how you use our Services by collecting anonymous usage data. Improves speed and reliability.',
      required: false,
      enabled: false,
    },
    {
      id: 'functional',
      name: 'Functional',
      description: 'Remember your preferences like language, region, and display settings for a personalized experience.',
      required: false,
      enabled: false,
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'Used to deliver relevant advertisements and measure campaign effectiveness. May track your activity across services.',
      required: false,
      enabled: false,
    },
  ]);

  useEffect(() => {
    const consent = localStorage.getItem('obey-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (accepted: boolean, prefs?: CookieCategory[]) => {
    const consentData = {
      timestamp: new Date().toISOString(),
      accepted,
      categories: prefs || categories,
    };
    localStorage.setItem('obey-cookie-consent', JSON.stringify(consentData));
    localStorage.setItem('obey-cookie-preferences', JSON.stringify(prefs || categories));

    if (accepted) {
      document.cookie = "obey_session_verified=true; max-age=31536000; path=/; SameSite=Strict; Secure";
    }

    setShow(false);
  };

  const handleAcceptAll = () => {
    const allEnabled = categories.map(c => ({ ...c, enabled: true }));
    setCategories(allEnabled);
    savePreferences(true, allEnabled);
  };

  const handleRejectAll = () => {
    const onlyEssential = categories.map(c => ({ ...c, enabled: c.required }));
    setCategories(onlyEssential);
    savePreferences(false, onlyEssential);
  };

  const handleSavePreferences = () => {
    savePreferences(true, categories);
  };

  const toggleCategory = (id: string) => {
    setCategories(prev =>
      prev.map(c => c.id === id ? { ...c, enabled: c.required ? true : !c.enabled } : c)
    );
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:max-w-lg"
        >
          <div className="bg-white border border-gray-200 rounded-[28px] p-6 md:p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>

            <div className="flex items-start gap-4">
              <div className="w-11 h-11 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                <Cookie size={22} />
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-base font-bold text-[#0b0e14]">Cookie Preferences</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  We use cookies to enhance your experience, analyze traffic, and personalize content. You can accept all, reject non-essential, or customize your preferences.{' '}
                  <span className="text-primary underline cursor-pointer">Learn more</span>
                </p>
              </div>
              <button
                onClick={() => setShow(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <button
                          onClick={() => toggleCategory(cat.id)}
                          disabled={cat.required}
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            cat.enabled
                              ? 'bg-primary border-primary'
                              : 'bg-white border-gray-300'
                          } ${cat.required ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-primary'}`}
                          aria-label={`Toggle ${cat.name} cookies`}
                        >
                          {cat.enabled && <Check size={12} className="text-white" />}
                        </button>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-[#0b0e14]">{cat.name}</p>
                            {cat.required && (
                              <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">Required</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{cat.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#0b0e14] transition-colors uppercase tracking-widest"
              >
                {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showDetails ? 'Hide Details' : 'Customize Preferences'}
              </button>

              <div className="flex gap-3">
                {showDetails && (
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 bg-gray-900 text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
                  >
                    Save Preferences
                  </button>
                )}
                <button
                  onClick={handleRejectAll}
                  className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
