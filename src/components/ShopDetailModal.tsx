import React, { useState, useMemo } from 'react';
import { X, Star, ShieldCheck, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { commodities } from '../data/mockData';
import { getCommodityBg } from '../data/commodityColors';
import type { ShopVendor } from '../types';

interface ShopDetailModalProps {
  vendor: ShopVendor | null;
  isOpen: boolean;
  onClose: () => void;
  avatarColor: string;
  onRatingSubmit?: (vendorId: string, rating: number) => void;
}

const ShopDetailModal: React.FC<ShopDetailModalProps> = ({
  vendor,
  isOpen,
  onClose,
  avatarColor,
  onRatingSubmit,
}) => {
  const { isDark } = useTheme();
  // Per-vendor ratings map: { vendorId: starValue }
  const [ratedVendors, setRatedVendors] = useState<Record<string, number>>({});

  const vendorId = vendor?.id ?? '';
  const userRating = ratedVendors[vendorId] ?? 0;
  const hasRated = vendorId in ratedVendors;

  // Inventory: commodities that this shop carries
  const inventory = useMemo(() => {
    if (!vendor?.commodityIds) return [];
    return vendor.commodityIds
      .map(id => {
        const commodity = commodities.find(c => c.id === id);
        if (!commodity) return null;
        // Generate consistent price variation
        const seed = parseInt(vendor.id.replace('sv-', '')) * parseInt(id);
        const variation = 0.9 + ((seed * 7) % 20) / 100;
        const price = Math.round(commodity.price * variation * 100) / 100;
        // Generate consistent liquidity
        const liquidityKg = 50 + ((seed * 13) % 400);
        return { ...commodity, shopPrice: price, liquidityKg };
      })
      .filter(Boolean) as (typeof commodities[0] & { shopPrice: number; liquidityKg: number })[];
  }, [vendor]);

  // Computed rating after user rates
  const displayRating = useMemo(() => {
    if (!vendor) return { avg: 0, count: 0 };
    if (hasRated && userRating > 0) {
      const totalScore = vendor.rating * vendor.reviewCount + userRating;
      const newCount = vendor.reviewCount + 1;
      return { avg: Math.round((totalScore / newCount) * 10) / 10, count: newCount };
    }
    return { avg: vendor.rating, count: vendor.reviewCount };
  }, [vendor, hasRated, userRating]);

  const handleRate = (star: number) => {
    if (!vendor) return;
    setRatedVendors(prev => ({ ...prev, [vendor.id]: star }));
    if (onRatingSubmit) {
      onRatingSubmit(vendor.id, star);
    }
  };

  // Reset state when modal closes
  const handleClose = () => {
    onClose();
    // Don't reset rating — persist within session per spec
  };

  if (!vendor) return null;

  // Is verified: shops with rating >= 4.8
  const isVerified = vendor.rating >= 4.8;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[90] flex items-end justify-center"
            onClick={(e) => e.target === e.currentTarget && handleClose()}
          >
            <div
              className={`w-full max-w-[430px] max-h-[90vh] rounded-t-3xl overflow-y-auto no-scrollbar ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8faf8]'
                }`}
            >
              {/* Drag indicator + Close button */}
              <div className="flex items-center justify-between px-5 pt-3 pb-2 sticky top-0 z-10"
                style={{ backgroundColor: isDark ? '#0a0a0a' : '#f8faf8' }}
              >
                <div className="w-8" />
                <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-[#2a2a2e]' : 'bg-gray-300'}`} />
                <button
                  onClick={handleClose}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isDark
                      ? 'bg-[#141418] border border-[#1f1f23] text-gray-400 hover:text-white'
                      : 'bg-white border border-[#e5e7eb] text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="px-5 pb-8 flex flex-col gap-5">

                {/* ═══ HEADER ═══ */}
                <div className="flex flex-col items-center gap-3 pt-2">
                  {/* Large avatar */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black"
                    style={{ backgroundColor: avatarColor + '30', color: avatarColor }}
                  >
                    {vendor.initial}
                  </div>

                  {/* Name */}
                  <h2 className={`text-lg font-black text-center leading-tight ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                    {vendor.name}
                  </h2>

                  {/* Verified badge */}
                  {isVerified && (
                    <div className="flex items-center gap-1.5 bg-[#22c55e]/10 px-3 py-1 rounded-full">
                      <ShieldCheck size={12} className="text-[#22c55e]" />
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#22c55e]">Verified</span>
                    </div>
                  )}

                  {/* Location */}
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {vendor.location}, North Cotabato
                    </span>
                  </div>

                  {/* Open/Closed + Hours */}
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${vendor.isOpen ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-wider ${vendor.isOpen ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      {vendor.isOpen ? 'Open' : 'Closed'}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      <Clock size={9} className="inline mr-0.5" />
                      06:00 – 18:00
                    </span>
                  </div>
                </div>

                {/* ═══ RATING SECTION ═══ */}
                <div className={`rounded-2xl border p-4 ${isDark ? 'bg-[#111a11] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
                  <p className={`text-[9px] font-black uppercase tracking-[0.15em] mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Rate Terminal (Toggle Stars)
                  </p>

                  <div className="flex items-center justify-between">
                    {/* Interactive stars */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRate(star)}
                          className="transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            size={22}
                            className={
                              star <= userRating
                                ? 'text-[#f59e0b] fill-[#f59e0b]'
                                : isDark
                                  ? 'text-[#2a2a2e]'
                                  : 'text-gray-300'
                            }
                          />
                        </button>
                      ))}
                    </div>

                    {/* Average rating display */}
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                        {displayRating.avg.toFixed(1)}
                      </span>
                      <div className="flex flex-col items-end">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              className={
                                s <= Math.round(displayRating.avg)
                                  ? 'text-[#f59e0b] fill-[#f59e0b]'
                                  : isDark
                                    ? 'text-[#2a2a2e]'
                                    : 'text-gray-300'
                              }
                            />
                          ))}
                        </div>
                        <span className={`text-[9px] font-bold ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                          {displayRating.count} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  {hasRated && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-bold text-[#22c55e] mt-2 text-center"
                    >
                      ✓ Thank you for rating this shop!
                    </motion.p>
                  )}
                </div>

                {/* ═══ TERMINAL INVENTORY ═══ */}
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-[#22c55e] mb-3">
                    Terminal Inventory
                  </h3>

                  <div className="flex flex-col gap-2">
                    {inventory.map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl border p-3 flex items-center gap-3 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
                          }`}
                      >
                        {/* Commodity image */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${getCommodityBg(item.slug, isDark)}`}>
                          <img
                            src={`/images/commodities/${item.slug}.webp`}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>

                        {/* Name + weight */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                            {item.name}
                          </p>
                          <p className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            Weight Index: {item.unitWeight}KG/Unit
                          </p>
                        </div>

                        {/* Price + liquidity */}
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-[#22c55e]">
                            ₱{item.shopPrice.toFixed(2)}
                          </p>
                          <p className={`text-[8px] font-black uppercase tracking-widest mt-0.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                            Liquidity: {item.liquidityKg}KG
                          </p>
                        </div>
                      </div>
                    ))}

                    {inventory.length === 0 && (
                      <div className={`rounded-xl border p-6 text-center ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          No inventory data available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShopDetailModal;
