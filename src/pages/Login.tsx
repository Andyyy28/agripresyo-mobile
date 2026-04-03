import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBasket, Store, Mail, Lock, Eye, EyeOff, Leaf, TrendingUp, Sprout } from 'lucide-react';
import { motion } from 'motion/react';
import type { UserRole } from '../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState<UserRole>('consumer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
        navigate('/vendor/market', { replace: true });
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex justify-center relative overflow-hidden">
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
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-8 mt-4"
        >
          <div className="w-14 h-14 bg-[#22c55e] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#22c55e]/20">
            <TrendingUp size={28} className="text-black" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-white">Agri</span>
            <span className="text-[#22c55e]">Presyo</span>
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.25em] mt-2 font-semibold">
            A Mobile App for Real-Time Market Prices.
          </p>
        </motion.div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 flex-1">
          {/* Role Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-3 flex flex-col gap-2.5"
          >
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2 pt-1">Select Role</p>

            {/* Consumer Card */}
            <button
              type="button"
              onClick={() => setSelectedRole('consumer')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left border-l-[3px] ${
                selectedRole === 'consumer'
                  ? 'bg-[#166534] border-l-[#22c55e] shadow-lg shadow-[#166534]/30'
                  : 'bg-[#1a1a1e] border-l-transparent hover:bg-[#1e1e24]'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                selectedRole === 'consumer' ? 'bg-[#22c55e]/20' : 'bg-[#252529]'
              }`}>
                <ShoppingBasket size={22} className={selectedRole === 'consumer' ? 'text-[#22c55e]' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-black uppercase tracking-wide ${
                  selectedRole === 'consumer' ? 'text-white' : 'text-gray-300'
                }`}>Consumer</h3>
                <p className={`text-[11px] mt-0.5 ${
                  selectedRole === 'consumer' ? 'text-green-300/70' : 'text-gray-600'
                }`}>Browse prices & build budgets</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedRole === 'consumer' ? 'border-[#22c55e]' : 'border-gray-700'
              }`}>
                {selectedRole === 'consumer' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                )}
              </div>
            </button>

            {/* Vendor Card */}
            <button
              type="button"
              onClick={() => setSelectedRole('vendor')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left border-l-[3px] ${
                selectedRole === 'vendor'
                  ? 'bg-[#166534] border-l-[#22c55e] shadow-lg shadow-[#166534]/30'
                  : 'bg-[#1a1a1e] border-l-transparent hover:bg-[#1e1e24]'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                selectedRole === 'vendor' ? 'bg-[#22c55e]/20' : 'bg-[#252529]'
              }`}>
                <Store size={22} className={selectedRole === 'vendor' ? 'text-[#22c55e]' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-black uppercase tracking-wide ${
                  selectedRole === 'vendor' ? 'text-white' : 'text-gray-300'
                }`}>Vendor</h3>
                <p className={`text-[11px] mt-0.5 ${
                  selectedRole === 'vendor' ? 'text-green-300/70' : 'text-gray-600'
                }`}>Manage your shop & inventory</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedRole === 'vendor' ? 'border-[#22c55e]' : 'border-gray-700'
              }`}>
                {selectedRole === 'vendor' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                )}
              </div>
            </button>
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
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                id="login-email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141418] border border-[#1f1f23] rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/50 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141418] border border-[#1f1f23] rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#22c55e]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
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
              className="w-full bg-[#141418] border border-[#1f1f23] rounded-xl py-4 font-black text-sm uppercase tracking-widest text-[#22c55e] hover:bg-[#1a1a1e] hover:border-[#22c55e]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
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

            <button type="button" className="text-gray-600 text-[10px] uppercase tracking-widest font-bold text-center py-2 hover:text-gray-400 transition-colors">
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
            <div className="flex-1 h-px bg-[#1f1f23]" />
            <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold whitespace-nowrap">Or Continue With</span>
            <div className="flex-1 h-px bg-[#1f1f23]" />
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
              className="w-full bg-[#141418] border border-[#1f1f23] rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm font-semibold text-white hover:bg-[#1a1a1e] transition-colors"
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
              className="w-full bg-[#1877F2] rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm font-semibold text-white hover:bg-[#1565D8] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Sign in with Facebook
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default Login;
