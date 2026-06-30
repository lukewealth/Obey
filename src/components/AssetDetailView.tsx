import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, TrendingUp, TrendingDown, BarChart3,
  DollarSign, Activity, Clock, Shield, Zap,
  AlertCircle, CheckCircle2, RefreshCw, Globe,
  ArrowUpRight, ArrowDownRight, Star, Eye
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { UserProfile } from "../types";
import api from "../services/api";

interface AssetDetailViewProps {
  asset: {
    asset_id?: string;
    symbol?: string;
    name: string;
    price_usd?: number;
    image?: string;
    price_change_24h?: number;
    market_cap?: number;
    coingeckoId?: string;
  };
  onClose: () => void;
  onTrade: (symbol: string, type: 'buy' | 'sell') => void;
  profile: UserProfile;
}

interface MarketData {
  currentPrice: number;
  priceChange24h: number;
  priceChange7d: number;
  priceChange30d: number;
  marketCap: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  ath: number;
  athChange: number;
  rank: number;
  circulatingSupply: number;
  totalSupply: number;
}

interface PricePoint {
  time: string;
  price: number;
  volume?: number;
}

const NGN_PEG = 1600;

export default function AssetDetailView({ asset, onClose, onTrade, profile }: AssetDetailViewProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'1D' | '7D' | '30D' | '1Y'>('7D');
  const [livePrice, setLivePrice] = useState(asset.price_usd || 0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const symbol = asset.asset_id || asset.symbol || '';
  const coingeckoId = asset.coingeckoId || symbol.toLowerCase();

  const coinIdMap: Record<string, string> = {
    BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', SUI: 'sui', USDC: 'usd-coin',
    BNB: 'binancecoin', XRP: 'ripple', ADA: 'cardano', DOGE: 'dogecoin',
  };
  const resolvedId = coingeckoId || coinIdMap[symbol] || symbol.toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coinRes, historyRes] = await Promise.allSettled([
          api.get(`/market/coingecko/coin/${resolvedId}`),
          api.get(`/market/coingecko/history/${resolvedId}?days=${chartPeriod === '1D' ? '1' : chartPeriod === '7D' ? '7' : chartPeriod === '30D' ? '30' : '365'}`),
        ]);

        if (coinRes.status === 'fulfilled') {
          const data = coinRes.value.data;
          setMarketData({
            currentPrice: data.market_data?.current_price?.usd || 0,
            priceChange24h: data.market_data?.price_change_percentage_24h || 0,
            priceChange7d: data.market_data?.price_change_percentage_7d || 0,
            priceChange30d: data.market_data?.price_change_percentage_30d || 0,
            marketCap: data.market_data?.market_cap?.usd || 0,
            volume24h: data.market_data?.total_volume?.usd || 0,
            high24h: data.market_data?.high_24h?.usd || 0,
            low24h: data.market_data?.low_24h?.usd || 0,
            ath: data.market_data?.ath?.usd || 0,
            athChange: data.market_data?.ath_change_percentage?.usd || 0,
            rank: data.market_cap_rank || 0,
            circulatingSupply: data.market_data?.circulating_supply || 0,
            totalSupply: data.market_data?.total_supply || 0,
          });
          setLivePrice(data.market_data?.current_price?.usd || asset.price_usd || 0);
        }

        if (historyRes.status === 'fulfilled') {
          const histData = historyRes.value.data;
          const prices = (histData.prices || []).map((p: number[]) => ({
            time: new Date(p[0]).toLocaleDateString('en-US', {
              month: chartPeriod === '1D' ? undefined : 'short',
              day: 'numeric',
              hour: chartPeriod === '1D' ? '2-digit' : undefined,
              minute: chartPeriod === '1D' ? '2-digit' : undefined,
            }),
            price: p[1],
          }));
          const volumes = histData.total_volumes || [];
          const combined = prices.map((p: PricePoint, i: number) => ({
            ...p,
            volume: volumes[i] ? volumes[i][1] : undefined,
          }));
          setPriceHistory(combined);
        }
      } catch (error) {
        console.error("Market data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedId, chartPeriod]);

  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      try {
        const res = await api.get(`/market/coingecko/coin/${resolvedId}`);
        const data = res.data;
        if (data.market_data?.current_price?.usd) {
          setLivePrice(data.market_data.current_price.usd);
          setLastUpdate(new Date());
        }
      } catch {}
    }, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resolvedId]);

  const formatPrice = (price: number) => {
    if (price >= 1000) return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  const formatNGN = (usd: number) => `₦${(usd * NGN_PEG).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  const formatLargeNumber = (n: number) => {
    if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
    if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
    if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
    return `$${n.toFixed(2)}`;
  };

  const priceChange = marketData?.priceChange24h || asset.price_change_24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#fcfcfd] dark:bg-[#0b0e14] overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-32">
        <div className="flex items-center justify-between mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center transition-colors hover:bg-gray-200 dark:hover:bg-white/20"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20"
            >
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            {asset.image && (
              <img src={asset.image} alt={asset.name} className="w-14 h-14 rounded-2xl object-contain bg-gray-50 dark:bg-white/5 p-1 border border-gray-100 dark:border-white/10" />
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">{asset.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{symbol}</span>
                {marketData?.rank && (
                  <span className="text-[10px] font-black text-gray-300 dark:text-gray-500 uppercase tracking-widest">Rank #{marketData.rank}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white font-mono tracking-tight">
              {formatPrice(livePrice)}
            </span>
            <span className={`text-sm font-black px-3 py-1 rounded-full flex items-center gap-1 ${
              isPositive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400'
            }`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
            {formatNGN(livePrice)} NGN
          </p>
          <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1 flex items-center gap-1">
            <Clock size={10} /> Updated {lastUpdate.toLocaleTimeString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Price Chart</h3>
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
              {(['1D', '7D', '30D', '1Y'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setChartPeriod(period)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    chartPeriod === period
                      ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <RefreshCw size={24} className="text-gray-300 animate-spin" />
              </div>
            ) : priceHistory.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceHistory}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                    <XAxis
                      dataKey="time"
                      stroke="rgba(0,0,0,0.2)"
                      tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      stroke="rgba(0,0,0,0.2)"
                      tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      domain={['auto', 'auto']}
                      tickFormatter={(v) => formatPrice(v)}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        padding: '12px 16px',
                      }}
                      formatter={(value: number) => [formatPrice(value), 'Price']}
                      labelStyle={{ color: '#666', fontSize: 11, marginBottom: 4 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke={isPositive ? '#10b981' : '#ef4444'}
                      strokeWidth={2.5}
                      fill="url(#priceGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <p className="text-sm text-gray-400">Chart data unavailable</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Market Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Market Cap', value: marketData ? formatLargeNumber(marketData.marketCap) : '---', icon: DollarSign },
              { label: '24h Volume', value: marketData ? formatLargeNumber(marketData.volume24h) : '---', icon: Activity },
              { label: '24h High', value: marketData ? formatPrice(marketData.high24h) : '---', icon: TrendingUp },
              { label: '24h Low', value: marketData ? formatPrice(marketData.low24h) : '---', icon: TrendingDown },
              { label: '7d Change', value: marketData ? `${marketData.priceChange7d >= 0 ? '+' : ''}${marketData.priceChange7d.toFixed(2)}%` : '---', icon: BarChart3, color: marketData && marketData.priceChange7d >= 0 ? 'text-emerald-600' : 'text-red-500' },
              { label: '30d Change', value: marketData ? `${marketData.priceChange30d >= 0 ? '+' : ''}${marketData.priceChange30d.toFixed(2)}%` : '---', icon: BarChart3, color: marketData && marketData.priceChange30d >= 0 ? 'text-emerald-600' : 'text-red-500' },
              { label: 'All-Time High', value: marketData ? formatPrice(marketData.ath) : '---', icon: Star },
              { label: 'ATH Change', value: marketData ? `${marketData.athChange.toFixed(1)}%` : '---', icon: ArrowDownRight, color: 'text-red-500' },
              { label: 'Circulating', value: marketData?.circulatingSupply ? `${(marketData.circulatingSupply / 1e6).toFixed(1)}M` : '---', icon: Globe },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <stat.icon size={12} className="text-gray-300 dark:text-gray-500" />
                  <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</p>
                </div>
                <p className={`text-base font-black font-mono ${stat.color || 'text-gray-900 dark:text-white'}`}>{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {priceHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Volume</h3>
            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10">
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priceHistory.filter(p => p.volume)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                    <XAxis dataKey="time" stroke="rgba(0,0,0,0.2)" tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis stroke="rgba(0,0,0,0.2)" tick={{ fill: 'rgba(0,0,0,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatLargeNumber(v)} width={60} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}
                      formatter={(value: number) => [formatLargeNumber(value), 'Volume']}
                    />
                    <Bar dataKey="volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={20} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#0b0e14]/95 backdrop-blur-2xl border-t border-gray-100 dark:border-white/10 p-4 z-50">
        <div className="max-w-4xl mx-auto flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTrade(symbol, 'buy')}
            className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ArrowUpRight size={18} /> Buy {symbol}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTrade(symbol, 'sell')}
            className="flex-1 h-14 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
          >
            <ArrowDownRight size={18} /> Sell {symbol}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
