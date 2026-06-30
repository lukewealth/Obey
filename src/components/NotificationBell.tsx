import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, Trash2, Settings, ChevronRight } from "lucide-react";
import api from "../services/api";

interface AppNotification {
  id: string;
  type: "transaction" | "security" | "reward" | "system" | "promo";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface NotificationBellProps {
  userId?: string;
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/notifications/${userId}`);
      if (res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch {
      // Silent fail - notifications are non-critical
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.post(`/notifications/read-all`, { userId });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => (notifications.find(n => n.id === id)?.read ? prev : Math.max(0, prev - 1)));
    } catch {}
  };

  const typeColors: Record<string, string> = {
    transaction: "bg-blue-100 text-blue-600",
    security: "bg-red-100 text-red-600",
    reward: "bg-amber-100 text-amber-600",
    system: "bg-gray-100 text-gray-600",
    promo: "bg-emerald-100 text-emerald-600",
  };

  const typeIcons: Record<string, string> = {
    transaction: "",
    security: "🔒",
    reward: "🎁",
    system: "⚙️",
    promo: "",
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) fetchNotifications(); }}
        className="relative p-2 text-gray-500 hover:text-[#0b0e14] hover:bg-gray-100/50 rounded-xl transition-all"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#0b0e14]">Notifications</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:opacity-70 transition-opacity"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Bell className="w-10 h-10 text-gray-200 mx-auto" />
                  <p className="text-sm font-bold text-gray-400">No notifications yet</p>
                  <p className="text-[10px] text-gray-300">We'll notify you of important updates</p>
                </div>
              ) : (
                notifications.map((notif, i) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-all group ${!notif.read ? "bg-primary/[0.02]" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${typeColors[notif.type]}`}>
                        {typeIcons[notif.type]}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-black text-[#0b0e14] leading-tight">{notif.title}</p>
                          {!notif.read && <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1" />}
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1 line-clamp-2">{notif.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">{formatTime(notif.createdAt)}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notif.read && (
                              <button onClick={() => markAsRead(notif.id)} className="p-1 hover:bg-gray-100 rounded-lg transition-all" title="Mark read">
                                <Check size={12} className="text-emerald-500" />
                              </button>
                            )}
                            <button onClick={() => deleteNotification(notif.id)} className="p-1 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                              <Trash2 size={12} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50/50">
              <button className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">
                View All Notifications <ChevronRight size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
