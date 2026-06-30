import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  MoonIcon,
  SunIcon,
  CheckIcon
} from "@heroicons/react/24/outline";
import { useNotification } from "./NotificationSystem";
import api from "../services/api";

interface NotificationSettingsProps {
  userId?: string;
}

interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  transactions: boolean;
  marketing: boolean;
  security: boolean;
  muted: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export default function NotificationSettings({ userId }: NotificationSettingsProps) {
  const { notify } = useNotification();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    push: true,
    transactions: true,
    marketing: false,
    security: true,
    muted: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00"
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load preferences from backend first, fallback to localStorage
    const loadPreferences = async () => {
      if (userId) {
        try {
          const response = await api.get(`/notification-prefs/${userId}`);
          if (response.data.success && response.data.preferences) {
            setPreferences(response.data.preferences);
            // Also save to localStorage as cache
            localStorage.setItem(`notification_prefs_${userId}`, JSON.stringify(response.data.preferences));
            return;
          }
        } catch (e) {
          console.warn("Failed to load preferences from backend, using localStorage");
        }
      }
      
      // Fallback to localStorage
      const saved = localStorage.getItem(`notification_prefs_${userId}`);
      if (saved) {
        try {
          setPreferences(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse notification preferences", e);
        }
      }
    };
    
    loadPreferences();
  }, [userId]);

  const savePreferences = async (newPrefs: NotificationPreferences) => {
    setSaving(true);
    try {
      // Save to localStorage as cache
      localStorage.setItem(`notification_prefs_${userId}`, JSON.stringify(newPrefs));
      
      // Save to backend
      if (userId) {
        await api.post(`/notification-prefs/${userId}`, newPrefs);
      }
      
      notify("success", "Settings Saved", "Your notification preferences have been updated.");
    } catch (error) {
      console.error("Failed to save preferences:", error);
      notify("error", "Save Failed", "Could not save notification preferences.");
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    savePreferences(newPrefs);
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    label, 
    description 
  }: { 
    enabled: boolean; 
    onChange: (value: boolean) => void; 
    label: string;
    description?: string;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/10 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-semibold text-[#0b0e14] dark:text-white">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <BellIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#0b0e14] dark:text-white">
            Notification Settings
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Control how you receive notifications
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notification Channels */}
        <div>
          <h4 className="text-sm font-bold text-[#0b0e14] dark:text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Notification Channels
          </h4>
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
            <ToggleSwitch
              enabled={preferences.email}
              onChange={(value) => updatePreference("email", value)}
              label="Email Notifications"
              description="Receive notifications via email"
            />
            <ToggleSwitch
              enabled={preferences.sms}
              onChange={(value) => updatePreference("sms", value)}
              label="SMS Notifications"
              description="Receive text messages for important alerts"
            />
            <ToggleSwitch
              enabled={preferences.push}
              onChange={(value) => updatePreference("push", value)}
              label="Push Notifications"
              description="Receive push notifications in your browser"
            />
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h4 className="text-sm font-bold text-[#0b0e14] dark:text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Notification Types
          </h4>
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
            <ToggleSwitch
              enabled={preferences.transactions}
              onChange={(value) => updatePreference("transactions", value)}
              label="Transaction Alerts"
              description="Get notified for all transactions"
            />
            <ToggleSwitch
              enabled={preferences.security}
              onChange={(value) => updatePreference("security", value)}
              label="Security Alerts"
              description="Login attempts and security updates"
            />
            <ToggleSwitch
              enabled={preferences.marketing}
              onChange={(value) => updatePreference("marketing", value)}
              label="Marketing & Promotions"
              description="Receive promotional offers and updates"
            />
          </div>
        </div>

        {/* Do Not Disturb */}
        <div>
          <h4 className="text-sm font-bold text-[#0b0e14] dark:text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full"></span>
            Do Not Disturb
          </h4>
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
            <ToggleSwitch
              enabled={preferences.muted}
              onChange={(value) => updatePreference("muted", value)}
              label="Mute All Notifications"
              description="Temporarily disable all notifications"
            />
            
            {preferences.muted && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3">
                  Quiet Hours
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={preferences.quietHoursStart}
                      onChange={(e) => updatePreference("quietHoursStart", e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-[#0b0e14] dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={preferences.quietHoursEnd}
                      onChange={(e) => updatePreference("quietHoursEnd", e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg text-sm text-[#0b0e14] dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => savePreferences(preferences)}
          disabled={saving}
          className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              Saving...
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4" />
              Save Preferences
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
