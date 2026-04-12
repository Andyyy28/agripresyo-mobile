import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Store, MapPin, TrendingUp, ChevronDown, CheckCircle, Leaf, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserRole, User as UserType } from '../types';

const marketLocations = ['Bankerohan', 'Agdao', 'Uyanguren', 'Tiangge', 'Other'];

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, socialLogin } = useAuth();
  const { isDark } = useTheme();

  const [selectedRole, setSelectedRole] = useState<UserRole>('consumer');
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [shopName, setShopName] = useState('');
  const [marketLocation, setMarketLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showFacebookModal, setShowFacebookModal] = useState(false);

  const roles: { value: UserRole; label: string; emoji: string; description: string }[] = [
    { value: 'consumer', label: 'Consumer', emoji: '🛒', description: 'See prices and plan what to buy' },
    { value: 'vendor', label: 'Vendor', emoji: '🏪', description: 'Manage your shop and update prices' },
  ];

  const currentRole = roles.find(r => r.value === selectedRole)!;

  // Validation
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email format';
    if (selectedRole === 'vendor') {
      if (!shopName.trim()) e.shopName = 'Shop/Stall name is required';
      if (!marketLocation) e.marketLocation = 'Market location is required';
    }
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  }, [fullName, email, shopName, marketLocation, password, confirmPassword, selectedRole]);

  const isValid = (field: string) => touched[field] && !errors[field];
  const hasError = (field: string) => touched[field] && errors[field];

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Touch all fields
    const allFields = ['fullName', 'email', 'password', 'confirmPassword'];
    if (selectedRole === 'vendor') allFields.push('shopName', 'marketLocation');
    const allTouched: Record<string, boolean> = {};
    allFields.forEach(f => allTouched[f] = true);
    setTouched(allTouched);

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      await signup({
        name: fullName,
        email,
        password,
        role: selectedRole,
        shopName: selectedRole === 'vendor' ? shopName : undefined,
        marketLocation: selectedRole === 'vendor' ? marketLocation : undefined,
      });
      navigate(selectedRole === 'consumer' ? '/market' : '/vendor/dashboard', { replace: true });
    } catch {
      // error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setShowGoogleModal(true);
  };

  const handleFacebookSignup = () => {
    setShowFacebookModal(true);
  };

  const inputClass = (field: string) => `w-full rounded-xl py-3.5 text-sm focus:outline-none transition-colors ${
    hasError(field)
      ? 'border-[#ef4444] focus:border-[#ef4444]'
      : isValid(field)
        ? 'border-[#22c55e] focus:border-[#22c55e]'
        : `focus:border-[#22c55e]/50 ${isDark ? 'border-[#1f1f23]' : 'border-[#e5e7eb]'}`
  } ${isDark ? 'bg-[#141418] text-white placeholder-gray-600 border' : 'bg-[#f3f4f6] text-[#111827] placeholder-gray-400 border'}`;

  return (
    <div className={`min-h-screen font-sans flex justify-center relative overflow-hidden ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f0fdf4] text-[#111827]'}`}>
      {/* Decorative */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-16 left-6 animate-float-slow">
          <Leaf size={40} className="text-[#22c55e]" strokeWidth={1} />
        </div>
        <div className="absolute top-32 right-8 animate-float-slower" style={{ animationDelay: '2s' }}>
          <Sprout size={32} className="text-[#22c55e]" strokeWidth={1} />
        </div>
        <div className="absolute bottom-48 left-10 animate-float-slower" style={{ animationDelay: '4s' }}>
          <Leaf size={28} className="text-[#22c55e] rotate-45" strokeWidth={1} />
        </div>
        <svg className="absolute top-0 right-0 w-48 h-64 opacity-[0.04]" viewBox="0 0 200 300">
          <path d="M 180 0 Q 120 80 160 160 T 100 300" fill="none" stroke="#22c55e" strokeWidth="2" />
        </svg>
      </div>

      <div className="w-full max-w-[430px] relative flex flex-col min-h-screen px-6 py-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
            isDark ? 'bg-[#141418] border border-[#1f1f23] text-gray-400' : 'bg-white border border-[#e5e7eb] text-gray-500'
          }`}
        >
          <ArrowLeft size={20} />
        </motion.button>

        {/* Logo — transparent PNG, no background box */}
        {/* Replace /public/images/logo.png to update logo globally */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-6"
        >
          <img
            src="/images/logo.png"
            alt="AgriPresyo"
            className="h-12 w-auto object-contain mb-3"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback if logo image is missing */}
          <div className="hidden mb-3">
            <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>Agri</span>
            <span className="text-2xl font-black text-[#22c55e]">Presyo</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            <span className={isDark ? 'text-white' : 'text-[#111827]'}>Create Account</span>
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Join the market community
          </p>
        </motion.div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4 flex-1">
          {/* Role Dropdown — no label text above */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
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
                        onClick={() => { setSelectedRole(role.value); setIsRoleOpen(false); }}
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

          {/* Fields */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            {/* Full Name */}
            <div>
              <div className="relative">
                <User size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  className={`${inputClass('fullName')} pl-12 pr-10`}
                />
                {isValid('fullName') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22c55e]" />}
              </div>
              {hasError('fullName') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`${inputClass('email')} pl-12 pr-10`}
                />
                {isValid('email') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22c55e]" />}
              </div>
              {hasError('email') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.email}</p>}
            </div>

            {/* Vendor-specific fields */}
            <AnimatePresence>
              {selectedRole === 'vendor' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col gap-3 overflow-hidden"
                >
                  {/* Shop Name */}
                  <div>
                    <div className="relative">
                      <Store size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                      <input
                        type="text"
                        placeholder="Shop/Stall Name"
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        onBlur={() => handleBlur('shopName')}
                        className={`${inputClass('shopName')} pl-12 pr-10`}
                      />
                      {isValid('shopName') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22c55e]" />}
                    </div>
                    {hasError('shopName') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.shopName}</p>}
                  </div>

                  {/* Market Location Dropdown */}
                  <div>
                    <div className="relative">
                      <MapPin size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                      <button
                        type="button"
                        onClick={() => { setIsLocationOpen(!isLocationOpen); handleBlur('marketLocation'); }}
                        className={`${inputClass('marketLocation')} pl-12 pr-10 text-left w-full flex items-center justify-between`}
                      >
                        <span className={marketLocation ? (isDark ? 'text-white' : 'text-[#111827]') : (isDark ? 'text-gray-600' : 'text-gray-400')}>
                          {marketLocation || 'Market Location'}
                        </span>
                        <ChevronDown size={16} className={`transition-transform ${isLocationOpen ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                      </button>
                      <AnimatePresence>
                        {isLocationOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className={`absolute top-full left-0 right-0 mt-1 rounded-xl border overflow-hidden z-20 ${
                              isDark ? 'bg-[#141418] border-[#22c55e]' : 'bg-white border-[#22c55e]'
                            }`}
                          >
                            {marketLocations.map((loc) => (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => { setMarketLocation(loc); setIsLocationOpen(false); }}
                                className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${
                                  marketLocation === loc
                                    ? `${isDark ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#dcfce7] text-[#16a34a]'}`
                                    : `${isDark ? 'text-gray-300 hover:bg-[#1a1a1e]' : 'text-gray-700 hover:bg-gray-50'}`
                                }`}
                              >
                                {loc}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {hasError('marketLocation') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.marketLocation}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`${inputClass('password')} pl-12 pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {hasError('password') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`${inputClass('confirmPassword')} pl-12 pr-12`}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {hasError('confirmPassword') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.confirmPassword}</p>}
            </div>
          </motion.div>

          {/* Create Account Button */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex flex-col gap-3"
          >
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-xl py-4 font-black text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50 border ${
                isDark
                  ? 'bg-[#141418] border-[#1f1f23] text-[#22c55e] hover:border-[#22c55e]/30'
                  : 'bg-[#15803d] border-[#15803d] text-white hover:bg-[#166534]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className={`flex-1 h-px ${isDark ? 'bg-[#1f1f23]' : 'bg-[#e5e7eb]'}`} />
            <span className={`text-[10px] uppercase tracking-widest font-bold whitespace-nowrap ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Or Sign Up With</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-[#1f1f23]' : 'bg-[#e5e7eb]'}`} />
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleSignup}
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
              Sign up with Google
            </button>
            <button
              type="button"
              onClick={handleFacebookSignup}
              className="w-full bg-[#1877F2] rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm font-semibold text-white hover:bg-[#1565D8] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Sign up with Facebook
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center py-4">
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-[#22c55e] font-bold uppercase text-xs tracking-wider"
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
