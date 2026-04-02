import React, { useState } from 'react';
import { commodities } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

const Analytics: React.FC = () => {
  const [selectedId, setSelectedId] = useState(commodities[0].id);
  const selected = commodities.find(c => c.id === selectedId)!;

  const chartData = selected.sparklineData.map((price, index) => ({
    day: `Day ${index + 1}`,
    price: price
  }));

  const stats = [
    { label: 'Active Products', value: '156', icon: ShoppingBag, color: '#22c55e' },
    { label: 'Verified Vendors', value: '42', icon: Users, color: '#3b82f6' },
    { label: 'Avg. Market Price', value: '₱142', icon: TrendingUp, color: '#f59e0b' },
  ];

  return (
    <div className="px-5 py-6 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold mb-4">Market Analytics</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 flex flex-col gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-gray-500 text-[8px] font-bold uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-black text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Price History Chart */}
      <section className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold">Price History</h2>
            <p className="text-gray-500 text-xs">7-day trend analysis</p>
          </div>
          <select 
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg py-2 px-3 text-xs font-bold text-[#22c55e] focus:outline-none"
          >
            {commodities.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#71717a" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                dx={-10}
                tickFormatter={(value) => `₱${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111114', border: '1px solid #1f1f23', borderRadius: '12px' }}
                itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#22c55e" 
                strokeWidth={3} 
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4, stroke: '#111114' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Market Rankings */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold">Market Rankings</h2>
        <div className="flex flex-col gap-3">
          {commodities.sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange)).slice(0, 5).map((item, idx) => (
            <div key={item.id} className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-xs font-black text-gray-400">
                #{idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{item.category}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">₱{item.price}</p>
                <div className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${item.percentChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {item.percentChange >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {Math.abs(item.percentChange).toFixed(1)}%
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-700" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Analytics;
