import React from 'react';
import { commodities } from '../data/mockData';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

const PriceTicker: React.FC = () => {
  const tickerItems = commodities.slice(0, 8);

  return (
    <div className="w-full bg-[#111114] border-b border-[#1f1f23] py-2 overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-8 px-4"
        animate={{ x: [0, -1000] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      >
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
      </motion.div>
    </div>
  );
};

export default PriceTicker;
