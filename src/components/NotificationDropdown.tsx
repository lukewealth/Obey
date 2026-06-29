import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellIcon,
  CheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { Transaction } from "../types";

interface Notification {
  id: string;
  type: "transaction" | "alert" | "info" | "success" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: string;
}

interface NotificationDropdownProps {
  transactions: Transaction[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export default function NotificationDropdown({
  transactions,
  onMarkAllRead,
  onClearAll
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Convert recent transactions to notifications
    const txNotifications: Notification[] = transactions.slice(0, 10).map((tx) => ({
      id: tx.id,
      type: tx.type === "Credit" ? "success" : "info",
      title: tx.title,
      message: `${tx.type === "Credit" ? "Received" : "Sent"} ₦${tx.amount.toLocaleString()}`,
      timestamp: tx.date,
      read: false,
      icon: tx.category
    }));

    // Add some system notifications
    const systemNotifications: Notification[] = [
      {
        id: "sys-1",
        type: "info",
        title: "Welcome to Obey",
        message: "Your account is now active. Start trading!",
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: "sys-2",
        type: "alert",
        title: "Security Alert",
        message: "New login detected from Lagos, Nigeria",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ];

    setNotifications([...systemNotifications, ...txNotifications]);
  }, [transactions]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "success":
        return <CheckCircleIcon className={`${iconClass} text-emerald-600`} />;
      case "warning":
        return <ExclamationTriangleIcon className={`${iconClass} text-amber-600`} />;
      case "alert":
        return <BellIcon className={`${iconClass} text-red-600`} />;
      case "info":
        return <InformationCircleIcon className={`${iconClass} text-blue-600`} />;
      default:
        return <InformationCircleIcon className={`${iconClass} text-gray-600`} />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-100 text-emerald-600";
      case "warning":
        return "bg-amber-100 text-amber-600";
      case "alert":
        return "bg-red-100 text-red-600";
      case "info":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-[#0b0e14] dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-xl transition-all"
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-white/10 z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-[#0b0e14] dark:text-white">
                    Notifications
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onMarkAllRead}
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    <CheckIcon className="w-3 h-3" />
                    Mark all as read
                  </button>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <button
                    onClick={onClearAll}
                    className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                  >
                    <TrashIcon className="w-3 h-3" />
                    Clear all
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <BellIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-white/5">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all cursor-pointer ${
                          !notification.read ? "bg-primary/5 dark:bg-primary/10" : ""
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getIconColor(
                              notification.type
                            )}`}
                          >
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-[#0b0e14] dark:text-white mb-1">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                              >
                                <XMarkIcon className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                              {formatTime(notification.timestamp)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-200/50 dark:border-white/10 bg-white/50 dark:bg-white/5">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
