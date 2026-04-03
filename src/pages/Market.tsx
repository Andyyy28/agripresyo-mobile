import React, { useState } from 'react';
import { commodities } from '../data/mockData';
import { Bell, User, Bookmark, TrendingUp, ArrowUp, ArrowDown, Search, Filter, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import CommodityDetailModal from '../components/CommodityDetailModal';
import type { Commodity } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categories = ['All', 'Fruits', 'Vegetables', 'Spices', 'Roots'];

const Market: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-high' | 'price-low' | 'trending'>('trending');
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const topGainer = commodities.reduce((prev, current) => (prev.percentChange > current.percentChange) ? prev : current);

  const filteredCommodities = commodities
    .filter(c => activeCategory === 'All' || c.category === activeCategory)
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'price-low') return a.price - b.price;
      return Math.abs(b.percentChange) - Math.abs(a.percentChange);
    });

  const tickerItems = commodities.slice(0, 8);

  const handleCommodityClick = (commodity: Commodity) => {
    setSelectedCommodity(commodity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCommodity(null), 300);
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Price Ticker */}
      <div className="w-full bg-[#111114] border-b border-[#1f1f23] py-2.5 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-8 px-4 animate-ticker">
          {[...tickerItems, ...tickerItems].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center gap-2">
              <span className="text-gray-400 text-xs font-medium uppercase">{item.name}</span>
              <span className="text-white font-bold text-sm">₱{item.price}</span>
              <div className={`flex items-center gap-0.5 text-[10px] font-bold ${item.percentChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {item.percentChange >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {Math.abs(item.percentChange).toFixed(1)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#22c55e] rounded-xl flex items-center justify-center shadow-lg shadow-[#22c55e]/15">
              <TrendingUp size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">
                <span className="text-white">Agri</span>
                <span className="text-[#22c55e]">Presyo</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 bg-[#141418] rounded-xl border border-[#1f1f23] text-gray-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#22c55e] rounded-full border-2 border-[#141418]"></span>
            </button>
            <div className="w-9 h-9 bg-[#141418] rounded-xl border border-[#1f1f23] flex items-center justify-center text-gray-400 overflow-hidden">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Greeting */}
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Welcome back</p>
          <p className="text-lg font-bold mt-0.5">{user?.name || 'User'} 👋</p>
        </div>

        {/* Top Gainer Card */}
        <section>
          <div
            className="bg-gradient-to-br from-[#141418] to-[#1a1a20] rounded-2xl border border-[#1f1f23] p-5 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => handleCommodityClick(topGainer)}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/5 rounded-full blur-3xl" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest mb-1">Market Top Gainer</p>
                <h2 className="text-2xl font-black flex items-center gap-2">
                  {topGainer.emoji} {topGainer.name}
                </h2>
              </div>
              <div className="bg-[#22c55e]/10 text-[#22c55e] px-3 py-1.5 rounded-full text-sm font-black flex items-center gap-1">
                <ArrowUp size={14} />
                +{topGainer.percentChange.toFixed(1)}%
              </div>
            </div>
            
            <div className="flex items-end justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-xs mb-1">Current Price</p>
                <p className="text-3xl font-black">₱{topGainer.price}</p>
              </div>
              <div className="w-32 h-12">
                <svg viewBox="0 0 100 40" className="w-full h-full">
                  <path
                    d="M 0 35 Q 20 10 40 25 T 80 5 T 100 15"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Best Value Picks */}
        <section>
          <h2 className="text-sm font-black mb-3 flex items-center gap-2 uppercase tracking-wider">
            Best Value Picks <span className="text-[#22c55e] text-[10px] font-bold normal-case tracking-normal">View All</span>
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
            {commodities.filter(c => c.percentChange < 0).slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="min-w-[140px] bg-[#141418] rounded-xl border border-[#1f1f23] p-3.5 flex flex-col gap-2 cursor-pointer active:scale-[0.97] transition-transform"
                onClick={() => handleCommodityClick(item)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.emoji}</span>
                  <p className="font-bold text-xs truncate">{item.name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-base font-black">₱{item.price}</p>
                  <p className="text-[#ef4444] text-[10px] font-black">{item.percentChange.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Search Bar */}
        <section>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              id="market-search"
              type="text"
              placeholder="Search commodities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141418] border border-[#1f1f23] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#22c55e]/50 transition-colors placeholder-gray-600"
            />
          </div>
        </section>

        {/* Categories */}
        <section>
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200",
                  activeCategory === cat 
                    ? "bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/20" 
                    : "bg-[#141418] text-gray-400 border border-[#1f1f23] hover:border-[#2a2a2e]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Sorting */}
        <section className="flex justify-between items-center">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{filteredCommodities.length} Results</p>
          <div className="flex items-center gap-2">
            <Filter size={12} className="text-[#22c55e]" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[10px] font-black text-[#22c55e] focus:outline-none uppercase tracking-wider"
            >
              <option value="trending">Trending</option>
              <option value="price-high">Price: High-Low</option>
              <option value="price-low">Price: Low-High</option>
            </select>
          </div>
        </section>

        {/* Commodity Grid */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            {filteredCommodities.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id}
                className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 flex flex-col gap-2.5 relative group hover:border-[#2a2a2e] transition-colors cursor-pointer active:scale-[0.97]"
                onClick={() => handleCommodityClick(item)}
              >
                <div className="flex justify-between items-start">
                  <span className="text-2xl">{item.emoji}</span>
                  <button
                    className="text-gray-700 hover:text-[#22c55e] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
                
                <div>
                  <p className="text-gray-600 text-[8px] uppercase font-black tracking-widest">{item.category}</p>
                  <h3 className="font-bold text-sm truncate">{item.name}</h3>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-black">₱{item.price}</p>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5",
                    item.percentChange >= 0 ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#ef4444] bg-[#ef4444]/10"
                  )}>
                    {item.percentChange >= 0 ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                    {Math.abs(item.percentChange).toFixed(1)}%
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider",
                    item.availability === 'In Season' ? "bg-[#22c55e]/15 text-[#22c55e]" :
                    item.availability === 'Low Stock' ? "bg-[#ef4444]/15 text-[#ef4444]" :
                    "bg-gray-800 text-gray-500"
                  )}>
                    {item.availability}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600 text-[8px]">
                    <Clock size={8} />
                    <span>2h ago</span>
                  </div>
                </div>

                <div className="w-full h-7">
                  <svg viewBox="0 0 100 40" className="w-full h-full opacity-40">
                    <path
                      d={`M 0 30 ${item.sparklineData.map((d, i) => `L ${i * 20} ${40 - (d / Math.max(...item.sparklineData)) * 30}`).join(' ')}`}
                      fill="none"
                      stroke={item.percentChange >= 0 ? "#22c55e" : "#ef4444"}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {item.isInSeason && (
                  <div className="absolute top-2 left-2 bg-[#22c55e] text-black text-[7px] font-black px-1.5 py-0.5 rounded uppercase">
                    In Season
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Commodity Detail Modal */}
      <CommodityDetailModal
        commodity={selectedCommodity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Market;
