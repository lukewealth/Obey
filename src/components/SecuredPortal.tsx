import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Fingerprint, Lock, CheckCircle2, AlertCircle, Loader2, Smartphone, Key } from 'lucide-react';
import api from '../services/api';

interface SecuredPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  userId: string;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export default function SecuredPortal({ isOpen, onClose, onVerified, userId, riskLevel = 'LOW' }: SecuredPortalProps) {
  const [step, setStep] = useState<'biometric' | 'totp' | 'verified'>('biometric');
  const [verifying, setVerifying] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [deviceFingerprint, setDeviceFingerprint] = useState('');

  useEffect(() => {
    if (isOpen) {
      generateDeviceFingerprint();
      setStep(riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'totp' : 'biometric');
    }
  }, [isOpen, riskLevel]);

  const generateDeviceFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Obey-Fingerprint', 2, 2);
    }
    const fingerprint = canvas.toDataURL() + navigator.userAgent + navigator.language + screen.width + screen.height;
    setDeviceFingerprint(btoa(fingerprint).substring(0, 16));
  };

  const handleBiometricVerify = async () => {
    setVerifying(true);
    setError('');

    setTimeout(async () => {
      try {
        await api.post('/sync/verify-biometric', {
          userId,
          deviceFingerprint,
          method: 'biometric',
        });
        setStep('verified');
        setTimeout(() => {
          onVerified();
          onClose();
        }, 1500);
      } catch (error) {
        setError('Biometric verification failed. Please try again.');
        setVerifying(false);
      }
    }, 2000);
  };

  const handleTotpVerify = async () => {
    if (totpCode.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      await api.post('/sync/verify-totp', {
        userId,
        code: totpCode,
        deviceFingerprint,
      });
      setStep('verified');
      setTimeout(() => {
        onVerified();
        onClose();
      }, 1500);
    } catch (error) {
      setError('Invalid code. Please try again.');
      setVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-white dark:bg-[#1E1E1E] rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-purple-600 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">Secured Portal</h2>
            </div>
            <p className="text-white/80 text-sm">
              {riskLevel === 'HIGH' || riskLevel === 'CRITICAL'
                ? 'High-risk transaction detected. Additional verification required.'
                : 'Please verify your identity to continue.'}
            </p>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 'biometric' && (
                <motion.div
                  key="biometric"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Fingerprint className="w-12 h-12 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Biometric Verification</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use your device's biometric authentication to verify your identity
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleBiometricVerify}
                    disabled={verifying}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-5 h-5" />
                        Verify with Biometrics
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => setStep('totp')}
                      className="text-sm text-primary hover:underline"
                    >
                      Use 2FA code instead
                    </button>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                    <p className="text-xs text-gray-500 text-center">
                      Device ID: {deviceFingerprint}
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 'totp' && (
                <motion.div
                  key="totp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <input
                      type="text"
                      maxLength={6}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      className="w-full text-center text-3xl font-mono font-bold py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={handleTotpVerify}
                      disabled={verifying || totpCode.length !== 6}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                      {verifying ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Key className="w-5 h-5" />
                          Verify Code
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setStep('biometric')}
                      className="text-sm text-primary hover:underline"
                    >
                      Use biometrics instead
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'verified' && (
                <motion.div
                  key="verified"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Identity Verified</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Secure session established. Redirecting...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
