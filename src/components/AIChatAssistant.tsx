import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import {
  Brain, Send, X, Sparkles, Loader2, Zap, TrendingUp, TrendingDown,
  AlertTriangle, ArrowUpRight, Copy, Check, DollarSign, PieChart,
  BarChart3, Activity, Shield, Lightbulb, Target, Clock, CheckCircle2,
  AlertCircle, Coins
} from 'lucide-react';
import api from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    riskLevel?: string;
    suggestions?: string[];
    insightCards?: InsightCard[];
    marketData?: MarketCardData;
  };
}

interface InsightCard {
  type: 'spending' | 'savings' | 'investment' | 'alert' | 'opportunity';
  title: string;
  description: string;
  value?: string;
  change?: number;
  color: string;
  icon: string;
}

interface MarketCardData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap?: string;
  volume24h?: string;
  image?: string;
}

interface AIChatAssistantProps {
  userId: string;
  balance: number;
  transactions: any[];
  isOpen: boolean;
  onClose: () => void;
  prices?: { BTC: number; ETH: number; SOL: number; SUI: number };
}

const NGN_PEG = 1600;

const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center gap-2 px-4 py-3"
  >
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      ))}
    </div>
    <span className="text-xs text-gray-400 ml-2">Analyzing data...</span>
  </motion.div>
);

const InsightCardComponent = ({ card }: { card: InsightCard }) => {
  const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', iconBg: 'bg-emerald-500/20' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', iconBg: 'bg-amber-500/20' },
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', iconBg: 'bg-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', iconBg: 'bg-purple-500/20' },
    red: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', iconBg: 'bg-red-500/20' },
  };
  const c = colorMap[card.color] || colorMap.blue;

  return (
    <div className={`rounded-xl p-3 ${c.bg} border ${c.border}`}>
      <div className="flex items-start gap-2.5">
        <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
          {card.icon === 'trending' && <TrendingUp size={14} className={c.text} />}
          {card.icon === 'alert' && <AlertCircle size={14} className={c.text} />}
          {card.icon === 'check' && <CheckCircle2 size={14} className={c.text} />}
          {card.icon === 'lightbulb' && <Lightbulb size={14} className={c.text} />}
          {card.icon === 'target' && <Target size={14} className={c.text} />}
          {card.icon === 'dollar' && <DollarSign size={14} className={c.text} />}
          {card.icon === 'shield' && <Shield size={14} className={c.text} />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white mb-0.5">{card.title}</p>
          <p className="text-[11px] text-gray-400 leading-relaxed">{card.description}</p>
          {card.value && (
            <p className={`text-sm font-black font-mono mt-1 ${c.text}`}>{card.value}</p>
          )}
          {card.change !== undefined && (
            <p className={`text-[10px] font-black mt-0.5 ${card.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {card.change >= 0 ? '+' : ''}{card.change.toFixed(2)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const MarketCardComponent = ({ data }: { data: MarketCardData }) => {
  const isPositive = data.change24h >= 0;
  return (
    <div className="rounded-xl p-3 bg-white/5 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
            <Coins size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{data.name}</p>
            <p className="text-[10px] text-gray-500 font-medium">{data.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-white font-mono">${data.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
          <p className={`text-[10px] font-black ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{data.change24h.toFixed(2)}%
          </p>
        </div>
      </div>
      {(data.marketCap || data.volume24h) && (
        <div className="flex gap-4 mt-2 pt-2 border-t border-white/5">
          {data.marketCap && <p className="text-[9px] text-gray-500">MCap: <span className="text-gray-400 font-bold">{data.marketCap}</span></p>}
          {data.volume24h && <p className="text-[9px] text-gray-500">Vol: <span className="text-gray-400 font-bold">{data.volume24h}</span></p>}
        </div>
      )}
    </div>
  );
};

const MessageBubble = ({ message }: { message: Message; isLast: boolean }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5 ml-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
              <Brain size={10} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-400">AI Assistant</span>
          </div>
        )}

        <div className={`relative rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-br-md'
            : 'bg-white/5 border border-white/10 text-gray-100 rounded-bl-md'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

          {!isUser && (
            <motion.button
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              onClick={handleCopy}
              className="absolute -bottom-8 right-0 p-1.5 rounded-lg bg-white/5 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-gray-400" />}
            </motion.button>
          )}
        </div>

        {message.metadata?.insightCards && message.metadata.insightCards.length > 0 && (
          <div className="mt-3 space-y-2 ml-1">
            {message.metadata.insightCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <InsightCardComponent card={card} />
              </motion.div>
            ))}
          </div>
        )}

        {message.metadata?.marketData && (
          <div className="mt-3 ml-1">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MarketCardComponent data={message.metadata.marketData} />
            </motion.div>
          </div>
        )}

        {message.metadata && !isUser && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.2 }}
            className="mt-2 ml-1 space-y-2"
          >
            {message.metadata.confidence && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${message.metadata.confidence * 100}%` }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                  />
                </div>
                <span>{(message.metadata.confidence * 100).toFixed(0)}% confidence</span>
              </div>
            )}

            {message.metadata.riskLevel && (
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                message.metadata.riskLevel === 'Low' || message.metadata.riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-400' :
                message.metadata.riskLevel === 'Medium' || message.metadata.riskLevel === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  message.metadata.riskLevel === 'Low' || message.metadata.riskLevel === 'LOW' ? 'bg-emerald-400' :
                  message.metadata.riskLevel === 'Medium' || message.metadata.riskLevel === 'MEDIUM' ? 'bg-amber-400' :
                  'bg-red-400'
                }`} />
                Risk: {message.metadata.riskLevel}
              </div>
            )}

            {message.metadata.suggestions && message.metadata.suggestions.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-gray-400 font-medium">Suggestions:</p>
                {message.metadata.suggestions.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2 text-xs text-gray-300 pl-2"
                  >
                    <ArrowUpRight size={10} className="text-primary shrink-0" />
                    <span>{s}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <p className={`text-[10px] text-gray-500 mt-1 ${isUser ? 'text-right mr-1' : 'ml-1'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
};

const QuickAction = ({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -1 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/10 hover:border-primary/30 hover:text-white transition-all duration-200 whitespace-nowrap"
  >
    <Icon size={14} className="text-primary" />
    <span className="truncate">{label}</span>
  </motion.button>
);

function analyzeSpendingPattern(txs: any[]) {
  const last30Days = txs.filter(tx => {
    const txDate = new Date(tx.createdAt || tx.date);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return txDate >= thirtyDaysAgo;
  });
  const totalSpent = last30Days.filter(tx => tx.type === 'Debit').reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = last30Days.filter(tx => tx.type === 'Credit').reduce((sum, tx) => sum + tx.amount, 0);
  const avgDaily = totalSpent / 30;
  const byCategory: Record<string, number> = {};
  last30Days.filter(tx => tx.type === 'Debit').forEach(tx => {
    const cat = tx.category || 'Other';
    byCategory[cat] = (byCategory[cat] || 0) + tx.amount;
  });
  return { totalSpent, totalIncome, avgDaily, transactionCount: last30Days.length, byCategory };
}

function generateInsightsFromData(balance: number, transactions: any[], prices?: { BTC: number; ETH: number; SOL: number; SUI: number }): InsightCard[] {
  const cards: InsightCard[] = [];
  const spending = analyzeSpendingPattern(transactions);

  if (spending.totalIncome > 0) {
    const savingsRate = ((spending.totalIncome - spending.totalSpent) / spending.totalIncome * 100);
    if (savingsRate > 20) {
      cards.push({
        type: 'savings', title: 'Excellent Savings Rate',
        description: `You're saving ${savingsRate.toFixed(0)}% of your income. Above the recommended 20%.`,
        value: `${savingsRate.toFixed(0)}%`, color: 'emerald', icon: 'check'
      });
    } else if (savingsRate > 0) {
      cards.push({
        type: 'savings', title: 'Savings Opportunity',
        description: `Current savings rate is ${savingsRate.toFixed(0)}%. Try to reach 20% for optimal financial health.`,
        value: `${savingsRate.toFixed(0)}%`, color: 'amber', icon: 'lightbulb'
      });
    } else {
      cards.push({
        type: 'alert', title: 'Spending Exceeds Income',
        description: 'Your spending is higher than your income. Review your budget immediately.',
        color: 'red', icon: 'alert'
      });
    }
  }

  const topCategory = Object.entries(spending.byCategory).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    cards.push({
      type: 'spending', title: `Top Category: ${topCategory[0]}`,
      description: `₦${topCategory[1].toLocaleString()} spent on ${topCategory[0]}. ${spending.totalSpent > 0 ? `${((topCategory[1] / spending.totalSpent) * 100).toFixed(0)}% of total spending.` : ''}`,
      value: `₦${topCategory[1].toLocaleString()}`, color: 'blue', icon: 'dollar'
    });
  }

  if (balance > 100000) {
    cards.push({
      type: 'opportunity', title: 'Investment Opportunity',
      description: `You have ₦${balance.toLocaleString()} available. Consider diversifying into crypto assets for potential growth.`,
      value: `₦${balance.toLocaleString()}`, color: 'purple', icon: 'target'
    });
  }

  if (spending.avgDaily > 0) {
    const daysUntilDepletion = Math.floor(balance / spending.avgDaily);
    if (daysUntilDepletion < 30) {
      cards.push({
        type: 'alert', title: 'Balance Alert',
        description: `At current spending rate, your balance will last approximately ${daysUntilDepletion} days.`,
        value: `${daysUntilDepletion} days`, color: 'red', icon: 'alert'
      });
    }
  }

  return cards.slice(0, 4);
}

async function fetchAssetMarketData(symbol: string): Promise<MarketCardData | null> {
  try {
    const coinIdMap: Record<string, string> = {
      BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', SUI: 'sui', USDC: 'usd-coin',
      BNB: 'binancecoin', XRP: 'ripple', ADA: 'cardano', DOGE: 'dogecoin',
    };
    const coinId = coinIdMap[symbol.toUpperCase()] || symbol.toLowerCase();
    const res = await fetch(`/api/market/coingecko/coin/${coinId}`);
    const data = await res.json();
    return {
      symbol: data.symbol?.toUpperCase() || symbol.toUpperCase(),
      name: data.name || symbol,
      price: data.market_data?.current_price?.usd || 0,
      change24h: data.market_data?.price_change_percentage_24h || 0,
      marketCap: data.market_data?.market_cap?.usd ? `$${(data.market_data.market_cap.usd / 1e9).toFixed(2)}B` : undefined,
      volume24h: data.market_data?.total_volume?.usd ? `$${(data.market_data.total_volume.usd / 1e6).toFixed(2)}M` : undefined,
    };
  } catch {
    return null;
  }
}

function detectAssetQuery(message: string): string | null {
  const lower = message.toLowerCase();
  const assets = ['bitcoin', 'ethereum', 'solana', 'sui', 'bnb', 'xrp', 'cardano', 'dogecoin', 'usdc'];
  const symbols = ['btc', 'eth', 'sol', 'sui', 'bnb', 'xrp', 'ada', 'doge', 'usdc'];

  for (let i = 0; i < assets.length; i++) {
    if (lower.includes(assets[i])) return symbols[i];
  }
  for (const sym of symbols) {
    const regex = new RegExp(`\\b${sym}\\b`, 'i');
    if (regex.test(lower)) return sym;
  }
  return null;
}

export default function AIChatAssistant({ userId, balance, transactions, isOpen, onClose, prices }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI financial assistant. I can help you with:\n\n- Portfolio insights & spending analysis\n- Real-time crypto market data\n- Anomaly detection & risk alerts\n- Cash flow predictions\n- Personalized recommendations\n\nWhat would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (overrideInput?: string) => {
    const msgText = overrideInput || input;
    if (!msgText.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = msgText;
    setInput('');
    setIsThinking(true);

    try {
      const lowerMsg = currentInput.toLowerCase();
      const assetSymbol = detectAssetQuery(currentInput);

      let responseText = '';
      let metadata: any = {};

      if (lowerMsg.includes('insight') || lowerMsg.includes('analyze') || lowerMsg.includes('spending') || lowerMsg.includes('portfolio') || lowerMsg.includes('health')) {
        const insights = generateInsightsFromData(balance, transactions, prices);
        const spending = analyzeSpendingPattern(transactions);

        responseText = `Here's your financial overview:\n\nBalance: ₦${balance.toLocaleString()}\n30-day spending: ₦${spending.totalSpent.toLocaleString()}\nAvg daily: ₦${spending.avgDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nTransactions: ${spending.transactionCount}`;

        metadata = {
          confidence: 0.92,
          riskLevel: spending.totalSpent > balance ? 'HIGH' : spending.totalSpent > balance * 0.5 ? 'MEDIUM' : 'LOW',
          insightCards: insights,
          suggestions: [
            'Review top spending categories for optimization',
            'Set up automatic savings',
            'Consider diversifying idle balance',
          ]
        };
      } else if (lowerMsg.includes('predict') || lowerMsg.includes('forecast') || lowerMsg.includes('cash flow')) {
        const spending = analyzeSpendingPattern(transactions);
        const daysLeft = spending.avgDaily > 0 ? Math.floor(balance / spending.avgDaily) : Infinity;

        responseText = `Cash Flow Forecast:\n\nCurrent balance: ₦${balance.toLocaleString()}\nAvg daily spending: ₦${spending.avgDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nProjected runway: ${daysLeft > 365 ? '> 1 year' : `${daysLeft} days`}\n\n${daysLeft < 30 ? 'Warning: Your balance may deplete soon. Consider reducing discretionary spending.' : 'Your spending pattern is sustainable at the current rate.'}`;

        metadata = {
          confidence: 0.78,
          riskLevel: daysLeft < 14 ? 'HIGH' : daysLeft < 30 ? 'MEDIUM' : 'LOW',
          suggestions: [
            daysLeft < 30 ? 'Reduce non-essential spending immediately' : 'Maintain current spending discipline',
            'Set up income alerts for better forecasting',
          ]
        };
      } else if (lowerMsg.includes('anomal') || lowerMsg.includes('unusual') || lowerMsg.includes('fraud') || lowerMsg.includes('security')) {
        const spending = analyzeSpendingPattern(transactions);
        const avgTx = spending.transactionCount > 0 ? spending.totalSpent / spending.transactionCount : 0;
        const largeTx = transactions.filter(tx => tx.amount > avgTx * 3 && tx.type === 'Debit');

        responseText = `Security Analysis:\n\nAnalyzed ${transactions.length} transactions.\nAverage transaction: ₦${avgTx.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nFlagged anomalies: ${largeTx.length}\n\n${largeTx.length > 0 ? `${largeTx.length} transaction(s) significantly above average detected. Review for unauthorized activity.` : 'No unusual patterns detected. Your account activity appears normal.'}`;

        metadata = {
          confidence: 0.88,
          riskLevel: largeTx.length > 2 ? 'HIGH' : largeTx.length > 0 ? 'MEDIUM' : 'LOW',
          insightCards: largeTx.length > 0 ? [{
            type: 'alert', title: `${largeTx.length} Anomalies Detected`,
            description: `${largeTx.length} transactions exceeded 3x your average spending amount.`,
            color: largeTx.length > 2 ? 'red' : 'amber', icon: 'alert'
          }] : [{
            type: 'savings', title: 'All Clear',
            description: 'No unusual patterns detected in your transaction history.',
            color: 'emerald', icon: 'shield'
          }],
        };
      } else if (assetSymbol && (lowerMsg.includes('price') || lowerMsg.includes('market') || lowerMsg.includes('buy') || lowerMsg.includes('sell') || lowerMsg.includes('worth') || lowerMsg.includes('how much'))) {
        const marketData = await fetchAssetMarketData(assetSymbol);
        if (marketData) {
          const isPositive = marketData.change24h >= 0;
          responseText = `${marketData.name} (${marketData.symbol}) Live Data:\n\nPrice: $${marketData.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}\n24h Change: ${isPositive ? '+' : ''}${marketData.change24h.toFixed(2)}%\n${marketData.marketCap ? `Market Cap: ${marketData.marketCap}` : ''}\n\n${isPositive ? 'Bullish momentum in the short term.' : 'Bearish pressure detected. Monitor support levels.'}`;

          metadata = {
            confidence: 0.95,
            marketData,
            suggestions: [
              `View detailed ${marketData.symbol} chart`,
              isPositive ? 'Consider taking partial profits' : 'Watch for reversal signals',
              'Set price alerts for key levels',
            ]
          };
        } else {
          responseText = `Unable to fetch live data for ${assetSymbol.toUpperCase()}. The market API may be temporarily unavailable.`;
        }
      } else if (lowerMsg.includes('market') || lowerMsg.includes('crypto') || lowerMsg.includes('top') || lowerMsg.includes('trending')) {
        const symbols = ['BTC', 'ETH', 'SOL'];
        const results = await Promise.all(symbols.map(s => fetchAssetMarketData(s)));
        const valid = results.filter(Boolean) as MarketCardData[];

        responseText = `Top Crypto Markets:\n\n${valid.map(v => `${v.name}: $${v.price.toLocaleString(undefined, { maximumFractionDigits: 2 })} (${v.change24h >= 0 ? '+' : ''}${v.change24h.toFixed(2)}%)`).join('\n')}\n\nAsk about any specific asset for detailed analysis.`;

        if (valid.length > 0) {
          metadata = {
            confidence: 0.93,
            marketData: valid[0],
            suggestions: valid.map(v => `View ${v.symbol} details`),
          };
        }
      } else if (lowerMsg.includes('budget') || lowerMsg.includes('save') || lowerMsg.includes('recommend')) {
        const spending = analyzeSpendingPattern(transactions);
        const monthlyIncome = spending.totalIncome || balance * 0.3;
        const needs = monthlyIncome * 0.5;
        const wants = monthlyIncome * 0.3;
        const savings = monthlyIncome * 0.2;

        responseText = `Personalized Budget Recommendation (50/30/20 Rule):\n\nNeeds (50%): ₦${needs.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nWants (30%): ₦${wants.toLocaleString(undefined, { maximumFractionDigits: 0 })}\nSavings (20%): ₦${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}\n\nBased on your current spending, ${spending.totalSpent > wants ? 'you\'re overspending on wants. Consider cutting discretionary expenses.' : 'your spending aligns well with recommended budgets.'}`;

        metadata = {
          confidence: 0.85,
          insightCards: [{
            type: 'savings', title: 'Recommended Monthly Savings',
            description: `Based on your income pattern, aim to save at least this amount monthly.`,
            value: `₦${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            color: 'purple', icon: 'target'
          }],
          suggestions: [
            'Automate savings transfers',
            'Review subscriptions monthly',
            'Set spending limits per category',
          ]
        };
      } else {
        try {
          const response = await api.post('/ai/chat', {
            userId,
            message: currentInput,
            context: {
              balance,
              recentTransactions: transactions.slice(0, 10),
              spendingPattern: analyzeSpendingPattern(transactions),
            }
          });
          responseText = response.data.response;
          metadata = response.data.metadata || {};
        } catch {
          responseText = generateLocalResponse(currentInput, balance, transactions);
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        metadata,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  const quickActions = [
    { label: 'Financial insights', icon: PieChart },
    { label: 'BTC price', icon: TrendingUp },
    { label: 'Analyze spending', icon: BarChart3 },
    { label: 'Detect anomalies', icon: AlertTriangle },
    { label: 'Predict cash flow', icon: Zap },
    { label: 'Budget advice', icon: Lightbulb },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 right-4 md:right-6 w-[calc(100%-2rem)] md:w-[440px] h-[640px] max-h-[calc(100vh-8rem)] bg-[#0F1419] rounded-3xl shadow-2xl shadow-black/50 border border-white/10 flex flex-col z-50 overflow-hidden"
        >
          <div className="relative px-5 py-4 border-b border-white/10 bg-gradient-to-r from-primary/20 to-emerald-600/10">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <Brain size={20} className="text-white" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Financial Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-xs text-gray-400">Online</p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </motion.button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} message={msg} isLast={i === messages.length - 1} />
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {isThinking && <TypingIndicator />}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 py-2 border-t border-white/5">
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              {quickActions.map((action) => (
                <QuickAction
                  key={action.label}
                  icon={action.icon}
                  label={action.label}
                  onClick={() => handleSend(action.label)}
                />
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask about finances, crypto, budget..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSend()}
                disabled={!input.trim() || isThinking}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  input.trim() && !isThinking
                    ? 'bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isThinking ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </motion.button>
            </div>
            <p className="text-[10px] text-gray-500 text-center mt-2">
              AI responses are for informational purposes only
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function generateLocalResponse(message: string, balance: number, transactions: any[]): string {
  const lower = message.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return "Hello! How can I help you with your finances today? I can analyze your spending, check crypto prices, detect anomalies, or provide budget recommendations.";
  }

  if (lower.includes('balance') || lower.includes('how much')) {
    return `Your current balance is ₦${balance.toLocaleString()}. Would you like me to analyze your spending patterns or provide investment recommendations?`;
  }

  if (lower.includes('transaction') || lower.includes('history')) {
    return `You have ${transactions.length} recent transactions. Your most recent activity includes ${transactions.slice(0, 3).map(tx => `${tx.type} of ₦${tx.amount.toLocaleString()}`).join(', ')}. Want me to analyze any specific patterns?`;
  }

  return "I can help you with:\n- Financial insights & spending analysis\n- Real-time crypto market data (try 'BTC price')\n- Anomaly detection & security\n- Cash flow predictions\n- Budget recommendations\n\nWhat would you like to explore?";
}
