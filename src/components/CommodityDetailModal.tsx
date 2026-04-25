import React, { useState, useMemo } from 'react';
import { X, ArrowUpRight, Clock, Star, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { Commodity } from '../types';
import { getShopVendorsForCommodity } from '../data/mockData';
import { useAssets } from '../context/AssetContext';
import { useTheme } from '../context/ThemeContext';

interface CommodityDetailModalProps {
  commodity: Commodity | null;
  isOpen: boolean;
  onClose: () => void;
}

// Custom tooltip for the chart
const CustomTooltip: React.FC<any> = ({ active, payload, label, lineColor }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg px-3 py-2 shadow-xl">
        <p className="text-white text-[11px] font-medium">{label}</p>
        <p className="text-sm font-bold" style={{ color: lineColor }}>
          Price : ₱{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const CommodityDetailModal: React.FC<CommodityDetailModalProps> = ({ commodity, isOpen, onClose }) => {
  const { addAsset } = useAssets();
  const { isDark } = useTheme();
  const [showToast, setShowToast] = useState(false);

  // All hooks MUST be above the early return to avoid hook ordering issues
  // Chart data with dates
  const chartData = useMemo(() => {
    if (!commodity) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return commodity.priceHistory.map((price, i) => {
      const monthIdx = (i + 2) % 12; // Start from March
      const day = (i % 28) + 1;
      return {
        index: i,
        price,
        month: months[monthIdx],
        date: `2026-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      };
    });
  }, [commodity]);

  // Recent data points (last 5)
  const recentDataPoints = useMemo(() => {
    if (!commodity) return [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const lastPoints = commodity.priceHistory.slice(-5);
    return lastPoints.map((price, i) => {
      const realIndex = commodity.priceHistory.length - 5 + i;
      const prevPrice = realIndex > 0 ? commodity.priceHistory[realIndex - 1] : price;
      const change = prevPrice !== 0 ? ((price - prevPrice) / prevPrice) * 100 : 0;
      const monthIdx = (realIndex + 2) % 12;
      const day = (realIndex % 28) + 1;
      return {
        date: `${months[monthIdx]} ${day}, 2026`,
        price,
        change,
      };
    }).reverse(); // Most recent first
  }, [commodity]);

  if (!commodity) return null;

  // Derived values (not hooks, safe after early return)
  const shopVendors = getShopVendorsForCommodity(commodity);

  const minPrice = Math.min(...commodity.priceHistory);
  const maxPrice = Math.max(...commodity.priceHistory);
  const padding = (maxPrice - minPrice) * 0.15;

  const isVegetable = commodity.category === 'Vegetables' || commodity.category === 'Spices' || commodity.category === 'Roots';
  const lineColor = isVegetable ? '#ef4444' : '#22c55e';

  const handleAddToAssets = () => {
    addAsset(commodity.id);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // Unique X-axis labels (use only every 5th month to avoid clutter)
  const filteredData = chartData.filter((_, i) => i % 5 === 0 || i === chartData.length - 1);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={onClose}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
            >
              <div className={`w-full max-w-[430px] rounded-t-3xl border-t border-x max-h-[90vh] overflow-y-auto no-scrollbar ${isDark ? 'bg-[#0a0a0a] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
                }`}>
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className={`w-10 h-1 rounded-full ${isDark ? 'bg-[#2a2a2e]' : 'bg-gray-300'}`} />
                </div>

                <div className="px-5 pb-24 flex flex-col gap-5">
                  {/* Modal Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden ${isDark ? commodity.darkBgColor : commodity.lightBgColor}`}>
                        <img
                          src={`/images/commodities/${commodity.slug}.webp`}
                          alt={commodity.name}
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{commodity.name}</h2>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{commodity.category.toUpperCase()} INDEX</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className={`w-9 h-9 rounded-full flex items-center justify-center border transition-colors mt-1 ${isDark ? 'bg-[#141418] border-[#1f1f23] text-gray-400 hover:text-white' : 'bg-gray-50 border-[#e5e7eb] text-gray-400 hover:text-gray-600'
                        }`}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Section 1: Local Market Index Card */}
                  <div className={`rounded-xl border p-4 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-gray-50 border-[#e5e7eb]'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Local Market Index</p>
                      <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${commodity.percentChange >= 0
                        ? 'text-[#22c55e] bg-[#22c55e]/10'
                        : 'text-[#ef4444] bg-[#ef4444]/10'
                        }`}>
                        <ArrowUpRight size={12} className={commodity.percentChange < 0 ? 'rotate-90' : ''} />
                        {Math.abs(commodity.percentChange).toFixed(1)}%
                      </div>
                    </div>

                    <div className="mb-2">
                      <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₱{commodity.price.toFixed(2)}</span>
                      <span className={`text-lg ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>/ kg</span>
                    </div>

                    <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                      Projection: 1 Unit = {commodity.unitWeight.toFixed(1)}KG
                    </p>
                  </div>

                  {/* Section 2: Price History Chart */}
                  <div className="flex flex-col gap-3">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Price History</p>

                    <div className={`rounded-xl border p-4 ${isDark ? 'bg-[#111114] border-[#1f1f23]' : 'bg-gray-50 border-[#e5e7eb]'}`}>
                      <div className="w-full h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -10, bottom: 5 }}>
                            <defs>
                              <linearGradient id={`gradient-${commodity.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={lineColor} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="4 4"
                              stroke={isDark ? '#1f1f23' : '#e5e7eb'}
                              vertical={false}
                            />
                            <XAxis
                              dataKey="month"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: isDark ? '#4a4a4e' : '#9ca3af', fontSize: 10, fontWeight: 600 }}
                              interval={4}
                            />
                            <YAxis
                              domain={[minPrice - padding, maxPrice + padding]}
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: isDark ? '#4a4a4e' : '#9ca3af', fontSize: 10, fontWeight: 700 }}
                              tickFormatter={(val: number) => `₱${Math.round(val)}`}
                              width={50}
                              tickCount={4}
                            />
                            <Tooltip
                              content={<CustomTooltip lineColor={lineColor} />}
                              cursor={{
                                stroke: '#ffffff',
                                strokeWidth: 1,
                                strokeDasharray: '4 4',
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="price"
                              stroke={lineColor}
                              strokeWidth={2.5}
                              fill={`url(#gradient-${commodity.id})`}
                              dot={false}
                              activeDot={{
                                r: 5,
                                fill: lineColor,
                                stroke: isDark ? '#111114' : '#ffffff',
                                strokeWidth: 2,
                              }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Recent Data Points */}
                  <div className="flex flex-col gap-3">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Recent Data Points</p>
                    <div className={`rounded-xl border overflow-hidden ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-gray-50 border-[#e5e7eb]'}`}>
                      {recentDataPoints.map((point, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 px-4 py-3 ${i < recentDataPoints.length - 1
                            ? isDark ? 'border-b border-[#1f1f23]' : 'border-b border-[#e5e7eb]'
                            : ''
                            }`}
                        >
                          <Clock size={12} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                          <span className={`text-xs font-bold flex-1 ${isDark ? 'text-white' : 'text-[#111827]'}`}>{point.date}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${point.change >= 0
                            ? 'text-[#22c55e] bg-[#22c55e]/10'
                            : 'text-[#ef4444] bg-[#ef4444]/10'
                            }`}>
                            {point.change >= 0 ? '▲' : '▼'}{Math.abs(point.change).toFixed(1)}%
                          </span>
                          <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₱{point.price.toFixed(2)}</span>

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Section 3: Available Ask Terminals */}
                  <div className="flex flex-col gap-3">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Available Ask Terminals</p>

                    <div className="flex flex-col gap-2.5">
                      {shopVendors.length > 0 ? (
                        shopVendors.map((vendor) => (
                          <div
                            key={vendor.id}
                            className={`rounded-xl border p-4 flex items-center gap-3 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-gray-50 border-[#e5e7eb]'}`}
                          >
                            {/* Vendor avatar */}
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                              style={{
                                backgroundColor: isDark ? '#1a1a1e' : '#f3f4f6',
                                color: isDark ? '#9ca3af' : '#6b7280',
                              }}
                            >
                              {vendor.initial}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{commodity.name}</p>
                              <p className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{vendor.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Star size={10} className="text-[#f59e0b] fill-[#f59e0b]" />
                                <span className="text-[10px] font-bold text-[#f59e0b]">{vendor.rating.toFixed(1)}</span>
                                <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>({vendor.reviewCount})</span>
                              </div>
                            </div>
                            {/* Open/Closed badge */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                              <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${vendor.isOpen
                                ? 'bg-[#22c55e]/15 text-[#22c55e]'
                                : 'bg-[#ef4444]/15 text-[#ef4444]'
                                }`}>
                                {vendor.isOpen ? '+ OPEN' : '● CLOSED'}
                              </span>
                              <p className="text-sm font-black text-[#22c55e]">₱{vendor.dynamicPrice.toFixed(2)}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={`rounded-xl border p-6 text-center ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-gray-50 border-[#e5e7eb]'}`}>
                          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No vendors available for this commodity</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleAddToAssets}
                      className="flex-1 bg-[#22c55e] text-black font-black text-sm uppercase tracking-wider py-4 rounded-full hover:bg-[#16a34a] transition-colors active:scale-[0.98]"
                    >
                      Add to Budget Plan
                    </button>
                    <button
                      onClick={onClose}
                      className={`flex-1 font-black text-sm uppercase tracking-wider py-4 rounded-full transition-colors active:scale-[0.98] ${isDark ? 'bg-[#2a2a2e] text-white hover:bg-[#333338]' : 'bg-gray-200 text-[#111827] hover:bg-gray-300'
                        }`}
                    >
                      Close View
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-[#22c55e] text-black px-5 py-3 rounded-full shadow-2xl shadow-[#22c55e]/30 font-bold text-sm"
          >
            <CheckCircle size={18} />
            Added to Budget Plan
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommodityDetailModal;
