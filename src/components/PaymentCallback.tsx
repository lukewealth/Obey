import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { verifyTransaction } from "../services/api";

interface PaymentCallbackProps {
  onNavigate?: (path: string) => void;
}

export default function PaymentCallback({ onNavigate }: PaymentCallbackProps) {
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");
  const [transaction, setTransaction] = useState<any>(null);
  const [pollCount, setPollCount] = useState(0);

  const urlParams = new URLSearchParams(window.location.search);
  const orderReference = urlParams.get("orderReference");

  const navigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.href = path;
    }
  };

  useEffect(() => {
    if (!orderReference) {
      setStatus("failed");
      return;
    }

    const pollStatus = async () => {
      try {
        const response = await verifyTransaction(orderReference);
        
        if (response.data.status === "SUCCESS") {
          setStatus("success");
          setTransaction(response.data.transaction);
        } else if (response.data.status === "FAILED") {
          setStatus("failed");
        } else {
          setPollCount(prev => prev + 1);
        }
      } catch (error) {
        console.error("Verification failed:", error);
        setPollCount(prev => prev + 1);
      }
    };

    const interval = setInterval(pollStatus, 2000);
    pollStatus();

    const timeout = setTimeout(() => {
      clearInterval(interval);
      if (status === "verifying") {
        setStatus("failed");
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderReference]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
      >
        {status === "verifying" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mb-6"
            >
              <Loader2 className="w-20 h-20 text-blue-600 mx-auto" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600 mb-4">
              Please wait while we confirm your transaction...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span>Checking with payment provider</span>
            </div>
            {pollCount > 10 && (
              <p className="text-xs text-gray-400 mt-4">
                This is taking longer than usual. Please wait...
              </p>
            )}
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful
            </h2>
            <p className="text-gray-600 mb-6">
              {transaction && (
                <span className="text-3xl font-bold text-green-600">
                  ₦{transaction.amount?.toLocaleString()}
                </span>
              )}
              <br />
              <span className="text-sm">has been added to your wallet</span>
            </p>
            
            {transaction && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Reference</span>
                    <span className="font-mono text-xs">{transaction.id?.substring(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="text-green-600 font-medium">Confirmed</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <XCircle className="w-20 h-20 text-red-600 mx-auto mb-6" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment could not be processed. Please try again or contact support.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/wallet")}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
