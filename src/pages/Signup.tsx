import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Store, MapPin, ChevronDown, CheckCircle, X, ShoppingBasket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { UserRole, User as UserType } from '../types';

/* ════════════════════════════════════════════════════
   TERMS / PRIVACY MODAL — light theme
   ════════════════════════════════════════════════════ */
const PolicyModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}> = ({ isOpen, onClose, title, content }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()} className="w-full max-w-[370px] relative overflow-hidden"
          style={{ background: '#ffffff', border: '1px solid #d0ecd0', borderRadius: '20px', maxHeight: '70vh' }}>
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <h2 className="text-base font-bold text-[#0a1a0a]">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 bg-[#f0faf0] hover:bg-[#d0ecd0]">
              <X size={16} className="text-[#4a5e4a]" />
            </button>
          </div>
          <div className="mx-6 h-px bg-[#d0ecd0]" />
          <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(70vh - 130px)' }}>
            <p className="text-sm leading-relaxed text-[#4a5e4a]">{content}</p>
          </div>
          <div className="px-6 pb-5 pt-2">
            <button onClick={onClose} className="w-full py-3 rounded-xl text-sm font-bold text-[#0a1a0a] transition-all duration-200 active:scale-[0.97] bg-[#3ddc6e] shadow-sm">Got it</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ════════════════════════════════════════════════════
   STATIC LEAF BACKGROUND
   ════════════════════════════════════════════════════ */
const LeafBackground: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="leaf-signup" width="120" height="120" patternUnits="userSpaceOnUse">
        <path d="M60 10 Q70 30 60 50 Q50 30 60 10Z" fill="none" stroke="#3ddc6e" strokeWidth="0.8" />
        <path d="M20 70 Q30 90 20 110 Q10 90 20 70Z" fill="none" stroke="#3ddc6e" strokeWidth="0.8" />
        <path d="M100 60 Q110 80 100 100 Q90 80 100 60Z" fill="none" stroke="#3ddc6e" strokeWidth="0.8" />
        <path d="M60 10 L60 50" fill="none" stroke="#3ddc6e" strokeWidth="0.4" />
        <path d="M20 70 L20 110" fill="none" stroke="#3ddc6e" strokeWidth="0.4" />
        <path d="M100 60 L100 100" fill="none" stroke="#3ddc6e" strokeWidth="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#leaf-signup)" />
  </svg>
);

/* ════════════════════════════════════════════════════
   CSS ANIMATIONS
   ════════════════════════════════════════════════════ */
const fadeStyle = `
@keyframes signup-fade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
.signup-fade { animation: signup-fade 0.4s ease-out both; }
.signup-fade-d1 { animation: signup-fade 0.4s ease-out 0.1s both; }
.signup-fade-d2 { animation: signup-fade 0.4s ease-out 0.2s both; }
`;

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
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [termsError, setTermsError] = useState(false);

  const roles: { value: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'consumer', label: 'Consumer', icon: <ShoppingBasket size={20} className="text-[#16a34a]" />, description: 'See prices and plan what to buy' },
    { value: 'vendor', label: 'Vendor', icon: <Store size={20} className="text-[#16a34a]" />, description: 'Manage your shop and update prices' },
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

    if (!agreedToTerms) { setTermsError(true); return; }
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    try {
      await signup({ name: fullName, email, password, role: selectedRole, shopName: selectedRole === 'vendor' ? shopName : undefined, marketLocation: selectedRole === 'vendor' ? marketLocation : undefined });
      navigate(selectedRole === 'consumer' ? '/market' : '/vendor/dashboard', { replace: true });
    } catch {
      // error handling
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (field: string) => ({
    background: '#f0faf0',
    border: hasError(field) ? '1px solid #ef4444' : isValid(field) ? '1px solid #3ddc6e' : '1px solid #d0ecd0',
  });

  return (
    <div className="min-h-screen font-sans flex justify-center items-center" style={{ backgroundColor: '#e8f5e8' }}>
      <style>{fadeStyle}</style>

      {/* ── Mobile Frame Container ── */}
      <div className="w-full max-w-[430px] relative flex flex-col min-h-screen overflow-hidden shadow-lg border-x border-[#d0ecd0]" style={{ backgroundColor: '#f0faf0' }}>
        <LeafBackground />

        <div className="w-full relative flex flex-col min-h-screen px-6 py-6 z-10">
          {/* Back button */}
          <button onClick={() => navigate('/login')}
            className="signup-fade w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-200 bg-white border border-[#d0ecd0] text-[#4a5e4a] hover:border-[#3ddc6e] hover:text-[#16a34a]">
            <ArrowLeft size={20} />
          </button>

          {/* Logo */}
          <div className="signup-fade flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden mb-3 border-2 border-[#d0ecd0] bg-white shadow-sm">
              <img src="/images/AgriPresyo_logoFinal.webp" alt="AgriPresyo" className="w-full h-full object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <h1 className="signup-fade-d1 text-2xl font-black tracking-tight text-[#0a1a0a]">Create Account</h1>
            <p className="signup-fade-d1 text-xs mt-1 text-[#4a5e4a]">Join the market community</p>
          </div>

          {/* Card form */}
          <div className="signup-fade-d2 relative overflow-hidden" style={{ background: '#ffffff', border: '1px solid #d0ecd0', borderRadius: '24px', padding: '28px 24px' }}>
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 h-[2px] rounded-full" style={{ width: '60%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, transparent, #3ddc6e, transparent)' }} />

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
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

              {/* Fields */}
              <div className="flex flex-col gap-3">
                {/* Full Name */}
                <div>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5e4a]" />
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} onBlur={() => handleBlur('fullName')}
                      className="w-full rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none transition-all duration-200 text-[#0a1a0a] placeholder-[#8a9e8a]" style={getInputStyle('fullName')}
                      onFocus={(e) => { if (!hasError('fullName') && !isValid('fullName')) e.currentTarget.style.borderColor = '#3ddc6e'; }} />
                    {isValid('fullName') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3ddc6e]" />}
                  </div>
                  {hasError('fullName') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5e4a]" />
                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => handleBlur('email')}
                      className="w-full rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none transition-all duration-200 text-[#0a1a0a] placeholder-[#8a9e8a]" style={getInputStyle('email')}
                      onFocus={(e) => { if (!hasError('email') && !isValid('email')) e.currentTarget.style.borderColor = '#3ddc6e'; }} />
                    {isValid('email') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3ddc6e]" />}
                  </div>
                  {hasError('email') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.email}</p>}
                </div>

                {/* Vendor fields */}
                <AnimatePresence>
                  {selectedRole === 'vendor' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                      className="flex flex-col gap-3 overflow-hidden">
                      <div>
                        <div className="relative">
                          <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5e4a]" />
                          <input type="text" placeholder="Shop/Stall Name" value={shopName} onChange={(e) => setShopName(e.target.value)} onBlur={() => handleBlur('shopName')}
                            className="w-full rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none transition-all duration-200 text-[#0a1a0a] placeholder-[#8a9e8a]" style={getInputStyle('shopName')} />
                          {isValid('shopName') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3ddc6e]" />}
                        </div>
                        {hasError('shopName') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.shopName}</p>}
                      </div>
                      <div>
                        <div className="relative">
                          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5e4a]" />
                          <input type="text" placeholder="e.g. Kabacan, North Cotabato" value={marketLocation} onChange={(e) => setMarketLocation(e.target.value)} onBlur={() => handleBlur('marketLocation')}
                            className="w-full rounded-xl py-3.5 pl-12 pr-10 text-sm focus:outline-none transition-all duration-200 text-[#0a1a0a] placeholder-[#8a9e8a]" style={getInputStyle('marketLocation')} />
                          {isValid('marketLocation') && <CheckCircle size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3ddc6e]" />}
                        </div>
                        {hasError('marketLocation') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.marketLocation}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Password */}
                <div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5e4a]" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onBlur={() => handleBlur('password')}
                      className="w-full rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none transition-all duration-200 text-[#0a1a0a] placeholder-[#8a9e8a]" style={getInputStyle('password')}
                      onFocus={(e) => { if (!hasError('password') && !isValid('password')) e.currentTarget.style.borderColor = '#3ddc6e'; }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a5e4a] hover:text-[#16a34a] transition-colors duration-200">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {hasError('password') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4a5e4a]" />
                    <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={() => handleBlur('confirmPassword')}
                      className="w-full rounded-xl py-3.5 pl-12 pr-12 text-sm focus:outline-none transition-all duration-200 text-[#0a1a0a] placeholder-[#8a9e8a]" style={getInputStyle('confirmPassword')}
                      onFocus={(e) => { if (!hasError('confirmPassword') && !isValid('confirmPassword')) e.currentTarget.style.borderColor = '#3ddc6e'; }} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a5e4a] hover:text-[#16a34a] transition-colors duration-200">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {hasError('confirmPassword') && <p className="text-[#ef4444] text-[10px] font-semibold mt-1 px-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Terms & Privacy checkbox */}
              <div className="flex flex-col gap-1.5">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input type="checkbox" checked={agreedToTerms} onChange={(e) => { setAgreedToTerms(e.target.checked); if (e.target.checked) setTermsError(false); }} className="sr-only peer" />
                    <div className="w-[18px] h-[18px] rounded flex items-center justify-center transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[#3ddc6e]/50"
                      style={{ border: termsError ? '1.5px solid #ef4444' : agreedToTerms ? '1.5px solid #3ddc6e' : '1.5px solid #8a9e8a', background: agreedToTerms ? '#3ddc6e' : 'transparent' }}>
                      {agreedToTerms && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-xs leading-relaxed text-[#4a5e4a]">
                    I agree to the{' '}
                    <button type="button" onClick={(e) => { e.preventDefault(); setShowTermsModal(true); }} className="font-semibold underline underline-offset-2 transition-colors duration-200 text-[#16a34a]">Terms of Service</button>{' '}
                    and{' '}
                    <button type="button" onClick={(e) => { e.preventDefault(); setShowPrivacyModal(true); }} className="font-semibold underline underline-offset-2 transition-colors duration-200 text-[#16a34a]">Privacy Policy</button>
                  </span>
                </label>
                {termsError && (
                  <p className="text-[#ef4444] text-[10px] font-semibold pl-[30px]">Please agree to the Terms of Service and Privacy Policy to continue.</p>
                )}
              </div>

              {/* Create Account button */}
              <button type="submit" disabled={isLoading || !agreedToTerms}
                className="w-full py-4 font-black text-sm uppercase tracking-widest transition-all duration-200 disabled:opacity-50 relative overflow-hidden active:scale-[0.97]"
                style={{
                  background: agreedToTerms ? '#3ddc6e' : '#d0ecd0',
                  borderRadius: '14px',
                  color: agreedToTerms ? '#0a1a0a' : '#8a9e8a',
                  cursor: agreedToTerms ? 'pointer' : 'not-allowed',
                }}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0a1a0a]/30 border-t-[#0a1a0a] rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : ('Create Account')}
              </button>

              {/* Login link */}
              <div className="text-center py-4">
                <p className="text-sm text-[#4a5e4a]">
                  Already have an account?{' '}
                  <button type="button" onClick={() => navigate('/login')} className="text-[#16a34a] font-bold uppercase text-xs tracking-wider">Login</button>
                </p>
              </div>
            </form>
          </div>

          {/* Policy Modals */}
          <PolicyModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} title="Terms of Service"
            content="By using AgriPresyo, you agree to use the app responsibly and only for its intended purpose of viewing agricultural commodity prices in Kabacan, North Cotabato." />
          <PolicyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} title="Privacy Policy"
            content="AgriPresyo collects your name, email, and role to personalize your experience. Your data is used solely for app functionality and is never sold to third parties." />
        </div>
      </div>
    </div>
  );
};

export default Signup;
