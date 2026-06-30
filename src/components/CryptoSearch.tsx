import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, Loader2, TrendingUp, TrendingDown, Star, Zap, Clock, Flame, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

interface CryptoAsset {
  asset_id: string;
  name: string;
  price_usd: number;
  volume_1day_usd: number;
  image?: string;
  price_change_24h?: number;
  market_cap?: number;
  coingeckoId?: string;
}

interface CryptoSearchProps {
  onSelect: (asset: CryptoAsset) => void;
  placeholder?: string;
}

const TRENDING_ASSETS: CryptoAsset[] = [
  { asset_id: "BTC", name: "Bitcoin", price_usd: 67000, volume_1day_usd: 28000000000, price_change_24h: 2.4, market_cap: 1320000000000, coingeckoId: "bitcoin" },
  { asset_id: "ETH", name: "Ethereum", price_usd: 3500, volume_1day_usd: 15000000000, price_change_24h: -1.2, market_cap: 420000000000, coingeckoId: "ethereum" },
  { asset_id: "SOL", name: "Solana", price_usd: 145, volume_1day_usd: 3200000000, price_change_24h: 5.8, market_cap: 64000000000, coingeckoId: "solana" },
  { asset_id: "SUI", name: "Sui", price_usd: 1.8, volume_1day_usd: 890000000, price_change_24h: 12.5, market_cap: 5200000000, coingeckoId: "sui" },
  { asset_id: "USDC", name: "USD Coin", price_usd: 1.0, volume_1day_usd: 5600000000, price_change_24h: 0.01, market_cap: 32000000000, coingeckoId: "usd-coin" },
  { asset_id: "BNB", name: "BNB", price_usd: 580, volume_1day_usd: 1800000000, price_change_24h: 1.1, market_cap: 89000000000, coingeckoId: "binancecoin" },
  { asset_id: "XRP", name: "XRP", price_usd: 0.52, volume_1day_usd: 1200000000, price_change_24h: -0.8, market_cap: 28000000000, coingeckoId: "ripple" },
  { asset_id: "ADA", name: "Cardano", price_usd: 0.45, volume_1day_usd: 450000000, price_change_24h: 3.2, market_cap: 16000000000, coingeckoId: "cardano" },
];

const RECENT_SEARCHES_KEY = "obey_recent_crypto_searches";

function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query: string) {
  try {
    const recent = getRecentSearches().filter(s => s !== query);
    recent.unshift(query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, 8)));
  } catch {}
}

function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function CryptoSearch({ onSelect, placeholder = "Search crypto assets (BTC, ETH, SOL...)" }: CryptoSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CryptoAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"trending" | "results" | "recent">("trending");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const searchLocalAssets = useCallback((q: string): CryptoAsset[] => {
    const upper = q.toUpperCase();
    return TRENDING_ASSETS.filter(a =>
      a.asset_id.includes(upper) ||
      fuzzyMatch(a.name, q) ||
      fuzzyMatch(a.asset_id, q)
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length < 1) {
        setResults([]);
        setMode("trending");
        setIsOpen(false);
        return;
      }

      setIsOpen(true);
      setLoading(true);

      const localResults = searchLocalAssets(query);
      if (localResults.length >= 3) {
        setResults(localResults);
        setMode("results");
        setLoading(false);
      }

      try {
        const response = await api.get(
          `/market/coingecko/search?query=${encodeURIComponent(query)}`
        );
        const data = response.data;
        const coins = (data.coins || []).slice(0, 12);

        const detailed = await Promise.all(
          coins.map(async (coin: any) => {
            const existing = localResults.find(r => r.coingeckoId === coin.id || r.asset_id === coin.symbol?.toUpperCase());
            if (existing) return existing;
            try {
              const detailRes = await api.get(`/market/coingecko/coin/${coin.id}`);
              const detail = detailRes.data;
              return {
                asset_id: coin.symbol.toUpperCase(),
                name: coin.name,
                price_usd: detail.market_data?.current_price?.usd || 0,
                volume_1day_usd: detail.market_data?.total_volume?.usd || 0,
                image: detail.image?.small || coin.thumb,
                price_change_24h: detail.market_data?.price_change_percentage_24h || 0,
                market_cap: detail.market_data?.market_cap?.usd || 0,
                coingeckoId: coin.id,
              };
            } catch {
              return {
                asset_id: coin.symbol.toUpperCase(),
                name: coin.name,
                price_usd: 0,
                volume_1day_usd: 0,
                image: coin.thumb,
                price_change_24h: 0,
                market_cap: 0,
                coingeckoId: coin.id,
              };
            }
          })
        );

        const merged = [...localResults];
        for (const d of detailed) {
          if (!merged.find(m => m.asset_id === d.asset_id)) {
            merged.push(d);
          }
        }

        setResults(merged.slice(0, 15));
        setMode("results");
      } catch (error) {
        console.error("Search error:", error);
        if (localResults.length > 0) {
          setResults(localResults);
          setMode("results");
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchLocalAssets]);

  const handleSelect = (asset: CryptoAsset) => {
    saveRecentSearch(asset.asset_id);
    onSelect(asset);
    setIsOpen(false);
    setQuery("");
  };

  const clearRecent = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setMode("trending");
  };

  const recentSearches = getRecentSearches();

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
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.length < 1) {
              setMode(recentSearches.length > 0 ? "recent" : "trending");
              setIsOpen(true);
            }
          }}
          className="w-full h-16 pl-16 pr-12 bg-white border border-gray-100 rounded-[22px] text-lg font-black placeholder:text-gray-300 placeholder:font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/20 outline-none transition-all shadow-sm"
          placeholder={placeholder}
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setMode("trending"); inputRef.current?.focus(); }}
            className="absolute inset-y-0 right-4 flex items-center text-gray-300 hover:text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-100 rounded-[32px] shadow-2xl z-[100] max-h-[520px] overflow-y-auto overflow-x-hidden p-3 custom-scrollbar"
          >
            {mode === "trending" && (
              <>
                <div className="px-5 py-3 mb-2 border-b border-gray-50 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
                    <Flame size={10} className="text-orange-500" /> Trending Assets
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
                  </div>
                </div>
                {TRENDING_ASSETS.map((asset, index) => (
                  <TrendingRow key={asset.asset_id} asset={asset} index={index} onSelect={handleSelect} NGN_PEG={NGN_PEG} />
                ))}
              </>
            )}

            {mode === "recent" && !query && (
              <>
                <div className="px-5 py-3 mb-2 border-b border-gray-50 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5">
                    <Clock size={10} /> Recent Searches
                  </p>
                  <button onClick={clearRecent} className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-red-400 transition-colors">
                    Clear
                  </button>
                </div>
                {recentSearches.map((s, i) => {
                  const asset = TRENDING_ASSETS.find(a => a.asset_id === s);
                  if (!asset) return null;
                  return (
                    <TrendingRow key={s} asset={asset} index={i} onSelect={handleSelect} NGN_PEG={NGN_PEG} />
                  );
                })}
                <div className="px-5 py-3 mt-2 border-t border-gray-50">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-1.5 mb-2">
                    <Flame size={10} className="text-orange-500" /> Trending
                  </p>
                </div>
                {TRENDING_ASSETS.slice(0, 4).map((asset, index) => (
                  <TrendingRow key={asset.asset_id} asset={asset} index={index} onSelect={handleSelect} NGN_PEG={NGN_PEG} />
                ))}
              </>
            )}

            {mode === "results" && results.length > 0 && (
              <>
                <div className="px-5 py-3 mb-2 border-b border-gray-50 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Results: {results.length}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Real-Time</span>
                  </div>
                </div>
                {results.map((asset, index) => {
                  const isPositive = (asset.price_change_24h || 0) >= 0;
                  return (
                    <motion.button
                      key={asset.asset_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSelect(asset)}
                      className="w-full p-5 flex items-center justify-between rounded-[20px] hover:bg-primary/5 group transition-all text-left mb-1"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-[14px] flex items-center justify-center group-hover:bg-white transition-all border border-gray-100 shadow-sm overflow-hidden">
                          {asset.image ? (
                            <img
                              src={asset.image}
                              alt={asset.name}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                (e.target as any).src = "https://api.dicebear.com/7.x/identicon/svg?seed=" + asset.asset_id;
                              }}
                            />
                          ) : (
                            <span className="font-black text-gray-400 text-sm">{asset.asset_id[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-base font-black text-gray-900 leading-none">{asset.name}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{asset.asset_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-black text-[#0b0e14] font-mono leading-none">
                          {asset.price_usd >= 1
                            ? `₦${(asset.price_usd * NGN_PEG).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                            : `$${asset.price_usd.toFixed(4)}`
                          }
                        </p>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-1.5 flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {isPositive ? '+' : ''}{(asset.price_change_24h || 0).toFixed(2)}%
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </>
            )}

            {mode === "results" && results.length === 0 && !loading && (
              <div className="py-12 text-center">
                <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No assets found</p>
                <p className="text-xs text-gray-400 mt-2">Try a different search term</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TrendingRow({ asset, index, onSelect, NGN_PEG }: { asset: CryptoAsset; index: number; onSelect: (a: CryptoAsset) => void; NGN_PEG: number }) {
  const isPositive = (asset.price_change_24h || 0) >= 0;
  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onSelect(asset)}
      className="w-full p-5 flex items-center justify-between rounded-[20px] hover:bg-primary/5 group transition-all text-left mb-1"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-[14px] flex items-center justify-center group-hover:bg-white transition-all border border-gray-100 shadow-sm overflow-hidden">
          {asset.image ? (
            <img src={asset.image} alt={asset.name} className="w-8 h-8 object-contain" />
          ) : (
            <span className="font-black text-gray-400 text-sm">{asset.asset_id[0]}</span>
          )}
        </div>
        <div>
          <p className="text-base font-black text-gray-900 leading-none">{asset.name}</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{asset.asset_id}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-base font-black text-[#0b0e14] font-mono leading-none">
          {asset.price_usd >= 1
            ? `₦${(asset.price_usd * NGN_PEG).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
            : `$${asset.price_usd.toFixed(4)}`
          }
        </p>
        <p className={`text-[9px] font-black uppercase tracking-widest mt-1.5 flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {isPositive ? '+' : ''}{(asset.price_change_24h || 0).toFixed(2)}%
        </p>
      </div>
    </motion.button>
  );
}
