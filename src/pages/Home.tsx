import React, { useState } from 'react';
import { commodities } from '../data/mockData';
import { Bell, User, Bookmark, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categories = ['All', 'Fruits', 'Vegetables', 'Spices', 'Roots'];

const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const topGainer = commodities.reduce((prev, current) => (prev.percentChange > current.percentChange) ? prev : current);

  const filteredCommodities = activeCategory === 'All' 
    ? commodities 
    : commodities.filter(c => c.category === activeCategory);

  return (
    <div className="px-5 py-6 flex flex-col gap-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
            <TrendingUp size={20} className="text-black" />
          </div>
          <h1 className="text-xl font-bold text-[#22c55e] tracking-tight">AgriPresyo</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 bg-[#141418] rounded-full border border-[#1f1f23] text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#22c55e] rounded-full border-2 border-[#141418]"></span>
          </button>
          <div className="w-10 h-10 bg-[#141418] rounded-full border border-[#1f1f23] flex items-center justify-center text-gray-400 overflow-hidden">
            <User size={24} />
          </div>
        </div>
      </header>

      {/* Top Gainer Card */}
      <section>
        <div className="bg-gradient-to-br from-[#141418] to-[#1a1a20] rounded-2xl border border-[#1f1f23] p-5 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[#22c55e] text-xs font-bold uppercase tracking-widest mb-1">Market Top Gainer</p>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {topGainer.emoji} {topGainer.name}
              </h2>
            </div>
            <div className="bg-[#22c55e]/10 text-[#22c55e] px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <ArrowUp size={14} />
              +{topGainer.percentChange.toFixed(1)}%
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Current Price</p>
              <p className="text-3xl font-bold">₱{topGainer.price}</p>
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

      {/* Categories */}
      <section>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                activeCategory === cat 
                  ? "bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/20" 
                  : "bg-[#141418] text-gray-400 border border-[#1f1f23]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Commodity Grid */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          {filteredCommodities.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={item.id}
              className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 flex flex-col gap-3 relative group"
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl">{item.emoji}</span>
                <button className="text-gray-600 hover:text-[#22c55e] transition-colors">
                  <Bookmark size={18} />
                </button>
              </div>
              
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{item.category}</p>
                <h3 className="font-bold text-sm truncate">{item.name}</h3>
              </div>

              <div className="flex items-center justify-between mt-1">
                <p className="text-lg font-bold">₱{item.price}</p>
                <div className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5",
                  item.percentChange >= 0 ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#ef4444] bg-[#ef4444]/10"
                )}>
                  {item.percentChange >= 0 ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                  {Math.abs(item.percentChange).toFixed(1)}%
                </div>
              </div>

              <div className="w-full h-8 mt-1">
                <svg viewBox="0 0 100 40" className="w-full h-full opacity-50">
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
                <div className="absolute top-2 left-2 bg-[#22c55e] text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                  In Season
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Value Picks */}
      <section className="mb-4">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          Best Value Picks <span className="text-[#22c55e] text-xs font-normal">View All</span>
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {commodities.filter(c => c.percentChange < 0).slice(0, 5).map((item) => (
            <div key={item.id} className="min-w-[160px] bg-[#141418] rounded-xl border border-[#1f1f23] p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.emoji}</span>
                <p className="font-bold text-sm truncate">{item.name}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">₱{item.price}</p>
                <p className="text-[#ef4444] text-xs font-bold">{item.percentChange.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
