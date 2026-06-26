import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Loader2, CheckCircle, XCircle, ExternalLink, ArrowLeft } from "lucide-react";
import { createCheckoutOrder } from "../services/api";
import { useNotification } from "./NotificationSystem";

interface PaymentCheckoutProps {
  userId: string;
  userEmail?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentCheckout({ userId, userEmail, onSuccess, onCancel }: PaymentCheckoutProps) {
  const { notify } = useNotification();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [checkoutLink, setCheckoutLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(amount);
    if (!amountVal || amountVal < 100) {
      setError("Minimum amount is ₦100");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await createCheckoutOrder({
        userId,
        amount: amountVal,
        email: userEmail,
        callbackUrl: `${window.location.origin}/payment/callback`,
      });

      if (response.data.success) {
        setCheckoutLink(response.data.checkoutLink);
        notify("info", "Checkout Ready", "Redirecting to secure payment...");
        
        setTimeout(() => {
          window.location.href = response.data.checkoutLink;
        }, 1500);
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to create checkout";
      setError(errorMsg);
      notify("error", "Checkout Failed", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (checkoutLink) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Payment</h3>
          <p className="text-gray-600 mb-6">
            You'll be redirected to our secure payment processor...
          </p>
          <a
            href={checkoutLink}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Click here if not redirected <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Fund Wallet</h2>
      </div>

      <form onSubmit={handleCreateCheckout} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (NGN)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              ₦
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10,000"
              className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              min="100"
              step="100"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Minimum amount: ₦100
          </p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700"
            >
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Secure Payment</p>
              <p className="text-blue-700 text-xs">
                You'll be redirected to Nomba's secure checkout. We support card, bank transfer, USSD, and more.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !amount}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay ₦{parseFloat(amount || "0").toLocaleString()}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
