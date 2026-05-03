import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
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
   STATIC LEAF BACKGROUND (replaces HexMesh + Particles)
   ════════════════════════════════════════════════════ */
const LeafBackground: React.FC = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    style={{ opacity: 0.06 }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="leaf-onboard" width="120" height="120" patternUnits="userSpaceOnUse">
        <path d="M60 10 Q70 30 60 50 Q50 30 60 10Z" fill="none" stroke="#3ddc6e" strokeWidth="0.8" />
        <path d="M20 70 Q30 90 20 110 Q10 90 20 70Z" fill="none" stroke="#3ddc6e" strokeWidth="0.8" />
        <path d="M100 60 Q110 80 100 100 Q90 80 100 60Z" fill="none" stroke="#3ddc6e" strokeWidth="0.8" />
        <path d="M60 10 L60 50" fill="none" stroke="#3ddc6e" strokeWidth="0.4" />
        <path d="M20 70 L20 110" fill="none" stroke="#3ddc6e" strokeWidth="0.4" />
        <path d="M100 60 L100 100" fill="none" stroke="#3ddc6e" strokeWidth="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#leaf-onboard)" />
  </svg>
);

/* ════════════════════════════════════════════════════
   PRICE CARD (Screen 2) — light theme
   ════════════════════════════════════════════════════ */
const PriceCard: React.FC<{
  name: string;
  slug: string;
  price: string;
  change: string;
  isUp: boolean;
}> = ({ name, slug, price, change, isUp }) => (
  <div
    className="flex items-center gap-3 rounded-2xl px-4 py-3"
    style={{
      background: '#ffffff',
      border: '1px solid #d0ecd0',
    }}
  >
    <div className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0 bg-[#f0faf0] border border-[#d0ecd0]">
      <img
        src={`/images/commodities/${slug}.webp`}
        alt={name}
        className="w-full h-full object-contain p-1.5"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold text-[#0a1a0a] truncate">{name}</p>
      <p className="text-[10px] text-[#4a5e4a]">per kilo</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-sm font-black text-[#0a1a0a]">{price}</p>
      <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${isUp ? 'text-[#16a34a]' : 'text-[#ef4444]'}`}>
        {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
        {change}
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════
   FEATURE BULLET (Screens 3 & 4) — light theme
   ════════════════════════════════════════════════════ */
const FeatureBullet: React.FC<{
  icon: React.ReactNode;
  label: string;
}> = ({ icon, label }) => (
  <div
    className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
    style={{
      background: '#ffffff',
      border: '1px solid #d0ecd0',
    }}
  >
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-[#3ddc6e]/10">
      {icon}
    </div>
    <span className="text-sm font-bold text-[#0a1a0a]">{label}</span>
  </div>
);

/* ════════════════════════════════════════════════════
   INLINE STYLES for CSS-only animations
   ════════════════════════════════════════════════════ */
const fadeSlideStyle = `
@keyframes onb-fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.onb-fade { animation: onb-fade-in 0.4s ease-out both; }
.onb-fade-d1 { animation: onb-fade-in 0.4s ease-out 0.05s both; }
.onb-fade-d2 { animation: onb-fade-in 0.4s ease-out 0.1s both; }
.onb-fade-d3 { animation: onb-fade-in 0.4s ease-out 0.15s both; }
.onb-fade-d4 { animation: onb-fade-in 0.4s ease-out 0.2s both; }
.onb-fade-d5 { animation: onb-fade-in 0.4s ease-out 0.25s both; }
`;

/* ════════════════════════════════════════════════════
   MAIN ONBOARDING COMPONENT
   ════════════════════════════════════════════════════ */
const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [currentScreen, setCurrentScreen] = useState(0);
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
      setCurrentScreen((prev) => prev + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentScreen(index);
  };

  /* ─── Screen Definitions ─── */
  const screens: OnboardingScreen[] = [
    /* ── Screen 1: Welcome ────────────────────────── */
    {
      id: 1,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          {/* Logo */}
          <div className="onb-fade mb-6">
            <div className="w-[76px] h-[76px] rounded-full border-2 border-[#d0ecd0] flex items-center justify-center overflow-hidden bg-white shadow-sm">
              <img
                src="/images/AgriPresyo_logoFinal.webp"
                alt="AgriPresyo"
                className="w-full h-full object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </div>

          {/* Bilingual greeting */}
          <p className="onb-fade-d1 text-[#16a34a] text-sm font-bold tracking-widest uppercase mb-1">
            Maligayang Pagdating
          </p>

          <h1 className="onb-fade-d2 text-2xl font-black text-[#0a1a0a] tracking-tight mb-2">
            Welcome to <span style={{ color: '#518706' }}>Agri</span><span className="text-[#0a1a0a]">Presyo</span>
          </h1>

          <p className="onb-fade-d3 text-sm text-[#4a5e4a] leading-relaxed max-w-[300px] mx-auto">
            Smarter farming decisions through real-time market updates.
          </p>

          {/* Commodity icon row */}
          <div className="onb-fade-d4 flex items-center gap-3 mt-8">
            {['tomato', 'onion', 'potato', 'carrot', 'eggplant'].map((slug) => (
              <div
                key={slug}
                className="w-13 h-13 rounded-xl flex items-center justify-center overflow-hidden border border-[#d0ecd0] bg-white shadow-sm"
              >
                <img
                  src={`/images/commodities/${slug}.webp`}
                  alt={slug}
                  className="w-full h-full object-contain p-1.5"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
      ),
    },

    /* ── Screen 2: Price Tracking ─────────────────── */
    {
      id: 2,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <div className="onb-fade w-14 h-14 rounded-2xl bg-[#3ddc6e] flex items-center justify-center shadow-sm mb-5">
            <BarChart3 size={28} className="text-[#0a1a0a]" strokeWidth={1.5} />
          </div>

          <h2 className="onb-fade-d1 text-2xl font-black text-[#0a1a0a] mb-1">Live Price Tracking</h2>

          <p className="onb-fade-d2 text-xs font-bold uppercase tracking-widest text-[#16a34a] mb-2">Real-Time Market Data</p>

          <p className="onb-fade-d3 text-sm text-[#4a5e4a] leading-relaxed max-w-[300px] mx-auto mb-5">
            Monitor commodity prices as they change. Never overpay or undersell again.
          </p>

          <div className="onb-fade-d4 w-full flex flex-col gap-2.5">
            <PriceCard name="Red Onion" slug="onion" price="₱120/kg" change="-1.8%" isUp={false} />
            <PriceCard name="Native Tomato" slug="tomato" price="₱65/kg" change="+3.2%" isUp={true} />
          </div>
        </div>
      ),
    },

    /* ── Screen 3: For Consumers ──────────────────── */
    {
      id: 3,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <div className="onb-fade w-14 h-14 rounded-2xl bg-[#3ddc6e] flex items-center justify-center shadow-sm mb-5">
            <ShoppingCart size={28} className="text-[#0a1a0a]" strokeWidth={1.5} />
          </div>

          <h2 className="onb-fade-d1 text-2xl font-black text-[#0a1a0a] mb-1">For Consumers</h2>

          <p className="onb-fade-d2 text-xs font-bold uppercase tracking-widest text-[#16a34a] mb-2">Smart Buying Starts Here</p>

          <p className="onb-fade-d3 text-sm text-[#4a5e4a] leading-relaxed max-w-[300px] mx-auto mb-6">
            Easily check market prices, compare commodities, and make smarter buying decisions.
          </p>

          <div className="onb-fade-d4 w-full flex flex-col gap-2.5">
            <FeatureBullet icon={<Eye size={20} className="text-[#16a34a]" />} label="View real-time prices" />
            <FeatureBullet icon={<BarChart3 size={20} className="text-[#16a34a]" />} label="Compare vendors easily" />
            <FeatureBullet icon={<TrendingUp size={20} className="text-[#16a34a]" />} label="Track market trends" />
          </div>
        </div>
      ),
    },

    /* ── Screen 4: For Vendors ────────────────────── */
    {
      id: 4,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <div className="onb-fade w-14 h-14 rounded-2xl bg-[#3ddc6e] flex items-center justify-center shadow-sm mb-5">
            <Store size={28} className="text-[#0a1a0a]" strokeWidth={1.5} />
          </div>

          <h2 className="onb-fade-d1 text-2xl font-black text-[#0a1a0a] mb-1">For Vendors &amp; Sellers</h2>

          <p className="onb-fade-d2 text-xs font-bold uppercase tracking-widest text-[#16a34a] mb-2">Grow Your Business</p>

          <p className="onb-fade-d3 text-sm text-[#4a5e4a] leading-relaxed max-w-[300px] mx-auto mb-6">
            Manage your inventory, update product prices, and connect directly with consumers in your area.
          </p>

          <div className="onb-fade-d4 w-full flex flex-col gap-2.5">
            <FeatureBullet icon={<Package size={20} className="text-[#16a34a]" />} label="Manage inventory" />
            <FeatureBullet icon={<DollarSign size={20} className="text-[#16a34a]" />} label="Update prices instantly" />
            <FeatureBullet icon={<Users size={20} className="text-[#16a34a]" />} label="Connect with consumers" />
          </div>
        </div>
      ),
    },

    /* ── Screen 5: Language & Alerts ────────────────── */
    {
      id: 5,
      content: (
        <div className="flex flex-col items-center text-center w-full">
          <div className="onb-fade w-14 h-14 rounded-2xl bg-[#3ddc6e] flex items-center justify-center shadow-sm mb-5">
            <Globe size={28} className="text-[#0a1a0a]" strokeWidth={1.5} />
          </div>

          <h2 className="onb-fade-d1 text-2xl font-black text-[#0a1a0a] mb-1">Language &amp; Alerts</h2>

          <p className="onb-fade-d2 text-xs font-bold uppercase tracking-widest text-[#16a34a] mb-5">SET YOUR PREFERENCES</p>

          {/* Language Selector */}
          <div className="onb-fade-d3 w-full mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#4a5e4a] mb-2 text-left">Language</p>
            <div className="flex items-center justify-center gap-2">
              {[
                { flag: '🇵🇭', label: 'Filipino', value: 'fil' as const },
                { flag: '🇺🇸', label: 'English', value: 'en' as const },
              ].map((lang) => (
                <div
                  key={lang.label}
                  onClick={() => handleLangSelect(lang.value)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${selectedLang === lang.value
                    ? 'bg-[#3ddc6e]/15 border-[#3ddc6e]/40 text-[#16a34a]'
                    : 'bg-white border-[#d0ecd0] text-[#4a5e4a] hover:border-[#3ddc6e]/40'
                    }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  {lang.label}
                </div>
              ))}
            </div>
          </div>

          {/* Notification Options */}
          <div className="onb-fade-d4 w-full">
            <div
              className="rounded-2xl p-5"
              style={{
                background: '#ffffff',
                border: '1px solid #d0ecd0',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bell size={18} className="text-[#16a34a]" />
                <p className="text-sm font-black text-[#0a1a0a]">Stay Updated with Price Alerts</p>
              </div>
              <p className="text-xs text-[#4a5e4a] leading-relaxed mb-4">
                Get notified when your tracked commodities hit your target price.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleNext}
                  className="flex-1 bg-[#3ddc6e] text-[#0a1a0a] py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-[#34c960] transition-colors duration-200 active:scale-[0.97]"
                >
                  Allow Notifications
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#4a5e4a] hover:text-[#0a1a0a] transition-colors duration-200 active:scale-[0.97]"
                  style={{
                    background: '#f0faf0',
                    border: '1px solid #d0ecd0',
                  }}
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

  return (
    <div className="min-h-screen font-sans flex justify-center items-center" style={{ backgroundColor: '#e8f5e8' }}>
      <style>{fadeSlideStyle}</style>

      {/* ── Mobile Frame Container ── */}
      <div className="w-full max-w-[430px] relative flex flex-col min-h-screen overflow-hidden shadow-lg border-x border-[#d0ecd0]" style={{ backgroundColor: '#f0faf0' }}>
        {/* ── Static Background ── */}
        <LeafBackground />

        {/* ── Main Content ── */}
        <div className="w-full relative flex flex-col min-h-screen z-10">
          {/* Skip row */}
          <div className="flex items-center justify-end px-6 pt-8 pb-2">
            <button
              onClick={handleSkip}
              className="text-[#4a5e4a] text-[10px] font-bold uppercase tracking-[0.15em] hover:text-[#16a34a] transition-colors duration-200 px-2 py-1"
            >
              Skip
            </button>
          </div>

          {/* Content area inside card */}
          <div className="flex-1 flex flex-col items-center justify-center px-5 pb-4 overflow-hidden">
            {/* Card wrapper */}
            <div
              className="w-full rounded-3xl relative overflow-hidden"
              style={{
                background: '#ffffff',
                border: '1px solid #d0ecd0',
                padding: '36px 24px',
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                style={{
                  width: '60%',
                  background: 'linear-gradient(90deg, transparent, #3ddc6e, transparent)',
                }}
              />

              <AnimatePresence mode="wait">
                <div
                  key={screen.id}
                  className="w-full"
                  style={{
                    animation: 'onb-fade-in 0.3s ease-out both',
                  }}
                >
                  {screen.content}
                </div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Bottom: Progress + CTA ── */}
          <div className="px-7 pb-10 flex flex-col gap-5">
            {/* 5-step progress indicator */}
            <div className="flex items-center justify-center gap-2">
              {screens.map((_, i) => (
                <button key={i} onClick={() => handleDotClick(i)} className="p-1">
                  <div
                    style={{
                      width: i === currentScreen ? 28 : 8,
                      height: 8,
                      backgroundColor: i === currentScreen ? '#3ddc6e' : '#d0ecd0',
                      borderRadius: i === currentScreen ? 10 : 50,
                      transition: 'all 0.3s ease-out',
                    }}
                  />
                </button>
              ))}
            </div>

            {/* CTA Button */}
            {!isLast && (
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-[14px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] text-[#0a1a0a] bg-[#3ddc6e] shadow-sm"
              >
                <span className="flex items-center gap-2">
                  {currentScreen === 0 ? 'Get Started' : 'Next'}
                  <ChevronRight size={18} />
                </span>
              </button>
            )}

            {isLast && (
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-[14px] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.97] text-[#0a1a0a] bg-[#3ddc6e] shadow-sm"
              >
                <span className="flex items-center gap-2">
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
