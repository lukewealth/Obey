import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, MoreVertical, ChevronLeft, ChevronRight, Check,
  Calendar, Repeat, ArrowRight, TrendingUp,
  X, ArrowDownLeft,
  Wallet, Zap, Bell,
  Home, FileText, PiggyBank, RefreshCw
} from "lucide-react";
import { ScheduledPayment, WeeklyPin, UserProfile } from "../types";

interface PaymentScheduleChannelerProps {
  profile: UserProfile;
  scheduledPayments: ScheduledPayment[];
  onAddPayment: (payment: Omit<ScheduledPayment, "id">) => void;
  onReschedule: (id: string, newDate: string, newTime: string) => void;
  onCancel: (id: string) => void;
  onComplete: (id: string) => void;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Transfer: <ArrowDownLeft size={16} />,
  Bills: <FileText size={16} />,
  Savings: <PiggyBank size={16} />,
  Subscription: <Repeat size={16} />,
  Rent: <Home size={16} />,
  Other: <Wallet size={16} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  Personal: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
  Bills: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
  Savings: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  Transfer: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  Subscription: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  Rent: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400",
};

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const adjustedFirst = firstDay === 0 ? 6 : firstDay - 1;
  const days: (number | null)[] = [];
  for (let i = 0; i < adjustedFirst; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

export default function PaymentScheduleChanneler({
  profile,
  scheduledPayments,
  onAddPayment,
  onReschedule,
  onCancel,
  onComplete,
}: PaymentScheduleChannelerProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [showAddModal, setShowAddModal] = useState(false);
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showRescheduleNotification, setShowRescheduleNotification] = useState(true);
  const [rescheduleTarget, setRescheduleTarget] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weeklyPins: WeeklyPin[] = scheduledPayments
    .filter((p) => p.status === "upcoming" || p.status === "rescheduled")
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      title: p.title,
      date: p.date,
      time: p.time,
      category: p.category as WeeklyPin["category"],
      description: p.description,
    }));

  const todaySchedule = scheduledPayments.filter((p) => {
    const [day, month, year] = p.date.split("/").map(Number);
    return day === selectedDate && month === currentMonth + 1 && year === currentYear;
  });

  const upcomingPayments = scheduledPayments
    .filter((p) => p.status === "upcoming")
    .sort((a, b) => {
      const [da, ma, ya] = a.date.split("/").map(Number);
      const [db, mb, yb] = b.date.split("/").map(Number);
      return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
    });

  const rescheduledPayments = scheduledPayments.filter((p) => p.status === "rescheduled");

  const totalScheduled = scheduledPayments.filter((p) => p.status === "upcoming").reduce((s, p) => s + p.amount, 0);
  const totalRescheduled = rescheduledPayments.reduce((s, p) => s + p.amount, 0);

  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  const formatTime12 = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const getWeatherEmoji = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 12) return "Now is almost Sunny";
    if (hour >= 12 && hour < 17) return "Partly Cloudy";
    if (hour >= 17 && hour < 20) return "Sunset approaching";
    return "Clear Night";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Payment Schedules
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your recurring and upcoming payments
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#0b0e14] dark:bg-white text-white dark:text-[#0b0e14] px-5 py-3 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={18} />
          Schedule Payment
        </motion.button>
      </motion.div>

      {/* Reschedule Alert Banner */}
      <AnimatePresence>
        {rescheduledPayments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mb-6"
          >
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={18} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  {rescheduledPayments.length} payment{rescheduledPayments.length > 1 ? "s" : ""} recently rescheduled
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400/70 mt-0.5">
                  {rescheduledPayments.map((p) => p.title).join(", ")}
                </p>
              </div>
              <button
                onClick={() => setShowRescheduleNotification(false)}
                className="text-amber-400 hover:text-amber-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - Weekly Pins + Calendar */}
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
          {/* Weekly Pinned */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Weekly Pinned</h3>
              <button className="text-xs text-primary font-medium hover:text-primary/80 transition-colors">
                View all
              </button>
            </div>

            <div className="space-y-3">
              {weeklyPins.map((pin) => (
                <motion.div
                  key={pin.id}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${CATEGORY_COLORS[pin.category] || CATEGORY_COLORS.Other}`}>
                      {CATEGORY_ICONS[pin.category] || <Wallet size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{pin.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {pin.date}{pin.time ? ` - ${pin.time}` : ""}
                      </p>
                      {pin.description && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{pin.description}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {weeklyPins.length === 0 && (
                <div className="py-6 text-center">
                  <Calendar size={24} className="text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">No pinned payments</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddModal(true)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400 hover:border-primary hover:text-primary transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus size={16} className="text-primary" />
                </div>
                <span className="text-sm font-medium">Add new weekly pin</span>
              </motion.button>
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {MONTHS[currentMonth]}, {currentYear}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
                    else setCurrentMonth(currentMonth - 1);
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => {
                    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
                    else setCurrentMonth(currentMonth + 1);
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
              <button className="text-xs text-primary font-medium">Two weeks</button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                const isSelected = day === selectedDate;
                const hasPayment = day && scheduledPayments.some((p) => {
                  const [d, m, y] = p.date.split("/").map(Number);
                  return d === day && m === currentMonth + 1 && y === currentYear && p.status === "upcoming";
                });

                return (
                  <button
                    key={i}
                    onClick={() => day && setSelectedDate(day)}
                    className={`relative w-full aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all ${
                      !day ? "" :
                      isSelected
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : isToday
                        ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {day}
                    {hasPayment && !isSelected && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* CENTER COLUMN - Today's Schedule */}
        <motion.div variants={itemVariants} className="lg:col-span-6">
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedDate === today.getDate() && currentMonth === today.getMonth() ? "Today's" : `${selectedDate} ${MONTHS[currentMonth].slice(0, 3)}`} schedule
                </h2>
                <p className="text-sm text-primary font-medium mt-0.5">
                  {DAYS[(new Date(currentYear, currentMonth, selectedDate).getDay() + 6) % 7]} {selectedDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (selectedDate > 1) setSelectedDate(selectedDate - 1);
                    else if (currentMonth > 0) { setCurrentMonth(currentMonth - 1); setSelectedDate(new Date(currentYear, currentMonth, 0).getDate()); }
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => {
                    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                    if (selectedDate < daysInMonth) setSelectedDate(selectedDate + 1);
                    else { setCurrentMonth(currentMonth + 1); setSelectedDate(1); }
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-1">
              {todaySchedule.length > 0 ? (
                todaySchedule.map((payment, i) => {
                  const isCompleted = payment.status === "completed";
                  const isRescheduled = payment.status === "rescheduled";
                  const isFailed = payment.status === "failed";

                  return (
                    <motion.div
                      key={payment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="relative"
                    >
                      <div className="flex items-start gap-4 py-4 group">
                        {/* Timeline dot */}
                        <div className="flex flex-col items-center pt-1">
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            isCompleted ? "bg-emerald-500 border-emerald-500" :
                            isRescheduled ? "bg-amber-400 border-amber-400" :
                            isFailed ? "bg-red-500 border-red-500" :
                            "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                          }`}>
                            {isCompleted && <Check size={8} className="text-white mx-auto mt-px" />}
                          </div>
                          {i < todaySchedule.length - 1 && (
                            <div className="w-px h-full bg-gray-200 dark:bg-white/10 mt-1" />
                          )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 rounded-xl p-4 transition-all ${
                          isCompleted ? "bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10" :
                          isRescheduled ? "bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10" :
                          isFailed ? "bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10" :
                          "bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/20"
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                isCompleted ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" :
                                isRescheduled ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400" :
                                isFailed ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400" :
                                "bg-primary/10 text-primary"
                              }`}>
                                {CATEGORY_ICONS[payment.category] || <Wallet size={16} />}
                              </div>
                              <div>
                                <p className={`text-sm font-semibold ${
                                  isCompleted ? "text-emerald-700 dark:text-emerald-400 line-through" :
                                  isFailed ? "text-red-700 dark:text-red-400" :
                                  "text-gray-900 dark:text-white"
                                }`}>
                                  {payment.title}
                                </p>
                                {payment.recipient && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{payment.recipient}</p>
                                )}
                                {payment.description && (
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{payment.description}</p>
                                )}
                                {isRescheduled && payment.originalDate && (
                                  <p className="text-xs text-amber-500 mt-0.5 flex items-center gap-1">
                                    <RefreshCw size={10} />
                                    Rescheduled from {payment.originalDate}
                                    {payment.rescheduleCount && payment.rescheduleCount > 1 && ` (${payment.rescheduleCount}x)`}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">
                                {payment.time}
                              </p>
                              <p className={`text-xs font-semibold ${
                                isCompleted ? "text-emerald-600 dark:text-emerald-400" :
                                "text-gray-500 dark:text-gray-400"
                              }`}>
                                {isCompleted ? "Paid" : `₦${payment.amount.toLocaleString()}`}
                              </p>
                            </div>
                          </div>

                          {/* Action buttons */}
                          {!isCompleted && !isFailed && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                              <button
                                onClick={() => onComplete(payment.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors"
                              >
                                <Check size={12} />
                                Mark Paid
                              </button>
                              <button
                                onClick={() => setRescheduleTarget(payment.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors"
                              >
                                <RefreshCw size={12} />
                                Reschedule
                              </button>
                              <button
                                onClick={() => onCancel(payment.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-medium hover:bg-red-200 dark:hover:bg-red-500/30 transition-colors"
                              >
                                <X size={12} />
                                Cancel
                              </button>
                            </div>
                          )}

                          {isFailed && (
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                              <button
                                onClick={() => onComplete(payment.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                              >
                                <RefreshCw size={12} />
                                Retry Payment
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Calendar size={24} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No payments scheduled</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">for {MONTHS[currentMonth].slice(0, 3)} {selectedDate}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddModal(true)}
                    className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Plus size={14} />
                    Add payment
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN - Stats + Clock + Promo */}
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6">
          {/* Profile Card */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-primary/30">
                {profile.avatar}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{profile.name}</p>
                <p className="text-xs text-primary font-medium">My settings</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Scheduled</p>
              <MoreVertical size={14} className="text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₦{totalScheduled.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={12} className="text-emerald-500" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400">{upcomingPayments.length} upcoming</span>
            </div>

            {totalRescheduled > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Rescheduled</p>
                  <span className="text-xs text-amber-500">{rescheduledPayments.length}</span>
                </div>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                  ₦{totalRescheduled.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Clock & Weather */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {formatTime12(currentTime)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center justify-center gap-1">
              <Zap size={10} className="text-amber-400" />
              {getWeatherEmoji()}
            </p>
          </div>

          {/* Upcoming Payments List */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Up Next</p>
              <Bell size={14} className="text-gray-400" />
            </div>
            <div className="space-y-2.5">
              {upcomingPayments.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${CATEGORY_COLORS[p.category] || CATEGORY_COLORS.Other}`}>
                    {CATEGORY_ICONS[p.category] || <Wallet size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{p.title}</p>
                    <p className="text-[10px] text-gray-400">{p.date} {p.time}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">₦{(p.amount / 1000).toFixed(0)}k</p>
                </div>
              ))}
              {upcomingPayments.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">No upcoming payments</p>
              )}
            </div>
          </div>

          {/* Promo Card */}
          <div className="bg-gradient-to-br from-[#0b0e14] to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <p className="text-lg font-bold leading-tight">Auto-pay your bills on time</p>
              <p className="text-xs text-gray-400 mt-2">Set up recurring payments and never miss a due date again.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="mt-4 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Get Started
                <ArrowRight size={12} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Payment Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddPaymentModal
            onClose={() => setShowAddModal(false)}
            onAdd={onAddPayment}
            profile={profile}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* Add Payment Modal */
function AddPaymentModal({
  onClose,
  onAdd,
  profile,
}: {
  onClose: () => void;
  onAdd: (payment: Omit<ScheduledPayment, "id">) => void;
  profile: UserProfile;
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState<ScheduledPayment["frequency"]>("once");
  const [category, setCategory] = useState<ScheduledPayment["category"]>("Bills");
  const [recipient, setRecipient] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title || !amount || !date || !time) return;
    onAdd({
      title,
      amount: parseFloat(amount),
      currency: profile.currency,
      date,
      time,
      frequency,
      category,
      status: "upcoming",
      recipient: recipient || undefined,
      description: description || undefined,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Schedule New Payment</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Monthly Rent, Netflix Subscription"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Amount (₦)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ScheduledPayment["category"])}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all appearance-none"
                >
                  <option value="Bills">Bills</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Savings">Savings</option>
                  <option value="Subscription">Subscription</option>
                  <option value="Rent">Rent</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    setDate(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => {
                    const [h, m] = e.target.value.split(":");
                    const hour = parseInt(h);
                    const ampm = hour >= 12 ? "PM" : "AM";
                    const h12 = hour % 12 || 12;
                    setTime(`${h12}:${m} ${ampm}`);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Frequency</label>
              <div className="grid grid-cols-5 gap-2">
                {(["once", "daily", "weekly", "monthly", "yearly"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrequency(f)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      frequency === f
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Recipient (optional)</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Name or account"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title || !amount || !date || !time}
              className="flex-1 px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30"
            >
              Schedule Payment
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
