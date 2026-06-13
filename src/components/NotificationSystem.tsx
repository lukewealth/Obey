import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, AlertCircle, XCircle, Info, X, 
  Terminal, ShieldCheck, Zap, Bell
} from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info" | "log" | "security";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notify: (type: NotificationType, title: string, message: string, duration?: number) => void;
  remove: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within a NotificationProvider");
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((type: NotificationType, title: string, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = { id, type, title, message, duration };
    setNotifications((prev) => [...prev, newNotification]);

    if (duration !== Infinity) {
      setTimeout(() => remove(id), duration);
    }
  }, [remove]);

  return (
    <NotificationContext.Provider value={{ notify, remove }}>
      {children}
      <div className="fixed bottom-10 right-10 z-[1000] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="pointer-events-auto"
            >
              <NotificationItem notification={n} onClose={() => remove(n.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  const { type, title, message } = notification;

  const styles = {
    success: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: <CheckCircle2 size={20} className="text-emerald-500" />,
      text: "text-emerald-900",
      sub: "text-emerald-600/70"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-100",
      icon: <XCircle size={20} className="text-red-500" />,
      text: "text-red-900",
      sub: "text-red-600/70"
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      icon: <AlertCircle size={20} className="text-amber-500" />,
      text: "text-amber-900",
      sub: "text-amber-600/70"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: <Info size={20} className="text-blue-500" />,
      text: "text-blue-900",
      sub: "text-blue-600/70"
    },
    log: {
      bg: "bg-[#0b0e14]",
      border: "border-white/10",
      icon: <Terminal size={20} className="text-primary" />,
      text: "text-white",
      sub: "text-gray-500 font-mono text-[10px]"
    },
    security: {
      bg: "bg-primary/5",
      border: "border-primary/20",
      icon: <ShieldCheck size={20} className="text-primary" />,
      text: "text-[#0b0e14]",
      sub: "text-primary/60"
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`${currentStyle.bg} ${currentStyle.border} border backdrop-blur-xl p-5 rounded-[2rem] shadow-2xl flex items-start gap-4 relative overflow-hidden group`}>
      <div className="shrink-0 pt-0.5">
        {currentStyle.icon}
      </div>
      <div className="flex-grow space-y-1">
        <h4 className={`text-sm font-black uppercase tracking-widest ${currentStyle.text}`}>{title}</h4>
        <p className={`text-xs font-medium leading-relaxed ${currentStyle.sub}`}>{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="shrink-0 p-1 text-gray-400 hover:text-gray-900 transition-colors"
      >
        <X size={16} />
      </button>

      {/* Progress Bar for non-log notifications */}
      {type !== "log" && (
        <motion.div 
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: (notification.duration || 5000) / 1000, ease: "linear" }}
          className="absolute bottom-0 left-0 h-0.5 bg-primary/20"
        />
      )}
    </div>
  );
};
