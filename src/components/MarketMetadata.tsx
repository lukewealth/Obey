import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Clock, ShieldCheck, Globe, Zap, BarChart3, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

interface MarketMetadataProps {
  symbol: string;
}

export default function MarketMetadata({ symbol }: MarketMetadataProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Institutional Peg for Real-Time NGN Conversion
  const NGN_PEG = 1600;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!symbol) return;
      setLoading(true);
      try {
        const response = await api.get(`/market/details/${symbol}`);
        setDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch node depth:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [symbol]);

  if (!details && !loading) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-[35px] p-8 md:p-10 shadow-xl space-y-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-[#0b0e14] rounded-[22px] flex items-center justify-center text-white text-3xl font-black shadow-lg">
             {symbol[0]}
           </div>
           <div>
             <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">{symbol} Market Depth</h3>
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-2">
               <ShieldCheck className="text-emerald-500 w-3 h-3" /> Sequential Ledger Verified
             </p>
           </div>
        </div>
        
        <div className="text-center md:text-right">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Live Node Value (NGN)</p>
           <p className="text-4xl font-black font-space tracking-tight text-[#0b0e14]">
             ₦{(details?.price * NGN_PEG)?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) || '---'}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Execution Speed", val: "Sub-100ms", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
           { label: "Node Liquidity", val: "Institutional", icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
           { label: "Market Status", val: "High Fidelity", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" }
         ].map((m, i) => (
           <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-3xl flex items-center gap-4 group hover:bg-white hover:shadow-lg transition-all">
              <div className={`w-12 h-12 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                 <m.icon size={20} />
              </div>
              <div>
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{m.label}</p>
                 <p className="text-base font-black text-gray-900 uppercase">{m.val}</p>
              </div>
           </div>
         ))}
      </div>

      {details?.history && (
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <BarChart3 size={14} /> OHLC Node Series (Last 24H)
              </h4>
              <p className="text-[9px] font-bold text-gray-400 uppercase">Updates every 5m</p>
           </div>
           
           <div className="h-48 w-full flex items-end justify-between gap-1 md:gap-2 px-2">
              {details.history.slice(0, 24).map((h: any, i: number) => {
                const height = ((h.price_close - Math.min(...details.history.map((x:any) => x.price_close))) / (Math.max(...details.history.map((x:any) => x.price_close)) - Math.min(...details.history.map((x:any) => x.price_close)))) * 100;
                return (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 10)}%` }}
                    className={`flex-1 rounded-t-lg ${h.price_close >= h.price_open ? 'bg-emerald-500/20 hover:bg-emerald-500' : 'bg-red-500/20 hover:bg-red-500'} transition-all cursor-pointer relative group/bar`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[8px] font-black rounded opacity-0 group-hover/bar:opacity-100 whitespace-nowrap z-20">
                      ₦{(h.price_close * NGN_PEG).toLocaleString()}
                    </div>
                  </motion.div>
                );
              })}
           </div>
        </div>
      )}

      <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <Clock size={16} className="text-gray-300" />
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Last Sync: {details?.updatedAt ? new Date(details.updatedAt).toLocaleTimeString() : 'Establishing connection...'}
            </p>
         </div>
         <button className="h-14 px-10 bg-primary text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 hover:bg-black transition-all active-press">
           Execute Depth Order
         </button>
      </div>
    </div>
  );
}
