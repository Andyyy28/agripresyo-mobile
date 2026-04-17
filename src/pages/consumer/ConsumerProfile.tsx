import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { User, ShoppingBasket, Bell, Moon, Sun, Globe, ChevronRight, LogOut, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const ConsumerProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const settingsItems = [
    { icon: Bell, label: 'Notifications', value: 'On', color: '#22c55e', onClick: () => {} },
    { icon: isDark ? Moon : Sun, label: 'Dark Mode', value: isDark ? 'On' : 'Off', color: '#8b5cf6', onClick: toggleTheme },
    { icon: Globe, label: 'Language', value: 'English', color: '#3b82f6', onClick: () => {} },
    { icon: Shield, label: 'Privacy', value: '', color: '#f59e0b', onClick: () => {} },
  ];

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <header>
        <h1 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-[#111827]'}`}>Profile</h1>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-6 flex flex-col items-center gap-4 relative overflow-hidden ${
            isDark ? 'bg-gradient-to-br from-[#141418] to-[#1a1a20] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
          }`}
        >
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${isDark ? 'bg-[#22c55e]/5' : 'bg-[#22c55e]/10'}`} />

          <div className={`w-20 h-20 rounded-2xl border-2 flex items-center justify-center relative z-10 ${
            isDark ? 'bg-[#1a1a1e] border-[#1f1f23] text-gray-400' : 'bg-gray-100 border-[#e5e7eb] text-gray-500'
          }`}>
            <User size={40} />
          </div>

          <div className="text-center relative z-10">
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{user?.name || 'User'}</h2>
            <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{user?.email || 'user@email.com'}</p>
          </div>

          <div className="flex items-center gap-2 bg-[#22c55e]/10 px-4 py-1.5 rounded-full relative z-10">
            <ShoppingBasket size={14} className="text-[#22c55e]" />
            <span className="text-[#22c55e] text-xs font-black uppercase tracking-wider">Consumer</span>
          </div>
        </motion.div>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { label: 'Saved', value: '12', color: isDark ? 'text-[#22c55e]' : 'text-[#16a34a]' },
          { label: 'Budget', value: '₱2.4k', color: isDark ? 'text-white' : 'text-[#111827]' },
          { label: 'Lists', value: '8', color: isDark ? 'text-white' : 'text-[#111827]' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl border p-4 text-center ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            <p className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Settings */}
      <section className="flex flex-col gap-2">
        <h3 className={`text-xs font-black uppercase tracking-widest px-1 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Settings</h3>
        <div className={`rounded-2xl border divide-y overflow-hidden ${isDark ? 'bg-[#141418] border-[#1f1f23] divide-[#1f1f23]' : 'bg-white border-[#e5e7eb] divide-[#e5e7eb]'}`}>
          {settingsItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 px-5 py-4 transition-colors text-left ${isDark ? 'hover:bg-[#1a1a1e]' : 'hover:bg-gray-50'}`}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                <item.icon size={18} />
              </div>
              <span className={`flex-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{item.label}</span>
              {item.value && <span className={`text-xs font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{item.value}</span>}
              <ChevronRight size={16} className={isDark ? 'text-gray-700' : 'text-gray-300'} />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <section>
        <button
          id="consumer-logout"
          onClick={handleLogout}
          className="w-full bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-2xl py-4 flex items-center justify-center gap-3 text-[#ef4444] font-bold text-sm hover:bg-[#ef4444]/15 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </section>

      <p className={`text-center text-[10px] font-bold uppercase tracking-widest pb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
        AgriPresyo v2.0.0
      </p>
    </div>
  );
};

export default ConsumerProfile;
