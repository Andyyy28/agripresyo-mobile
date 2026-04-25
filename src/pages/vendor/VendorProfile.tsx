import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Store, CheckCircle, Bell, Moon, Sun, Globe, ChevronRight, LogOut, Shield, MapPin, Package, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCommodityBg } from '../../data/commodityColors';

const VendorProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleLangChange = (lang: 'en' | 'fil') => {
    setLanguage(lang);
    setShowLangPicker(false);
  };

  const verificationStatus = user?.verificationStatus || 'none';

  const stallInfo = {
    name: user?.shopName || `${user?.name || 'Vendor'}'s Shop`,
    location: user?.marketLocation ? `${user.marketLocation} Market` : 'Stall #42-B • Main Market',
  };

  const commoditiesSold = [
    { name: 'Carabao Mango', slug: 'mango' },
    { name: 'Pineapple', slug: 'pineapple' },
    { name: 'Red Onion', slug: 'onion' },
    { name: 'Siling Labuyo', slug: 'chili' },
    { name: 'Highland Carrots', slug: 'carrot' },
    { name: 'Native Tomato', slug: 'tomato' },
  ];

  const settingsItems = [
    { icon: Bell, label: t('notifications_label'), value: t('on'), color: '#22c55e', onClick: () => {} },
    { icon: isDark ? Moon : Sun, label: t('dark_mode'), value: isDark ? t('on') : t('off'), color: '#8b5cf6', onClick: toggleTheme },
    { icon: Globe, label: t('language'), value: language === 'en' ? 'English' : 'Filipino', color: '#3b82f6', onClick: () => setShowLangPicker(true) },
    { icon: Shield, label: t('privacy'), value: '', color: '#f59e0b', onClick: () => {} },
  ];

  // Verification badge renderer
  const renderVerificationBadge = () => {
    if (verificationStatus === 'verified') {
      return <CheckCircle size={16} className="text-[#22c55e]" />;
    }
    if (verificationStatus === 'pending') {
      return (
        <span className="text-[8px] font-black uppercase tracking-wider text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded-full">
          {t('pending')}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <header>
        <h1 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('profile')}</h1>

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
              <span className="text-[#22c55e] text-[10px] font-black uppercase tracking-wider">{t('vendor_label')}</span>
            </div>
            {verificationStatus === 'verified' && (
              <div className="bg-[#3b82f6]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <CheckCircle size={12} className="text-[#3b82f6]" />
                <span className="text-[#3b82f6] text-[10px] font-black uppercase tracking-wider">{t('verified')}</span>
              </div>
            )}
            {verificationStatus === 'pending' && (
              <div className="bg-[#f59e0b]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Clock size={12} className="text-[#f59e0b]" />
                <span className="text-[#f59e0b] text-[10px] font-black uppercase tracking-wider">{t('pending')}</span>
              </div>
            )}
          </div>
        </motion.div>
      </header>

      {/* Account Info */}
      <section className={`rounded-2xl border p-5 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
        <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('account')}</h3>
        <div className="flex flex-col gap-2">
          {[
            { label: t('name_label'), value: user?.name || 'Vendor' },
            { label: t('shop_name_label'), value: user?.shopName || `${user?.name || 'Vendor'}'s Shop` },
            { label: t('email_label'), value: user?.email || 'vendor@email.com' },
            { label: t('member_since'), value: 'Jan 2026' },
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
          {t('commodities_sold')}
        </h3>
        <div className={`rounded-2xl border p-4 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
          <div className="flex flex-wrap gap-2">
            {commoditiesSold.map((item) => (
              <div key={item.name} className={`border rounded-full px-3 py-2 flex items-center gap-2 ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e]' : 'bg-white border-gray-200'}`}>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center overflow-hidden ${getCommodityBg(item.slug, isDark)}`}>
                  <img
                    src={`/images/commodities/${item.slug}.webp`}
                    alt={item.name}
                    className="w-full h-full object-contain p-0.5"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="flex flex-col gap-2">
        <h3 className={`text-xs font-black uppercase tracking-widest px-1 mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('settings')}</h3>
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
          {t('sign_out')}
        </button>
      </section>

      <p className={`text-center text-[10px] font-bold uppercase tracking-widest pb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`}>
        AgriPresyo v2.0.0
      </p>

      {/* Language Picker Modal */}
      <AnimatePresence>
        {showLangPicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
              onClick={() => setShowLangPicker(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-[85] px-8"
            >
              <div className={`w-full max-w-[320px] rounded-2xl border p-6 ${isDark ? 'bg-[#111114] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('language')}</h3>
                  <button onClick={() => setShowLangPicker(false)} className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                    <X size={18} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'English', flag: '🇺🇸', value: 'en' as const },
                    { label: 'Filipino', flag: '🇵🇭', value: 'fil' as const },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleLangChange(opt.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                        language === opt.value
                          ? 'bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#22c55e]'
                          : isDark
                            ? 'bg-[#1a1a1e] border border-[#2a2a2e] text-white hover:border-[#22c55e]/20'
                            : 'bg-gray-50 border border-[#e5e7eb] text-[#111827] hover:border-[#22c55e]/20'
                      }`}
                    >
                      <span className="text-lg">{opt.flag}</span>
                      {opt.label}
                      {language === opt.value && <span className="ml-auto text-[#22c55e]">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorProfile;
