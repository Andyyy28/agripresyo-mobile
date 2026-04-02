import React, { useState } from 'react';
import { commodities } from '../data/mockData';
import { Search, Filter, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categories = ['All', 'Fruits', 'Vegetables', 'Spices', 'Roots'];

const Market: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-high' | 'price-low' | 'trending'>('trending');

  const filteredCommodities = commodities
    .filter(c => activeCategory === 'All' || c.category === activeCategory)
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'price-low') return a.price - b.price;
      return Math.abs(b.percentChange) - Math.abs(a.percentChange);
    });

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold mb-4">Market Monitoring</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search commodities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141418] border border-[#1f1f23] rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#22c55e] transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                activeCategory === cat 
                  ? "bg-[#22c55e] text-black" 
                  : "bg-[#141418] text-gray-400 border border-[#1f1f23]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Sorting */}
      <section className="flex justify-between items-center">
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{filteredCommodities.length} Results</p>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#22c55e]" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs font-bold text-[#22c55e] focus:outline-none"
          >
            <option value="trending">Trending</option>
            <option value="price-high">Price: High-Low</option>
            <option value="price-low">Price: Low-High</option>
          </select>
        </div>
      </section>

      {/* Commodity List */}
      <section className="flex flex-col gap-4">
        {filteredCommodities.map((item) => (
          <motion.div
            layout
            key={item.id}
            className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 flex items-center gap-4"
          >
            <div className="w-14 h-14 bg-[#1a1a1e] rounded-xl flex items-center justify-center text-3xl border border-[#1f1f23]">
              {item.emoji}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-sm truncate">{item.name}</h3>
                <p className="text-lg font-bold">₱{item.price}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">{item.category}</span>
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5",
                    item.percentChange >= 0 ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#ef4444] bg-[#ef4444]/10"
                  )}>
                    {item.percentChange >= 0 ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                    {Math.abs(item.percentChange).toFixed(1)}%
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                  <Clock size={10} />
                  <span>2h ago</span>
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider",
                  item.availability === 'In Season' ? "bg-[#22c55e]/20 text-[#22c55e]" :
                  item.availability === 'Low Stock' ? "bg-[#ef4444]/20 text-[#ef4444]" :
                  "bg-gray-800 text-gray-400"
                )}>
                  {item.availability}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Market;
