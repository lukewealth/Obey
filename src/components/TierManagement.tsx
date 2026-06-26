import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Crown, Star, ShieldCheck, Award, TrendingUp, 
  CheckCircle2, ArrowUpCircle, Users, Zap, 
  Loader2, ChevronRight
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "./NotificationSystem";

interface TierManagementProps {
  userId?: string;
  currentTier?: number;
  onUpdate?: () => void;
}

export default function TierManagement({ userId, currentTier = 1, onUpdate }: TierManagementProps) {
  const { notify } = useNotification();
  const [upgrading, setUpgrading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const tiers = [
    { 
      level: 1, 
      name: "Standard", 
      icon: Star, 
      color: "text-gray-500", 
      bg: "bg-gray-100",
      border: "border-gray-200",
      benefits: ["Basic transactions", "Standard limits", "Email support"]
    },
    { 
      level: 2, 
      name: "Verified", 
      icon: ShieldCheck, 
      color: "text-blue-500", 
      bg: "bg-blue-100",
      border: "border-blue-200",
      benefits: ["Higher limits", "Priority support", "Advanced analytics"]
    },
    { 
      level: 3, 
      name: "Premium", 
      icon: Crown, 
      color: "text-purple-500", 
      bg: "bg-purple-100",
      border: "border-purple-200",
      benefits: ["Premium limits", "Dedicated support", "Exclusive features"]
    },
    { 
      level: 4, 
      name: "Institutional", 
      icon: Award, 
      color: "text-amber-500", 
      bg: "bg-amber-100",
      border: "border-amber-200",
      benefits: ["Unlimited limits", "24/7 support", "API access", "Custom integrations"]
    }
  ];

  const handleUpgrade = async (tierLevel: number) => {
    if (!userId) {
      notify("error", "Error", "User ID required");
      return;
    }

    setUpgrading(true);
    try {
      await api.post('/admin/upgrade-tier', { userId, tierLevel });
      notify("success", "Tier Upgraded", `User upgraded to ${tiers[tierLevel - 1].name}`);
      setSelectedTier(null);
      onUpdate?.();
    } catch (error: any) {
      notify("error", "Upgrade Failed", error.response?.data?.error || "Failed to upgrade tier");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Tier Management</h3>
          <p className="text-sm text-gray-500">Manage user access levels and permissions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
          <Users size={16} className="text-primary" />
          <span className="text-xs font-black text-primary uppercase tracking-widest">Admin Control</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tiers.map((tier, index) => {
          const isCurrentTier = tier.level === currentTier;
          const isLocked = tier.level > currentTier + 1;
          const TierIcon = tier.icon;

          return (
            <motion.div
              key={tier.level}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-6 rounded-2xl border-2 transition-all ${
                isCurrentTier 
                  ? `${tier.border} ${tier.bg} shadow-lg` 
                  : isLocked
                  ? "border-gray-100 bg-gray-50 opacity-60"
                  : "border-gray-200 bg-white hover:border-primary/30 hover:shadow-md"
              }`}
            >
              {isCurrentTier && (
                <div className="absolute -top-3 -right-3 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                  Current
                </div>
              )}

              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${tier.bg} rounded-xl flex items-center justify-center`}>
                  <TierIcon className={tier.color} size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Level</p>
                  <p className={`text-2xl font-black ${tier.color}`}>{tier.level}</p>
                </div>
              </div>

              <h4 className="text-lg font-black text-gray-900 mb-3">{tier.name}</h4>

              <ul className="space-y-2 mb-6">
                {tier.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 size={14} className={tier.color} />
                    {benefit}
                  </li>
                ))}
              </ul>

              {!isCurrentTier && !isLocked && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTier(tier.level)}
                  disabled={upgrading}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    tier.level < currentTier
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                  }`}
                >
                  {tier.level < currentTier ? (
                    <>Downgrade <ArrowUpCircle size={14} className="rotate-180" /></>
                  ) : (
                    <>Upgrade <ArrowUpCircle size={14} /></>
                  )}
                </motion.button>
              )}

              {isLocked && (
                <div className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-black text-xs uppercase tracking-widest text-center flex items-center justify-center gap-2">
                  <Zap size={14} /> Locked
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xl"
            onClick={() => !upgrading && setSelectedTier(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="text-center space-y-6">
                <div className={`w-16 h-16 ${tiers[selectedTier - 1].bg} rounded-2xl flex items-center justify-center mx-auto`}>
                  {React.createElement(tiers[selectedTier - 1].icon, { 
                    className: tiers[selectedTier - 1].color, 
                    size: 32 
                  })}
                </div>

                <div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">
                    {selectedTier > currentTier ? "Upgrade" : "Downgrade"} to {tiers[selectedTier - 1].name}?
                  </h3>
                  <p className="text-gray-500 text-sm">
                    This will {selectedTier > currentTier ? "unlock" : "restrict"} additional features and adjust transaction limits.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-left">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Changes</p>
                  {selectedTier > currentTier ? (
                    tiers[selectedTier - 1].benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>{benefit}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">User will lose access to higher tier features.</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTier(null)}
                    disabled={upgrading}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUpgrade(selectedTier)}
                    disabled={upgrading}
                    className="flex-1 py-4 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Processing
                      </>
                    ) : (
                      <>
                        Confirm
                        <ChevronRight size={14} />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
