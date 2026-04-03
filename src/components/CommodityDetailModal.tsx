import React from 'react';
import { X, ArrowUpRight, Clock, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts';
import type { Commodity } from '../types';
import { getVendorsForCommodity } from '../data/mockData';
import { useAssets } from '../context/AssetContext';

interface CommodityDetailModalProps {
  commodity: Commodity | null;
  isOpen: boolean;
  onClose: () => void;
}

const CommodityDetailModal: React.FC<CommodityDetailModalProps> = ({ commodity, isOpen, onClose }) => {
  const { addAsset } = useAssets();

  if (!commodity) return null;

  const vendors = getVendorsForCommodity(commodity);

  const chartData = commodity.priceHistory.map((price, i) => ({ index: i, price }));
  const minPrice = Math.min(...commodity.priceHistory);
  const maxPrice = Math.max(...commodity.priceHistory);
  const padding = (maxPrice - minPrice) * 0.15;

  const lastDate = 'Oct 26, 2026';
  const lastPrice = commodity.priceHistory[commodity.priceHistory.length - 1];

  const categoryLabel = `${commodity.category.toUpperCase()} INDEX`;

  const handleAddToAssets = () => {
    addAsset(commodity.id);
    onClose();
  };

  return (
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
            <div className="w-full max-w-[430px] bg-[#0a0a0a] rounded-t-3xl border-t border-x border-[#1f1f23] max-h-[90vh] overflow-y-auto no-scrollbar">
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[#2a2a2e] rounded-full" />
              </div>

              <div className="px-5 pb-8 flex flex-col gap-5">
                {/* Modal Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#141418] rounded-2xl flex items-center justify-center text-4xl border border-[#1f1f23]">
                      {commodity.emoji}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{commodity.name}</h2>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">{categoryLabel}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 bg-[#141418] rounded-full flex items-center justify-center border border-[#1f1f23] text-gray-400 hover:text-white transition-colors mt-1"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Section 1: Local Market Index Card */}
                <div className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Local Market Index</p>
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                      commodity.percentChange >= 0
                        ? 'text-[#22c55e] bg-[#22c55e]/10'
                        : 'text-[#ef4444] bg-[#ef4444]/10'
                    }`}>
                      <ArrowUpRight size={12} className={commodity.percentChange < 0 ? 'rotate-90' : ''} />
                      {Math.abs(commodity.percentChange).toFixed(1)}%
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="text-3xl font-black text-white">₱{commodity.price.toFixed(2)}</span>
                    <span className="text-gray-500 text-lg ml-1">/ kg</span>
                  </div>

                  <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                    Projection: 1 Unit = {commodity.unitWeight.toFixed(1)}KG
                  </p>
                </div>

                {/* Section 2: Price History Chart */}
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Price History</p>

                  <div className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4">
                    <div className="w-full h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                          <YAxis
                            domain={[minPrice - padding, maxPrice + padding]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#4a4a4e', fontSize: 10, fontWeight: 700 }}
                            tickFormatter={(val: number) => `₱${Math.round(val)}`}
                            width={50}
                            tickCount={4}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#22c55e"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Recent Data Point */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#1f1f23]">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={12} />
                        <span className="text-xs font-medium">{lastDate}</span>
                      </div>
                      <span className="text-sm font-bold text-white">₱{lastPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Available Ask Terminals */}
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Available Ask Terminals</p>

                  <div className="flex flex-col gap-2.5">
                    {vendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4 flex items-center gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
                          style={{ backgroundColor: vendor.color + '30', color: vendor.color }}
                        >
                          {vendor.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{vendor.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Star size={10} className="text-[#f59e0b] fill-[#f59e0b]" />
                            <span className="text-[10px] font-bold text-[#f59e0b]">{vendor.rating.toFixed(1)}</span>
                            <span className="text-[10px] text-gray-600">({vendor.reviewCount})</span>
                          </div>
                        </div>
                        <p className="text-sm font-black text-[#22c55e] shrink-0">₱{vendor.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddToAssets}
                    className="flex-1 bg-[#22c55e] text-black font-black text-sm uppercase tracking-wider py-4 rounded-full hover:bg-[#16a34a] transition-colors active:scale-[0.98]"
                  >
                    Add to Assets
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-[#141418] text-white font-black text-sm uppercase tracking-wider py-4 rounded-full border border-[#1f1f23] hover:bg-[#1a1a1e] transition-colors active:scale-[0.98]"
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
  );
};

export default CommodityDetailModal;
