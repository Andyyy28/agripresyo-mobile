import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { UserRole } from '../types';

export interface AppNotification {
  id: string;
  type: 'price_drop' | 'announcement' | 'price_surge' | 'low_stock' | 'review';
  icon: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  roles: UserRole[]; // which roles can see this notification
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isPanelOpen: boolean;
  notificationsEnabled: boolean;
  openPanel: () => void;
  closePanel: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  toggleNotifications: () => void;
  getFilteredNotifications: (role: UserRole) => AppNotification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const mockNotifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'price_drop',
    icon: '🔻',
    title: 'Price Drop Alert',
    message: 'Kangkong dropped to ₱28.00 at Bankerohan',
    timestamp: '5 mins ago',
    isRead: false,
    roles: ['consumer', 'vendor'],
  },
  {
    id: 'n2',
    type: 'announcement',
    icon: '📢',
    title: 'Market Announcement',
    message: 'Market hours extended this Saturday',
    timestamp: '2 hours ago',
    isRead: false,
    roles: ['consumer', 'vendor'],
  },
  {
    id: 'n3',
    type: 'price_surge',
    icon: '📈',
    title: 'Price Surge',
    message: 'Onion increased by 12% today',
    timestamp: '5 hours ago',
    isRead: false,
    roles: ['consumer', 'vendor'],
  },
  {
    id: 'n4',
    type: 'low_stock',
    icon: '📦',
    title: 'Low Stock Warning',
    message: 'Your Okra stock is below 10kg',
    timestamp: '1 hour ago',
    isRead: false,
    roles: ['vendor'],
  },
  {
    id: 'n5',
    type: 'review',
    icon: '⭐',
    title: 'New Review',
    message: 'Someone rated your shop 5 stars',
    timestamp: '3 hours ago',
    isRead: false,
    roles: ['vendor'],
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('agripresyo_notifications_enabled');
    return stored !== null ? stored === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('agripresyo_notifications_enabled', String(notificationsEnabled));
  }, [notificationsEnabled]);

  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled(prev => !prev);
  }, []);

  const unreadCount = notificationsEnabled ? notifications.filter(n => !n.isRead).length : 0;

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const getFilteredNotifications = useCallback(
    (role: UserRole) => notifications.filter(n => n.roles.includes(role)),
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isPanelOpen,
        notificationsEnabled,
        openPanel,
        closePanel,
        markAsRead,
        markAllAsRead,
        toggleNotifications,
        getFilteredNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
