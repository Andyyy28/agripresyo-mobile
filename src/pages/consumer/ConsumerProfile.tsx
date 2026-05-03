import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, ShoppingBasket, Bell, Moon, Sun, Globe, ChevronRight, LogOut, Shield, X, ArrowLeft, FileText, ScrollText, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ConsumerProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [privacyView, setPrivacyView] = useState<'menu' | 'policy' | 'terms'>('menu');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleLangChange = (lang: 'en' | 'fil') => {
    setLanguage(lang);
    setShowLangPicker(false);
  };

  const settingsItems = [
    { icon: Bell, label: t('notifications_label'), value: t('on'), color: '#22c55e', onClick: () => {} },
    { icon: isDark ? Moon : Sun, label: t('dark_mode'), value: isDark ? t('on') : t('off'), color: '#8b5cf6', onClick: toggleTheme },
    { icon: Globe, label: t('language'), value: language === 'en' ? 'English' : 'Filipino', color: '#3b82f6', onClick: () => setShowLangPicker(true) },
    { icon: Shield, label: t('privacy'), value: '', color: '#f59e0b', onClick: () => { setShowPrivacy(true); setPrivacyView('menu'); } },
  ];

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <header>
        <h1 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('profile')}</h1>

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
            <span className="text-[#22c55e] text-xs font-black uppercase tracking-wider">{t('consumer_label')}</span>
          </div>
        </motion.div>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { label: t('saved'), value: '12', color: isDark ? 'text-[#22c55e]' : 'text-[#16a34a]' },
          { label: t('budget'), value: '₱2.4k', color: isDark ? 'text-white' : 'text-[#111827]' },
          { label: t('lists'), value: '8', color: isDark ? 'text-white' : 'text-[#111827]' },
        ].map(stat => (
          <div key={stat.label} className={`rounded-2xl border p-4 text-center ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
            <p className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Settings */}
      <section className="flex flex-col gap-2">
        <h3 className={`text-xs font-black uppercase tracking-widest px-1 mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('settings')}</h3>
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
          {t('sign_out')}
        </button>
      </section>

      <p className="text-center text-[10px] font-bold uppercase tracking-widest pb-4">
        <span style={{ color: '#518706' }}>Agri</span><span style={{ color: isDark ? '#FFFFFF' : '#000000' }}>Presyo</span> <span className={isDark ? 'text-gray-700' : 'text-gray-300'}>v2.0.0</span>
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

      {/* Privacy Panel Overlay */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed inset-0 z-[90] overflow-y-auto no-scrollbar ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8faf8]'}`}
          >
            <div className="w-full max-w-[430px] mx-auto px-5 py-6">
              {/* Back button */}
              <button
                onClick={() => {
                  if (privacyView !== 'menu') {
                    setPrivacyView('menu');
                  } else {
                    setShowPrivacy(false);
                  }
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-colors ${isDark ? 'bg-[#141418] border border-[#1f1f23] text-gray-400 hover:text-white' : 'bg-white border border-[#e5e7eb] text-gray-500 hover:text-gray-700'}`}
              >
                <ArrowLeft size={20} />
              </button>

              <h2 className={`text-xl font-black mb-6 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                {privacyView === 'menu' ? 'Privacy' : privacyView === 'policy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>

              {privacyView === 'menu' && (
                <div className={`rounded-2xl border divide-y overflow-hidden ${isDark ? 'bg-[#141418] border-[#1f1f23] divide-[#1f1f23]' : 'bg-white border-[#e5e7eb] divide-[#e5e7eb]'}`}>
                  {/* Privacy Policy */}
                  <button
                    onClick={() => setPrivacyView('policy')}
                    className={`w-full flex items-center gap-4 px-5 py-4 transition-colors text-left ${isDark ? 'hover:bg-[#1a1a1e]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#3b82f6]/15 text-[#3b82f6]">
                      <FileText size={18} />
                    </div>
                    <span className={`flex-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Privacy Policy</span>
                    <ChevronRight size={16} className={isDark ? 'text-gray-700' : 'text-gray-300'} />
                  </button>

                  {/* Terms of Service */}
                  <button
                    onClick={() => setPrivacyView('terms')}
                    className={`w-full flex items-center gap-4 px-5 py-4 transition-colors text-left ${isDark ? 'hover:bg-[#1a1a1e]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#22c55e]/15 text-[#22c55e]">
                      <ScrollText size={18} />
                    </div>
                    <span className={`flex-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-[#111827]'}`}>Terms of Service</span>
                    <ChevronRight size={16} className={isDark ? 'text-gray-700' : 'text-gray-300'} />
                  </button>

                  {/* Delete Account */}
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className={`w-full flex items-center gap-4 px-5 py-4 transition-colors text-left ${isDark ? 'hover:bg-[#1a1a1e]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#ef4444]/15 text-[#ef4444]">
                      <Trash2 size={18} />
                    </div>
                    <span className="flex-1 text-sm font-semibold text-[#ef4444]">Delete Account</span>
                    <ChevronRight size={16} className={isDark ? 'text-gray-700' : 'text-gray-300'} />
                  </button>
                </div>
              )}

              {/* Privacy Policy Content */}
              {privacyView === 'policy' && (
                <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
                  <div className={`flex flex-col gap-4 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>Effective Date:</strong> January 1, 2026</p>
                    <p>AgriPresyo ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use the AgriPresyo mobile application.</p>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>Information We Collect</strong></p>
                    <p>We collect your name, email address, and role (consumer or vendor) when you create an account. We also collect usage data such as commodity searches, watchlist preferences, and budget planner activity to improve your experience.</p>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>How We Use Your Information</strong></p>
                    <p>Your data is used to provide personalized price tracking, budget recommendations, and market insights. We do not sell or share your personal information with third parties for marketing purposes.</p>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>Data Security</strong></p>
                    <p>We implement industry-standard security measures to protect your data. All transmissions are encrypted and account credentials are securely hashed.</p>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>Your Rights</strong></p>
                    <p>You may request access to, correction of, or deletion of your personal data at any time through the app settings or by contacting us at support@agripresyo.com.</p>
                  </div>
                </div>
              )}

              {/* Terms of Service Content */}
              {privacyView === 'terms' && (
                <div className={`rounded-2xl border p-5 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
                  <div className={`flex flex-col gap-4 text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>Effective Date:</strong> January 1, 2026</p>
                    <p>By using AgriPresyo, you agree to the following terms and conditions. Please read them carefully before creating an account or using the application.</p>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>Use of Service</strong></p>
                    <p>AgriPresyo provides real-time agricultural commodity price tracking for the Kabacan, North Cotabato region. Prices displayed are based on available market data and may not reflect exact transaction prices at all terminals.</p>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>User Accounts</strong></p>
                    <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information during registration and to update it as necessary.</p>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>Prohibited Conduct</strong></p>
                    <p>Users may not misuse the platform by submitting false pricing data, impersonating vendors, or engaging in activities that disrupt the service for others.</p>
                    <p><strong className={isDark ? 'text-white' : 'text-[#111827]'}>Limitation of Liability</strong></p>
                    <p>AgriPresyo is provided "as is" without warranties of any kind. We are not liable for any losses resulting from reliance on the price data or market insights provided through the application.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Account Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[95]"
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-[100] px-8"
            >
              <div className={`w-full max-w-[320px] rounded-2xl border p-6 ${isDark ? 'bg-[#111114] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
                <div className="w-12 h-12 rounded-xl bg-[#ef4444]/15 flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-[#ef4444]" />
                </div>
                <h3 className={`text-lg font-black text-center mb-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>Delete Account</h3>
                <p className={`text-sm text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Are you sure? This cannot be undone.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setShowPrivacy(false);
                      logout();
                      navigate('/login', { replace: true });
                    }}
                    className="w-full bg-[#ef4444] text-white font-black text-sm uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#dc2626] transition-colors active:scale-[0.98]"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`w-full font-bold text-sm py-3.5 rounded-xl transition-colors active:scale-[0.98] ${isDark ? 'bg-[#1a1a1e] text-gray-400 hover:bg-[#2a2a2e]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsumerProfile;
