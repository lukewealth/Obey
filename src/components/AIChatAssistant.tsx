import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, X, Sparkles, Loader2, Zap, TrendingUp, AlertTriangle, ArrowUpRight, Copy, Check } from 'lucide-react';
import api from '../services/api';
import { motionVariants } from '../styles/design-tokens';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    confidence?: number;
    riskLevel?: string;
    suggestions?: string[];
  };
}

interface AIChatAssistantProps {
  userId: string;
  balance: number;
  transactions: any[];
  isOpen: boolean;
  onClose: () => void;
}

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
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: 'easeInOut',
          }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      ))}
    </div>
    <span className="text-xs text-gray-400 ml-2">AI is thinking...</span>
  </motion.div>
);

const MessageBubble = ({ message, isLast }: { message: Message; isLast: boolean }) => {
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
        
        <div
          className={`relative rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-br-md'
              : 'bg-white/5 border border-white/10 text-gray-100 rounded-bl-md'
          }`}
        >
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
                message.metadata.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-400' :
                message.metadata.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  message.metadata.riskLevel === 'Low' ? 'bg-emerald-400' :
                  message.metadata.riskLevel === 'Medium' ? 'bg-amber-400' :
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
    className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/10 hover:border-primary/30 hover:text-white transition-all duration-200"
  >
    <Icon size={14} className="text-primary" />
    <span className="truncate">{label}</span>
  </motion.button>
);

export default function AIChatAssistant({ userId, balance, transactions, isOpen, onClose }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI financial assistant. I can help you analyze transactions, detect unusual activity, predict cash flow, and provide smart recommendations. What would you like to know?",
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

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsThinking(true);

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

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        metadata: response.data.metadata,
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

  const analyzeSpendingPattern = (txs: any[]) => {
    const last30Days = txs.filter(tx => {
      const txDate = new Date(tx.createdAt);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return txDate >= thirtyDaysAgo;
    });

    const totalSpent = last30Days.filter(tx => tx.type === 'Debit').reduce((sum, tx) => sum + tx.amount, 0);
    const avgDaily = totalSpent / 30;

    return {
      totalSpent,
      avgDaily,
      transactionCount: last30Days.length,
    };
  };

  const quickActions = [
    { label: 'Analyze spending', icon: TrendingUp },
    { label: 'Detect anomalies', icon: AlertTriangle },
    { label: 'Predict cash flow', icon: Zap },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 right-4 md:right-6 w-[calc(100%-2rem)] md:w-[420px] h-[600px] max-h-[calc(100vh-8rem)] bg-[#0F1419] rounded-3xl shadow-2xl shadow-black/50 border border-white/10 flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <MessageBubble 
                  key={msg.id} 
                  message={msg} 
                  isLast={i === messages.length - 1}
                />
              ))}
            </AnimatePresence>
            
            <AnimatePresence>
              {isThinking && <TypingIndicator />}
            </AnimatePresence>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-t border-white/5">
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
              {quickActions.map((action) => (
                <QuickAction
                  key={action.label}
                  icon={action.icon}
                  label={action.label}
                  onClick={() => {
                    setInput(action.label);
                    setTimeout(() => handleSend(), 100);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask about your finances..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isThinking}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  input.trim() && !isThinking
                    ? 'bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg shadow-primary/20'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isThinking ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
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
