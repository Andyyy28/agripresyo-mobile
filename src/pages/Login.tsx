import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, Eye, EyeOff, ChevronDown, ShoppingBasket, Store } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { UserRole, User } from '../types';

/* ════════════════════════════════════════════════════
   STATIC LEAF BACKGROUND
   ════════════════════════════════════════════════════ */
const LeafBackground: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="leaf-login" width="120" height="120" patternUnits="userSpaceOnUse">
        <path d="M60 10 Q70 30 60 50 Q50 30 60 10Z" fill="none" stroke="#3ddc6e" strokeWidth="0.8" />
        <path d="M20 70 Q30 90 20 110 Q10 90 20 70Z" fill="none" stroke="#3ddc6e" strokeWidth="0.8" />
        <path d="M100 60 Q110 80 100 100 Q90 80 100 60Z" fill="none" stroke="#3ddc6e" strokeWidth="0.8" />
        <path d="M60 10 L60 50" fill="none" stroke="#3ddc6e" strokeWidth="0.4" />
        <path d="M20 70 L20 110" fill="none" stroke="#3ddc6e" strokeWidth="0.4" />
        <path d="M100 60 L100 100" fill="none" stroke="#3ddc6e" strokeWidth="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#leaf-login)" />
  </svg>
);

/* ════════════════════════════════════════════════════
   CSS ANIMATIONS
   ════════════════════════════════════════════════════ */
const fadeStyle = `
@keyframes login-fade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
.login-fade { animation: login-fade 0.4s ease-out both; }
.login-fade-d1 { animation: login-fade 0.4s ease-out 0.1s both; }
.login-fade-d2 { animation: login-fade 0.4s ease-out 0.2s both; }
`;

/* ════════════════════════════════════════════════════
   GOOGLE AUTH MODAL
   ════════════════════════════════════════════════════ */
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-8">
            <div className="w-full max-w-[340px] rounded-2xl overflow-hidden shadow-xl bg-white border border-[#d0ecd0]">
              <div className="p-5 border-b border-[#d0ecd0]">
                <div className="flex items-center gap-3 mb-1">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-[#0a1a0a] text-sm font-bold">Choose an account</span>
                </div>
                <p className="text-[#4a5e4a] text-xs">to continue to <span style={{ color: '#518706' }}>Agri</span><span className="text-[#0a1a0a]">Presyo</span></p>
              </div>
              <div className="py-2">
                {accounts.map((account) => (
                  <button key={account.email} onClick={() => handleSelect(account)} disabled={isLoading}
                    className="w-full flex items-center gap-3 px-5 py-3.5 transition-colors duration-200 disabled:opacity-50 hover:bg-[#f0faf0]">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: account.color }}>
                      {account.initial}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[#0a1a0a] text-sm font-semibold">{account.name}</p>
                      <p className="text-[#4a5e4a] text-xs">{account.email}</p>
                    </div>
                    {isLoading && selectedAccount === account.email && (
                      <span className="w-5 h-5 border-2 border-[#3ddc6e]/30 border-t-[#3ddc6e] rounded-full animate-spin" />
                    )}
                  </button>
                ))}
              </div>
              <div className="p-4 border-t border-[#d0ecd0]">
                <button onClick={onClose} className="text-[#4a5e4a] text-xs font-bold w-full text-center hover:text-[#0a1a0a] transition-colors duration-200">Cancel</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ════════════════════════════════════════════════════
   FACEBOOK AUTH MODAL
   ════════════════════════════════════════════════════ */
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 flex items-center justify-center z-[101] px-8">
            <div className="w-full max-w-[340px] rounded-2xl overflow-hidden shadow-xl bg-white border border-[#d0ecd0]">
              <div className="p-5 bg-[#1877F2] text-center border-b border-[#d0ecd0]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="mx-auto mb-2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <p className="text-white text-sm font-bold">Log in with Facebook</p>
              </div>
              <div className="p-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#1877F2] flex items-center justify-center text-white text-2xl font-bold">A</div>
                <div className="text-center">
                  <p className="text-[#0a1a0a] font-bold text-lg">Andy Gabbu</p>
                  <p className="text-[#4a5e4a] text-xs mt-1">Continue as Andy Gabbu</p>
                </div>
                <button onClick={handleContinue} disabled={isLoading}
                  className="w-full bg-[#1877F2] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#1565D8] transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Connecting...</>) : ('Continue')}
                </button>
                <button onClick={onClose} className="text-[#4a5e4a] text-xs font-bold hover:text-[#0a1a0a] transition-colors duration-200">Cancel</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ════════════════════════════════════════════════════
   LOGIN PAGE
   ════════════════════════════════════════════════════ */
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

  const roles: { value: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'consumer', label: 'Consumer', icon: <ShoppingBasket size={20} className="text-[#16a34a]" />, description: 'See prices and plan what to buy' },
    { value: 'vendor', label: 'Vendor', icon: <Store size={20} className="text-[#16a34a]" />, description: 'Manage your shop and update prices' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setIsLoading(true);
    try {
      await login(email, password, selectedRole);
      navigate(selectedRole === 'consumer' ? '/market' : '/vendor/dashboard', { replace: true });
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSelect = (account: { name: string; email: string }) => {
    const user: User = { name: account.name, email: account.email, role: selectedRole, authMethod: 'google', shopName: selectedRole === 'vendor' ? `${account.name}'s Shop` : undefined, isVerified: false, verificationStatus: 'none' };
    socialLogin(user);
    setShowGoogleModal(false);
    navigate(selectedRole === 'consumer' ? '/market' : '/vendor/dashboard', { replace: true });
  };

  const handleFacebookConfirm = (profile: { name: string; email: string }) => {
    const user: User = { name: profile.name, email: profile.email, role: selectedRole, authMethod: 'facebook', shopName: selectedRole === 'vendor' ? `${profile.name}'s Shop` : undefined, isVerified: false, verificationStatus: 'none' };
    socialLogin(user);
    setShowFacebookModal(false);
    navigate(selectedRole === 'consumer' ? '/market' : '/vendor/dashboard', { replace: true });
  };

  const currentRole = roles.find(r => r.value === selectedRole)!;

  return (
    <div className="min-h-screen font-sans flex justify-center items-center" style={{ backgroundColor: '#e8f5e8' }}>
      <style>{fadeStyle}</style>

      {/* ── Mobile Frame Container ── */}
      <div className="w-full max-w-[430px] relative flex flex-col min-h-screen overflow-hidden shadow-lg border-x border-[#d0ecd0]" style={{ backgroundColor: '#f0faf0' }}>
        <LeafBackground />

        <div className="w-full relative flex flex-col min-h-screen px-6 py-10 z-10">
          {/* Logo */}
          <div className="login-fade flex flex-col items-center mb-8 mt-4">
            <div className="w-[76px] h-[76px] rounded-full flex items-center justify-center overflow-hidden mb-4 border-2 border-[#d0ecd0] bg-white shadow-sm">
              <img src="/images/AgriPresyo_logoFinal.webp" alt="AgriPresyo" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              <span style={{ color: '#518706' }}>Agri</span>
              <span style={{ color: '#0a1a0a' }}>Presyo</span>
            </h1>
            <p className="text-[10px] uppercase mt-2 font-semibold text-[#4a5e4a]" style={{ letterSpacing: '0.25em' }}>
              A Mobile App for Real-Time Market Prices.
            </p>
          </div>

          {/* Card form */}
          <div className="login-fade-d1 relative overflow-hidden" style={{ background: '#ffffff', border: '1px solid #d0ecd0', borderRadius: '24px', padding: '32px 24px' }}>
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 h-[2px] rounded-full" style={{ width: '60%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, transparent, #3ddc6e, transparent)' }} />

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {/* Role dropdown */}
              <div className="relative">
                <button type="button" onClick={() => setIsRoleOpen(!isRoleOpen)}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-200"
                  style={{ background: '#f0faf0', border: isRoleOpen ? '1px solid #3ddc6e' : '1px solid #d0ecd0' }}>
                  <span className="flex items-center gap-3">
                    {currentRole.icon}
                    <span className="flex flex-col items-start">
                      <span className="font-bold text-[#0a1a0a]">{currentRole.label}</span>
                      <span className="text-[10px] font-normal text-[#4a5e4a]">{currentRole.description}</span>
                    </span>
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-200 ${isRoleOpen ? 'rotate-180' : ''} text-[#4a5e4a]`} />
                </button>
                <AnimatePresence>
                  {isRoleOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                      style={{ background: '#ffffff', border: '1px solid #d0ecd0' }}
                      className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-20 shadow-md">
                      {roles.map((role) => (
                        <button key={role.value} type="button" onClick={() => { setSelectedRole(role.value); setIsRoleOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-sm transition-colors duration-200 hover:bg-[#f0faf0]"
                          style={{ borderLeft: selectedRole === role.value ? '3px solid #3ddc6e' : '3px solid transparent', background: selectedRole === role.value ? '#f0faf0' : 'transparent' }}>
                          {role.icon}
                          <span className="flex flex-col items-start">
                            <span className={`font-bold ${selectedRole === role.value ? 'text-[#0a1a0a]' : 'text-[#4a5e4a]'}`}>{role.label}</span>
                            <span className="text-[10px] font-normal text-[#4a5e4a]">{role.description}</span>
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Email */}
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5e4a]" />
                <input id="login-email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none transition-all duration-200 text-[#0a1a0a] placeholder-[#8a9e8a]"
                  style={{ background: '#f0faf0', border: '1px solid #d0ecd0' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#3ddc6e'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#d0ecd0'; }} />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5e4a]" />
                <input id="login-password" type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none transition-all duration-200 text-[#0a1a0a] placeholder-[#8a9e8a]"
                  style={{ background: '#f0faf0', border: '1px solid #d0ecd0' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#3ddc6e'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#d0ecd0'; }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200 text-[#4a5e4a] hover:text-[#16a34a]">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && <p className="text-[#ef4444] text-xs font-semibold px-1">{error}</p>}

              {/* CTA */}
              <button id="login-submit" type="submit" disabled={isLoading}
                className="w-full py-4 font-black text-sm uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a1a0a] active:scale-[0.97] shadow-sm"
                style={{ background: '#3ddc6e', borderRadius: '14px' }}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0a1a0a]/30 border-t-[#0a1a0a] rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : ('Access Terminal')}
              </button>

              <button type="button" className="text-[10px] uppercase tracking-widest font-bold text-center py-2 transition-colors duration-200 text-[#4a5e4a] hover:text-[#16a34a]">
                Forgot Password?
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#d0ecd0]" />
                <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap text-[#4a5e4a]">Or Continue With</span>
                <div className="flex-1 h-px bg-[#d0ecd0]" />
              </div>

              {/* Social */}
              <div className="flex flex-col gap-3">
                <button id="login-google" type="button" onClick={() => setShowGoogleModal(true)}
                  className="w-full rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm font-semibold transition-all duration-200 text-[#0a1a0a] hover:border-[#3ddc6e]"
                  style={{ background: '#f0faf0', border: '1px solid #d0ecd0' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign in with Google
                </button>
                <button id="login-facebook" type="button" onClick={() => setShowFacebookModal(true)}
                  className="w-full bg-[#1877F2] rounded-xl py-3.5 flex items-center justify-center gap-3 text-sm font-semibold text-white hover:bg-[#1565D8] transition-colors duration-200">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Sign in with Facebook
                </button>
              </div>

              {/* Sign up link */}
              <div className="text-center py-4">
                <p className="text-sm text-[#4a5e4a]">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => navigate('/signup')} className="text-[#16a34a] font-bold uppercase text-xs tracking-wider">Sign Up</button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Social Auth Modals */}
      <GoogleAuthModal isOpen={showGoogleModal} onClose={() => setShowGoogleModal(false)} onSelect={handleGoogleSelect} />
      <FacebookAuthModal isOpen={showFacebookModal} onClose={() => setShowFacebookModal(false)} onConfirm={handleFacebookConfirm} />
    </div>
  );
};

export default Login;
