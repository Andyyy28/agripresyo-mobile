import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Store, CheckCircle, Bell, Moon, Sun, Globe, ChevronRight, LogOut, Shield, MapPin, Package, Clock } from 'lucide-react';
import { motion } from 'motion/react';

const VendorProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const verificationStatus = user?.verificationStatus || 'none';

  const stallInfo = {
    name: user?.shopName || `${user?.name || 'Vendor'}'s Shop`,
    location: user?.marketLocation ? `${user.marketLocation} Market` : 'Stall #42-B • Main Market',
  };

  const commoditiesSold = [
    { name: 'Carabao Mango', emoji: '🥭' },
    { name: 'Pineapple', emoji: '🍍' },
    { name: 'Red Onion', emoji: '🧅' },
    { name: 'Siling Labuyo', emoji: '🌶️' },
    { name: 'Highland Carrots', emoji: '🥕' },
    { name: 'Native Tomato', emoji: '🍅' },
  ];

  const settingsItems = [
    { icon: Bell, label: 'Notifications', value: 'On', color: '#22c55e', onClick: () => {} },
    { icon: isDark ? Moon : Sun, label: 'Dark Mode', value: isDark ? 'On' : 'Off', color: '#8b5cf6', onClick: toggleTheme },
    { icon: Globe, label: 'Language', value: 'English', color: '#3b82f6', onClick: () => {} },
    { icon: Shield, label: 'Privacy', value: '', color: '#f59e0b', onClick: () => {} },
  ];

  // Verification badge renderer
  const renderVerificationBadge = () => {
    if (verificationStatus === 'verified') {
      return <CheckCircle size={16} className="text-[#22c55e]" />;
    }
    if (verificationStatus === 'pending') {
      return (
        <span className="text-[8px] font-black uppercase tracking-wider text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded-full">
          Pending
        </span>
      );
    }
    return null;
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <header>
        <h1 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-[#111827]'}`}>Profile</h1>

        {/* Vendor Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-6 relative overflow-hidden ${
            isDark ? 'bg-gradient-to-br from-[#141418] to-[#1a1a20] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
          }`}
        >
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl ${isDark ? 'bg-[#22c55e]/5' : 'bg-[#22c55e]/10'}`} />

          <div className="flex items-center gap-4 relative z-10 mb-4">
            <div className="w-16 h-16 bg-[#22c55e]/10 rounded-2xl flex items-center justify-center text-[#22c55e] border border-[#22c55e]/20">
              <Store size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{stallInfo.name}</h2>
                {renderVerificationBadge()}
              </div>
              <div className={`flex items-center gap-1.5 text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <MapPin size={12} />
                <p>{stallInfo.location}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <div className="bg-[#22c55e]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Store size={12} className="text-[#22c55e]" />
              <span className="text-[#22c55e] text-[10px] font-black uppercase tracking-wider">Vendor</span>
            </div>
            {verificationStatus === 'verified' && (
              <div className="bg-[#3b82f6]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle size={12} className="text-[#3b82f6]" />
                <span className="text-[#3b82f6] text-[10px] font-black uppercase tracking-wider">Verified</span>
              </div>
            )}
            {verificationStatus === 'pending' && (
              <div className="bg-[#f59e0b]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Clock size={12} className="text-[#f59e0b]" />
                <span className="text-[#f59e0b] text-[10px] font-black uppercase tracking-wider">Pending</span>
              </div>
            )}
          </div>
        </motion.div>
      </header>

      {/* Account Info */}
      <section className={`rounded-2xl border p-5 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
        <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Account</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: 'Name', value: user?.name || 'Vendor' },
            { label: 'Shop Name', value: user?.shopName || `${user?.name || 'Vendor'}'s Shop` },
            { label: 'Email', value: user?.email || 'vendor@email.com' },
            { label: 'Member Since', value: 'Jan 2026' },
          ].map(item => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>{item.label}</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Commodities Sold */}
      <section className="flex flex-col gap-3">
        <h3 className={`text-xs font-black uppercase tracking-widest px-1 flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <Package size={12} />
          Commodities Sold
        </h3>
        <div className={`rounded-2xl border p-4 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
          <div className="flex flex-wrap gap-2">
            {commoditiesSold.map((item) => (
              <div key={item.name} className={`border rounded-lg px-3 py-2 flex items-center gap-2 ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e]' : 'bg-gray-50 border-[#e5e7eb]'}`}>
                <span className="text-sm">{item.emoji}</span>
                <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="flex flex-col gap-2">
        <h3 className={`text-xs font-black uppercase tracking-widest px-1 mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Settings</h3>
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
          id="vendor-logout"
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

export default VendorProfile;
