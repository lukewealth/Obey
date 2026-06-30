import React, { useState, useEffect } from "react";
import { UserProfile, Transaction } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  Smartphone, Wifi, Check, RefreshCw, ChevronRight,
  AlertTriangle, ShieldCheck, Download, Zap, Search,
  ArrowRight, Landmark, CreditCard, Star, Activity, Coins,
  Phone, Network, Loader2, FileText, BadgeCheck, Contact, X
} from "lucide-react";
import api from "../services/api";
import { useNotification } from "./NotificationSystem";

const rechargeSchema = z.object({
  phone: z.string().length(10, "Phone number must be exactly 10 digits"),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Amount must be greater than 0",
  }),
});

interface AirtimeModuleProps {
  profile: UserProfile;
  onPurchase: (amount: number, description: string) => Promise<boolean> | boolean;
  initialSegment?: "airtime" | "data";
}

interface NetworkProvider {
  id: string;
  name: string;
  color: string;
  textColor: string;
  logoChar: string;
  logoUrl?: string;
  paymentCode: string;
  symbolColor: string;
}

interface DataPlan {
  id: string;
  name: string;
  price: number;
  dataAmount: string;
  validity: string;
  paymentCode: string;
  recommended?: boolean;
}

interface SavedContact {
  id: string;
  name: string;
  phone: string;
}

export default function AirtimeModule({ profile, onPurchase }: AirtimeModuleProps) {
  const { notify } = useNotification();
  const [activeSegment, setActiveSegment] = useState<"airtime" | "data" | "subscriptions">("airtime");
  const [selectedProvider, setSelectedProvider] = useState<string>("mtn");
  const [phoneNo, setPhoneNo] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedDataPlan, setSelectedDataPlan] = useState<string>("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<any | null>(null);
  const [showContacts, setShowContacts] = useState(false);
  const [contacts, setContacts] = useState<SavedContact[]>([
    { id: "1", name: "Mom", phone: "8031234567" },
    { id: "2", name: "Dad", phone: "8021234567" },
    { id: "3", name: "Sarah", phone: "9031234567" },
  ]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  const providers: NetworkProvider[] = [
    {
      id: "mtn",
      name: "MTN",
      color: "bg-[#FFCC00]",
      textColor: "text-black",
      logoChar: "M",
      logoUrl: "/mtn.svg",
      paymentCode: "10101",
      symbolColor: "#FFCC00"
    },
    {
      id: "airtel",
      name: "Airtel",
      color: "bg-[#ED1C24]",
      textColor: "text-white",
      logoChar: "A",
      logoUrl: "/airtel.png",
      paymentCode: "10201",
      symbolColor: "#ED1C24"
    },
    {
      id: "glo",
      name: "Glo",
      color: "bg-[#00A651]",
      textColor: "text-white",
      logoChar: "G",
      logoUrl: "/glo.jpeg",
      paymentCode: "10301",
      symbolColor: "#00A651"
    },
    {
      id: "9mobile",
      name: "9mobile",
      color: "bg-[#006B3F]",
      textColor: "text-white",
      logoChar: "9",
      logoUrl: "/9mobile.png",
      paymentCode: "10401",
      symbolColor: "#006B3F"
    },
  ];

  const dataPlans: Record<string, DataPlan[]> = {
    mtn: [
      { id: "m1", name: "Daily Value", price: 100, dataAmount: "1.5GB", validity: "24 Hours", paymentCode: "10102" },
      { id: "m2", name: "Weekly Mega", price: 1500, dataAmount: "10GB", validity: "7 Days", paymentCode: "10103" },
      { id: "m3", name: "Monthly Pro", price: 5000, dataAmount: "40GB", validity: "30 Days", paymentCode: "10104", recommended: true },
    ],
    airtel: [
      { id: "a1", name: "Binge Plan", price: 300, dataAmount: "2.5GB", validity: "24 Hours", paymentCode: "10202" },
      { id: "a2", name: "Work Force", price: 3000, dataAmount: "15GB", validity: "7 Days", paymentCode: "10203", recommended: true },
    ],
    glo: [
      { id: "g1", name: "Glo Special", price: 200, dataAmount: "2GB", validity: "24 Hours", paymentCode: "10302", recommended: true },
    ],
    "9mobile": [
      { id: "n1", name: "Smart Plan", price: 500, dataAmount: "3GB", validity: "48 Hours", paymentCode: "10402", recommended: true },
    ]
  };

  const subscriptionServices = [
    {
      id: "netflix",
      name: "Netflix",
      logoUrl: "/netflix.jpg",
      color: "bg-[#E50914]",
      plans: [
        { id: "nf1", name: "Mobile", price: 1200, description: "1 device, 480p", duration: "Monthly" },
        { id: "nf2", name: "Basic", price: 1800, description: "1 device, 720p", duration: "Monthly", recommended: true },
        { id: "nf3", name: "Standard", price: 2800, description: "2 devices, 1080p", duration: "Monthly" },
        { id: "nf4", name: "Premium", price: 4400, description: "4 devices, 4K", duration: "Monthly" },
      ]
    },
    {
      id: "spotify",
      name: "Spotify",
      logoUrl: "https://storage.googleapis.com/pr-newsroom-wp/1/2023/09/Spotify_Full_Logo_RGB_Green.png",
      color: "bg-[#1DB954]",
      plans: [
        { id: "sp1", name: "Individual", price: 1200, description: "1 account", duration: "Monthly", recommended: true },
        { id: "sp2", name: "Duo", price: 1600, description: "2 accounts", duration: "Monthly" },
        { id: "sp3", name: "Family", price: 1900, description: "6 accounts", duration: "Monthly" },
      ]
    },
    {
      id: "apple",
      name: "Apple Music",
      logoUrl: "/apple.png",
      color: "bg-[#FA243C]",
      plans: [
        { id: "am1", name: "Individual", price: 1200, description: "1 account", duration: "Monthly", recommended: true },
        { id: "am2", name: "Family", price: 1800, description: "6 accounts", duration: "Monthly" },
        { id: "am3", name: "Student", price: 600, description: "1 account", duration: "Monthly" },
      ]
    },
    {
      id: "youtube",
      name: "YouTube Premium",
      logoUrl: "https://www.gstatic.com/youtube/src/web/htdocs/img/branding/YouTube_Logo_2024.svg",
      color: "bg-[#FF0000]",
      plans: [
        { id: "yt1", name: "Individual", price: 1200, description: "1 account", duration: "Monthly", recommended: true },
        { id: "yt2", name: "Family", price: 1900, description: "5 accounts", duration: "Monthly" },
        { id: "yt3", name: "Student", price: 600, description: "1 account", duration: "Monthly" },
      ]
    },
    {
      id: "showmax",
      name: "Showmax",
      logoUrl: "https://nigerialogos.com/logos/showmax.svg",
      color: "bg-[#000000]",
      plans: [
        { id: "sm1", name: "Mobile", price: 1200, description: "1 device", duration: "Monthly", recommended: true },
        { id: "sm2", name: "Standard", price: 2500, description: "2 devices", duration: "Monthly" },
      ]
    },
    {
      id: "dstv",
      name: "DSTV",
      logoUrl: "/dstv.svg",
      color: "bg-[#003DA5]",
      plans: [
        { id: "ds1", name: "Padi", price: 2500, description: "Local channels", duration: "Monthly" },
        { id: "ds2", name: "Yanga", price: 3500, description: "Entertainment", duration: "Monthly", recommended: true },
        { id: "ds3", name: "Confam", price: 6200, description: "Family package", duration: "Monthly" },
        { id: "ds4", name: "Compact", price: 10500, description: "Full entertainment", duration: "Monthly" },
      ]
    },
  ];

  const currentProvider = providers.find((p) => p.id === selectedProvider) || providers[0];
  const activePlans = dataPlans[selectedProvider] || [];

  // Network auto-detection logic
  useEffect(() => {
     const prefix = phoneNo.substring(0, 3);
     const mtn = ['803', '703', '903', '806', '706', '813', '816'];
     const airtel = ['802', '701', '708', '812', '902'];
     const glo = ['805', '705', '815', '811', '905'];
     const mobile9 = ['809', '818', '817', '909'];

     if (mtn.includes(prefix)) setSelectedProvider('mtn');
     else if (airtel.includes(prefix)) setSelectedProvider('airtel');
     else if (glo.includes(prefix)) setSelectedProvider('glo');
     else if (mobile9.includes(prefix)) setSelectedProvider('9mobile');
  }, [phoneNo]);

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
        setErrors({ phone: "Invalid phone number" });
        return;
      }
      if (!selectedDataPlan) {
        notify("error", "Selection Required", "Please select a data bundle.");
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
      description = `Airtime sent to ${phoneNo} (${currentProvider.name})`;
      pCode = currentProvider.paymentCode;
    } else {
      const plan = activePlans.find((p) => p.id === selectedDataPlan);
      if (!plan) return;
      price = plan.price;
      description = `${plan.dataAmount} Data sent to ${phoneNo} (${currentProvider.name})`;
      pCode = plan.paymentCode;
    }

    if (price > profile.balance) {
      notify("error", "Insufficient Balance", "Please add funds to continue.");
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post('/vtu/recharge', {
        paymentCode: pCode,
        customerId: `234${phoneNo}`,
        amount: price * 100, // Amount in kobo for API
        requestReference: `VTU-${Date.now()}`
      });

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
        notify("success", "Success", "Airtime sent successfully.");
      }
    } catch (error) {
      console.error('VTU Error:', error);
      notify("error", "Failed", "Transaction failed. Please try again.");
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
    <div className="space-y-8 md:space-y-12 pb-24 px-1 md:px-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight text-center md:text-left">Services</h2>
          <p className="text-sm md:text-lg text-gray-500 font-medium text-center md:text-left">Airtime, data, and subscriptions.</p>
        </div>
        <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-[18px] md:rounded-[22px] border border-gray-200 w-full md:w-fit hide-scrollbar overflow-x-auto shadow-sm">
          {[
            { id: "airtime", label: "Airtime", icon: Smartphone },
            { id: "data", label: "Data", icon: Wifi },
            { id: "subscriptions", label: "Subscriptions", icon: Star }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSegment(tab.id as any)}
              className={`px-6 md:px-8 py-2.5 md:py-3.5 rounded-[14px] md:rounded-[18px] text-[11px] md:text-[13px] font-black tracking-tight transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap flex-1 md:flex-initial relative active-scale ${
                activeSegment === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              {activeSegment === tab.id && (
                <motion.div layoutId="utility-tab" className="absolute inset-0 bg-primary rounded-[14px] md:rounded-[18px] -z-10" />
              )}
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
            className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-[35px] md:rounded-[45px] p-8 md:p-12 text-center shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-500"></div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <BadgeCheck size={32} className="md:w-12 md:h-12" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Purchase Successful</h2>
              <p className="text-sm md:text-base text-gray-500 font-medium leading-relaxed">Airtime sent to: <span className="text-primary font-bold">+234 {phoneNo}</span></p>
            </div>

            <div className="bg-gray-50 rounded-[24px] md:rounded-[32px] p-6 md:p-10 space-y-6 text-left border border-gray-100 shadow-inner">
              <div className="grid grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-1">
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction ID</p>
                  <p className="text-xs md:text-sm font-bold text-gray-900 font-mono truncate">{successReceipt.txId.substring(0, 15)}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</p>
                  <p className="text-base md:text-lg font-bold text-primary font-mono tracking-tight">₦{successReceipt.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              <button className="w-full bg-primary text-white py-5 md:py-6 rounded-[18px] md:rounded-[22px] font-bold text-xs md:text-sm uppercase tracking-wider shadow-2xl active-press">
                Download Receipt
              </button>
              <button onClick={() => setSuccessReceipt(null)} className="text-xs md:text-sm font-bold text-gray-400 hover:text-gray-900 tracking-wider uppercase py-2">
                Done
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
            {/* Configuration Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 bento-card p-6 md:p-10 space-y-8 md:space-y-12 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-accent-blue/30 rounded-full blur-[60px] md:blur-[100px] -z-10 group-hover:scale-110 transition-transform duration-[3s]"></div>
              
              <div className="space-y-2 relative z-10 border-b border-gray-100 pb-8">
                 <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Enter Details</h3>
                 <p className="text-sm font-medium text-gray-500">Choose your network and amount.</p>
              </div>

              <form onSubmit={handleOpenCheckout} className="space-y-10 md:space-y-12 relative z-10">
                {/* Network Selection Grid */}
                <div className="space-y-5">
                  <div className="flex justify-between items-center px-4">
                     <label className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">Select Network</label>
                      <button type="button" onClick={() => setShowContacts(true)} className="text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity"><Contact size={14} /> Contacts</button>
                  </div>
                  <div className="grid grid-cols-4 gap-3 md:gap-5">
                    {providers.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProvider(p.id)}
                        className={`flex flex-col items-center justify-center aspect-square rounded-[24px] md:rounded-[32px] border-2 transition-all duration-300 group/p relative overflow-hidden active-scale ${
                          selectedProvider === p.id
                            ? "border-primary bg-white shadow-xl shadow-primary/10"
                            : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                        }`}
                      >
                        {p.logoUrl ? (
                          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-1 shadow-lg group-hover/p:scale-110 transition-transform duration-200 shrink-0 relative z-10 overflow-hidden bg-white">
                            <img 
                              src={p.logoUrl} 
                              alt={p.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className={`hidden w-full h-full ${p.color} ${p.textColor} rounded-full flex items-center justify-center font-black text-lg md:text-xl`}>
                              {p.logoChar}
                            </div>
                          </div>
                        ) : (
                          <div className={`w-10 h-10 md:w-14 md:h-14 ${p.color} ${p.textColor} rounded-full flex items-center justify-center font-black text-lg md:text-xl mb-1 shadow-lg group-hover/p:scale-110 transition-transform duration-200 shrink-0 relative z-10`}>
                            {p.logoChar}
                          </div>
                        )}
                        <span className="text-[8px] md:text-[10px] font-black text-gray-900 tracking-tight uppercase relative z-10">{p.name}</span>
                        {selectedProvider === p.id && (
                          <motion.div layoutId="provider-accent" className="absolute inset-0 bg-primary/5 -z-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-4">Phone Number</label>
                    <div className="relative group">
                      <input
                        type="tel"
                        required
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value.replace(/[^0-9]/g, ""))}
                        placeholder="809 102 8824"
                        className="w-full h-16 md:h-20 px-8 bg-gray-50 border border-gray-100 rounded-[22px] md:rounded-[28px] text-xl md:text-2xl font-bold text-gray-900 input-focus-ring focus:border-primary outline-none transition-all duration-200 shadow-inner tracking-wider"
                      />
                      <AnimatePresence>
                         {phoneNo.length >= 3 && (
                            <motion.div 
                              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white/90 border border-gray-100 px-3 py-1 rounded-full shadow-sm"
                            >
                               <div className={`w-2 h-2 rounded-full ${currentProvider.color}`} />
                               <span className="text-[8px] font-bold text-gray-900 uppercase tracking-widest">{currentProvider.name} Detected</span>
                            </motion.div>
                         )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {activeSegment === "airtime" && (
                    <div className="space-y-3">
                      <label className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-4">Amount (NGN)</label>
                      <div className="relative group">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold text-2xl">₦</span>
                        <input
                          type="number"
                          required
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full h-16 md:h-20 pl-14 pr-8 bg-gray-50 border border-gray-100 rounded-[22px] md:rounded-[28px] text-xl md:text-2xl font-bold text-gray-900 input-focus-ring focus:border-primary outline-none transition-all duration-200 shadow-inner"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Data Plans Grid */}
                {activeSegment === "data" && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center px-4">
                       <label className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">Select Bundle</label>
                       <div className="flex gap-2">
                          <button type="button" className="px-3 py-1 bg-primary text-white text-[8px] font-bold uppercase rounded-full">Daily</button>
                          <button type="button" className="px-3 py-1 bg-gray-100 text-gray-400 text-[8px] font-bold uppercase rounded-full">Monthly</button>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      {activePlans.map((plan) => (
                        <div
                          key={plan.id}
                          onClick={() => setSelectedDataPlan(plan.id)}
                          className={`p-8 bg-white border-2 rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-between h-48 cursor-pointer transition-all duration-300 group/d relative overflow-hidden active-scale-98 ${
                            selectedDataPlan === plan.id
                              ? "border-primary shadow-2xl shadow-primary/10"
                              : "border-gray-100 bg-white/40 hover:border-primary/20 hover:bg-white"
                          }`}
                        >
                          {plan.recommended && (
                             <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1.5 rounded-bl-2xl font-bold text-[8px] uppercase tracking-widest">Recommended</div>
                          )}
                          <div className="space-y-1 relative z-10">
                             <p className="text-3xl font-bold text-gray-900 tracking-tight">{plan.dataAmount}</p>
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{plan.validity}</p>
                          </div>
                          <div className="flex justify-between items-end relative z-10 pt-4 border-t border-gray-50">
                             <p className="text-xl font-bold text-primary font-mono tracking-tight">₦{plan.price.toLocaleString()}</p>
                             <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${selectedDataPlan === plan.id ? 'bg-primary text-white scale-110' : 'bg-gray-100 text-gray-300 group-hover/d:bg-primary/10 group-hover/d:text-primary'}`}>
                                <Check size={18} />
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-18 md:h-22 bg-primary hover:bg-black text-white rounded-2xl md:rounded-[32px] font-bold text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transition-all duration-200 flex items-center justify-center active-scale hover:shadow-primary/40"
                >
                  Confirm Purchase <ArrowRight className="ml-3" size={24} />
                </button>
              </form>
            </motion.div>

            {/* Info Side Bento */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 space-y-6 md:space-y-8">
               <div className="bento-card p-8 md:p-10 space-y-8">
                  <h4 className="text-[10px] md:text-[11px] font-bold uppercase text-gray-400 tracking-widest">Benefits</h4>
                  <div className="space-y-8">
                     {[
                        { title: "Instant Delivery", desc: "Delivered in under 3 seconds.", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
                        { title: "Secure & Encrypted", desc: "Your transaction is fully encrypted.", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" }
                     ].map(i => (
                        <div key={i.title} className="flex gap-4 group/i">
                           <div className={`w-12 h-12 ${i.bg} ${i.color} rounded-2xl flex items-center justify-center shrink-0 group-hover/i:scale-110 transition-transform`}><i.icon size={24} /></div>
                           <div className="space-y-0.5">
                              <p className="text-sm font-bold text-gray-900">{i.title}</p>
                              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{i.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-accent-yellow p-8 rounded-[35px] space-y-5 relative overflow-hidden group shadow-xl">
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-yellow-600 shadow-sm relative z-10"><AlertTriangle size={24} /></div>
                  <h4 className="text-xl font-bold text-gray-900 tracking-tight relative z-10">Important</h4>
                  <p className="text-[11px] text-yellow-900 font-medium leading-relaxed relative z-10">Double-check the phone number. Transactions cannot be reversed.</p>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContacts && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-lg bg-white border border-gray-100 rounded-[35px] md:rounded-[50px] p-8 md:p-10 shadow-2xl space-y-6 relative overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Contacts</h3>
                <button onClick={() => setShowContacts(false)} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <X size={18} className="text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => {
                      const cleaned = contact.phone.replace(/\D/g, "");
                      setPhoneNo(cleaned.slice(-10));
                      setShowContacts(false);
                      notify("success", "Contact Selected", `${contact.name} added.`);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{contact.name}</p>
                      <p className="text-xs text-gray-500 font-mono">+234 {contact.phone}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add New Contact</p>
                <input
                  type="text"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  placeholder="Name"
                  className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
                <input
                  type="tel"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Phone number (e.g. 8091028824)"
                  className="w-full h-12 px-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-mono"
                />
                <button
                  onClick={() => {
                    if (!newContactName.trim() || newContactPhone.length < 10) {
                      notify("error", "Invalid Contact", "Enter a valid name and 10-digit phone number.");
                      return;
                    }
                    setContacts(prev => [...prev, { id: Date.now().toString(), name: newContactName, phone: newContactPhone }]);
                    setNewContactName("");
                    setNewContactPhone("");
                    notify("success", "Contact Saved", "New contact added successfully.");
                  }}
                  className="w-full h-14 bg-primary hover:bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  Save Contact
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-xl bg-white border border-gray-100 rounded-[35px] md:rounded-[50px] p-8 md:p-12 shadow-2xl space-y-8 md:space-y-10 relative overflow-hidden"
            >
              <div className="space-y-1 md:space-y-2 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Review Order</h3>
                <p className="text-xs md:text-sm text-gray-500 font-medium uppercase tracking-widest">Confirm your purchase</p>
              </div>

              <div className="bg-gray-50/50 rounded-[24px] md:rounded-[40px] p-6 md:p-10 space-y-6 md:space-y-8 border border-gray-100 shadow-inner">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Phone Number</span>
                  <span className="text-lg md:text-xl font-bold text-gray-900 font-mono tracking-[0.1em] truncate">+234 {phoneNo}</span>
                </div>
                <div className="h-px bg-gray-200/50"></div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest shrink-0">Network</span>
                  <div className="flex items-center gap-3 overflow-hidden">
                     {currentProvider.logoUrl ? (
                       <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-white border border-gray-200">
                         <img 
                           src={currentProvider.logoUrl} 
                           alt={currentProvider.name}
                           className="w-full h-full object-contain"
                           onError={(e) => {
                             (e.target as HTMLImageElement).style.display = 'none';
                           }}
                         />
                       </div>
                     ) : (
                       <div className={`w-7 h-7 md:w-8 md:h-8 ${currentProvider.color} ${currentProvider.textColor} rounded-full flex items-center justify-center font-bold text-[9px] md:text-[10px] shrink-0`}>
                         {currentProvider.logoChar}
                       </div>
                     )}
                     <span className="text-sm font-bold text-gray-900 truncate uppercase">{currentProvider.name}</span>
                  </div>
                </div>
                <div className="h-px bg-gray-200/50"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">Transaction Fee</span>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                     <Activity size={12} />
                     <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Free</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end px-2 md:px-4">
                <div className="space-y-0.5 md:space-y-1">
                   <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                   <p className="text-xs md:text-sm font-bold text-primary uppercase tracking-widest">Your Balance</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight leading-none font-mono">
                    ₦{activeSegment === "airtime" ? parseFloat(amount || "0").toLocaleString() : activePlans.find((p) => p.id === selectedDataPlan)?.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6 pt-2 md:pt-4">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="py-5 md:py-6 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-[18px] md:rounded-[22px] text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all active-press"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePurchaseFinal}
                  disabled={processing}
                  className="py-5 md:py-6 bg-primary hover:bg-primary/90 text-white rounded-[18px] md:rounded-[22px] text-[11px] md:text-xs font-bold uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all flex items-center justify-center active-press"
                >
                  {processing ? <RefreshCw className="animate-spin" size={20} /> : "Confirm Payment"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
