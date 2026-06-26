import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Plus, Building2, Loader2, XCircle } from "lucide-react";
import { fetchVirtualAccounts, createVirtualAccount } from "../services/api";
import { useNotification } from "./NotificationSystem";

interface VirtualAccountCardProps {
  userId: string;
  userName: string;
}

export default function VirtualAccountCard({ userId, userName }: VirtualAccountCardProps) {
  const { notify } = useNotification();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, [userId]);

  const fetchAccounts = async () => {
    try {
      const response = await fetchVirtualAccounts(userId);
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error("Failed to fetch virtual accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setCreating(true);
    setError(null);
    try {
      const response = await createVirtualAccount({
        userId,
        accountName: userName,
      });
      
      if (response.data.success) {
        await fetchAccounts();
        notify("success", "Account Created", "Your virtual account is ready to receive payments");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || "Failed to create virtual account";
      setError(errorMsg);
      notify("error", "Creation Failed", errorMsg);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    notify("success", "Copied", "Account number copied to clipboard");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-24 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Virtual Accounts</h3>
        </div>
        {accounts.length < 2 && (
          <button
            onClick={handleCreateAccount}
            disabled={creating}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition text-sm font-medium"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {creating ? "Creating..." : "New Account"}
          </button>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-4"
          >
            <XCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {accounts.length === 0 ? (
        <div className="text-center py-8">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">No virtual accounts yet</p>
          <p className="text-sm text-gray-500">
            Create a dedicated account to receive payments directly into your wallet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map((account, index) => (
            <motion.div
              key={account._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{account.accountName}</p>
                  <p className="text-sm text-gray-500">{account.bankName}</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                  Active
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-white rounded-xl p-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Number</p>
                  <p className="text-lg font-mono font-bold text-gray-900">
                    {account.bankAccountNumber}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(account.bankAccountNumber, index)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  {copiedIndex === index ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Funds sent to this account will automatically credit your wallet
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {accounts.length > 0 && accounts.length < 2 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          You can create {2 - accounts.length} more virtual account{2 - accounts.length > 1 ? "s" : ""}
        </p>
      )}
    </motion.div>
  );
}
