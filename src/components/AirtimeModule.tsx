import React, { useState, useEffect } from "react";
import { UserProfile, Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { 
  Smartphone, Wifi, Check, RefreshCw, ChevronRight, 
  AlertTriangle, ShieldCheck, Download, Zap, Search,
  ArrowRight, Landmark, CreditCard, Star, Activity, DollarSign
} from "lucide-react";
import api from "../services/api";

const rechargeSchema = z.object({
  phone: z.string().length(10, "Phone number must be exactly 10 digits"),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be a positive magnitude",
  }),
});

interface AirtimeModuleProps {
  profile: UserProfile;
  onPurchase: (amount: number, description: string) => Promise<boolean> | boolean;
}

interface NetworkProvider {
  id: string;
  name: string;
  color: string;
  textColor: string;
  logoChar: string;
  paymentCode: string;
}

interface DataPlan {
  id: string;
  name: string;
  price: number;
  dataAmount: string;
  validity: string;
  paymentCode: string;
}

export default function AirtimeModule({ profile, onPurchase }: AirtimeModuleProps) {
  const [activeSegment, setActiveSegment] = useState<"airtime" | "data">("airtime");
  const [selectedProvider, setSelectedProvider] = useState<string>("mtn");
  const [phoneNo, setPhoneNo] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDataPlan, setSelectedDataPlan] = useState<string>("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);

  const providers: NetworkProvider[] = [
    { id: "mtn", name: "MTN", color: "bg-[#FFCC00]", textColor: "text-black", logoChar: "M", paymentCode: "10101" },
    { id: "airtel", name: "Airtel", color: "bg-[#E50914]", textColor: "text-white", logoChar: "A", paymentCode: "10201" },
    { id: "glo", name: "Glo", color: "bg-[#339933]", textColor: "text-white", logoChar: "G", paymentCode: "10301" },
    { id: "9mobile", name: "9mobile", color: "bg-[#015249]", textColor: "text-white", logoChar: "9", paymentCode: "10401" },
  ];

  const dataPlans: Record<string, DataPlan[]> = {
    mtn: [
      { id: "m1", name: "Daily Value", price: 1.0, dataAmount: "1.5GB", validity: "24 Hours", paymentCode: "10102" },
      { id: "m2", name: "Weekly Mega", price: 5.0, dataAmount: "10GB", validity: "7 Days", paymentCode: "10103" },
      { id: "m3", name: "Monthly Pro", price: 15.0, dataAmount: "40GB", validity: "30 Days", paymentCode: "10104" },
    ],
    airtel: [
      { id: "a1", name: "Binge Plan", price: 1.5, dataAmount: "2.5GB", validity: "24 Hours", paymentCode: "10202" },
      { id: "a2", name: "Work Force", price: 8.0, dataAmount: "15GB", validity: "7 Days", paymentCode: "10203" },
    ],
    glo: [
      { id: "g1", name: "Glo Special", price: 1.0, dataAmount: "2GB", validity: "24 Hours", paymentCode: "10302" },
    ],
    "9mobile": [
      { id: "n1", name: "Smart Plan", price: 2.0, dataAmount: "3GB", validity: "48 Hours", paymentCode: "10402" },
    ]
  };

  const currentProvider = providers.find((p) => p.id === selectedProvider) || providers[0];
  const activePlans = dataPlans[selectedProvider] || [];

  const handleOpenCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (activeSegment === "airtime") {
      const result = rechargeSchema.safeParse({ phone: phoneNo, amount });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }
    } else {
      if (!phoneNo || phoneNo.length !== 10) {
        setErrors({ phone: "Invalid node identifier" });
        return;
      }
      if (!selectedDataPlan) {
        alert("Please select a data plan");
        return;
      }
    }
    
    setShowCheckout(true);
  };

  const handlePurchaseFinal = async () => {
    let price = 0;
    let description = "";
    let pCode = "";

    if (activeSegment === "airtime") {
      price = parseFloat(amount);
      description = `Airtime dispatched to ${phoneNo} (${currentProvider.name})`;
      pCode = currentProvider.paymentCode;
    } else {
      const plan = activePlans.find((p) => p.id === selectedDataPlan);
      if (!plan) return;
      price = plan.price;
      description = `${plan.dataAmount} Data delivered to ${phoneNo} (${currentProvider.name})`;
      pCode = plan.paymentCode;
    }

    if (price > profile.balance) {
      alert("Insufficient reserves.");
      return;
    }

    setProcessing(true);
    try {
      // 1. Call Interswitch Backend
      const response = await api.post('/vtu/recharge', {
        paymentCode: pCode,
        customerId: `234${phoneNo}`,
        amount: price * 100, // Kobo or simulated unit
        requestReference: `VTU-${Date.now()}`
      });

      // 2. Call Parent Update
      const isSuccess = await onPurchase(price, description);
      
      if (isSuccess) {
        setShowCheckout(false);
        setSuccessReceipt({
          txId: response.data.transactionReference || `OBY-VTU-${Date.now()}`,
          phone: phoneNo,
          provider: currentProvider.name,
          planType: activeSegment === "airtime" ? "Airtime Top-Up" : `${activePlans.find(p => p.id === selectedDataPlan)?.dataAmount} Data`,
          amount: price,
          date: new Date().toLocaleString()
        });
      }
    } catch (error) {
      console.error('VTU Error:', error);
      alert("System dispatch failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const tabVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };

  return (
    <div className="space-y-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Utility Hub</h2>
          <p className="text-gray-500 font-medium">Refill assets and subscribe to network nodes instantly.</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[22px] border border-gray-200 w-full md:w-fit hide-scrollbar overflow-x-auto">
          {[
            { id: "airtime", label: "Airtime", icon: Smartphone },
            { id: "data", label: "Data Bundles", icon: Wifi }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSegment(tab.id as any)}
              className={`px-8 py-3.5 rounded-[18px] text-[13px] font-black tracking-tight transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                activeSegment === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {successReceipt ? (
          <motion.div 
            key="success"
            variants={tabVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[45px] p-12 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
            
            <div className="space-y-4">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check size={48} />
              </div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Dispatch Successful</h2>
              <p className="text-gray-500 font-medium leading-relaxed">Your mobile bundle has been delivered instantly to the target node.</p>
            </div>

            <div className="bg-gray-50 rounded-[32px] p-10 space-y-8 text-left border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Target Node</span>
                <span className="text-2xl font-black text-gray-900 font-mono tracking-widest">+234 {successReceipt.phone}</span>
              </div>
              <div className="h-px bg-gray-200"></div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operator</p>
                  <p className="text-lg font-black text-gray-900">{successReceipt.provider}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Magnitude</p>
                  <p className="text-lg font-black text-gray-900">${successReceipt.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button className="w-full bg-primary text-white py-6 rounded-[22px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 active-press">
                Download Receipt
              </button>
              <button onClick={() => setSuccessReceipt(null)} className="text-sm font-black text-gray-400 hover:text-gray-900 tracking-widest uppercase py-2">
                Return to Hub
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Action Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 bento-card p-10 space-y-12 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/30 rounded-full blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-[3s]"></div>
              
              <div className="flex justify-between items-center border-b border-gray-100 pb-10 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Configuration Terminal</h3>
                  <p className="text-sm text-gray-500 font-medium">Select provider and specify target node details.</p>
                </div>
                <div className="w-14 h-14 bg-primary/10 rounded-[22px] flex items-center justify-center text-primary">
                  {activeSegment === "airtime" ? <Smartphone size={28} /> : <Wifi size={28} />}
                </div>
              </div>

              <form onSubmit={handleOpenCheckout} className="space-y-10 relative z-10">
                {/* Providers Grid */}
                <div className="space-y-5">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Network Operator</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {providers.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProvider(p.id)}
                        className={`flex flex-col items-center justify-center p-8 rounded-[32px] border transition-all duration-400 group/p ${
                          selectedProvider === p.id
                            ? "border-primary bg-white shadow-xl shadow-primary/10"
                            : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                        }`}
                      >
                        <div className={`w-16 h-16 ${p.color} ${p.textColor} rounded-[22px] flex items-center justify-center font-black text-2xl mb-4 shadow-sm group-hover/p:scale-110 transition-transform`}>
                          {p.logoChar}
                        </div>
                        <span className="text-sm font-black text-gray-900 tracking-tight uppercase">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Target Phone Node</label>
                    <div className="flex group">
                      <div className="bg-gray-100 border border-gray-100 border-r-0 rounded-l-[22px] px-6 flex items-center text-sm font-black text-gray-500 transition-colors group-focus-within:border-primary/20 group-focus-within:bg-white">
                        +234
                      </div>
                      <input
                        type="tel"
                        required
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="809 102 8824"
                        className="w-full h-16 px-6 bg-gray-50 border border-gray-100 rounded-r-[22px] text-lg font-bold focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {activeSegment === "airtime" && (
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Amount (USD)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={24} />
                        <input
                          type="number"
                          required
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full h-16 pl-16 pr-8 bg-gray-50 border border-gray-100 rounded-[22px] text-lg font-black focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Data Matrix */}
                {activeSegment === "data" && (
                  <div className="space-y-5">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Institutional Bundles</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {activePlans.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedDataPlan(plan.id)}
                          className={`p-8 bg-white border rounded-[32px] flex items-center justify-between cursor-pointer transition-all duration-400 group/d ${
                            selectedDataPlan === plan.id
                              ? "border-primary shadow-xl shadow-primary/10"
                              : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-5">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${selectedDataPlan === plan.id ? 'border-primary' : 'border-gray-200'}`}>
                              {selectedDataPlan === plan.id && <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/40 animate-fade-in"></div>}
                            </div>
                            <div className="space-y-1">
                              <p className="text-xl font-black text-gray-900 tracking-tight">{plan.dataAmount}</p>
                              <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">{plan.validity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-gray-900 font-mono tracking-tighter">${plan.price.toFixed(2)}</p>
                            <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">OPTIMIZED</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center active-press"
                >
                  <div className="flex items-center gap-3">
                     Process Checkout <ArrowRight size={20} />
                  </div>
                </button>
              </form>
            </motion.div>

            {/* Info Bento Column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 space-y-8"
            >
              <div className="bento-card p-10 space-y-10">
                <h4 className="text-[11px] font-black uppercase text-gray-400 tracking-[0.3em]">Network Intelligence</h4>
                <div className="space-y-10">
                  {[
                    { title: "Direct Settlement", desc: "Transactions settle on carrier nodes in sub-seconds.", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
                    { title: "Node Protocol", desc: "Enterprise liquidity routing with zero surcharge.", icon: Landmark, color: "text-primary", bg: "bg-accent-blue" },
                    { title: "Compliance Shield", desc: "100% success rate on institutional data pipes.", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" }
                  ].map((item) => (
                    <div key={item.title} className="flex gap-5 group/i">
                      <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-[20px] flex items-center justify-center shrink-0 group-hover/i:scale-110 transition-transform shadow-sm`}>
                        <item.icon size={28} />
                      </div>
                      <div className="space-y-1 pt-1">
                        <p className="text-base font-black text-gray-900 tracking-tight">{item.title}</p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-accent-yellow border border-yellow-200 rounded-[45px] p-10 relative overflow-hidden group shadow-xl shadow-yellow-500/5">
                 <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                 <div className="relative z-10 space-y-5">
                    <div className="w-14 h-14 bg-white rounded-[22px] flex items-center justify-center text-yellow-600 shadow-sm">
                       <AlertTriangle size={32} />
                    </div>
                    <h4 className="text-2xl font-black text-gray-900 tracking-tighter leading-tight">Identity <br /> Verification.</h4>
                    <p className="text-sm text-yellow-800 font-medium leading-relaxed">
                       Always confirm the target record. Unified billing nodes cannot reverse carrier-level settlements.
                    </p>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checkout Overlay: Apple Pro Inspired */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xl z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-xl bg-white border border-gray-100 rounded-[50px] p-12 shadow-[0_100px_200px_-20px_rgba(0,0,0,0.2)] space-y-10 relative overflow-hidden"
            >
              <div className="space-y-2 text-center">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">Invoice Review</h3>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Verify and Authorize Settlement</p>
              </div>

              <div className="bg-gray-50/50 rounded-[40px] p-10 space-y-8 border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Target Node</span>
                  <span className="text-xl font-black text-gray-900 font-mono tracking-[0.1em]">+234 {phoneNo}</span>
                </div>
                <div className="h-px bg-gray-200/50"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Carrier Protocol</span>
                  <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 ${currentProvider.color} ${currentProvider.textColor} rounded-lg flex items-center justify-center font-black text-[10px]`}>
                       {currentProvider.logoChar}
                     </div>
                     <span className="text-sm font-black text-gray-900">{currentProvider.name}</span>
                  </div>
                </div>
                <div className="h-px bg-gray-200/50"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Network Fee</span>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                     <Activity size={12} />
                     <span className="text-[10px] font-black uppercase tracking-widest">SUB-ZERO</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end px-4">
                <div className="space-y-1">
                   <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Authorized Magnitude</p>
                   <p className="text-sm font-black text-primary uppercase tracking-widest">Primary USD Vault</p>
                </div>
                <div className="text-right">
                  <p className="text-6xl font-black text-gray-900 tracking-tighter leading-none">
                    ${activeSegment === "airtime" ? parseFloat(amount).toFixed(2) : activePlans.find((p) => p.id === selectedDataPlan)?.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="py-6 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-[22px] text-xs font-black uppercase tracking-widest transition-all active-press"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePurchaseFinal}
                  disabled={processing}
                  className="py-6 bg-primary hover:bg-primary/90 text-white rounded-[22px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all flex items-center justify-center active-press"
                >
                  {processing ? <RefreshCw className="animate-spin" size={20} /> : "Authorize Settlement"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
