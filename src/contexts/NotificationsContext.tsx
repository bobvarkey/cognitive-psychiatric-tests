import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  isNativePushAvailable,
  onPushMessage,
  registerPushNotifications,
  type PushMessage,
} from '@/lib/appbuild/push';

const STORAGE_KEY = 'psycognito.notifications.v1';
const MAX_ITEMS = 50;

interface NotificationsContextType {
  notifications: PushMessage[];
  unreadCount: number;
  pushEnabled: boolean;
  pushToken: string | null;
  markAllRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

function load(): PushMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PushMessage[]) : [];
  } catch {
    return [];
  }
}

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<PushMessage[]>(() => load());
  const [unreadCount, setUnreadCount] = useState(0);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    if (!isNativePushAvailable()) return;

    registerPushNotifications().then((reg) => {
      if (!active || !reg) return;
      setPushToken(reg.token);
      setPushEnabled(true);
    });

    const unsubscribe = onPushMessage((message) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === message.id)) return prev;
        const next = [message, ...prev].slice(0, MAX_ITEMS);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* storage full or unavailable — keep in memory only */
        }
        return next;
      });
      setUnreadCount((c) => c + 1);
      toast(message.title, { description: message.body || undefined });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const markAllRead = () => setUnreadCount(0);

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, pushEnabled, pushToken, markAllRead, clearAll }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextType => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationsProvider');
  return ctx;
};
