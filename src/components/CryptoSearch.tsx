import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, TrendingUp, TrendingDown, Star, Zap, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

interface CryptoAsset {
  asset_id: string;
  name: string;
  price_usd: number;
  volume_1day_usd: number;
}

interface CryptoSearchProps {
  onSelect: (asset: CryptoAsset) => void;
  placeholder?: string;
}

export default function CryptoSearch({ onSelect, placeholder = "Search global depth nodes (BTC, ETH, SOL...)" }: CryptoSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Institutional Peg for Real-Time NGN Conversion
  const NGN_PEG = 1600;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get(`/market/search?q=${query}`);
        setResults(response.data);
        setIsOpen(true);
      } catch (error) {
        console.error("Search node error:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const getOfficialSymbol = (assetId: string) => {
    // Official crypto icons mesh
    return `https://cryptoicons.org/api/icon/${assetId.toLowerCase()}/64`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="w-full h-16 pl-16 pr-6 bg-white border border-gray-100 rounded-[22px] text-lg font-black placeholder:text-gray-300 placeholder:font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all shadow-sm"
          placeholder={placeholder}
        />
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-100 rounded-[32px] shadow-2xl z-[100] max-h-[480px] overflow-y-auto overflow-x-hidden p-3 custom-scrollbar"
          >
            <div className="px-5 py-3 mb-2 border-b border-gray-50">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Node Depth: {results.length}</p>
            </div>
            {results.map((asset, index) => (
              <motion.button
                key={asset.asset_id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => {
                  onSelect(asset);
                  setIsOpen(false);
                  setQuery("");
                }}
                className="w-full p-5 flex items-center justify-between rounded-[20px] hover:bg-primary/5 group transition-all text-left mb-1"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-[14px] flex items-center justify-center font-black text-gray-400 group-hover:bg-white group-hover:text-primary transition-all border border-gray-100 shadow-sm overflow-hidden">
                    <img 
                      src={getOfficialSymbol(asset.asset_id)} 
                      alt="" 
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as any).src = "https://api.dicebear.com/7.x/identicon/svg?seed=" + asset.asset_id;
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-base font-black text-gray-900 leading-none">{asset.name}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{asset.asset_id} • Depth Secured</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-[#0b0e14] font-mono leading-none">₦{(asset.price_usd * NGN_PEG).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1.5 flex items-center justify-end gap-1">
                    <TrendingUp size={10} /> Live Node
                  </p>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
