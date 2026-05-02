import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  TrendingDown,
  Globe,
  Bell,
  Store,
  ShoppingCart,
  ChevronRight,
  ArrowRight,
  Eye,
  BarChart3,
  Package,
  DollarSign,
  Users,
} from 'lucide-react';

/* ════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════ */
interface OnboardingScreen {
  id: number;
  content: React.ReactNode;
}

/* ════════════════════════════════════════════════════
   HEXAGONAL MESH SVG (background overlay)
   ════════════════════════════════════════════════════ */
const HexMesh: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{ opacity: 0.07 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="hex" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.2)">
        <path
          d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
          fill="none"
          stroke="#16a34a"
          strokeWidth="0.5"
        />
        <path
          d="M28 0L56 16L56 50L28 66L0 50L0 16Z"
          fill="none"
          stroke="#16a34a"
          strokeWidth="0.5"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex)" />
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
   PRICE CARD (Screen 2)
   ════════════════════════════════════════════════════ */
const PriceCard: React.FC<{
  name: string;
  slug: string;
  price: string;
  change: string;
  isUp: boolean;
  delay?: number;
}> = ({ name, slug, price, change, isUp, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center gap-3 rounded-2xl px-4 py-3"
    style={{
      background: 'rgba(10, 22, 13, 0.55)',
      border: '1px solid rgba(22, 163, 74, 0.2)',
    }}
  >
    <div className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-[#0d1f12] border border-[#16a34a33]">
      <img
        src={`/images/commodities/${slug}.webp`}
        alt={name}
        className="w-full h-full object-contain p-1.5"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#e2e8f0] truncate">{name}</p>
      <p className="text-[10px] text-[#6b7c6e]">per kilo</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-sm font-black text-white">{price}</p>
      <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${isUp ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
        {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {change}
      </div>
    </div>
  </motion.div>
);

/* ════════════════════════════════════════════════════
   FEATURE BULLET (Screens 3 & 4)
   ════════════════════════════════════════════════════ */
const FeatureBullet: React.FC<{
  icon: React.ReactNode;
  label: string;
  delay?: number;
}> = ({ icon, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
    style={{
      background: 'rgba(10, 22, 13, 0.55)',
      border: '1px solid rgba(22, 163, 74, 0.2)',
    }}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#16a34a]/10">
      {icon}
    </div>
    <span className="text-sm font-bold text-[#d1d5db]">{label}</span>
  </motion.div>
);

/* ════════════════════════════════════════════════════
   MAIN ONBOARDING COMPONENT
   ════════════════════════════════════════════════════ */
const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedLang, setSelectedLang] = useState<'en' | 'fil'>(language);

  const handleLangSelect = (lang: 'en' | 'fil') => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const handleSkip = () => {
    navigate('/login', { replace: true });
  };

  const handleNext = () => {
    if (currentScreen === 4) {
      navigate('/login', { replace: true });
    } else {
      setDirection(1);
      setCurrentScreen((prev) => prev + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentScreen ? 1 : -1);
    setCurrentScreen(index);
  };

  /* ─── Screen Definitions ─── */
  const screens: OnboardingScreen[] = [
    /* ── Screen 1: Welcome ────────────────────────── */
    {
      id: 1,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          {/* Logo with bobbing */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
            className="mb-6 animate-bob"
          >
            <div className="w-[76px] h-[76px] rounded-full border-2 border-[#16a34a44] flex items-center justify-center overflow-hidden bg-[#0a160d]/60 shadow-[0_0_30px_rgba(22,163,74,0.15)]">
              <img
                src="/images/AgriPresyo_logoFinal.webp"
                alt="AgriPresyo"
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </motion.div>

          {/* Bilingual greeting */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#16a34a] text-sm font-bold tracking-widest uppercase mb-1"
          >
            Maligayang Pagdating
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-2xl font-black text-white tracking-tight mb-2"
          >
            Welcome to <span style={{ color: '#518706' }}>Agri</span><span className="text-white">Presyo</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm text-[#8b9a8f] leading-relaxed max-w-[300px] mx-auto"
          >
            Smarter farming decisions through real-time market updates.
          </motion.p>

          {/* Commodity icon row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center gap-3 mt-8"
          >
            {['tomato', 'onion', 'potato', 'carrot', 'eggplant'].map((slug, i) => (
              <motion.div
                key={slug}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.6 + i * 0.08, type: 'spring', stiffness: 260 }}
                className="w-13 h-13 rounded-xl flex items-center justify-center overflow-hidden border border-[#16a34a33] bg-[#0d1f12] shadow-md"
              >
                <img
                  src={`/images/commodities/${slug}.webp`}
                  alt={slug}
                  className="w-full h-full object-contain p-1.5"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ),
    },

    /* ── Screen 2: Price Tracking ─────────────────── */
    {
      id: 2,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center shadow-[0_8px_30px_rgba(34,197,94,0.3)] mb-5"
          >
            <BarChart3 size={28} className="text-white" strokeWidth={1.5} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-2xl font-black text-white mb-1"
          >Live Price Tracking</motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-[#22c55e] mb-2"
          >Real-Time Market Data</motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm text-[#8b9a8f] leading-relaxed max-w-[300px] mx-auto mb-5"
          >
            Monitor commodity prices as they change. Never overpay or undersell again.
          </motion.p>

          <div className="w-full flex flex-col gap-2.5">
            <PriceCard name="Red Onion" slug="onion" price="₱120/kg" change="-1.8%" isUp={false} delay={0.35} />
            <PriceCard name="Native Tomato" slug="tomato" price="₱65/kg" change="+3.2%" isUp={true} delay={0.45} />
          </div>
        </div>
      ),
    },

    /* ── Screen 3: For Consumers ──────────────────── */
    {
      id: 3,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center shadow-[0_8px_30px_rgba(34,197,94,0.3)] mb-5"
          >
            <ShoppingCart size={28} className="text-white" strokeWidth={1.5} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-2xl font-black text-white mb-1"
          >For Consumers</motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-[#22c55e] mb-2"
          >Smart Buying Starts Here</motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm text-[#8b9a8f] leading-relaxed max-w-[300px] mx-auto mb-6"
          >
            Easily check market prices, compare commodities, and make smarter buying decisions.
          </motion.p>

          <div className="w-full flex flex-col gap-2.5">
            <FeatureBullet icon={<Eye size={20} className="text-[#22c55e]" />} label="View real-time prices" delay={0.35} />
            <FeatureBullet icon={<BarChart3 size={20} className="text-[#22c55e]" />} label="Compare vendors easily" delay={0.45} />
            <FeatureBullet icon={<TrendingUp size={20} className="text-[#22c55e]" />} label="Track market trends" delay={0.55} />
          </div>
        </div>
      ),
    },

    /* ── Screen 4: For Vendors ────────────────────── */
    {
      id: 4,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center shadow-[0_8px_30px_rgba(34,197,94,0.3)] mb-5"
          >
            <Store size={28} className="text-white" strokeWidth={1.5} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-2xl font-black text-white mb-1"
          >For Vendors &amp; Sellers</motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-[#22c55e] mb-2"
          >Grow Your Business</motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-sm text-[#8b9a8f] leading-relaxed max-w-[300px] mx-auto mb-6"
          >
            Manage your inventory, update product prices, and connect directly with consumers in your area.
          </motion.p>

          <div className="w-full flex flex-col gap-2.5">
            <FeatureBullet icon={<Package size={20} className="text-[#22c55e]" />} label="Manage inventory" delay={0.35} />
            <FeatureBullet icon={<DollarSign size={20} className="text-[#22c55e]" />} label="Update prices instantly" delay={0.45} />
            <FeatureBullet icon={<Users size={20} className="text-[#22c55e]" />} label="Connect with consumers" delay={0.55} />
          </div>
        </div>
      ),
    },

    /* ── Screen 5: Language & Alerts ────────────────── */
    {
      id: 5,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center shadow-[0_8px_30px_rgba(34,197,94,0.3)] mb-5"
          >
            <Globe size={28} className="text-white" strokeWidth={1.5} />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-2xl font-black text-white mb-1"
          >Language &amp; Alerts</motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-xs font-bold uppercase tracking-widest text-[#22c55e] mb-5"
          >SET YOUR PREFERENCES</motion.p>

          {/* Language Selector */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-full mb-4"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-[#6b7c6e] mb-2 text-left">Language</p>
            <div className="flex items-center justify-center gap-2">
              {[
                { flag: '🇵🇭', label: 'Filipino', value: 'fil' as const },
                { flag: '🇺🇸', label: 'English', value: 'en' as const },
              ].map((lang) => (
                <div
                  key={lang.label}
                  onClick={() => handleLangSelect(lang.value)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${selectedLang === lang.value
                    ? 'bg-[#16a34a]/15 border-[#16a34a]/40 text-[#22c55e]'
                    : 'bg-[#0a160d]/60 border-[#16a34a22] text-[#6b7c6e] hover:border-[#16a34a44]'
                    }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.label}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notification Options */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-full"
          >
            <div
              className="rounded-2xl p-5"
              style={{
                background: 'linear-gradient(135deg, rgba(22,163,74,0.12) 0%, rgba(10,22,13,0.6) 100%)',
                border: '1px solid rgba(22, 163, 74, 0.25)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bell size={18} className="text-[#22c55e]" />
                <p className="text-sm font-black text-white">Stay Updated with Price Alerts</p>
              </div>
              <p className="text-xs text-[#8b9a8f] leading-relaxed mb-4">
                Get notified when your tracked commodities hit your target price.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#16a34a] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#16a34a]/20 hover:bg-[#15803d] transition-colors"
                >
                  Allow Notifications
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#6b7c6e] hover:text-[#8b9a8f] transition-colors"
                  style={{
                    background: 'rgba(10, 22, 13, 0.55)',
                    border: '1px solid rgba(22, 163, 74, 0.15)',
                  }}
                >
                  Not Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ),
    },
  ];

  const screen = screens[currentScreen];
  const isLast = currentScreen === screens.length - 1;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 280 : -280, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -280 : 280, opacity: 0 }),
  };

  return (
    <div className="min-h-screen font-sans flex justify-center items-center" style={{ backgroundColor: '#0a0a0a' }}>
      {/* ── Mobile Frame Container ── */}
      <div className="w-full max-w-[430px] relative flex flex-col min-h-screen overflow-hidden shadow-2xl border-x border-[#1f1f23]" style={{ backgroundColor: '#060e09' }}>
        {/* ── Background Layers (inside frame) ── */}
        <HexMesh />
        <FloatingParticles />
        <div className="absolute pointer-events-none" style={{ top: '-15%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: '-20%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%)' }} />

        {/* ── Main Content ── */}
        <div className="w-full relative flex flex-col min-h-screen z-10">
          {/* Skip + Close row */}
          <div className="flex items-center justify-end px-6 pt-8 pb-2">
            <button
              onClick={handleSkip}
              className="text-[#6b7c6e] text-[10px] font-bold uppercase tracking-[0.15em] hover:text-[#22c55e] transition-colors px-2 py-1"
            >
              Skip
            </button>
          </div>

          {/* Content area inside glass card */}
          <div className="flex-1 flex flex-col items-center justify-center px-5 pb-4 overflow-hidden">
            {/* Glass card wrapper */}
            <div
              className="w-full rounded-3xl relative overflow-hidden animate-glow-pulse"
              style={{
                background: 'rgba(10, 22, 13, 0.72)',
                border: '1px solid rgba(22, 163, 74, 0.33)',
                padding: '36px 24px',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                style={{
                  width: '60%',
                  background: 'linear-gradient(90deg, transparent, #22c55e, transparent)',
                }}
              />

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={screen.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="w-full"
                >
                  {screen.content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Bottom: Progress + CTA ── */}
          <div className="px-7 pb-10 flex flex-col gap-5">
            {/* 5-step progress indicator */}
            <div className="flex items-center justify-center gap-2">
              {screens.map((_, i) => (
                <button key={i} onClick={() => handleDotClick(i)} className="p-1">
                  <motion.div
                    animate={{
                      width: i === currentScreen ? 28 : 8,
                      height: 8,
                      backgroundColor: i === currentScreen ? '#16a34a' : '#1a2e1e',
                      borderRadius: i === currentScreen ? 10 : 50,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                </button>
              ))}
            </div>

            {/* CTA Button */}
            {!isLast && (
              <button
                onClick={handleNext}
                className="onboard-cta w-full py-4 rounded-[14px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] text-white bg-[#16a34a] relative overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(22,163,74,0.25)' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {currentScreen === 0 ? 'Get Started' : 'Next'}
                  <ChevronRight size={18} />
                </span>
              </button>
            )}

            {isLast && (
              <button
                onClick={handleNext}
                className="onboard-cta w-full py-4 rounded-[14px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] text-white bg-[#16a34a] relative overflow-hidden"
                style={{ boxShadow: '0 8px 32px rgba(22,163,74,0.25)' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Continue to App
                  <ArrowRight size={18} />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
