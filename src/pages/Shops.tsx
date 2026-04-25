import React, { useState, useMemo } from 'react';
import { shopVendors, commodities } from '../data/mockData';
import { Star, ShoppingBag, Leaf, ArrowRight, Bell, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { getCommodityBg } from '../data/commodityColors';

const filterOptions = ['ALL', 'FRUITS', 'VEGETABLES'];

const Shops: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { openPanel, unreadCount } = useNotifications();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const filteredVendors = useMemo(() => {
    if (activeFilter === 'ALL') return shopVendors;
    return shopVendors.filter(v =>
      v.category.toUpperCase() === activeFilter ||
      (activeFilter === 'VEGETABLES' && (v.category === 'Vegetables' || v.category === 'Spices'))
    );
  }, [activeFilter]);

  const fruitShops = filteredVendors.filter(v => v.category === 'Fruits');
  const vegShops = filteredVendors.filter(v => v.category === 'Vegetables' || v.category === 'Spices');

  const VendorCard: React.FC<{ vendor: typeof shopVendors[0]; index: number }> = ({ vendor, index }) => {
    const avatarColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
    const color = avatarColors[index % avatarColors.length];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-2xl border p-4 flex flex-col gap-3 relative overflow-hidden ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
          }`}
      >
        {/* Location Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[7px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${isDark ? 'bg-[#1a1a1e] text-gray-400 border border-[#2a2a2e]' : 'bg-gray-100 text-gray-500 border border-[#e5e7eb]'
            }`}>
            {vendor.location}
          </span>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
            style={{ backgroundColor: color + '30', color }}
          >
            {vendor.initial}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-bold truncate pr-16 ${isDark ? 'text-white' : 'text-[#111827]'}`}>{vendor.name}</h3>
            {vendor.isNew && (
              <span className="text-[8px] font-black uppercase tracking-wider text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                {t('new_market_partner')}
              </span>
            )}
          </div>
        </div>

        {/* Rating & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star size={12} className="text-[#f59e0b] fill-[#f59e0b]" />
            <span className="text-xs font-bold text-[#f59e0b]">{vendor.rating}</span>
            <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>({vendor.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${vendor.isOpen ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
            <span className={`text-[9px] font-black uppercase tracking-wider ${vendor.isOpen ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {vendor.isOpen ? t('open_status') : t('closed_status')}
            </span>
          </div>
        </div>

        {/* Commodity Images */}
        <div className="flex gap-1.5">
          {(vendor.commodityIds || []).slice(0, 4).map((cId, i) => {
            const commodity = commodities.find(c => c.id === cId);
            if (!commodity) return null;
            return (
              <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden ${getCommodityBg(commodity.slug, isDark)}`}>
                <img
                  src={`/images/commodities/${commodity.slug}.webp`}
                  alt={commodity.name}
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: isDark ? '#1f1f23' : '#e5e7eb' }}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#1a1a1e] text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
            <ShoppingBag size={14} />
          </div>
          <button className="text-[#22c55e] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:underline">
            {t('view_shop')} <ArrowRight size={10} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      {/* Header with logo, theme toggle, bell */}
      <header>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {/* Replace /public/images/logo.png to update logo globally */}
            <img
              src="/images/AgriPresyo_logoFinal.webp"
              alt="AgriPresyo"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback if logo image is missing */}
            <div className="hidden">
              <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>Agri</span>
              <span className="text-lg font-black text-[#22c55e]">Presyo</span>
            </div>
            <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('shops_title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-colors ${isDark ? 'bg-[#141418] border-[#1f1f23] text-gray-400 hover:text-white' : 'bg-white border-[#e5e7eb] text-gray-500 hover:text-gray-700'}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={openPanel}
              className={`relative p-2.5 rounded-xl border transition-colors ${isDark ? 'bg-[#141418] border-[#1f1f23] text-gray-400 hover:text-white' : 'bg-white border-[#e5e7eb] text-gray-500 hover:text-gray-700'}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full border-2" style={{ borderColor: isDark ? '#141418' : '#ffffff' }}></span>
              )}
            </button>
          </div>
        </div>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('browse_shops')}</p>
        <div className="flex gap-2 mt-3">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${activeFilter === f
                  ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                  : isDark
                    ? 'bg-[#1a1a1e] text-gray-500 border border-[#1f1f23]'
                    : 'bg-gray-100 text-gray-400 border border-[#e5e7eb]'
                }`}
            >
              {t(`filter_${f.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </header>

      {/* Fruit Shops Section */}
      {(activeFilter === 'ALL' || activeFilter === 'FRUITS') && fruitShops.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#f97316]/15 flex items-center justify-center">
              <ShoppingBag size={14} className="text-[#f97316]" />
            </div>
            <div>
              <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('fruit_shops')}</h2>
              <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('shops_sell_fruits')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {fruitShops.map((vendor, i) => (
              <VendorCard key={vendor.id} vendor={vendor} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Vegetable & Spice Shops Section */}
      {(activeFilter === 'ALL' || activeFilter === 'VEGETABLES') && vegShops.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-[#22c55e]/15 flex items-center justify-center">
              <Leaf size={14} className="text-[#22c55e]" />
            </div>
            <div>
              <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('veg_spice_shops')}</h2>
              <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('shops_sell_veg')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {vegShops.map((vendor, i) => (
              <VendorCard key={vendor.id} vendor={vendor} index={i + fruitShops.length} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Shops;
