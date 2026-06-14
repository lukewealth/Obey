import React, { useState, useEffect } from "react";
import { UserProfile, AdminMetrics } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, Activity, AlertCircle, Check, X, 
  TrendingUp, RefreshCw, BarChart2, ShieldAlert, CheckCircle2, UserCheck, Settings,
  Zap, Shield, Server, ArrowUpRight, ShoppingCart, Lock, Trash2, Loader2,
  ChevronRight, ArrowRight
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "./NotificationSystem";

interface AdminSystemProps {
  metrics: AdminMetrics;
  profile: UserProfile;
  onApproveKyc: () => void;
  onUpdateSystemStatus: (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => void;
}

export default function AdminSystem({ metrics, profile, onApproveKyc, onUpdateSystemStatus }: AdminSystemProps) {
  const { notify } = useNotification();
  const [kycQueue, setKycQueue] = useState([
    { id: "usr_2", name: "David Alao", email: "david@co-tech.com", documentType: "Passport Card", fileAttached: "illustrations.jpg", phone: "+234 802 991 2024", date: "June 09, 2026", status: "Pending" },
    { id: "usr_3", name: "Sarah Williams", email: "sarah.will@fintech.io", documentType: "National ID", fileAttached: "illustrations.jpg", phone: "+234 811 445 1022", date: "June 08, 2026", status: "Pending" }
  ]);

  const [escrowTrades, setEscrowTrades] = useState<any[]>([]);
  const [loadingTrades, setLoadingTrades] = useState(false);
  const [activeStatus, setActiveStatus] = useState(metrics.systemStatus);
  const [settlingId, setSettlingId] = useState<string | null>(null);

  // Fetch Escrow Trades from MongoDB via fallback API
  const fetchEscrowTrades = async () => {
    setLoadingTrades(true);
    try {
      const response = await api.get('/sync/transactions/admin-all'); 
      const trades = response.data.filter((tx: any) => 
        (tx.category === 'GiftCard' || tx.category === 'Crypto') && 
        ['Awaiting Audit', 'Processing', 'Escrow', 'Disputed'].includes(tx.status)
      );
      setEscrowTrades(trades);
    } catch (error) {
      // Simulation for prototype
      setEscrowTrades([
        { id: "OBY-ESC-AF82D1X", assetName: "Amazon Card $500", userId: "buyer@obey.finance", amount: 725000, status: "Escrow", type: "Debit", date: "June 14, 2026" },
        { id: "OBY-GC-99E2A2Z", assetName: "Apple Card $200", userId: "user@obey.finance", amount: 170000, status: "Awaiting Audit", type: "Credit", date: "June 14, 2026" }
      ]);
    } finally {
      setLoadingTrades(false);
    }
  };

  useEffect(() => {
    fetchEscrowTrades();
  }, []);

  const handleApproveQueueItem = (id: string) => {
    setKycQueue(prev => prev.filter(item => item.id !== id));
    onApproveKyc();
    notify("success", "Profile Authorized", "Institutional KYC node settled.");
  };

  const handleRejectQueueItem = (id: string) => {
    setKycQueue(prev => prev.filter(item => item.id !== id));
    notify("warning", "Profile Rejected", "Identity node has been flagged and purged.");
  };

  const handleSettleEscrow = async (txId: string, action: 'RELEASE' | 'REJECT') => {
    setSettlingId(txId);
    try {
      const response = await api.post('/giftcards/admin/settle', { txId, action });
      if (response.data.success) {
        setEscrowTrades(prev => prev.filter(t => t.id !== txId));
        notify("success", `Asset ${action === 'RELEASE' ? 'Released' : 'Rejected'}`, `Node settlement complete. New status: ${response.data.status}`);
      }
    } catch (error) {
      console.error('Settlement Error:', error);
      notify("error", "Settlement Failed", "Escrow node synchronization error.");
    } finally {
      setSettlingId(null);
    }
  };

  const changeStatus = (status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE") => {
    setActiveStatus(status);
    onUpdateSystemStatus(status);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Ecosystem Monitoring</h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium">Supervise compliant statuses and platform health.</p>
        </div>
        <div className="flex items-center justify-center gap-3 px-4 py-2 bg-accent-blue rounded-full border border-blue-100 self-center md:self-auto shadow-sm">
          <Server size={16} className="text-primary" />
          <span className="text-[10px] md:text-[11px] text-primary font-black uppercase tracking-widest">Master Node: v4.0.0</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[
          { label: "Total Users", val: metrics.totalUsers.toLocaleString(), icon: Users, color: "text-primary", bg: "bg-accent-blue" },
          { label: "Trade Volume", val: `$${metrics.totalVolume.toLocaleString()}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Fees Collected", val: `$${metrics.monthlyRevenue.toLocaleString()}`, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Pending Audits", val: kycQueue.length + escrowTrades.length, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((m, i) => (
          <motion.div 
            key={m.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-100 p-5 md:p-8 rounded-[24px] md:rounded-[32px] shadow-xl shadow-gray-200/50 flex flex-col sm:flex-row items-center justify-between group transition-all text-center sm:text-left gap-4"
          >
            <div>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{m.label}</p>
              <p className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">{m.val}</p>
            </div>
            <div className={`w-10 h-10 md:w-14 md:h-14 ${m.bg} ${m.color} rounded-[16px] md:rounded-[22px] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm shrink-0`}>
              <m.icon size={22} className="md:w-7 md:h-7" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
        
        {/* Compliance Queue */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-6 md:p-10 space-y-8 md:space-y-12 shadow-xl shadow-gray-200/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent-blue/30 rounded-full blur-[60px] md:blur-[100px] -z-10 transition-transform duration-[3s]"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 md:gap-8 relative z-10 border-b border-gray-100 pb-8 md:pb-10 text-center sm:text-left">
            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Compliance Queue</h3>
              <p className="text-xs md:text-sm text-gray-500 font-medium">Audit identity records for Level 2 clearance.</p>
            </div>
            <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-[9px] md:text-[10px] font-black uppercase text-gray-400 self-center sm:self-auto shadow-sm">
              <UserCheck size={14} />
              Gatekeeper Node
            </div>
          </div>

          <div className="space-y-4 md:space-y-5 relative z-10">
            <AnimatePresence mode="popLayout">
              {profile.kycStatus === "Pending" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 md:p-8 bg-accent-yellow/30 border border-yellow-200 rounded-[24px] md:rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-lg shadow-yellow-500/5"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-[16px] md:rounded-[22px] bg-white flex items-center justify-center text-yellow-600 shadow-sm font-black text-xl shrink-0">
                      {profile.avatar}
                    </div>
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <p className="text-base md:text-lg font-black text-gray-900">{profile.name} (MASTER)</p>
                        <span className="bg-yellow-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest animate-pulse">ADMIN</span>
                      </div>
                      <p className="text-[10px] md:text-[11px] text-gray-500 font-medium mt-1">Passport Card • {profile.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={onApproveKyc}
                    className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] md:text-[11px] uppercase tracking-widest rounded-xl md:rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active-press transition-all shrink-0"
                  >
                    <Check size={18} /> Approve Master Node
                  </button>
                </motion.div>
              )}

              {kycQueue.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-6 md:p-8 bg-white border border-gray-100 rounded-[24px] md:rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-gray-50 transition-all group text-center sm:text-left shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 overflow-hidden">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-[16px] md:rounded-[22px] bg-gray-50 flex items-center justify-center text-gray-400 font-black text-xl group-hover:bg-white group-hover:text-primary transition-colors border border-gray-100 shrink-0">
                      {item.name[0]}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-base md:text-lg font-black text-gray-900 truncate">{item.name}</p>
                      <p className="text-[10px] md:text-[11px] text-gray-400 font-medium mt-1 uppercase tracking-widest truncate">{item.documentType} • {item.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => handleRejectQueueItem(item.id)}
                      className="flex-1 sm:flex-none p-3.5 md:p-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl md:rounded-2xl transition-all active-press flex items-center justify-center"
                    >
                      <X size={20} />
                    </button>
                    <button 
                      onClick={() => handleApproveQueueItem(item.id)}
                      className="flex-[2] sm:flex-none h-12 md:h-14 px-6 md:px-10 bg-primary hover:bg-black text-white font-black text-[10px] md:text-[11px] uppercase tracking-widest rounded-xl md:rounded-2xl shadow-lg shadow-primary/20 active-press transition-all flex items-center justify-center gap-2"
                    >
                      Approve Node
                    </button>
                  </div>
                </motion.div>
              ))}

              {kycQueue.length === 0 && profile.kycStatus !== "Pending" && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={40} className="animate-bounce" />
                  </div>
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Queue Fully Audited</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* System Controls */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-4 space-y-6 md:space-y-10"
        >
          <div className="bg-white border border-gray-100 rounded-[30px] md:rounded-[45px] p-8 md:p-10 shadow-xl shadow-gray-200/50 space-y-8 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent-blue/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-accent-blue rounded-[14px] md:rounded-2xl flex items-center justify-center text-primary">
                <Settings size={22} className="md:w-6 md:h-6" />
              </div>
              <h4 className="text-[10px] md:text-[11px] font-black uppercase text-gray-400 tracking-[0.2em]">Node State Master</h4>
            </div>

            <div className="space-y-3 relative z-10">
              {[
                { id: "OPERATIONAL", label: "OPERATIONAL ACTIVE", color: "emerald" },
                { id: "DEGRADED", label: "CHANNELS DEGRADED", color: "amber" },
                { id: "MAINTENANCE", label: "LEDGER MAINTENANCE", color: "red" }
              ].map((s) => (
                <button 
                  key={s.id}
                  onClick={() => changeStatus(s.id as any)}
                  className={`w-full py-4 md:py-5 px-6 rounded-2xl md:rounded-[22px] text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center justify-between transition-all border group/btn ${
                    activeStatus === s.id 
                      ? `bg-${s.color}-50 border-${s.color}-200 text-${s.color}-600 shadow-sm` 
                      : "bg-gray-50 border-gray-100 text-gray-400 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
                  }`}
                >
                  <span>{s.label}</span>
                  <div className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-${s.color}-500 ${activeStatus === s.id ? 'animate-pulse scale-125' : ''}`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-[30px] md:rounded-[45px] p-8 md:p-10 shadow-2xl flex flex-col justify-between text-white min-h-[260px] md:min-h-[300px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="space-y-4 md:space-y-6 relative z-10 text-center sm:text-left">
              <ShieldAlert size={36} className="text-primary mx-auto sm:mx-0 md:w-12 md:h-12 animate-pulse" />
              <h5 className="text-xl md:text-2xl font-black tracking-tight leading-tight uppercase">Security Protocol</h5>
              <p className="text-[11px] md:text-sm text-white/50 font-medium leading-relaxed">
                Administrative actions are signed sequentially on the private ledger. Multi-sig override is mandatory for state changes.
              </p>
            </div>
            <button className="w-full mt-8 py-4 md:py-5 bg-white/10 hover:bg-white/20 text-white rounded-[18px] md:rounded-[22px] font-black text-[10px] md:text-xs uppercase tracking-widest border border-white/10 backdrop-blur-md transition-all active-press">
              Fetch Ledger Logs
            </button>
          </div>
        </motion.div>
      </div>

      {/* Marketplace Escrow Admin Portal */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0b0e14] text-white rounded-[35px] md:rounded-[50px] p-6 md:p-12 space-y-10 md:space-y-16 shadow-2xl relative overflow-hidden group/market"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary/20">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: "100%" }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
             className="h-full bg-primary shadow-[0_0_15px_rgba(0,87,255,0.8)]"
           />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 text-center md:text-left">
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-primary rounded-[16px] md:rounded-[20px] flex items-center justify-center shadow-lg shadow-primary/20">
                  <Lock size={24} className="text-white md:w-7 md:h-7" />
               </div>
               <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Marketplace Escrow</h3>
            </div>
            <p className="text-gray-500 font-medium max-w-xl text-sm md:text-base leading-relaxed">Release and audit global asset settlements from the decentralized escrow vault node.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto justify-center">
             <div className="px-6 md:px-8 py-4 md:py-5 bg-white/5 border border-white/10 rounded-[20px] md:rounded-[28px] text-center backdrop-blur-md">
                <p className="text-[9px] md:text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Locked Reserves</p>
                <p className="text-xl md:text-3xl font-black font-space text-primary tracking-tighter leading-none pt-1">₦5,575,000.00</p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 relative z-10">
          <AnimatePresence mode="popLayout">
            {escrowTrades.map((trade) => (
              <motion.div 
                key={trade.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[30px] md:rounded-[40px] flex flex-col justify-between gap-10 md:gap-12 group/card hover:border-primary/50 transition-all text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/card:opacity-10 transition-opacity">
                   <Shield size={64} />
                </div>

                <div className="flex justify-between items-start gap-4">
                   <div className="space-y-1 overflow-hidden">
                      <p className="text-xl md:text-2xl font-black tracking-tight truncate">{trade.assetName || trade.asset}</p>
                      <div className="flex items-center gap-2">
                         <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest truncate max-w-[120px]">Node: {trade.userId || trade.seller}</p>
                         <span className="text-[10px] text-gray-700">•</span>
                         <span className="text-[10px] text-gray-500 font-mono">{trade.id}</span>
                      </div>
                   </div>
                   <div className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shrink-0 shadow-sm ${trade.type === 'Debit' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                      {trade.status}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                   <div>
                      <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 md:mb-2">Magnitude</p>
                      <p className="text-3xl md:text-4xl font-black font-space tracking-tight text-white">${trade.amount.toLocaleString()}</p>
                   </div>
                   <div className="flex gap-3">
                      <button 
                        disabled={settlingId === trade.id}
                        onClick={() => handleSettleEscrow(trade.id, 'REJECT')}
                        className="flex-1 sm:flex-none p-4 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl md:rounded-2xl transition-all active-press border border-white/5"
                      >
                         {settlingId === trade.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                      </button>
                      <button 
                        disabled={settlingId === trade.id}
                        onClick={() => handleSettleEscrow(trade.id, 'RELEASE')}
                        className="flex-[2] sm:flex-none h-14 md:h-16 px-8 md:px-10 bg-white text-[#0b0e14] rounded-xl md:rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all active-press shadow-xl flex items-center justify-center gap-2"
                      >
                         {settlingId === trade.id ? <Loader2 size={18} className="animate-spin" /> : (
                            <>Release Funds <ArrowRight size={16} /></>
                         )}
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {escrowTrades.length === 0 && !loadingTrades && (
           <div className="py-24 text-center space-y-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5"
              >
                <CheckCircle2 size={40} className="text-emerald-500 opacity-20" />
              </motion.div>
              <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">Marketplace Node Fully Settled</p>
           </div>
        )}

        {loadingTrades && (
           <div className="py-24 text-center">
              <Loader2 size={40} className="text-primary animate-spin mx-auto" />
           </div>
        )}
      </motion.div>
    </div>
  );
}
