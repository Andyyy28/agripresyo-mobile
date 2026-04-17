import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  TrendingDown,
  Globe,
  Bell,
  Store,
  ShoppingCart,
  ChevronRight,
  ArrowRight,
  Leaf,
  Sprout,
  Eye,
  BarChart3,
  Package,
  DollarSign,
  Users,
} from 'lucide-react';

interface OnboardingScreen {
  id: number;
  content: React.ReactNode;
  accent: string;
}

/* ─── Commodity card used in Screen 2 ─── */
const PriceCard: React.FC<{
  name: string;
  slug: string;
  price: string;
  change: string;
  isUp: boolean;
  bgLight: string;
}> = ({ name, slug, price, change, isUp, bgLight }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 bg-white rounded-2xl border border-[#f0f0f0] px-4 py-3 shadow-sm"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${bgLight}`}>
      <img
        src={`/images/commodities/${slug}.webp`}
        alt={name}
        className="w-full h-full object-contain p-1.5"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#111] truncate">{name}</p>
      <p className="text-xs text-[#888]">per kilo</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-sm font-black text-[#111]">{price}</p>
      <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${isUp ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
        {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {change}
      </div>
    </div>
  </motion.div>
);

/* ─── Feature bullet ─── */
const FeatureBullet: React.FC<{
  icon: React.ReactNode;
  label: string;
  accent: string;
  delay?: number;
}> = ({ icon, label, accent, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center gap-3 bg-white rounded-2xl border border-[#f0f0f0] px-4 py-3.5 shadow-sm"
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${accent}18` }}
    >
      {icon}
    </div>
    <span className="text-sm font-bold text-[#333]">{label}</span>
  </motion.div>
);

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleSkip = () => {
    navigate('/login', { replace: true });
  };

  const handleNext = () => {
    if (currentScreen === 4) {
      navigate('/login', { replace: true });
    } else {
      setDirection(1);
      setCurrentScreen(prev => prev + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentScreen ? 1 : -1);
    setCurrentScreen(index);
  };

  /* ─── Screen definitions ─── */
  const screens: OnboardingScreen[] = [
    /* ── Screen 1: Welcome ── */
    {
      id: 1,
      accent: '#ff523b',
      content: (
        <div className="flex flex-col items-center text-center w-full">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <img
              src="/images/AgriPresyo_logoFinal.webp"
              alt="AgriPresyo"
              className="h-20 w-auto object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="text-2xl font-black text-[#ff523b] mb-1">Maligayang Pagdating!</p>
            <h1 className="text-3xl font-black text-[#111] tracking-tight mb-3">
              Welcome to <span className="text-[#ff523b]">AgriPresyo</span>
            </h1>
            <p className="text-sm text-[#555] leading-relaxed max-w-[300px] mx-auto">
              Smarter farming decisions through live market updates. Track commodity prices in real-time, across the Philippines.
            </p>
          </motion.div>

          {/* Decorative commodity images ring */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-8"
          >
            {['tomato', 'onion', 'mango', 'carrot', 'eggplant'].map((slug, i) => {
              const bgs = ['bg-[#fee2e2]', 'bg-[#f3e8ff]', 'bg-[#fef3c7]', 'bg-[#ffedd5]', 'bg-[#ede9fe]'];
              return (
                <motion.div
                  key={slug}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.35 + i * 0.08, type: 'spring' }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden ${bgs[i]} shadow-sm border border-black/5`}
                >
                  <img
                    src={`/images/commodities/${slug}.webp`}
                    alt={slug}
                    className="w-full h-full object-contain p-1.5"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      ),
    },

    /* ── Screen 2: Price Tracking ── */
    {
      id: 2,
      accent: '#ff523b',
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff523b] to-[#e7432e] flex items-center justify-center shadow-xl shadow-[#ff523b]/25 mb-5"
          >
            <BarChart3 size={32} className="text-white" strokeWidth={1.5} />
          </motion.div>

          <h2 className="text-2xl font-black text-[#111] mb-1">Live Price Tracking</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-[#ff523b] mb-3">Real-Time Market Data</p>
          <p className="text-sm text-[#555] leading-relaxed max-w-[300px] mx-auto mb-6">
            Monitor commodity prices as they change. Never overpay or undersell again.
          </p>

          <div className="w-full flex flex-col gap-2.5">
            <PriceCard name="Native Tomato" slug="tomato" price="₱65/kg" change="+3.2%" isUp={true} bgLight="bg-[#fee2e2]" />
            <PriceCard name="Red Onion" slug="onion" price="₱120/kg" change="-1.8%" isUp={false} bgLight="bg-[#f3e8ff]" />
            <PriceCard name="Carabao Mango" slug="mango" price="₱85/kg" change="+5.1%" isUp={true} bgLight="bg-[#fef3c7]" />
            <PriceCard name="Eggplant" slug="eggplant" price="₱55/kg" change="+0.9%" isUp={true} bgLight="bg-[#ede9fe]" />
          </div>
        </div>
      ),
    },

    /* ── Screen 3: For Consumers ── */
    {
      id: 3,
      accent: '#22c55e',
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] flex items-center justify-center shadow-xl shadow-[#22c55e]/25 mb-5"
          >
            <ShoppingCart size={32} className="text-white" strokeWidth={1.5} />
          </motion.div>

          <h2 className="text-2xl font-black text-[#111] mb-1">For Consumers</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-[#22c55e] mb-3">Smart Buying Starts Here</p>
          <p className="text-sm text-[#555] leading-relaxed max-w-[300px] mx-auto mb-6">
            Easily check market prices, compare commodities, and make smarter buying decisions.
          </p>

          <div className="w-full flex flex-col gap-2.5">
            <FeatureBullet icon={<Eye size={20} className="text-[#22c55e]" />} label="View real-time prices" accent="#22c55e" delay={0.15} />
            <FeatureBullet icon={<BarChart3 size={20} className="text-[#22c55e]" />} label="Compare products easily" accent="#22c55e" delay={0.25} />
            <FeatureBullet icon={<Bell size={20} className="text-[#22c55e]" />} label="Stay informed on price changes" accent="#22c55e" delay={0.35} />
          </div>

          {/* Mini commodity preview */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-2 mt-6"
          >
            {['tomato', 'onion', 'carrot', 'pechay'].map((slug, i) => {
              const bgs = ['bg-[#fee2e2]', 'bg-[#f3e8ff]', 'bg-[#ffedd5]', 'bg-[#dcfce7]'];
              return (
                <div key={slug} className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${bgs[i]} border border-black/5`}>
                  <img
                    src={`/images/commodities/${slug}.webp`}
                    alt={slug}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>
      ),
    },

    /* ── Screen 4: For Vendors & Sellers ── */
    {
      id: 4,
      accent: '#8b5cf6',
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shadow-xl shadow-[#8b5cf6]/25 mb-5"
          >
            <Store size={32} className="text-white" strokeWidth={1.5} />
          </motion.div>

          <h2 className="text-2xl font-black text-[#111] mb-1">For Vendors & Sellers</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-[#8b5cf6] mb-3">Grow Your Business</p>
          <p className="text-sm text-[#555] leading-relaxed max-w-[300px] mx-auto mb-6">
            Manage your inventory, update product prices, and connect directly with consumers in your area.
          </p>

          <div className="w-full flex flex-col gap-2.5">
            <FeatureBullet icon={<Package size={20} className="text-[#8b5cf6]" />} label="Add & manage products" accent="#8b5cf6" delay={0.15} />
            <FeatureBullet icon={<DollarSign size={20} className="text-[#8b5cf6]" />} label="Update prices instantly" accent="#8b5cf6" delay={0.25} />
            <FeatureBullet icon={<Users size={20} className="text-[#8b5cf6]" />} label="Connect with customers" accent="#8b5cf6" delay={0.35} />
          </div>
        </div>
      ),
    },

    /* ── Screen 5: Region & Alerts (Combined) ── */
    {
      id: 5,
      accent: '#f59e0b',
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center shadow-xl shadow-[#f59e0b]/25 mb-5"
          >
            <Globe size={32} className="text-white" strokeWidth={1.5} />
          </motion.div>

          <h2 className="text-2xl font-black text-[#111] mb-1">Region & Alerts</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mb-5">Personalize Your Experience</p>

          {/* Language chips */}
          <div className="w-full mb-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#999] mb-2">Language</p>
            <div className="flex items-center justify-center gap-2">
              {[
                { flag: '🇵🇭', label: 'Filipino', active: true },
                { flag: '🇺🇸', label: 'English', active: false },
                { flag: '🗣️', label: 'Bisaya', active: false },
              ].map((lang) => (
                <div
                  key={lang.label}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    lang.active
                      ? 'bg-[#ff523b]/10 border-[#ff523b]/30 text-[#ff523b]'
                      : 'bg-white border-[#eee] text-[#555]'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.label}
                </div>
              ))}
            </div>
          </div>

          {/* Region */}
          <div className="w-full mb-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#999] mb-2">Region</p>
            <div className="bg-white border border-[#eee] rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <Globe size={18} className="text-[#f59e0b]" />
              <span className="text-sm font-bold text-[#333]">Davao Region</span>
              <span className="ml-auto text-[8px] font-black uppercase tracking-widest bg-[#f59e0b]/15 text-[#f59e0b] px-2 py-0.5 rounded-full">Default</span>
            </div>
          </div>

          {/* Price Alerts */}
          <div className="w-full">
            <div className="bg-gradient-to-br from-[#fff5f5] to-[#fff0eb] border border-[#ffd6d6] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={18} className="text-[#ff523b]" />
                <p className="text-sm font-black text-[#111]">Stay Updated with Price Alerts</p>
              </div>
              <p className="text-xs text-[#555] leading-relaxed mb-4">
                Get notified when your tracked commodities hit your target price.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#ff523b] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#ff523b]/20"
                >
                  Allow Notifications
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 bg-white border border-[#eee] text-[#555] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
                >
                  Not Now
                </button>
              </div>
            </div>
          </div>
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
    <div className="min-h-screen bg-[#ffffff] text-[#111] font-sans flex justify-center relative overflow-hidden">
      {/* Soft background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          key={screen.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.08]"
          style={{ backgroundColor: screen.accent }}
        />
        <div className="absolute top-16 right-8 animate-float-slow opacity-[0.06]">
          <Leaf size={40} className="text-[#22c55e]" strokeWidth={1} />
        </div>
        <div className="absolute bottom-32 left-6 animate-float-slower opacity-[0.05]" style={{ animationDelay: '3s' }}>
          <Sprout size={28} className="text-[#22c55e]" strokeWidth={1} />
        </div>
      </div>

      <div className="w-full max-w-[430px] relative flex flex-col min-h-screen">
        {/* Skip button */}
        <div className="flex justify-end px-6 pt-8 pb-2">
          <button
            onClick={handleSkip}
            className="text-[#999] text-xs font-bold uppercase tracking-widest hover:text-[#555] transition-colors px-3 py-2"
          >
            Skip
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-7 pb-4 overflow-hidden">
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

        {/* Bottom: dots + button */}
        <div className="px-7 pb-10 flex flex-col gap-5">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {screens.map((_, i) => (
              <button key={i} onClick={() => handleDotClick(i)} className="p-1">
                <motion.div
                  animate={{
                    width: i === currentScreen ? 28 : 8,
                    backgroundColor: i === currentScreen ? screen.accent : '#e0e0e0',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="h-2 rounded-full"
                />
              </button>
            ))}
          </div>

          {/* Primary button (only for non-last screens, since screen 5 has its own buttons) */}
          {!isLast && (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] text-white"
              style={{
                backgroundColor: screen.accent,
                boxShadow: `0 8px 32px ${screen.accent}30`,
              }}
            >
              {currentScreen === 0 ? 'Get Started' : 'Next'}
              <ChevronRight size={18} />
            </button>
          )}

          {isLast && (
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] text-white"
              style={{
                backgroundColor: '#ff523b',
                boxShadow: '0 8px 32px rgba(255,82,59,0.2)',
              }}
            >
              Continue to App
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
