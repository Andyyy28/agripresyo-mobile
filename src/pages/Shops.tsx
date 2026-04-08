import React, { useState, useMemo } from 'react';
import { shopVendors } from '../data/mockData';
import { Star, ShoppingBag, Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

const filterOptions = ['ALL', 'FRUITS', 'VEGETABLES'];

const Shops: React.FC = () => {
  const { isDark } = useTheme();
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
        className={`rounded-2xl border p-4 flex flex-col gap-3 relative overflow-hidden ${
          isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
        }`}
      >
        {/* Location Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[7px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
            isDark ? 'bg-[#1a1a1e] text-gray-400 border border-[#2a2a2e]' : 'bg-gray-100 text-gray-500 border border-[#e5e7eb]'
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
                New Market Partner
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
              {vendor.isOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
        </div>

        {/* Commodity Emojis */}
        <div className="flex gap-1.5">
          {vendor.commodities.map((emoji, i) => (
            <span key={i} className={`text-sm p-1.5 rounded-lg ${isDark ? 'bg-[#1a1a1e]' : 'bg-gray-50'}`}>
              {emoji}
            </span>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: isDark ? '#1f1f23' : '#e5e7eb' }}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#1a1a1e] text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
            <ShoppingBag size={14} />
          </div>
          <button className="text-[#22c55e] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:underline">
            View Shop <ArrowRight size={10} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      {/* Header */}
      <header>
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>Shops</h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Browse shops and find the best prices</p>
          </div>
          <div className="flex gap-2">
            {filterOptions.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  activeFilter === f
                    ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                    : isDark
                      ? 'bg-[#1a1a1e] text-gray-500 border border-[#1f1f23]'
                      : 'bg-gray-100 text-gray-400 border border-[#e5e7eb]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
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
              <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>Fruit Shops</h2>
              <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Shops that sell fruits</p>
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
              <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>Vegetable &amp; Spice Shops</h2>
              <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Shops that sell vegetables and spices</p>
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
