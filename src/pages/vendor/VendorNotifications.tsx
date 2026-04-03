import React, { useState } from 'react';
import { announcements } from '../../data/mockData';
import { Bell, Calendar, Megaphone, AlertTriangle, CheckCircle, MessageSquare, ChevronDown, ChevronUp, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  type: 'announcement' | 'alert' | 'update';
  title: string;
  content: string;
  date: string;
  isRead: boolean;
}

const VendorNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    ...announcements.map(a => ({
      id: a.id,
      type: 'announcement' as const,
      title: a.title,
      content: a.content,
      date: a.date,
      isRead: false,
    })),
    {
      id: '3',
      type: 'alert',
      title: 'Low Stock Warning',
      content: 'Siling Labuyo and Native Tomato are running low. Consider restocking soon to avoid missed sales.',
      date: 'Apr 02, 2026',
      isRead: false,
    },
    {
      id: '4',
      type: 'update',
      title: 'Price Update Recorded',
      content: 'Your price update for Carabao Mango (₱220/kg) has been recorded and is now visible to consumers.',
      date: 'Apr 01, 2026',
      isRead: true,
    },
    {
      id: '5',
      type: 'alert',
      title: 'Market Holiday Notice',
      content: 'The market will be closed on April 9 (Araw ng Kagitingan). Plan your deliveries accordingly.',
      date: 'Mar 30, 2026',
      isRead: true,
    },
  ]);

  const [showConcernForm, setShowConcernForm] = useState(false);
  const [concernSubject, setConcernSubject] = useState('');
  const [concernCategory, setConcernCategory] = useState('general');
  const [concernDescription, setConcernDescription] = useState('');
  const [concernSubmitted, setConcernSubmitted] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleConcernSubmit = () => {
    if (!concernSubject || !concernDescription) return;
    setConcernSubmitted(true);
    setTimeout(() => {
      setConcernSubmitted(false);
      setShowConcernForm(false);
      setConcernSubject('');
      setConcernCategory('general');
      setConcernDescription('');
    }, 2000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Megaphone size={18} />;
      case 'alert': return <AlertTriangle size={18} />;
      case 'update': return <CheckCircle size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'announcement': return '#3b82f6';
      case 'alert': return '#ef4444';
      case 'update': return '#22c55e';
      default: return '#71717a';
    }
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-gray-500 text-xs font-bold mt-1">{unreadCount} unread</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest"
            >
              Mark all read
            </button>
          )}
          <button 
            onClick={() => setShowConcernForm(!showConcernForm)}
            className="p-2.5 bg-[#141418] rounded-xl border border-[#1f1f23] text-gray-400 hover:text-[#22c55e] transition-colors"
          >
            <MessageSquare size={18} />
          </button>
        </div>
      </header>

      {/* Concern Form */}
      <AnimatePresence>
        {showConcernForm && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare size={14} className="text-[#22c55e]" />
                  Submit a Concern
                </h3>
                <button onClick={() => setShowConcernForm(false)} className="text-gray-600 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {concernSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6"
                >
                  <div className="w-12 h-12 rounded-full bg-[#22c55e]/15 flex items-center justify-center">
                    <CheckCircle size={24} className="text-[#22c55e]" />
                  </div>
                  <p className="text-sm font-bold text-[#22c55e]">Concern submitted successfully!</p>
                  <p className="text-xs text-gray-500">We'll review and respond within 24 hours.</p>
                </motion.div>
              ) : (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Subject</label>
                    <input
                      type="text"
                      placeholder="Brief subject line..."
                      value={concernSubject}
                      onChange={(e) => setConcernSubject(e.target.value)}
                      className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#22c55e]/50 placeholder-gray-600"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</label>
                    <select
                      value={concernCategory}
                      onChange={(e) => setConcernCategory(e.target.value)}
                      className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#22c55e]/50"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="pricing">Pricing Issue</option>
                      <option value="technical">Technical Problem</option>
                      <option value="complaint">Complaint</option>
                      <option value="suggestion">Suggestion</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Description</label>
                    <textarea
                      placeholder="Describe your concern in detail..."
                      value={concernDescription}
                      onChange={(e) => setConcernDescription(e.target.value)}
                      rows={4}
                      className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#22c55e]/50 resize-none placeholder-gray-600"
                    />
                  </div>

                  <button
                    onClick={handleConcernSubmit}
                    className="w-full bg-[#22c55e] text-black py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#1db053] transition-colors active:scale-[0.98]"
                  >
                    <Send size={16} />
                    Submit Concern
                  </button>
                </>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Notification List */}
      <section className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            layout
            onClick={() => markAsRead(notification.id)}
            className={`bg-[#141418] rounded-2xl border p-4 flex gap-4 cursor-pointer transition-all ${
              notification.isRead ? 'border-[#1f1f23] opacity-60' : 'border-[#1f1f23] hover:border-[#2a2a2e]'
            }`}
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: `${getColor(notification.type)}15`, color: getColor(notification.type) }}
            >
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-bold text-sm flex-1">{notification.title}</h4>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-[#22c55e] rounded-full shrink-0 mt-1.5" />
                )}
              </div>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{notification.content}</p>
              <div className="flex items-center gap-1.5 mt-2 text-gray-600">
                <Calendar size={10} />
                <span className="text-[10px] font-bold">{notification.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default VendorNotifications;
