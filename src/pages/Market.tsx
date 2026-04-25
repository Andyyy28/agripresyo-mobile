import React, { useState, useMemo } from 'react';
import { commodities } from '../data/mockData';
import { Bell, Heart, TrendingUp, ArrowUp, ArrowDown, Search, ShoppingCart, Sun, Moon, BarChart3, Calculator, Trash2, Minus, Plus, AlertTriangle, Package } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAssets } from '../context/AssetContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import CommodityDetailModal from '../components/CommodityDetailModal';
import InsightsSection from '../components/InsightsSection';
import type { Commodity } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const categories = ['All', 'Fruits', 'Vegetables', 'Spices', 'Roots'];
const subFilters = ['ALL', '₱+', '₱-', 'HIGH DEMAND', 'TOP GAINER'];

const Market: React.FC = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();
  const { assets, liquidity, removeAsset, updateQuantity, setLiquidity, addAsset, toggleMode } = useAssets();
  const { savedIds, toggleSaved, isSaved } = useWatchlist();
  const { openPanel, unreadCount } = useNotifications();
  const { t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSubFilter, setActiveSubFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState<Commodity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredCommodities = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    const categoryFiltered = commodities
      .filter(c => activeCategory === 'All' || c.category === activeCategory);

    // Prefix-first search: startsWith matches first, then contains matches
    let list: typeof categoryFiltered;
    if (keyword) {
      const startsWithMatches = categoryFiltered.filter(c =>
        c.name.toLowerCase().startsWith(keyword)
      );
      const containsMatches = categoryFiltered.filter(c =>
        !c.name.toLowerCase().startsWith(keyword) &&
        c.name.toLowerCase().includes(keyword)
      );
      list = [...startsWithMatches, ...containsMatches];
    } else {
      list = categoryFiltered;
    }

    switch (activeSubFilter) {
      case '₱+':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case '₱-':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'HIGH DEMAND':
        list = [...list].sort((a, b) => Math.abs(b.percentChange) - Math.abs(a.percentChange));
        break;
      case 'TOP GAINER':
        list = [...list].filter(c => c.isInSeason);
        break;
      default:
        break;
    }
    return list;
  }, [activeCategory, activeSubFilter, searchQuery]);

  // Watchlist commodities
  const watchlistCommodities = useMemo(() =>
    commodities.filter(c => savedIds.includes(c.id)),
    [savedIds]
  );

  const tickerItems = commodities.slice(0, 8);
  const suggestedBasket = commodities.filter(c => c.price <= 150).slice(0, 6);

  const handleCommodityClick = (commodity: Commodity) => {
    setSelectedCommodity(commodity);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCommodity(null), 300);
  };

  // Smart Budget Planner calculations
  const assetDetails = useMemo(() =>
    assets.map(asset => {
      const commodity = commodities.find(c => c.id === asset.commodityId)!;
      const mode = asset.mode || 'qty';
      const totalKg = mode === 'qty' ? asset.quantity * commodity.unitWeight : asset.quantity;
      const totalPrice = totalKg * commodity.price;
      return { ...asset, commodity, totalKg, totalPrice, mode };
    }),
    [assets]
  );

  const totalKg = useMemo(() => assetDetails.reduce((sum, a) => sum + a.totalKg, 0), [assetDetails]);
  const totalCost = useMemo(() => assetDetails.reduce((sum, a) => sum + a.totalPrice, 0), [assetDetails]);
  const liquidityPercent = useMemo(() => liquidity > 0 ? (totalCost / liquidity) * 100 : 0, [totalCost, liquidity]);

  const getBarColor = () => {
    if (liquidityPercent >= 100) return '#ef4444';
    if (liquidityPercent > 80) return '#f59e0b';
    return '#22c55e';
  };

  const handleLiquidityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setLiquidity(parseInt(val) || 0);
  };

  return (
    <div className="flex flex-col gap-0">
      <div className="px-5 py-6 flex flex-col gap-6">
        {/* Header — only theme toggle + bell, no profile icon */}
        <header className="flex justify-between items-center">
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
            <div>
              <h1 className="text-lg font-black tracking-tight">
                <span className={isDark ? 'text-white' : 'text-[#111827]'}>Agri</span>
                <span className="text-[#22c55e]">Presyo</span>
              </h1>
            </div>
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
        </header>

        {/* Greeting */}
        <div>
          <p className={`text-lg font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('greeting')}, {user?.name || 'User'} 👋</p>
        </div>

        {/* Search Bar */}
        <section>
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} size={18} />
            <input
              id="market-search"
              type="text"
              placeholder={t('search_commodities')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#22c55e]/50 transition-colors ${isDark ? 'bg-[#141418] border border-[#1f1f23] text-white placeholder-gray-600' : 'bg-[#f3f4f6] border border-[#e5e7eb] text-[#111827] placeholder-gray-400'
                }`}
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
                    : isDark
                      ? "bg-[#141418] text-gray-400 border border-[#1f1f23] hover:border-[#2a2a2e]"
                      : "bg-white text-gray-500 border border-[#e5e7eb] hover:border-[#d1d5db]"
                )}
              >
                {t(`cat_${cat.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </section>

        {/* Sub-filter pills */}
        <section>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {subFilters.map((sf) => (
              <button
                key={sf}
                onClick={() => setActiveSubFilter(sf)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200",
                  activeSubFilter === sf
                    ? "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30"
                    : isDark
                      ? "bg-[#1a1a1e] text-gray-500 border border-[#1f1f23]"
                      : "bg-gray-100 text-gray-400 border border-[#e5e7eb]"
                )}
              >
                {t(`sf_${sf === 'ALL' ? 'all' : sf === '₱+' ? 'price_up' : sf === '₱-' ? 'price_down' : sf === 'HIGH DEMAND' ? 'high_demand' : 'top_gainer'}`)}
              </button>
            ))}
          </div>
        </section>

        {/* MY WATCHLIST — only shows if user has saved at least 1 commodity */}
        {watchlistCommodities.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">❤️</span>
              <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('my_watchlist')}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-[#1a1a1e] text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                {watchlistCommodities.length} {watchlistCommodities.length === 1 ? t('item') : t('items')}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
              {watchlistCommodities.map((item) => (
                <div
                  key={item.id}
                  className={`min-w-[120px] rounded-xl border p-3 flex flex-col gap-2 cursor-pointer active:scale-[0.97] transition-transform ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
                    }`}
                  onClick={() => handleCommodityClick(item)}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${isDark ? item.darkBgColor : item.lightBgColor}`}>
                      <img
                        src={`/images/commodities/${item.slug}.webp`}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSaved(item.id); }}
                      className="text-[#ef4444]"
                    >
                      <Heart size={14} fill="#ef4444" />
                    </button>
                  </div>
                  <p className={`font-bold text-[11px] truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{item.name}</p>
                  <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₱{item.price.toFixed(2)}</p>
                  <div className={cn(
                    "text-[9px] font-bold flex items-center gap-0.5",
                    item.percentChange >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"
                  )}>
                    {item.percentChange >= 0 ? <ArrowUp size={8} /> : <ArrowDown size={8} />}
                    {Math.abs(item.percentChange).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Price Insights Header */}
        <section className="flex items-center gap-2">
          <BarChart3 size={16} className="text-[#22c55e]" />
          <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('price_insights')}</h2>
          <span className={`text-[10px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{filteredCommodities.length} {t('results')}</span>
        </section>

        {/* Commodity Grid — 3 columns */}
        <section>
          <div className="grid grid-cols-3 gap-2.5">
            {filteredCommodities.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={item.id}
                className={`rounded-2xl border p-3 flex flex-col gap-1.5 relative group cursor-pointer active:scale-[0.97] transition-all ${isDark ? 'bg-[#141418] border-[#1f1f23] hover:border-[#2a2a2e]' : 'bg-white border-[#e5e7eb] hover:border-[#d1d5db]'
                  }`}
                onClick={() => handleCommodityClick(item)}
              >
                <div className="flex justify-between items-start">
                  {/* Commodity image with emoji fallback */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${isDark ? item.darkBgColor : item.lightBgColor}`}>
                    <img
                      src={`/images/commodities/${item.slug}.webp`}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  {/* Heart icon — filled red when saved, outline when not */}
                  <button
                    className={`transition-colors ${isSaved(item.id) ? 'text-[#ef4444]' : isDark ? 'text-gray-700 hover:text-[#ef4444]' : 'text-gray-300 hover:text-[#ef4444]'}`}
                    onClick={(e) => { e.stopPropagation(); toggleSaved(item.id); }}
                  >
                    <Heart size={12} fill={isSaved(item.id) ? '#ef4444' : 'none'} />
                  </button>
                </div>

                <div>
                  <h3 className={`font-bold text-[11px] truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{item.name}</h3>
                  <p className={`text-[7px] uppercase font-black tracking-widest ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{item.category}</p>
                </div>

                <span className={cn(
                  "self-start px-1.5 py-0.5 rounded-full text-[6px] font-black uppercase tracking-wider",
                  item.isInSeason ? "bg-[#22c55e]/15 text-[#22c55e]" : "bg-[#ef4444]/15 text-[#ef4444]"
                )}>
                  {item.isInSeason ? t('in_season') : t('off_season')}
                </span>

                <div className="flex items-center justify-between">
                  <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₱{item.price}</p>
                  <div className={cn(
                    "px-1 py-0.5 rounded text-[8px] font-bold flex items-center gap-0.5",
                    item.percentChange >= 0 ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#ef4444] bg-[#ef4444]/10"
                  )}>
                    {item.percentChange >= 0 ? <ArrowUp size={7} /> : <ArrowDown size={7} />}
                    {Math.abs(item.percentChange).toFixed(1)}%
                  </div>
                </div>

                {/* Mini sparkline */}
                <div className="w-full h-5">
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

                {/* Add to cart icon */}
                <button
                  className="absolute bottom-2 right-2 w-6 h-6 bg-[#22c55e]/10 rounded-lg flex items-center justify-center text-[#22c55e] hover:bg-[#22c55e]/20 transition-colors"
                  onClick={(e) => { e.stopPropagation(); addAsset(item.id); }}
                >
                  <ShoppingCart size={10} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Suggested Basket */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
              🧺 {t('suggested_basket')}
            </h2>
            <span className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('best_value')}</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
            {suggestedBasket.map((item) => (
              <div
                key={item.id}
                className={`min-w-[130px] rounded-xl border p-3 flex flex-col gap-2 cursor-pointer active:scale-[0.97] transition-transform ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
                  }`}
                onClick={() => addAsset(item.id)}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${isDark ? item.darkBgColor : item.lightBgColor}`}>
                    <img
                      src={`/images/commodities/${item.slug}.webp`}
                      alt={item.name}
                      className="w-full h-full object-contain p-0.5"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <p className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{item.name}</p>
                </div>
                <p className={`text-base font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₱{item.price}</p>
                <p className="text-[8px] font-bold text-[#22c55e] uppercase tracking-wider">{t('click_add_budget')}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Smart Budget Planner — inline below Suggested Basket */}
        <section className={`rounded-2xl border p-5 ${isDark ? 'bg-[#0d0d10] border-[#1f1f23]' : 'bg-[#f8faf8] border-[#e5e7eb]'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#22c55e]/15 rounded-xl flex items-center justify-center">
                <Calculator size={20} className="text-[#22c55e]" />
              </div>
              <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('smart_budget_planner')}</h2>
            </div>
          </div>
          <p className={`text-xs mb-4 ml-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('auto_calc')}</p>

          {/* Liquidity Input */}
          <div className={`rounded-xl border p-3 flex items-center justify-between mb-4 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('liquidity')}</p>
            <div className={`flex items-center gap-1 rounded-lg border px-3 py-2 ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e]' : 'bg-[#f3f4f6] border-[#e5e7eb]'}`}>
              <span className="text-[#22c55e] font-black text-sm">₱</span>
              <input
                type="text"
                value={liquidity}
                onChange={handleLiquidityChange}
                className={`bg-transparent font-black text-sm w-20 text-right focus:outline-none ${isDark ? 'text-white' : 'text-[#111827]'}`}
              />
            </div>
          </div>

          {/* Asset List */}
          <div className="flex flex-col gap-2.5">
            <AnimatePresence mode="popLayout">
              {assets.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 gap-3"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
                    <Package size={24} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                  </div>
                  <p className={`text-center text-sm max-w-[220px] leading-relaxed font-bold uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {t('no_active_trades')}
                  </p>
                  <p className={`text-center text-xs max-w-[220px] ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
                    Select produce from market to begin calculating
                  </p>
                </motion.div>
              ) : (
                assetDetails.map((asset) => {
                  const isKgMode = asset.mode === 'kg';
                  const stepAmount = isKgMode ? 0.5 : 1;
                  const displayQty = isKgMode ? asset.quantity.toFixed(2) : asset.quantity;
                  const subtractQty = isKgMode
                    ? Math.max(0.01, parseFloat((asset.quantity - stepAmount).toFixed(2)))
                    : asset.quantity - 1;
                  const addQty = isKgMode
                    ? parseFloat((asset.quantity + stepAmount).toFixed(2))
                    : asset.quantity + 1;

                  return (
                    <motion.div
                      key={asset.commodityId}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      layout
                      className={`rounded-xl border p-3 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${isDark ? asset.commodity.darkBgColor : asset.commodity.lightBgColor}`}>
                          <img
                            src={`/images/commodities/${asset.commodity.slug}.webp`}
                            alt={asset.commodity.name}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{asset.commodity.name}</p>
                          <p className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${isKgMode ? 'text-[#3b82f6]' : 'text-[#22c55e]'}`}>
                            {isKgMode
                              ? `${asset.quantity.toFixed(2)} KG`
                              : `${asset.quantity} Units ≈ ${asset.totalKg.toFixed(2)}KG`
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-0 shrink-0">
                          <button
                            onClick={() => toggleMode(asset.commodityId)}
                            className={`text-[8px] font-black uppercase tracking-widest mr-2 px-1.5 py-0.5 rounded cursor-pointer transition-colors active:scale-95 ${isKgMode
                                ? 'text-[#3b82f6] bg-[#3b82f6]/10 hover:bg-[#3b82f6]/20'
                                : 'text-[#22c55e] bg-[#22c55e]/10 hover:bg-[#22c55e]/20'
                              }`}
                          >
                            {isKgMode ? 'KG' : t('qty')}
                          </button>
                          <button
                            onClick={() => updateQuantity(asset.commodityId, subtractQty)}
                            className={`w-7 h-7 border rounded-l-lg flex items-center justify-center transition-colors active:scale-95 ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e] text-gray-400 hover:text-white hover:bg-[#2a2a2e]' : 'bg-gray-50 border-[#e5e7eb] text-gray-500 hover:bg-gray-100'}`}
                          >
                            <Minus size={12} />
                          </button>
                          <div className={`w-10 h-7 border-y flex items-center justify-center ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e]' : 'bg-gray-50 border-[#e5e7eb]'}`}>
                            <span className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{displayQty}</span>
                          </div>
                          <button
                            onClick={() => updateQuantity(asset.commodityId, addQty)}
                            className={`w-7 h-7 border rounded-r-lg flex items-center justify-center transition-colors active:scale-95 ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e] text-gray-400 hover:text-white hover:bg-[#2a2a2e]' : 'bg-gray-50 border-[#e5e7eb] text-gray-500 hover:bg-gray-100'}`}
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-end mt-2 gap-3">
                        <p className={`text-base font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₱{asset.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <button onClick={() => removeAsset(asset.commodityId)} className="text-gray-600 hover:text-[#ef4444] transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* Summary */}
          {assets.length > 0 && (
            <div className="flex flex-col gap-3 mt-4">
              <div className={`rounded-xl border p-4 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('total_projected')}</p>
                <div className="flex justify-between items-end">
                  <p className={`text-sm font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{totalKg.toFixed(2)}kg</p>
                  <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>₱{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
              </div>

              <div className={`rounded-xl border p-4 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('inventory_liquidity')}</p>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-bold" style={{ color: getBarColor() }}>
                    {liquidityPercent.toFixed(1)}%
                  </p>
                  <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    ₱{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ₱{liquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e]' : 'bg-gray-100 border-[#e5e7eb]'}`}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: getBarColor() }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(liquidityPercent, 100)}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  />
                </div>
                {liquidityPercent >= 100 && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-3 p-3 bg-[#ef4444]/10 rounded-lg border border-[#ef4444]/20"
                  >
                    <AlertTriangle size={14} className="text-[#ef4444] shrink-0" />
                    <p className="text-[10px] font-black text-[#ef4444] uppercase tracking-wider leading-relaxed">
                      {t('warning_exceeds')}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Insights for You */}
        <InsightsSection role={user?.role || 'consumer'} />
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
