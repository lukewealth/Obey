import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheckIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import api from "../services/api";
import { getErrorMessage } from "../utils/errorHandler";
import { useNotification } from "./NotificationSystem";

interface KYCRequest {
  _id: string;
  name: string;
  email: string;
  kycLevel: number;
  kycUpgradeRequest?: {
    requestedTier: number;
    documents: string[];
    requestedAt: string;
    status: string;
  };
}

interface AdminKYCManagementProps {
  adminId: string;
}

export default function AdminKYCManagement({ adminId }: AdminKYCManagementProps) {
  const { notify } = useNotification();
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/kyc/admin/pending?adminId=${adminId}`);
      if (response.data.success) {
        setRequests(response.data.requests);
      }
    } catch (error) {
      console.error("Failed to fetch KYC requests:", error);
      notify("error", "Fetch Failed", "Could not load KYC upgrade requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: KYCRequest) => {
    setProcessing(request._id);
    try {
      const response = await api.post("/kyc/admin/approve", {
        userId: request._id,
        newTier: request.kycUpgradeRequest?.requestedTier || 2,
        adminId
      });

      if (response.data.success) {
        notify(
          "success",
          "Approved",
          `${request.name} has been upgraded to Tier ${request.kycUpgradeRequest?.requestedTier}`
        );
        setRequests((prev) => prev.filter((r) => r._id !== request._id));
      }
    } catch (error: any) {
      notify("error", "Approval Failed", getErrorMessage(error, "Could not approve request."));
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    setProcessing(selectedRequest._id);
    try {
      const response = await api.post("/kyc/admin/reject", {
        userId: selectedRequest._id,
        reason: rejectionReason,
        adminId
      });

      if (response.data.success) {
        notify("info", "Rejected", `${selectedRequest.name}'s upgrade request has been rejected.`);
        setRequests((prev) => prev.filter((r) => r._id !== selectedRequest._id));
        setShowRejectModal(false);
        setSelectedRequest(null);
        setRejectionReason("");
      }
    } catch (error: any) {
      notify("error", "Rejection Failed", getErrorMessage(error, "Could not reject request."));
    } finally {
      setProcessing(null);
    }
  };

  const getTierName = (tier: number) => {
    const tiers: Record<number, string> = {
      1: "Standard",
      2: "Verified",
      3: "Premium",
      4: "Institutional"
    };
    return tiers[tier] || "Unknown";
  };

  const getTierColor = (tier: number) => {
    const colors: Record<number, string> = {
      1: "bg-gray-100 text-gray-700",
      2: "bg-blue-100 text-blue-700",
      3: "bg-purple-100 text-purple-700",
      4: "bg-amber-100 text-amber-700"
    };
    return colors[tier] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <ArrowPathIcon className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <ShieldCheckIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0b0e14] dark:text-white">
              KYC Upgrade Requests
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review and approve user tier upgrades
            </p>
          </div>
        </div>
        <button
          onClick={fetchPendingRequests}
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
        >
          <ArrowPathIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <ClockIcon className="w-5 h-5 text-amber-500" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Pending
            </p>
          </div>
          <p className="text-3xl font-bold text-[#0b0e14] dark:text-white">
            {requests.length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <UserGroupIcon className="w-5 h-5 text-blue-500" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Users
            </p>
          </div>
          <p className="text-3xl font-bold text-[#0b0e14] dark:text-white">
            {requests.reduce((acc, r) => acc + (r.kycLevel || 0), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-500" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Approved Today
            </p>
          </div>
          <p className="text-3xl font-bold text-[#0b0e14] dark:text-white">0</p>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-12 text-center">
          <CheckCircleIcon className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#0b0e14] dark:text-white mb-2">
            All Caught Up!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No pending KYC upgrade requests at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {request.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#0b0e14] dark:text-white mb-1">
                      {request.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {request.email}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getTierColor(
                          request.kycLevel
                        )}`}
                      >
                        Current: {getTierName(request.kycLevel)}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getTierColor(
                          request.kycUpgradeRequest?.requestedTier || 2
                        )}`}
                      >
                        Requested: {getTierName(request.kycUpgradeRequest?.requestedTier || 2)}
                      </span>
                    </div>
                    {request.kycUpgradeRequest?.documents &&
                      request.kycUpgradeRequest.documents.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Documents:
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {request.kycUpgradeRequest.documents.map((doc, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-xs text-gray-700 dark:text-gray-300"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                      Requested:{" "}
                      {new Date(
                        request.kycUpgradeRequest?.requestedAt || ""
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all"
                    title="View Details"
                  >
                    <EyeIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleApprove(request)}
                    disabled={processing === request._id}
                    className="p-2 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-xl transition-all disabled:opacity-50"
                    title="Approve"
                  >
                    <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowRejectModal(true);
                    }}
                    disabled={processing === request._id}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-all disabled:opacity-50"
                    title="Reject"
                  >
                    <XCircleIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0b0e14] dark:text-white">
                    Reject Upgrade Request
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedRequest.name}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-[#0b0e14] dark:text-white mb-2 block">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm text-[#0b0e14] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing === selectedRequest._id || !rejectionReason.trim()}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing === selectedRequest._id ? "Rejecting..." : "Reject Request"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
