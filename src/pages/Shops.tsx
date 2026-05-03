import React, { useState, useMemo, useCallback } from 'react';
import { shopVendors, commodities } from '../data/mockData';
import { Star, ShoppingBag, Leaf, ArrowRight, Bell, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { getCommodityBg } from '../data/commodityColors';
import ShopDetailModal from '../components/ShopDetailModal';
import type { ShopVendor } from '../types';

const filterOptions = ['ALL', 'FRUITS', 'VEGETABLES'];

const avatarColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const Shops: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { openPanel, unreadCount } = useNotifications();
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedVendor, setSelectedVendor] = useState<ShopVendor | null>(null);
  const [selectedColor, setSelectedColor] = useState('#22c55e');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Session ratings — tracks user-submitted ratings per vendor
  const [sessionRatings, setSessionRatings] = useState<Record<string, { rating: number; count: number }>>({});

  const handleRatingSubmit = useCallback((vendorId: string, rating: number) => {
    setSessionRatings(prev => {
      const vendor = shopVendors.find(v => v.id === vendorId);
      if (!vendor) return prev;
      // Always recalculate from original base + user's current star
      const baseTotal = vendor.rating * vendor.reviewCount;
      const newCount = vendor.reviewCount + 1;
      const newAvg = (baseTotal + rating) / newCount;
      return {
        ...prev,
        [vendorId]: {
          rating: Math.round(newAvg * 10) / 10,
          count: newCount,
        },
      };
    });
  }, []);

  const filteredVendors = useMemo(() => {
    if (activeFilter === 'ALL') return shopVendors;
    return shopVendors.filter(v =>
      v.category.toUpperCase() === activeFilter ||
      (activeFilter === 'VEGETABLES' && (v.category === 'Vegetables' || v.category === 'Spices'))
    );
  }, [activeFilter]);

  const fruitShops = filteredVendors.filter(v => v.category === 'Fruits');
  const vegShops = filteredVendors.filter(v => v.category === 'Vegetables' || v.category === 'Spices');

  const handleViewShop = (vendor: ShopVendor, colorIndex: number) => {
    setSelectedVendor(vendor);
    setSelectedColor(avatarColors[colorIndex % avatarColors.length]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVendor(null), 300);
  };

  const VendorCard: React.FC<{ vendor: typeof shopVendors[0]; index: number }> = ({ vendor, index }) => {
    const color = avatarColors[index % avatarColors.length];

    // Use session rating if user has rated
    const displayRating = sessionRatings[vendor.id]?.rating ?? vendor.rating;
    const displayCount = sessionRatings[vendor.id]?.count ?? vendor.reviewCount;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`rounded-2xl border p-3.5 flex flex-col gap-2.5 relative overflow-hidden cursor-pointer active:scale-[0.97] transition-all ${isDark ? 'bg-[#141418] border-[#1f1f23] hover:border-[#3ddc6e]/30 hover:shadow-[0_0_12px_rgba(61,220,110,0.06)]' : 'bg-white border-[#e5e7eb] hover:border-[#22c55e]/30 hover:shadow-[0_0_12px_rgba(34,197,94,0.08)]'
          }`}
        onClick={() => handleViewShop(vendor, index)}
      >
        {/* Location Badge */}
        <div>
          <span className={`text-[6px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full inline-block ${isDark ? 'bg-[#1a1a1e] text-gray-400 border border-[#2a2a2e]' : 'bg-gray-100 text-gray-500 border border-[#e5e7eb]'
            }`}>
            {vendor.location}
          </span>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
            style={{ backgroundColor: color + '30', color }}
          >
            {vendor.initial}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-[11px] font-bold leading-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>
              {vendor.name}
            </h3>
            {vendor.isNew && (
              <span className="text-[7px] font-black uppercase tracking-wider text-[#22c55e] bg-[#22c55e]/10 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">
                {t('new_market_partner')}
              </span>
            )}
          </div>
        </div>

        {/* Rating & Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star size={11} className="text-[#f59e0b] fill-[#f59e0b]" />
            <span className="text-[10px] font-bold text-[#f59e0b]">{displayRating}</span>
            <span className={`text-[9px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>({displayCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${vendor.isOpen ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
            <span className={`text-[8px] font-black uppercase tracking-wider ${vendor.isOpen ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {vendor.isOpen ? t('open_status') : t('closed_status')}
            </span>
          </div>
        </div>

        {/* Commodity Images */}
        <div className="flex gap-1">
          {(vendor.commodityIds || []).slice(0, 4).map((cId, i) => {
            const commodity = commodities.find(c => c.id === cId);
            if (!commodity) return null;
            return (
              <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden ${getCommodityBg(commodity.slug, isDark)}`}>
                <img
                  src={`/images/commodities/${commodity.slug}.webp`}
                  alt={commodity.name}
                  className="w-full h-full object-contain p-0.5"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            );
          })}
          {(vendor.commodityIds || []).length > 4 && (
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[8px] font-bold ${isDark ? 'bg-[#1a1a1e] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
              +{(vendor.commodityIds || []).length - 4}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: isDark ? '#1f1f23' : '#e5e7eb' }}>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#1a1a1e] text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
            <ShoppingBag size={12} />
          </div>
          <span className="text-[#22c55e] text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
            {t('view_shop')} <ArrowRight size={9} />
          </span>
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
              <span className="text-lg font-black" style={{ color: '#518706' }}>Agri</span>
              <span className="text-lg font-black" style={{ color: isDark ? '#FFFFFF' : '#000000' }}>Presyo</span>
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
          <div className="grid grid-cols-2 gap-2.5">
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
          <div className="grid grid-cols-2 gap-2.5">
            {vegShops.map((vendor, i) => (
              <VendorCard key={vendor.id} vendor={vendor} index={i + fruitShops.length} />
            ))}
          </div>
        </section>
      )}

      {/* Shop Detail Modal */}
      <ShopDetailModal
        vendor={selectedVendor}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        avatarColor={selectedColor}
        onRatingSubmit={handleRatingSubmit}
      />
    </div>
  );
};

export default Shops;
