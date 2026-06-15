import React, { useState, useEffect } from "react";
import { UserProfile } from "../types";
import { useNotification } from "./NotificationSystem";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCardIcon, 
  PlusIcon, 
  LockClosedIcon, 
  LockOpenIcon, 
  ArrowPathIcon, 
  ShieldCheckIcon,
  EyeIcon, 
  EyeSlashIcon,
  InformationCircleIcon,
  BoltIcon as ZapIcon
} from "@heroicons/react/24/outline";

interface VirtualCard {
  _id: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
  balance: number;
  status: 'Active' | 'Locked' | 'Terminated';
  cardType: 'Visa' | 'Mastercard';
  lastCVVRotation: string;
}

export default function VirtualCardSystem({ profile, onUpdateBalance }: { profile: UserProfile, onUpdateBalance: (amt: number) => void }) {
  const { notify } = useNotification();
  const [cards, setCards] = useState<VirtualCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [showSensitive, setShowSensitive] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchCards();
  }, [profile.id]);

  const fetchCards = async () => {
    if (!profile.id) return;
    try {
      const res = await api.get(`/cards/user/${profile.id}`);
      setCards(res.data);
    } catch (err) {
      console.error("Failed to fetch cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async () => {
    if (profile.balance < 5000) {
      notify("error", "Insufficient Liquidity", "A minimum of ₦5,000 is required for institutional provisioning.");
      return;
    }

    setIsProvisioning(true);
    try {
      const res = await api.post('/cards/create', {
        userId: profile.id,
        holderName: profile.name,
        initialLiquidity: 5000,
        kycNodeId: `KYC-${profile.id?.slice(-6)}`
      });

      if (res.data.success) {
        setCards([...cards, res.data.card]);
        onUpdateBalance(-5000);
        notify("success", "Node Provisioned", "Institutional virtual card successfully generated.");
      }
    } catch (err) {
      notify("error", "Provisioning Failed", "Institutional gateway rejected the request.");
    } finally {
      setIsProvisioning(false);
    }
  };

  const toggleLock = async (cardId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Locked' : 'Active';
    try {
      await api.patch(`/cards/${cardId}/status`, { status: newStatus });
      setCards(cards.map(c => c._id === cardId ? { ...c, status: newStatus as any } : c));
      notify("info", `Card ${newStatus}`, `Card node ${newStatus.toLowerCase()} successfully.`);
    } catch (err) {
      notify("error", "Operation Failed", "Could not synchronize card status.");
    }
  };

  const handleRotateCVV = async (cardId: string) => {
    try {
      const res = await api.post('/cards/rotate-cvv', { cardId });
      if (res.data.success) {
        setCards(cards.map(c => c._id === cardId ? { ...c, cvv: res.data.newCVV } : c));
        notify("success", "CVV Rotated", "Sequential security node updated.");
      }
    } catch (err) {
      notify("error", "Rotation Failed", "Institutional security node unreachable.");
    }
  };

  const toggleSensitive = (cardId: string) => {
    setShowSensitive(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-[#0b0e14] flex items-center gap-3">
            Institutional Cards
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full border border-primary/20">Elite Node</span>
          </h2>
          <p className="text-gray-400 font-bold text-sm mt-1 uppercase tracking-widest">Multi-Asset Virtual Proxies</p>
        </div>
        <button 
          onClick={handleCreateCard}
          disabled={isProvisioning}
          className="bg-[#0b0e14] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
        >
          {isProvisioning ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <PlusIcon className="w-5 h-5" />
          )}
          Provision New Card
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-gray-50 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[32px] p-20 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
            <CreditCardIcon className="w-10 h-10 text-gray-300" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#0b0e14]">No Active Card Nodes</h3>
            <p className="text-gray-400 font-bold max-w-xs mx-auto mt-2">Provision your first institutional card to access instant global liquidity.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map(card => (
            <motion.div 
              key={card._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group"
            >
              {/* Card UI */}
              <div className={`relative h-64 rounded-[32px] p-8 overflow-hidden shadow-2xl transition-all duration-500 ${card.status === 'Locked' ? 'grayscale opacity-80' : 'group-hover:scale-[1.02]'}`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-500 ${card.cardType === 'Visa' ? 'from-[#1a1a1a] via-[#333333] to-[#000000]' : 'from-[#1e3a8a] via-[#1e40af] to-[#1e1b4b]'}`} />
                
                {/* Abstract Pattern Overlay */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 0 L100 100 M0 100 L100 0" stroke="white" strokeWidth="0.1" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.05" />
                  </svg>
                </div>

                <div className="relative h-full flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Institutional Card</p>
                      <h4 className="text-lg font-black tracking-tight">{card.cardType} Platinum</h4>
                    </div>
                    <div className="w-12 h-12 flex items-center justify-center">
                       <ZapIcon className="w-8 h-8 text-primary fill-primary" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <p className="text-2xl font-mono tracking-[0.2em] font-black">
                        {showSensitive[card._id] ? card.cardNumber.replace(/(.{4})/g, '$1 ') : `**** **** **** ${card.cardNumber.slice(-4)}`}
                      </p>
                      <button onClick={() => toggleSensitive(card._id)} className="opacity-60 hover:opacity-100 transition-opacity">
                        {showSensitive[card._id] ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    <div className="flex gap-12">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Expiry</p>
                        <p className="text-sm font-black tracking-widest">{card.expiryDate}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">CVV</p>
                        <p className="text-sm font-black tracking-widest">
                          {showSensitive[card._id] ? card.cvv : '***'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <p className="text-sm font-black uppercase tracking-widest">{card.holderName}</p>
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                      <p className="text-[10px] font-black uppercase tracking-widest">Balance</p>
                      <p className="text-sm font-black tracking-tight">₦{card.balance.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Locked Overlay */}
                {card.status === 'Locked' && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-white/10 border border-white/20 backdrop-blur-xl px-4 py-2 rounded-full flex items-center gap-2">
                       <LockClosedIcon className="w-4 h-4 text-white" />
                       <span className="text-white text-[10px] font-black uppercase tracking-widest">Node Locked</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Card Controls */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button 
                  onClick={() => toggleLock(card._id, card.status)}
                  className={`flex-grow h-14 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all ${card.status === 'Locked' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-600 border border-orange-500/20'}`}
                >
                  {card.status === 'Locked' ? (
                    <><LockOpenIcon className="w-4 h-4" /> Unlock Node</>
                  ) : (
                    <><LockClosedIcon className="w-4 h-4" /> Lock Node</>
                  )}
                </button>
                <button 
                  onClick={() => handleRotateCVV(card._id)}
                  className="px-6 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all"
                  title="Rotate CVV"
                >
                  <ArrowPathIcon className="w-4 h-4" />
                  Rotate
                </button>
                <button className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#0b0e14] transition-all">
                  <InformationCircleIcon className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-[#0b0e14] rounded-[32px] p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
             <ShieldCheckIcon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-white text-xl font-black">24-Hour Security Protocol</h3>
            <p className="text-gray-400 font-bold mt-2 leading-relaxed">Cards enforce an institutional dynamic CVV protocol. For maximum security, security nodes are rotated every 24 hours. Locked cards cannot be used for conversion or external node processing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
