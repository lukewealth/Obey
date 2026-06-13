import React, { useState, useEffect } from "react";
import { UserProfile, CryptoAsset } from "../types";
import { 
  ArrowUpRight, ArrowDownLeft, Check, RefreshCw, DollarSign, 
  TrendingUp, TrendingDown, Coins, HelpCircle, ShieldAlert, Award
} from "lucide-react";

interface CryptoSystemProps {
  profile: UserProfile;
  btcPrice: number;
  ethPrice: number;
  onTradeCompleted: (amount: number, details: string, isSell: boolean) => void;
}

export default function CryptoSystem({ profile, btcPrice, ethPrice, onTradeCompleted }: CryptoSystemProps) {
  const [assets, setAssets] = useState<CryptoAsset[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: btcPrice, prevPrice: btcPrice, priceChangePercent: 2.45, logo: '₿', balance: 0.045, history: [62000, 62150, 62400, 62300, 63100, 64231] },
    { symbol: 'ETH', name: 'Ethereum', price: ethPrice, prevPrice: ethPrice, priceChangePercent: 1.82, logo: 'E', balance: 0.85, history: [3380, 3400, 3390, 3420, 3460, 3452] },
    { symbol: 'SOL', name: 'Solana', price: 145.67, prevPrice: 145.67, priceChangePercent: -0.42, logo: 'S', balance: 12.4, history: [148, 147, 146.5, 146, 145.2, 145.67] },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, prevPrice: 1.00, priceChangePercent: 0.00, logo: '$', balance: 250.00, history: [1, 1, 1, 1, 1, 1] }
  ]);

  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [fiatValue, setFiatValue] = useState("");
  const [processing, setProcessing] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<any | null>(null);

  const activeAsset = assets.find(a => a.symbol === selectedSymbol) || assets[0];

  // Dynamic real-time Price Tick Simulation every 3 seconds (Fintech fidelity)
  useEffect(() => {
    const timer = setInterval(() => {
      setAssets(prevAssets => 
        prevAssets.map(asset => {
          if (asset.symbol === 'USDC') return asset;
          
          // Random premium noise between -0.15% and +0.15%
          const pct = (Math.random() * 0.3 - 0.15) / 100;
          const nextPrice = asset.price * (1 + pct);
          const newHistory = [...asset.history.slice(1), nextPrice];
          const diffPct = ((nextPrice - asset.history[0]) / asset.history[0]) * 100;

          return {
            ...asset,
            prevPrice: asset.price,
            price: nextPrice,
            priceChangePercent: parseFloat(diffPct.toFixed(2)),
            history: newHistory
          };
        })
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Update selection if Parent external tickers change values
  useEffect(() => {
    setAssets(prev => prev.map(a => {
      if (a.symbol === 'BTC') return { ...a, price: btcPrice };
      if (a.symbol === 'ETH') return { ...a, price: ethPrice };
      return a;
    }));
  }, [btcPrice, ethPrice]);

  const executeTrade = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(fiatValue);
    if (!val || val <= 0) return;

    if (tradeType === "buy" && val > profile.balance) {
      alert("Insufficient fiat capital reserves.");
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const isSell = tradeType === "sell";
      const cryptoQty = val / activeAsset.price;
      
      onTradeCompleted(val, `${isSell ? 'Sold' : 'Bought'} ${cryptoQty.toFixed(5)} ${activeAsset.symbol}`, isSell);

      // Create local trade ticket
      setOrderReceipt({
        type: tradeType,
        symbol: activeAsset.symbol,
        fiatAmount: val,
        cryptoAmount: cryptoQty,
        executionPrice: activeAsset.price,
        date: new Date().toLocaleTimeString()
      });

      setFiatValue("");
    }, 1500);
  };

  // Build responsive SVG Sparkline values from numbers array
  const generateSparklineSvg = (history: number[]) => {
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;
    const width = 140;
    const height = 40;
    
    const points = history.map((val, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    }).join(" ");

    return points;
  };

  return (
    <div className="space-y-8">
      {orderReceipt ? (
        /* Trade Complete Invoice Screen */
        <div className="max-w-xl mx-auto bg-[#161F30] border border-[#242F41] rounded-[20px] p-8 space-y-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500"></div>
          
          <div className="w-16 h-16 bg-[#12B76A]/10 border border-[#12B76A]/20 rounded-full flex items-center justify-center text-emerald-400 mb-2 animate-bounce">
            <Check size={32} />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-[#12B76A] uppercase tracking-widest font-black">Trade Executed Safely</p>
            <h2 className="text-3xl font-mono text-white font-bold">
              {orderReceipt.type === "buy" ? "+" : "-"}{orderReceipt.cryptoAmount.toFixed(5)} {orderReceipt.symbol}
            </h2>
            <p className="text-xs text-slate-400 font-light mt-1">
              Authorized Settlement: ${orderReceipt.fiatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
            </p>
          </div>

          <div className="w-full space-y-4 bg-[#0B1220] border border-[#242F41] p-5 rounded-2xl text-left text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Order Routing Mode</span>
              <span className="text-white font-bold uppercase text-[10px]">OBEY LIQUID SYSTEM</span>
            </div>
            <div className="border-t border-[#242F41]"></div>
            <div className="flex justify-between">
              <span className="text-slate-400">Execution rate</span>
              <span className="font-mono text-white font-bold">${orderReceipt.executionPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="border-t border-[#242F41]"></div>
            <div className="flex justify-between">
              <span className="text-slate-400">Settler fee</span>
              <span className="bg-emerald-500/10 text-[#12B76A] px-2 py-0.5 rounded text-[9px] font-black uppercase">Free</span>
            </div>
            <div className="border-t border-[#242F41]"></div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Clearing Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 bg-[#12B76A] rounded-full animate-ping"></span>
                Settled in Full
              </span>
            </div>
          </div>

          <button onClick={() => setOrderReceipt(null)} className="w-full bg-[#0057FF] hover:bg-blue-600 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white active-press mt-2">
            Done
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Crypto Ledger Asset List */}
          <div className="lg:col-span-8 bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242F41] pb-4">
              <div>
                <h3 className="text-lg font-black text-white">Digital Treasury Indexes</h3>
                <p className="text-xs text-slate-400 font-light mt-0.5">Trade liquid digital currencies instantly back to fiat wallet cash.</p>
              </div>
            </div>

            <div className="space-y-3">
              {assets.map((asset) => {
                const isPositive = asset.priceChangePercent >= 0;
                const isSelected = asset.symbol === selectedSymbol;

                return (
                  <div
                    key={asset.symbol}
                    onClick={() => setSelectedSymbol(asset.symbol)}
                    className={`p-4 sm:p-5 bg-[#0B1220] rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-[#0057FF] bg-[#0057FF]/5"
                        : "border-[#242F41] hover:border-[#0057FF]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Logo visual badge */}
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#242F41] flex items-center justify-center font-bold text-gray-300">
                        {asset.logo}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{asset.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{asset.symbol} • Balance: {asset.balance}</p>
                      </div>
                    </div>

                    {/* SVG sparkline graph preview */}
                    <div className="hidden sm:block shrink-0 px-4">
                      <svg width="140" height="40">
                        <polyline
                          fill="none"
                          stroke={isPositive ? "#12B76A" : "#F04438"}
                          strokeWidth="2"
                          points={generateSparklineSvg(asset.history)}
                        />
                      </svg>
                    </div>

                    {/* Math Rates indicators */}
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold text-white">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <span className={`inline-flex items-center gap-0.5 text-xs font-bold leading-none mt-1 ${
                        isPositive ? "text-emerald-500" : "text-red-500"
                      }`}>
                        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {isPositive ? "+" : ""}{asset.priceChangePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Trade Terminal panel block */}
          <div className="lg:col-span-4 bg-[#161F30] border border-[#242F41] hover:border-[#0057FF] transition-all duration-200 rounded-[20px] p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0057FF]/5 rounded-full blur-[40px] pointer-events-none"></div>
            
            <h3 className="text-xs uppercase font-extrabold text-slate-400 tracking-widest">Trading Terminal</h3>

            <div className="grid grid-cols-2 p-1 bg-[#0B1220] border border-[#242F41] rounded-xl font-bold">
              <button
                type="button"
                onClick={() => setTradeType("buy")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  tradeType === "buy" ? "bg-[#0057FF] text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}
              >
                Buy {activeAsset.symbol}
              </button>
              <button
                type="button"
                onClick={() => setTradeType("sell")}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  tradeType === "sell" ? "bg-red-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
                }`}
              >
                Sell {activeAsset.symbol}
              </button>
            </div>

            <form onSubmit={executeTrade} className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">Enter Capital Value ($)</span>
                  <span className="text-slate-400 font-mono">Reserves: ${profile.balance.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <DollarSign size={16} />
                  </span>
                  <input
                    type="number"
                    required
                    value={fiatValue}
                    onChange={(e) => setFiatValue(e.target.value)}
                    placeholder="e.g. 500"
                    className="block w-full h-12 pl-10 pr-4 bg-[#0B1220] border border-[#242F41] focus:border-[#0057FF] focus:ring-1 focus:ring-[#0057FF] rounded-xl text-sm font-semibold outline-none text-white font-mono"
                  />
                </div>
              </div>

              {/* Fractional conversion estimates */}
              {fiatValue && (
                <div className="p-3.5 bg-[#0B1220] border border-[#242F41] rounded-xl space-y-2 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Est. Yield Outcome</span>
                    <span className="text-white font-mono font-bold">
                      {(parseFloat(fiatValue) / activeAsset.price).toFixed(6)} {activeAsset.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Broker Rates Slip</span>
                    <span className="bg-emerald-500/10 text-[#12B76A] px-1.5 py-0.5 rounded text-[9px] font-black uppercase">Zero Surcharge</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={processing || !fiatValue}
                className={`w-full h-14 active-press text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center pt-0.5 shadow-lg ${
                  tradeType === "buy" ? "bg-[#0057FF] hover:bg-blue-600 shadow-blue-500/15" : "bg-red-500 hover:bg-red-600 shadow-red-500/15"
                } disabled:opacity-50`}
              >
                {processing ? <RefreshCw className="animate-spin mr-2" size={14} /> : `Authorize ${tradeType.toUpperCase()} Request`}
              </button>
            </form>

            <div className="border-t border-[#242F41] pt-4 flex gap-3 items-start text-[10px] text-slate-400 font-light leading-relaxed">
              <ShieldAlert className="text-[#00C6FF] shrink-0" size={14} />
              <p>
                Trades settle instantly back onto your primary account ledger. Liquidity rates are backed directly by institutional standard liquidity aggregates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
