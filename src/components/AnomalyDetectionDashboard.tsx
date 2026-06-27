import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, Activity, TrendingUp, Loader2, X, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

interface AnomalyDetectionDashboardProps {
  userId: string;
  transactions: any[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AnomalyDetectionDashboard({ userId, transactions, isOpen, onClose }: AnomalyDetectionDashboardProps) {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      detectAnomalies();
    }
  }, [isOpen, transactions]);

  const detectAnomalies = async () => {
    setLoading(true);
    try {
      const response = await api.post('/ai/insights', {
        userId,
        transactions: transactions.slice(0, 50),
        balance: 0,
      });
      setAnomalies(response.data.anomalies || []);
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5" />;
      case 'MEDIUM':
        return <Activity className="w-5 h-5" />;
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Anomaly Detection</h2>
                <p className="text-white/80 text-sm">AI-powered transaction monitoring</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Analyzing transactions...</p>
                </div>
              </div>
            ) : anomalies.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Anomalies Detected</h3>
                  <p className="text-gray-600 dark:text-gray-400">All transactions appear normal</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {anomalies.length} Anomal{anomalies.length === 1 ? 'y' : 'ies'} Found
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      {anomalies.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length} Critical
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                      {anomalies.filter(a => a.severity === 'MEDIUM').length} Medium
                    </span>
                  </div>
                </div>

                {anomalies.map((anomaly, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setSelectedAnomaly(anomaly)}
                    className="p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 cursor-pointer hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`${getSeverityColor(anomaly.severity)} p-3 rounded-xl text-white flex-shrink-0`}>
                        {getSeverityIcon(anomaly.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{anomaly.title}</h4>
                          <span className={`px-2 py-0.5 ${getSeverityColor(anomaly.severity)} text-white text-xs rounded-full font-bold`}>
                            {anomaly.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{anomaly.description}</p>
                        {anomaly.transaction && (
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Amount: ₦{anomaly.transaction.amount?.toLocaleString()}</span>
                            <span>Date: {anomaly.transaction.date}</span>
                            <span>Category: {anomaly.transaction.category}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {selectedAnomaly && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-gray-200 dark:border-white/10 p-6 bg-gray-50 dark:bg-white/5"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Anomaly Details</h3>
                <button onClick={() => setSelectedAnomaly(null)} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Title</p>
                  <p className="font-bold text-gray-900 dark:text-white">{selectedAnomaly.title}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedAnomaly.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Severity</p>
                  <span className={`px-3 py-1 ${getSeverityColor(selectedAnomaly.severity)} text-white text-xs rounded-full font-bold`}>
                    {selectedAnomaly.severity}
                  </span>
                </div>
                {selectedAnomaly.transaction && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="font-bold text-gray-900 dark:text-white">₦{selectedAnomaly.transaction.amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedAnomaly.transaction.date}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Category</p>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedAnomaly.transaction.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedAnomaly.transaction.type}</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      api.post('/ai/fraud-check', {
                        transaction: selectedAnomaly.transaction,
                        userHistory: {}
                      });
                      setSelectedAnomaly(null);
                    }}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                  >
                    Run Deep Analysis
                  </button>
                  <button
                    onClick={() => setSelectedAnomaly(null)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
