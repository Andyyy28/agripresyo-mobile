import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, Leaf, TrendingUp, Sprout, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserRole, User } from '../types';

// Mock Google account picker modal
const GoogleAuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: { name: string; email: string }) => void;
}> = ({ isOpen, onClose, onSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const accounts = [
    { name: 'Andy G.', email: 'andyyy28@gmail.com', initial: 'A', color: '#4285F4' },
    { name: 'Test User', email: 'testuser@gmail.com', initial: 'T', color: '#EA4335' },
  ];

  const handleSelect = (account: typeof accounts[0]) => {
    setSelectedAccount(account.email);
    setIsLoading(true);
    setTimeout(() => {
      onSelect({ name: account.name, email: account.email });
      setIsLoading(false);
      setSelectedAccount(null);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-8"
          >
            <div className="w-full max-w-[340px] bg-[#1a1a1e] rounded-2xl border border-[#2a2a2e] overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-[#2a2a2e]">
                <div className="flex items-center gap-3 mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-white text-sm font-bold">Choose an account</span>
                </div>
                <p className="text-gray-500 text-xs">to continue to AgriPresyo</p>
              </div>
              <div className="py-2">
                {accounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => handleSelect(account)}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-[#252529] transition-colors disabled:opacity-50"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: account.color }}
                    >
                      {account.initial}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white text-sm font-semibold">{account.name}</p>
                      <p className="text-gray-400 text-xs">{account.email}</p>
                    </div>
                    {isLoading && selectedAccount === account.email && (
                      <span className="w-5 h-5 border-2 border-[#4285F4]/30 border-t-[#4285F4] rounded-full animate-spin" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-[#2a2a2e]">
                <button onClick={onClose} className="text-gray-400 text-xs font-bold w-full text-center hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Mock Facebook login modal
const FacebookAuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (profile: { name: string; email: string }) => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      onConfirm({ name: 'Andy Gabbu', email: 'andy.gabbu@facebook.com' });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-8"
          >
            <div className="w-full max-w-[340px] bg-[#1a1a1e] rounded-2xl border border-[#2a2a2e] overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-[#2a2a2e] bg-[#1877F2] text-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="mx-auto mb-2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <p className="text-white text-sm font-bold">Log in with Facebook</p>
              </div>
              <div className="p-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-2xl font-bold">
                  A
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">Andy Gabbu</p>
                  <p className="text-gray-400 text-xs mt-1">Continue as Andy Gabbu</p>
                </div>
                <button
                  onClick={handleContinue}
                  disabled={isLoading}
                  className="w-full bg-[#1877F2] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#1565D8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
                <button onClick={onClose} className="text-gray-400 text-xs font-bold hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, socialLogin } = useAuth();
  const { isDark, colors } = useTheme();

  const [selectedRole, setSelectedRole] = useState<UserRole>('consumer');
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showFacebookModal, setShowFacebookModal] = useState(false);

  const roles: { value: UserRole; label: string; emoji: string; description: string }[] = [
    { value: 'consumer', label: 'Consumer', emoji: '🛒', description: 'See prices and plan what to buy' },
    { value: 'vendor', label: 'Vendor', emoji: '🏪', description: 'Manage your shop and update prices' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, selectedRole);
      if (selectedRole === 'consumer') {
        navigate('/market', { replace: true });
      } else {
        navigate('/vendor/dashboard', { replace: true });
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSelect = (account: { name: string; email: string }) => {
    const user: User = {
      name: account.name,
      email: account.email,
      role: selectedRole,
      authMethod: 'google',
      shopName: selectedRole === 'vendor' ? `${account.name}'s Shop` : undefined,
      isVerified: false,
      verificationStatus: 'none',
    };
    socialLogin(user);
    setShowGoogleModal(false);
    navigate(selectedRole === 'consumer' ? '/market' : '/vendor/dashboard', { replace: true });
  };

  const handleFacebookConfirm = (profile: { name: string; email: string }) => {
    const user: User = {
      name: profile.name,
      email: profile.email,
      role: selectedRole,
      authMethod: 'facebook',
      shopName: selectedRole === 'vendor' ? `${profile.name}'s Shop` : undefined,
      isVerified: false,
      verificationStatus: 'none',
    };
    socialLogin(user);
    setShowFacebookModal(false);
    navigate(selectedRole === 'consumer' ? '/market' : '/vendor/dashboard', { replace: true });
  };

  const currentRole = roles.find(r => r.value === selectedRole)!;

  return (
    <div className={`min-h-screen font-sans flex justify-center relative overflow-hidden ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f0fdf4] text-[#111827]'}`}>
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Leaf decorations */}
        <div className="absolute top-16 left-6 animate-float-slow">
          <Leaf size={40} className="text-[#22c55e]" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-8 animate-float-slower" style={{ animationDelay: '2s' }}>
          <Sprout size={32} className="text-[#22c55e]" strokeWidth={1} />
        </div>
        <div className="absolute bottom-48 left-10 animate-float-slower" style={{ animationDelay: '4s' }}>
          <Leaf size={28} className="text-[#22c55e] rotate-45" strokeWidth={1} />
        </div>
        <div className="absolute bottom-32 right-12 animate-float-slow" style={{ animationDelay: '1s' }}>
          <Sprout size={36} className="text-[#22c55e]" strokeWidth={1} />
        </div>
        <div className="absolute top-1/2 left-2 animate-float-slow" style={{ animationDelay: '3s' }}>
          <Leaf size={24} className="text-[#22c55e] -rotate-30" strokeWidth={1} />
        </div>

        {/* Subtle vine lines */}
        <svg className="absolute top-0 right-0 w-48 h-64 opacity-[0.04]" viewBox="0 0 200 300">
          <path d="M 180 0 Q 120 80 160 160 T 100 300" fill="none" stroke="#22c55e" strokeWidth="2" />
          <path d="M 150 0 Q 90 60 130 140 T 70 280" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-48 h-64 opacity-[0.04]" viewBox="0 0 200 300">
          <path d="M 20 300 Q 80 220 40 140 T 100 0" fill="none" stroke="#22c55e" strokeWidth="2" />
          <path d="M 50 300 Q 110 240 70 160 T 130 20" fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="w-full max-w-[430px] relative flex flex-col min-h-screen px-6 py-10">
        {/* Logo — transparent PNG, no background box */}
        {/* Replace /public/images/logo.png to update logo globally */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-8 mt-4"
        >
          <img
            src="/images/logo.png"
            alt="AgriPresyo"
            className="h-16 w-auto object-contain mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback if logo image is missing */}
          <div className="hidden mb-4">
            <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>Agri</span>
            <span className="text-3xl font-black text-[#22c55e]">Presyo</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className={isDark ? 'text-white' : 'text-[#111827]'}>Agri</span>
            <span className="text-[#22c55e]">Presyo</span>
          </h1>
          <p className={`text-[10px] uppercase tracking-[0.25em] mt-2 font-semibold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            A Mobile App for Real-Time Market Prices.
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 flex-1">
          {/* Role Dropdown — no label text above */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 border ${
                  isRoleOpen
                    ? `border-[#22c55e] ${isDark ? 'bg-[#141418]' : 'bg-white'}`
                    : `${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{currentRole.emoji}</span>
                  <span className="flex flex-col items-start">
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{currentRole.label}</span>
                    <span className={`text-[10px] font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{currentRole.description}</span>
                  </span>
                </span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isRoleOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </button>
              <AnimatePresence>
                {isRoleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ transformOrigin: 'top' }}
                    className={`absolute top-full left-0 right-0 mt-1 rounded-xl border overflow-hidden z-20 ${
                      isDark ? 'bg-[#141418] border-[#2a2a2e]' : 'bg-white border-[#e5e7eb]'
                    }`}
                  >
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => {
                          setSelectedRole(role.value);
                          setIsRoleOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors ${
                          selectedRole === role.value
                            ? `${isDark ? 'bg-[#1a1a1e] border-l-[3px] border-l-[#22c55e]' : 'bg-[#dcfce7] border-l-[3px] border-l-[#22c55e]'}`
                            : `border-l-[3px] border-l-transparent ${isDark ? 'text-gray-300 hover:bg-[#1a1a1e]' : 'text-gray-700 hover:bg-gray-50'}`
                        }`}
                      >
                        <span className="text-lg">{role.emoji}</span>
                        <span className="flex flex-col items-start">
                          <span className={`font-bold ${selectedRole === role.value ? (isDark ? 'text-white' : 'text-[#111827]') : ''}`}>{role.label}</span>
                          <span className={`text-[10px] font-normal ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{role.description}</span>
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Form Fields */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            {/* Email */}
            <div className="relative">
              <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#22c55e]/50 transition-colors ${
                  isDark
                    ? 'bg-[#141418] border border-[#1f1f23] text-white placeholder-gray-600'
                    : 'bg-[#f3f4f6] border border-[#e5e7eb] text-[#111827] placeholder-gray-400'
                }`}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-[#22c55e]/50 transition-colors ${
                  isDark
                    ? 'bg-[#141418] border border-[#1f1f23] text-white placeholder-gray-600'
                    : 'bg-[#f3f4f6] border border-[#e5e7eb] text-[#111827] placeholder-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-[#ef4444] text-xs font-semibold px-1">{error}</p>
            )}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col gap-3"
          >
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-xl py-4 font-black text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden border ${
                isDark
                  ? 'bg-[#141418] border-[#1f1f23] text-[#22c55e] hover:bg-[#1a1a1e] hover:border-[#22c55e]/30'
                  : 'bg-[#15803d] border-[#15803d] text-white hover:bg-[#166534]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Access Terminal'
              )}
            </button>

            <button type="button" className={`text-[10px] uppercase tracking-widest font-bold text-center py-2 transition-colors ${isDark ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'}`}>
              Forgot Password?
            </button>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex items-center gap-4"
          >
            <div className={`flex-1 h-px ${isDark ? 'bg-[#1f1f23]' : 'bg-[#e5e7eb]'}`} />
            <span className={`text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Or Continue With</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-[#1f1f23]' : 'bg-[#e5e7eb]'}`} />
          </motion.div>

          {/* Social Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            {/* Google */}
            <button
              id="login-google"
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className={`w-full rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm font-semibold transition-colors border ${
                isDark
                  ? 'bg-[#141418] border-[#1f1f23] text-white hover:bg-[#1a1a1e]'
                  : 'bg-white border-[#e5e7eb] text-[#111827] hover:bg-gray-50'
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>

            {/* Facebook */}
            <button
              id="login-facebook"
              type="button"
              onClick={() => setShowFacebookModal(true)}
              className="w-full bg-[#1877F2] rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm font-semibold text-white hover:bg-[#1565D8] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Sign in with Facebook
            </button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center py-4"
          >
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="text-[#22c55e] font-bold uppercase text-xs tracking-wider"
              >
                Sign Up
              </button>
            </p>
          </motion.div>
        </form>
      </div>

      {/* Social Auth Modals */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onSelect={handleGoogleSelect}
      />
      <FacebookAuthModal
        isOpen={showFacebookModal}
        onClose={() => setShowFacebookModal(false)}
        onConfirm={handleFacebookConfirm}
      />
    </div>
  );
};

export default Login;
