import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, X, Sparkles, Loader2, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
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
  };
}

interface AIChatAssistantProps {
  userId: string;
  balance: number;
  transactions: any[];
  isOpen: boolean;
  onClose: () => void;
}

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await api.post('/ai/chat', {
        userId,
        message: input,
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="fixed bottom-24 right-6 w-[calc(100%-3rem)] md:w-96 h-[600px] bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col z-50 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Brain className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-white font-bold text-sm">AI Financial Assistant</h3>
            <p className="text-white/70 text-xs">Powered by Gemini Pro</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.metadata && (
                <div className="mt-2 pt-2 border-t border-white/20 space-y-1">
                  {msg.metadata.confidence && (
                    <p className="text-xs opacity-70">Confidence: {(msg.metadata.confidence * 100).toFixed(0)}%</p>
                  )}
                  {msg.metadata.riskLevel && (
                    <p className="text-xs opacity-70">Risk: {msg.metadata.riskLevel}</p>
                  )}
                  {msg.metadata.suggestions && msg.metadata.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs opacity-70">Suggestions:</p>
                      {msg.metadata.suggestions.map((s, i) => (
                        <p key={i} className="text-xs opacity-90">• {s}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs opacity-50 mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 dark:bg-white/10 rounded-2xl p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Analyzing...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-white/10">
        <div className="flex gap-2 mb-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => setInput(action.label)}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
              <action.icon className="w-3 h-3" />
              {action.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your finances..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
