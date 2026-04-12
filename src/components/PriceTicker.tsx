import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { commodities } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

const PriceTicker: React.FC = () => {
  const { isDark } = useTheme();
  const tickerItems = commodities.slice(0, 8);

  return (
    <div className={`w-full py-2.5 overflow-hidden whitespace-nowrap border-b ${isDark ? 'bg-[#111114] border-[#1f1f23]' : 'bg-[#f0f9f0] border-[#e5e7eb]'}`}>
      <div className="inline-flex gap-8 px-4 animate-ticker">
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center gap-2">
            <span className={`text-xs font-medium uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.name}</span>
            <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-[#111827]'}`}>₱{item.price}</span>
            <div className={`flex items-center gap-0.5 text-[10px] font-bold ${item.percentChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {item.percentChange >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
              {Math.abs(item.percentChange).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker;
