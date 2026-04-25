import React, { useState, useMemo } from 'react';
import { commodities } from '../data/mockData';
import { Trophy, Award, BarChart3, Bell, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';

const timeFilters = ['3M', '6M', '1Y', 'ALL'];

const Analytics: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { openPanel, unreadCount } = useNotifications();
  const { t } = useLanguage();
  const [activeTimeFilter, setActiveTimeFilter] = useState('1Y');

  // Price rankings
  const fruits = commodities.filter(c => c.category === 'Fruits');
  const vegetables = commodities.filter(c => c.category === 'Vegetables');

  const premiumFruits = [...fruits].sort((a, b) => b.price - a.price).slice(0, 3);
  const valueFruits = [...fruits].sort((a, b) => a.price - b.price).slice(0, 3);
  const premiumVegs = [...vegetables].sort((a, b) => b.price - a.price).slice(0, 3);
  const valueVegs = [...vegetables].sort((a, b) => a.price - b.price).slice(0, 3);

  // Generate chart data based on time filter
  const chartData = useMemo(() => {
    const months = activeTimeFilter === '3M' ? 3 : activeTimeFilter === '6M' ? 6 : activeTimeFilter === '1Y' ? 12 : 24;
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = [];
    let basePrice = 80;
    for (let i = 0; i < months; i++) {
      basePrice += (Math.random() - 0.4) * 15;
      basePrice = Math.max(28, Math.min(355, basePrice));
      data.push({
        name: labels[i % 12],
        price: Math.round(basePrice * 100) / 100,
      });
    }
    return data;
  }, [activeTimeFilter]);

  const avgPrice = chartData.reduce((s, d) => s + d.price, 0) / chartData.length;
  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const priceChange = ((chartData[chartData.length - 1].price - chartData[0].price) / chartData[0].price) * 100;

  const RankCard: React.FC<{
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    iconColor: string;
    items: typeof premiumFruits;
  }> = ({ title, subtitle, icon, iconColor, items }) => (
    <div className={`rounded-2xl border p-4 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
      <div className="flex items-center gap-2 mb-3">
        <span style={{ color: iconColor }}>{icon}</span>
        <div>
          <h3 className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>{title}</h3>
          <p className={`text-[8px] uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg ${isDark ? 'bg-[#1a1a1e]' : 'bg-gray-50'}`}
          >
            <span className={`text-[10px] font-black ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>#{i + 1}</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${isDark ? item.darkBgColor : item.lightBgColor}`}>
              <img
                src={`/images/commodities/${item.slug}.webp`}
                alt={item.name}
                className="w-full h-full object-contain p-0.5"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <span className={`text-xs font-bold flex-1 truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{item.name}</span>
            <span className="text-xs font-black text-[#22c55e]">₱{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      {/* Header with logo, theme toggle, bell */}
      <header>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            {/* Replace /public/images/logo.png to update logo globally */}
            <img
              src="/images/AgriPresyo_logoFinal.webp"
              alt="AgriPresyo"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback if logo image is missing */}
            <div className="hidden">
              <span className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>Agri</span>
              <span className="text-lg font-black text-[#22c55e]">Presyo</span>
            </div>
            <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('price_rankings')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-colors ${isDark ? 'bg-[#141418] border-[#1f1f23] text-gray-400 hover:text-white' : 'bg-white border-[#e5e7eb] text-gray-500 hover:text-gray-700'}`}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={openPanel}
              className={`relative p-2.5 rounded-xl border transition-colors ${isDark ? 'bg-[#141418] border-[#1f1f23] text-gray-400 hover:text-white' : 'bg-white border-[#e5e7eb] text-gray-500 hover:text-gray-700'}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4444] rounded-full border-2" style={{ borderColor: isDark ? '#141418' : '#ffffff' }}></span>
              )}
            </button>
          </div>
        </div>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          {t('see_expensive')}
        </p>
      </header>

      {/* 2x2 Ranking Grid */}
      <section className="grid grid-cols-2 gap-3">
        <RankCard
          title={t('premium_fruits')}
          subtitle={t('most_expensive')}
          icon={<Trophy size={14} />}
          iconColor="#f59e0b"
          items={premiumFruits}
        />
        <RankCard
          title={t('value_fruits')}
          subtitle={t('most_affordable')}
          icon={<Award size={14} />}
          iconColor="#22c55e"
          items={valueFruits}
        />
        <RankCard
          title={t('premium_veggies')}
          subtitle={t('most_expensive')}
          icon={<Trophy size={14} />}
          iconColor="#f97316"
          items={premiumVegs}
        />
        <RankCard
          title={t('value_veggies')}
          subtitle={t('most_affordable')}
          icon={<Award size={14} />}
          iconColor="#22c55e"
          items={valueVegs}
        />
      </section>

      {/* Price Changes Over Time */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[#22c55e]" />
            <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>
              {t('price_changes_time')}
            </h2>
          </div>
          <div className="flex gap-1.5">
            {timeFilters.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeFilter(tf)}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  activeTimeFilter === tf
                    ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                    : isDark
                      ? 'bg-[#1a1a1e] text-gray-500 border border-[#1f1f23]'
                      : 'bg-gray-100 text-gray-400 border border-[#e5e7eb]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className={`rounded-2xl border p-4 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#1f1f23' : '#e5e7eb'}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#4a4a4e' : '#9ca3af', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#4a4a4e' : '#9ca3af', fontSize: 10, fontWeight: 700 }}
                  tickFormatter={(val: number) => `₱${Math.round(val)}`}
                  width={50}
                  tickCount={4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1a1a1e' : '#ffffff',
                    border: `1px solid ${isDark ? '#2a2a2e' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isDark ? '#ffffff' : '#111827',
                  }}
                  formatter={(value: number) => [`₱${value.toFixed(2)}`, 'Price']}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className={`rounded-xl border p-3 text-center ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
            <p className={`text-[8px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('period')}</p>
            <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>Apr 2026</p>
          </div>
          <div className={`rounded-xl border p-3 text-center ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
            <p className={`text-[8px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('average')}</p>
            <p className="text-xs font-black text-[#22c55e]">₱{avgPrice.toFixed(2)}</p>
          </div>
          <div className={`rounded-xl border p-3 text-center ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
            <p className={`text-[8px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('range')}</p>
            <p className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₱{minPrice.toFixed(0)}–₱{maxPrice.toFixed(0)}</p>
          </div>
          <div className={`rounded-xl border p-3 text-center ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
            <p className={`text-[8px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('change')}</p>
            <p className={`text-xs font-black ${priceChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
