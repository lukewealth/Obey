import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { useNotification } from "./NotificationSystem";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, ShieldCheck, ShieldAlert, Star, Award, Crown, Zap,
  CheckCircle2, Clock, XCircle, ArrowRight, Loader2, Lock,
  TrendingUp, DollarSign, CreditCard, Users, Sparkles
} from "lucide-react";

interface KYCTierSystemProps {
  profile: UserProfile;
  onTierUpgrade: (newTier: number) => void;
}

interface TierInfo {
  level: number;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  limits: {
    dailyTransfer: number;
    monthlyTransfer: number;
    maxCardBalance: number;
    features: string[];
  };
}

const TIERS: TierInfo[] = [
  {
    level: 1,
    name: "Standard",
    icon: Star,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
    limits: {
      dailyTransfer: 100000,
      monthlyTransfer: 1000000,
      maxCardBalance: 50000,
      features: ["Basic transfers", "Airtime/Data", "Virtual card"]
    }
  },
  {
    level: 2,
    name: "Verified",
    icon: ShieldCheck,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
    limits: {
      dailyTransfer: 500000,
      monthlyTransfer: 5000000,
      maxCardBalance: 200000,
      features: ["All Standard features", "P2P Trading", "Gift cards", "Higher limits"]
    }
  },
  {
    level: 3,
    name: "Premium",
    icon: Award,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
    limits: {
      dailyTransfer: 2000000,
      monthlyTransfer: 20000000,
      maxCardBalance: 500000,
      features: ["All Verified features", "Priority support", "Institutional cards", "API access"]
    }
  },
  {
    level: 4,
    name: "Institutional",
    icon: Crown,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    borderColor: "border-amber-200",
    limits: {
      dailyTransfer: 10000000,
      monthlyTransfer: 100000000,
      maxCardBalance: 2000000,
      features: ["All Premium features", "Dedicated account manager", "Custom limits", "White-glove service"]
    }
  }
];

export default function KYCTierSystem({ profile, onTierUpgrade }: KYCTierSystemProps) {
  const { notify } = useNotification();
  const [currentTier, setCurrentTier] = useState(profile.kycLevel || 1);
  const [kycStatus, setKycStatus] = useState(profile.kycStatus || "Unverified");
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  useEffect(() => {
    fetchTierInfo();
  }, [profile.id]);

  const fetchTierInfo = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/kyc/tier/${profile.id}`);
      if (response.data.success) {
        setCurrentTier(response.data.tier);
        setKycStatus(response.data.kycStatus);
      }
    } catch (error) {
      console.error("Failed to fetch tier info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestUpgrade = async (tier: number) => {
    setUpgrading(true);
    try {
      const response = await api.post('/kyc/request-upgrade', {
        userId: profile.id,
        requestedTier: tier,
        documents: []
      });

      if (response.data.success) {
        setKycStatus("Pending");
        notify("success", "Upgrade Requested", "Your KYC upgrade request has been submitted. Awaiting admin approval.");
      }
    } catch (error: any) {
      notify("error", "Request Failed", error.response?.data?.error || "Could not submit upgrade request.");
    } finally {
      setUpgrading(false);
      setSelectedTier(null);
    }
  };

  const currentTierInfo = TIERS.find(t => t.level === currentTier) || TIERS[0];
  const nextTier = TIERS.find(t => t.level === currentTier + 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className={`w-20 h-20 ${currentTierInfo.bgColor} rounded-3xl flex items-center justify-center mx-auto`}>
          <currentTierInfo.icon className={`w-10 h-10 ${currentTierInfo.color}`} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {currentTierInfo.name} Tier
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            {kycStatus === "Verified" ? "Account verified" : 
             kycStatus === "Pending" ? "Upgrade pending approval" :
             kycStatus === "Rejected" ? "Upgrade rejected" :
             "Complete verification to unlock features"}
          </p>
        </div>
      </div>

      {/* Current Limits */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Your Current Limits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daily Transfer</p>
            <p className="text-2xl font-black text-gray-900">
              ₦{currentTierInfo.limits.dailyTransfer.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Monthly Transfer</p>
            <p className="text-2xl font-black text-gray-900">
              ₦{currentTierInfo.limits.monthlyTransfer.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Card Balance</p>
            <p className="text-2xl font-black text-gray-900">
              ₦{currentTierInfo.limits.maxCardBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tier Progression */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Upgrade Your Tier
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map((tier) => {
            const isCurrentTier = tier.level === currentTier;
            const isLocked = tier.level > currentTier && kycStatus !== "Pending";
            const isPending = tier.level > currentTier && kycStatus === "Pending";

            return (
              <motion.div
                key={tier.level}
                whileHover={{ scale: isLocked ? 1 : 1.02 }}
                className={`relative bg-white rounded-3xl p-6 border-2 transition-all ${
                  isCurrentTier
                    ? `${tier.borderColor} shadow-lg`
                    : isLocked
                    ? "border-gray-100 opacity-60"
                    : "border-gray-100 hover:border-primary/30 cursor-pointer"
                }`}
                onClick={() => !isCurrentTier && !isLocked && setSelectedTier(tier.level)}
              >
                {isCurrentTier && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    Current
                  </div>
                )}
                {isPending && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                  </div>
                )}

                <div className="space-y-4">
                  <div className={`w-14 h-14 ${tier.bgColor} rounded-2xl flex items-center justify-center`}>
                    <tier.icon className={`w-7 h-7 ${tier.color}`} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900">{tier.name}</h4>
                    <p className="text-xs text-gray-400 font-medium mt-1">Tier {tier.level}</p>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400">Daily: ₦{tier.limits.dailyTransfer.toLocaleString()}</p>
                    <p className="text-xs font-bold text-gray-400">Monthly: ₦{(tier.limits.monthlyTransfer / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="space-y-2">
                    {tier.limits.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  {!isCurrentTier && (
                    <button
                      disabled={isLocked || isPending}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                        isLocked
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : isPending
                          ? "bg-amber-100 text-amber-600 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}
                    >
                      {isLocked ? (
                        <span className="flex items-center justify-center gap-2">
                          <Lock className="w-3 h-3" />
                          Locked
                        </span>
                      ) : isPending ? (
                        "Awaiting Approval"
                      ) : (
                        "Request Upgrade"
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {selectedTier && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTier(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className={`w-16 h-16 ${TIERS[selectedTier - 1].bgColor} rounded-2xl flex items-center justify-center mx-auto`}>
                    {React.createElement(TIERS[selectedTier - 1].icon, {
                      className: `w-8 h-8 ${TIERS[selectedTier - 1].color}`
                    })}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">
                    Upgrade to {TIERS[selectedTier - 1].name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Request KYC verification upgrade. Admin approval required.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                  <h4 className="text-sm font-bold text-gray-900">What you'll get:</h4>
                  {TIERS[selectedTier - 1].limits.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTier(null)}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRequestUpgrade(selectedTier)}
                    disabled={upgrading}
                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request Upgrade
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
