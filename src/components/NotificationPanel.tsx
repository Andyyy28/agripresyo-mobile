import React from 'react';
import { X, Tag, AlertTriangle, Megaphone, Star, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NotificationPanel: React.FC = () => {
  const { isPanelOpen, closePanel, markAsRead, markAllAsRead, getFilteredNotifications, unreadCount } = useNotifications();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const role = user?.role || 'consumer';
  const filteredNotifications = getFilteredNotifications(role);
  const roleUnread = filteredNotifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'price_drop': return <Tag size={16} />;
      case 'price_surge': return <Tag size={16} />;
      case 'announcement': return <Megaphone size={16} />;
      case 'low_stock': return <Package size={16} />;
      case 'review': return <Star size={16} />;
      default: return <Tag size={16} />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'price_drop': return '#ef4444';
      case 'price_surge': return '#22c55e';
      case 'announcement': return '#3b82f6';
      case 'low_stock': return '#f59e0b';
      case 'review': return '#f59e0b';
      default: return '#71717a';
    }
  };

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
            onClick={closePanel}
          />

          {/* Panel sliding from right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[85] flex justify-end"
          >
            <div className={`w-[340px] max-w-[90vw] h-full flex flex-col shadow-2xl ${
              isDark ? 'bg-[#0a0a0a]' : 'bg-white'
            }`}>
              {/* Header */}
              <div className={`px-5 py-4 flex items-center justify-between border-b ${
                isDark ? 'border-[#1f1f23]' : 'border-[#e5e7eb]'
              }`}>
                <div className="flex items-center gap-3">
                  {/* Replace /public/images/logo.png to update logo globally */}
                  <img
                    src="/images/logo.png"
                    alt="AgriPresyo"
                    className="h-6 w-auto object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>Notifications</h2>
                </div>
                <div className="flex items-center gap-3">
                  {roleUnread > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[#22c55e] text-[10px] font-black uppercase tracking-wider"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={closePanel}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isDark ? 'text-gray-400 hover:text-white hover:bg-[#1a1a1e]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <p className={`text-sm font-bold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>No notifications</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`w-full flex gap-3 px-5 py-4 text-left transition-colors border-b ${
                        notification.isRead
                          ? isDark
                            ? 'bg-[#0a0a0a] border-[#1f1f23]'
                            : 'bg-white border-[#e5e7eb]'
                          : isDark
                            ? 'bg-[#1a1a1e] border-l-2 border-l-[#22c55e] border-b-[#1f1f23]'
                            : 'bg-[#f0fdf4] border-l-2 border-l-[#22c55e] border-b-[#e5e7eb]'
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${getIconColor(notification.type)}15`, color: getIconColor(notification.type) }}
                      >
                        {getIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{notification.title}</p>
                          <span className={`text-[10px] font-medium shrink-0 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            {notification.timestamp}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;
