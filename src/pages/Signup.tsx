import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Store, MapPin, ChevronDown, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserRole, User as UserType } from '../types';

/* ════════════════════════════════════════════════════
   HEXAGONAL MESH SVG
   ════════════════════════════════════════════════════ */
const HexMesh: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{ opacity: 0.07 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="hex-signup" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
        <path d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100" fill="none" stroke="#16a34a" strokeWidth="0.5" />
        <path d="M28 0L56 16L56 50L28 66L0 50L0 16Z" fill="none" stroke="#16a34a" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex-signup)" />
  </svg>
);

/* ════════════════════════════════════════════════════
   FLOATING PARTICLES
   ════════════════════════════════════════════════════ */
const FloatingParticles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 4,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.35,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: '#22c55e',
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

/* ════════════════════════════════════════════════════
   SIGNUP PAGE
   ════════════════════════════════════════════════════ */
const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup, socialLogin } = useAuth();
  const { isDark } = useTheme();

  const [selectedRole, setSelectedRole] = useState<UserRole>('consumer');
  const [isRoleOpen, setIsRoleOpen] = useState(false);
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

  const getInputStyle = (field: string) => ({
    background: '#0d1f10',
    border: hasError(field)
      ? '1px solid #ef4444'
      : isValid(field)
        ? '1px solid #22c55e'
        : '1px solid #166534',
  });

  return (
    <div className="min-h-screen font-sans flex justify-center items-center" style={{ backgroundColor: '#0a0a0a' }}>
      {/* ── Mobile Frame Container ── */}
      <div className="w-full max-w-[430px] relative flex flex-col min-h-screen overflow-hidden shadow-2xl border-x border-[#1f1f23]" style={{ backgroundColor: '#060e09' }}>
        {/* Background layers (inside frame) */}
        <HexMesh />
        <FloatingParticles />
        <div className="absolute pointer-events-none" style={{ top: '-15%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)' }} />

        <div className="w-full relative flex flex-col min-h-screen px-6 py-6 z-10">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/login')}
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all"
          style={{ background: '#0d1f10', border: '1px solid #166534', color: '#6b7c6e' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.color = '#22c55e'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#166534'; e.currentTarget.style.color = '#6b7c6e'; }}
        >
          <ArrowLeft size={20} />
        </motion.button>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden mb-3 animate-bob" style={{ border: '2px solid rgba(22, 163, 74, 0.27)', background: 'rgba(10, 22, 13, 0.6)', boxShadow: '0 0 20px rgba(22,163,74,0.12)' }}>
            <img
              src="/images/AgriPresyo_logoFinal.webp"
              alt="AgriPresyo"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-2xl font-black tracking-tight text-white"
          >
            Create Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xs mt-1 text-[#6b7c6e]"
          >
            Join the market community
          </motion.p>
        </motion.div>

        {/* Glass card form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="relative overflow-hidden animate-glow-pulse"
          style={{
            background: 'rgba(10, 22, 13, 0.72)',
            border: '1px solid rgba(22, 163, 74, 0.33)',
            borderRadius: '24px',
            padding: '28px 24px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-1/2 h-[2px] rounded-full"
            style={{ width: '60%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, transparent, #22c55e, transparent)' }}
          />

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {/* Role dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                style={{
                  background: '#0d1f10',
                  border: isRoleOpen ? '1px solid #22c55e' : '1px solid #166534',
                }}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{currentRole.emoji}</span>
                  <span className="flex flex-col items-start">
                    <span className="font-bold text-white">{currentRole.label}</span>
                    <span className="text-[10px] font-normal text-[#6b7c6e]">{currentRole.description}</span>
                  </span>
                </span>
                <ChevronDown size={18} className={`transition-transform duration-200 ${isRoleOpen ? 'rotate-180' : ''} text-[#6b7c6e]`} />
              </button>
              <AnimatePresence>
                {isRoleOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ transformOrigin: 'top', background: '#0d1f10', border: '1px solid rgba(22, 163, 74, 0.2)' }}
                    className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20"
                  >
                    {roles.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => { setSelectedRole(role.value); setIsRoleOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors"
                        style={{
                          borderLeft: selectedRole === role.value ? '3px solid #22c55e' : '3px solid transparent',
                          background: selectedRole === role.value ? 'rgba(22, 163, 74, 0.08)' : 'transparent',
                        }}
                      >
                        <span className="text-lg">{role.emoji}</span>
                        <span className="flex flex-col items-start">
                          <span className={`font-bold ${selectedRole === role.value ? 'text-white' : 'text-[#8b9a8f]'}`}>{role.label}</span>
                          <span className="text-[10px] font-normal text-[#6b7c6e]">{role.description}</span>
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-3">
              {/* Full Name */}
              <div>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6b50]" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    className="w-full rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none transition-all text-white placeholder-[#4a6b50]"
                    style={getInputStyle('fullName')}
                    onFocus={(e) => { if (!hasError('fullName') && !isValid('fullName')) { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.boxShadow = '0 0 12px rgba(34,197,94,0.15)'; } }}
                  />
                  {isValid('fullName') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22c55e]" />}
                </div>
                {hasError('fullName') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6b50]" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className="w-full rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none transition-all text-white placeholder-[#4a6b50]"
                    style={getInputStyle('email')}
                    onFocus={(e) => { if (!hasError('email') && !isValid('email')) { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.boxShadow = '0 0 12px rgba(34,197,94,0.15)'; } }}
                  />
                  {isValid('email') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22c55e]" />}
                </div>
                {hasError('email') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.email}</p>}
              </div>

              {/* Vendor fields */}
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
                        <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6b50]" />
                        <input
                          type="text"
                          placeholder="Shop/Stall Name"
                          value={shopName}
                          onChange={(e) => setShopName(e.target.value)}
                          onBlur={() => handleBlur('shopName')}
                          className="w-full rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none transition-all text-white placeholder-[#4a6b50]"
                          style={getInputStyle('shopName')}
                        />
                        {isValid('shopName') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22c55e]" />}
                      </div>
                      {hasError('shopName') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.shopName}</p>}
                    </div>

                    {/* Market Location */}
                    <div>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6b50]" />
                        <input
                          type="text"
                          placeholder="e.g. Kabacan, North Cotabato"
                          value={marketLocation}
                          onChange={(e) => setMarketLocation(e.target.value)}
                          onBlur={() => handleBlur('marketLocation')}
                          className="w-full rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none transition-all text-white placeholder-[#4a6b50]"
                          style={getInputStyle('marketLocation')}
                        />
                        {isValid('marketLocation') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#22c55e]" />}
                      </div>
                      {hasError('marketLocation') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.marketLocation}</p>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password */}
              <div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6b50]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className="w-full rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none transition-all text-white placeholder-[#4a6b50]"
                    style={getInputStyle('password')}
                    onFocus={(e) => { if (!hasError('password') && !isValid('password')) { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.boxShadow = '0 0 12px rgba(34,197,94,0.15)'; } }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6b50] hover:text-[#22c55e] transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {hasError('password') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a6b50]" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className="w-full rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none transition-all text-white placeholder-[#4a6b50]"
                    style={getInputStyle('confirmPassword')}
                    onFocus={(e) => { if (!hasError('confirmPassword') && !isValid('confirmPassword')) { e.currentTarget.style.borderColor = '#22c55e'; e.currentTarget.style.boxShadow = '0 0 12px rgba(34,197,94,0.15)'; } }}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a6b50] hover:text-[#22c55e] transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {hasError('confirmPassword') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Create Account button */}
            <button
              type="submit"
              disabled={isLoading}
              className="onboard-cta w-full py-4 font-black text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50 relative overflow-hidden text-white"
              style={{ background: '#16a34a', borderRadius: '14px', boxShadow: '0 8px 32px rgba(22,163,74,0.25)' }}
            >
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </span>
            </button>

            {/* Login link */}
            <div className="text-center py-4">
              <p className="text-sm text-[#6b7c6e]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#22c55e] font-bold uppercase text-xs tracking-wider"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
