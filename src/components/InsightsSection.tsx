import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, TrendingUp, Lightbulb, Calendar, BarChart3, ShoppingCart, Tag, Clock, ChevronRight, Leaf } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

/* ════════════════════════════════════════════════════
   TYPES
   ════════════════════════════════════════════════════ */
interface Article {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  readTime: string;
  icon: React.ReactNode;
  iconBg: string;
  bullets: string[];
  body: string[];
}

/* ════════════════════════════════════════════════════
   ARTICLE DATA
   ════════════════════════════════════════════════════ */
const consumerArticles: Article[] = [
  {
    id: 'c1',
    title: 'Why commodity prices spike this season',
    category: 'Prices',
    categoryColor: '#f59e0b',
    readTime: '4 min read',
    icon: <TrendingUp size={18} className="text-white" />,
    iconBg: '#f59e0b',
    bullets: ['Supply drops during typhoon months', 'Import restrictions affect local pricing', 'Demand surges near holidays'],
    body: [
      'Commodity prices in the Philippines follow predictable seasonal patterns that every smart buyer should understand. During typhoon season (June–November), supply chains for vegetables and fruits are frequently disrupted, leading to significant price increases.',
      'Import restrictions and quarantine protocols can further limit supply, especially for crops like onions and garlic that rely partly on imports. When local harvests fall short and imports are restricted, prices can spike by 30–80% within weeks.',
      'Additionally, demand surges during holiday seasons (Christmas, New Year, and fiestas) create further upward pressure on prices. Understanding these patterns helps you plan purchases in advance and avoid paying premium prices during peak periods.',
    ],
  },
  {
    id: 'c2',
    title: 'How to buy in-season produce and save up to 40%',
    category: 'Seasonal',
    categoryColor: '#22c55e',
    readTime: '5 min read',
    icon: <Calendar size={18} className="text-white" />,
    iconBg: '#22c55e',
    bullets: ['In-season crops are harvested locally', 'Lower transport and storage costs', 'Better freshness and nutrition'],
    body: [
      'Buying in-season produce is one of the simplest ways to save money on your grocery bill. When a crop is in season, local farmers are harvesting it in abundance, which means supply is high and prices naturally drop.',
      'In-season produce also has lower transportation costs since it doesn\'t need to be shipped from distant regions or imported. The reduced need for cold storage further brings down costs. These savings are passed on to consumers — you can save up to 40% compared to buying the same items off-season.',
      'Use the "In Season" and "Off Season" tags in AgriPresyo to quickly identify which commodities are currently at their best value. Plan your meals around in-season ingredients for maximum savings without sacrificing quality or taste.',
    ],
  },
  {
    id: 'c3',
    title: 'Understanding "In Season" vs "Off Season" tags',
    category: 'Tips',
    categoryColor: '#8b5cf6',
    readTime: '3 min read',
    icon: <Tag size={18} className="text-white" />,
    iconBg: '#8b5cf6',
    bullets: ['Green tags mean peak harvest period', 'Red tags indicate limited supply', 'Tags update based on regional data'],
    body: [
      'In AgriPresyo, every commodity card displays either an "In Season" (green) or "Off Season" (red) tag. These tags are based on agricultural harvest calendars and regional supply data.',
      '"In Season" means the commodity is currently being harvested in significant quantities in your region. This typically means better availability, lower prices, and fresher produce. It\'s the ideal time to buy.',
      '"Off Season" indicates that the crop is not currently in its peak harvest period. Supply may come from cold storage, other regions, or imports — all of which add costs. Prices tend to be higher, and freshness may be slightly reduced. When you see an off-season tag, consider substituting with an in-season alternative.',
    ],
  },
  {
    id: 'c4',
    title: 'Best time of week to buy vegetables',
    category: 'Tips',
    categoryColor: '#8b5cf6',
    readTime: '4 min read',
    icon: <ShoppingCart size={18} className="text-white" />,
    iconBg: '#06b6d4',
    bullets: ['Early morning gets freshest stock', 'Mid-week prices tend to be lower', 'Weekend markets often have markups'],
    body: [
      'Timing your market visits can make a real difference in both price and quality. Most public markets receive fresh deliveries early in the morning (4–6 AM), so arriving early gives you access to the freshest produce at competitive prices.',
      'Price-wise, mid-week (Tuesday to Thursday) tends to offer the best deals. Vendors have steady supply and lower foot traffic, which means less competition and sometimes willingness to negotiate. Monday prices can be slightly higher due to weekend supply gaps.',
      'Weekend markets, especially Saturday, often see higher prices due to increased demand from shoppers who can\'t visit during weekdays. If you must shop on weekends, try going early and compare prices across multiple vendors before buying.',
    ],
  },
  {
    id: 'c5',
    title: 'How to read price movement charts',
    category: 'Market trends',
    categoryColor: '#ef4444',
    readTime: '6 min read',
    icon: <BarChart3 size={18} className="text-white" />,
    iconBg: '#ef4444',
    bullets: ['Upward lines mean rising prices', 'Percentage shows weekly change', 'Sparklines reveal 30-day trends'],
    body: [
      'Each commodity card in AgriPresyo includes a mini sparkline chart and percentage indicator that shows recent price movement. Understanding these visual cues helps you make smarter buying decisions.',
      'The percentage value (e.g., +3.2% or -1.8%) shows the price change compared to the previous week. Green with an up arrow means the price has increased, while red with a down arrow means it has decreased. Look for red/downward trends to find commodities that are becoming cheaper.',
      'The sparkline (the small line chart at the bottom of each card) shows the price trend over the past 30 days. A generally downward-sloping line suggests prices are trending lower — a good time to buy. An upward slope means prices are rising, so you might want to wait or find alternatives.',
    ],
  },
];

const vendorArticles: Article[] = [
  {
    id: 'v1',
    title: 'How to price your produce competitively',
    category: 'Prices',
    categoryColor: '#f59e0b',
    readTime: '5 min read',
    icon: <TrendingUp size={18} className="text-white" />,
    iconBg: '#f59e0b',
    bullets: ['Monitor competitor pricing daily', 'Factor in transport and spoilage costs', 'Use market data to set fair margins'],
    body: [
      'Setting the right price for your produce is a balancing act between profitability and competitiveness. Start by understanding your true costs: purchase price from farms, transportation, storage, and expected spoilage losses.',
      'Use AgriPresyo\'s market data to see the current average price for each commodity in your region. Pricing within 5–10% of the market average ensures you remain competitive while maintaining healthy margins.',
      'Consider implementing dynamic pricing — slightly lower prices during slow periods to move inventory faster, and standard pricing during peak demand. Monitor your competitors\' prices and adjust accordingly, but avoid a price war that erodes everyone\'s margins.',
    ],
  },
  {
    id: 'v2',
    title: 'Best seasons to sell high-demand crops',
    category: 'Seasonal',
    categoryColor: '#22c55e',
    readTime: '4 min read',
    icon: <Calendar size={18} className="text-white" />,
    iconBg: '#22c55e',
    bullets: ['Holiday seasons drive demand spikes', 'Off-season crops command premium prices', 'Plan inventory 2–3 weeks ahead'],
    body: [
      'Understanding seasonal demand patterns is crucial for maximizing your revenue. Holiday periods — Christmas, New Year, All Saints\' Day, and local fiestas — create significant demand spikes for certain commodities.',
      'During these periods, items like tomatoes, onions, garlic, and premium fruits see demand increases of 50–200%. Stock up in advance when prices are still low, and you can sell at premium rates during peak demand.',
      'Additionally, off-season crops naturally command higher prices due to limited supply. If you can source off-season produce reliably, you\'ll face less competition and enjoy better margins. Use AgriPresyo\'s seasonal tags to identify these opportunities.',
    ],
  },
  {
    id: 'v3',
    title: 'Understanding buyer demand trends in your area',
    category: 'Market trends',
    categoryColor: '#ef4444',
    readTime: '5 min read',
    icon: <BarChart3 size={18} className="text-white" />,
    iconBg: '#ef4444',
    bullets: ['Track which items sell fastest', 'Regional preferences vary significantly', 'Weekend vs weekday demand differs'],
    body: [
      'Every market has its own demand patterns shaped by local cuisine preferences, income levels, and seasonal factors. Understanding your specific market\'s demand helps you stock the right products in the right quantities.',
      'Track which items sell out fastest and which tend to linger. In Davao, for example, demand for coconut and banana is consistently high, while in Manila markets, leafy greens and imported fruits may move faster.',
      'Pay attention to weekday vs weekend patterns. Weekday sales tend to be smaller, individual-household quantities, while weekend shoppers often buy in bulk. Adjust your display quantities and pricing strategies accordingly.',
    ],
  },
  {
    id: 'v4',
    title: 'How to use "Top Gainer" tags to your advantage',
    category: 'Tips',
    categoryColor: '#8b5cf6',
    readTime: '3 min read',
    icon: <Lightbulb size={18} className="text-white" />,
    iconBg: '#8b5cf6',
    bullets: ['Top Gainers show rising demand', 'Stock up before prices peak', 'Use data to negotiate with suppliers'],
    body: [
      'The "Top Gainer" filter in AgriPresyo highlights commodities with the highest positive price changes. As a vendor, this data is incredibly valuable for inventory planning.',
      'When you see a commodity tagged as a Top Gainer, it means demand is outpacing supply. This is your signal to stock up before prices climb further. Contact your suppliers early and secure quantities at current rates.',
      'You can also use Top Gainer data when negotiating with suppliers. Showing them market data helps establish fair pricing and demonstrates that you\'re an informed buyer who understands market dynamics.',
    ],
  },
  {
    id: 'v5',
    title: 'Tips for listing off-season crops effectively',
    category: 'Tips',
    categoryColor: '#8b5cf6',
    readTime: '4 min read',
    icon: <Leaf size={18} className="text-white" />,
    iconBg: '#06b6d4',
    bullets: ['Highlight scarcity to justify pricing', 'Bundle with in-season items', 'Target restaurants and caterers'],
    body: [
      'Off-season crops represent a significant revenue opportunity for vendors who can source them reliably. The key is positioning — buyers expect to pay more for off-season items, but they need to understand why.',
      'When listing off-season produce, highlight its scarcity and the effort involved in sourcing it. Consider creating combo bundles that pair off-season items with popular in-season produce, offering slight discounts on the bundle to drive volume.',
      'Don\'t overlook institutional buyers like restaurants, caterers, and food processors. These businesses need consistent supply regardless of season and are often willing to pay premium prices for reliable off-season sourcing.',
    ],
  },
];

/* ════════════════════════════════════════════════════
   ARTICLE DETAIL VIEW
   ════════════════════════════════════════════════════ */
const ArticleDetail: React.FC<{
  article: Article;
  onBack: () => void;
}> = ({ article, onBack }) => {
  const { isDark } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed inset-0 z-[90] overflow-y-auto ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#f8faf8]'}`}
    >
      <div className="w-full max-w-[430px] mx-auto px-5 py-6">
        {/* Back button */}
        <button
          onClick={onBack}
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-colors ${isDark ? 'bg-[#141418] border border-[#1f1f23] text-gray-400 hover:text-white' : 'bg-white border border-[#e5e7eb] text-gray-500 hover:text-gray-700'}`}
        >
          <ArrowLeft size={20} />
        </button>

        {/* Category + read time */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ backgroundColor: `${article.categoryColor}15`, color: article.categoryColor }}
          >
            {article.category}
          </span>
          <span className={`text-[10px] font-bold flex items-center gap-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            <Clock size={10} />
            {article.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className={`text-2xl font-black tracking-tight leading-tight mb-6 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
          {article.title}
        </h1>

        {/* Body */}
        <div className="flex flex-col gap-4">
          {article.body.map((paragraph, i) => (
            <p key={i} className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════════════════
   INSIGHTS SECTION
   ════════════════════════════════════════════════════ */
const InsightsSection: React.FC<{ role: 'consumer' | 'vendor' }> = ({ role }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const articles = role === 'consumer' ? consumerArticles : vendorArticles;
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeBanner, setActiveBanner] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartXRef = useRef(0);

  // Auto-scroll banner
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % articles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, articles.length]);

  const handleManualSwipe = useCallback((direction: 1 | -1) => {
    setActiveBanner((prev) => (prev + direction + articles.length) % articles.length);
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 5000);
  }, [articles.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(diff) > 50) {
      handleManualSwipe(diff < 0 ? 1 : -1);
    }
  };

  const featured = articles[activeBanner];

  return (
    <>
      <section className="flex flex-col gap-4">
        {/* Section header */}
        <div className="flex items-center gap-2">
          <Lightbulb size={16} className="text-[#22c55e]" />
          <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>
            {t('insights_for_you')}
          </h2>
        </div>

        {/* Featured banner with auto-scroll */}
        <div
          className="relative overflow-hidden rounded-2xl"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className={`rounded-2xl border p-5 cursor-pointer`}
              style={{
                background: isDark
                  ? 'linear-gradient(135deg, rgba(22, 163, 74, 0.15) 0%, rgba(10, 10, 10, 0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(255, 255, 255, 0.95) 100%)',
                border: isDark ? '1px solid rgba(22, 163, 74, 0.2)' : '1px solid rgba(22, 163, 74, 0.15)',
              }}
              onClick={() => setSelectedArticle(featured)}
            >
              <span
                className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-3"
                style={{ backgroundColor: `${featured.categoryColor}15`, color: featured.categoryColor }}
              >
                {featured.category}
              </span>
              <h3 className={`text-lg font-black tracking-tight mb-3 leading-snug ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                {featured.title}
              </h3>
              <ul className="flex flex-col gap-1.5 mb-4">
                {featured.bullets.map((b, i) => (
                  <li key={i} className={`text-xs flex items-start gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="text-[#22c55e] mt-0.5">•</span>
                    {b}
                  </li>
                ))}
              </ul>
              <span className="inline-flex items-center gap-1.5 bg-[#22c55e] text-black text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-full">
                Read now <ChevronRight size={12} />
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveBanner(i);
                  setIsPaused(true);
                  if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
                  pauseTimeoutRef.current = setTimeout(() => setIsPaused(false), 5000);
                }}
                className="p-0.5"
              >
                <div
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === activeBanner ? 20 : 6,
                    height: 6,
                    backgroundColor: i === activeBanner ? '#22c55e' : isDark ? '#1f1f23' : '#d1d5db',
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Suggested for you — horizontal scroll row */}
        <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Suggested for you
        </p>
        <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
          {articles.map((article) => (
            <div
              key={article.id}
              className={`min-w-[150px] max-w-[150px] rounded-2xl border p-3.5 flex flex-col gap-2 cursor-pointer active:scale-[0.97] transition-transform ${isDark ? 'bg-[#141418] border-[#1f1f23] hover:border-[#2a2a2e]' : 'bg-white border-[#e5e7eb] hover:border-[#d1d5db]'}`}
              onClick={() => setSelectedArticle(article)}
            >
              {/* Icon area */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${article.iconBg}20` }}
              >
                {React.cloneElement(article.icon as React.ReactElement, {
                  className: '',
                  style: { color: article.iconBg },
                })}
              </div>

              {/* Category */}
              <span
                className="text-[8px] font-black uppercase tracking-widest self-start"
                style={{ color: article.categoryColor }}
              >
                {article.category}
              </span>

              {/* Title (2 lines max) */}
              <p className={`text-xs font-bold leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                {article.title}
              </p>

              {/* Read time */}
              <span className={`text-[9px] font-bold flex items-center gap-1 mt-auto ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                <Clock size={9} />
                {article.readTime}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Article Detail Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleDetail
            article={selectedArticle}
            onBack={() => setSelectedArticle(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default InsightsSection;
