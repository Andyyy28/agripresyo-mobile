import React, { useMemo } from 'react';
import { commodities } from '../data/mockData';
import { Calculator, Trash2, Minus, Plus, AlertTriangle, ShoppingBasket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAssets } from '../context/AssetContext';
import { useTheme } from '../context/ThemeContext';

const Budget: React.FC = () => {
  const { assets, liquidity, removeAsset, updateQuantity, setLiquidity } = useAssets();
  const { isDark } = useTheme();

  const assetDetails = useMemo(() =>
    assets.map(asset => {
      const commodity = commodities.find(c => c.id === asset.commodityId)!;
      const totalKg = asset.quantity * commodity.unitWeight;
      const totalPrice = totalKg * commodity.price;
      return { ...asset, commodity, totalKg, totalPrice };
    }),
    [assets]
  );

  const totalKg = useMemo(() =>
    assetDetails.reduce((sum, a) => sum + a.totalKg, 0),
    [assetDetails]
  );

  const totalCost = useMemo(() =>
    assetDetails.reduce((sum, a) => sum + a.totalPrice, 0),
    [assetDetails]
  );

  const liquidityPercent = useMemo(() =>
    liquidity > 0 ? (totalCost / liquidity) * 100 : 0,
    [totalCost, liquidity]
  );

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
    <div className="px-5 py-6 flex flex-col gap-6">
      {/* Header */}
      <header>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-[#22c55e]/15 rounded-xl flex items-center justify-center">
            <Calculator size={20} className="text-[#22c55e]" />
          </div>
          <h1 className="text-xl font-black">Smart Asset Projection</h1>
        </div>
        <p className="text-gray-500 text-xs ml-12">Auto-calculating unit weight vs market index values</p>
      </header>

      {/* Liquidity Input */}
      <div className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4 flex items-center justify-between">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Liquidity</p>
        <div className="flex items-center gap-1 bg-[#1a1a1e] rounded-lg border border-[#2a2a2e] px-3 py-2">
          <span className="text-[#22c55e] font-black text-sm">₱</span>
          <input
            type="text"
            value={liquidity}
            onChange={handleLiquidityChange}
            className="bg-transparent text-white font-black text-sm w-20 text-right focus:outline-none"
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {assets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <div className="w-16 h-16 bg-[#141418] rounded-2xl flex items-center justify-center border border-[#1f1f23]">
                <ShoppingBasket size={28} className="text-gray-600" />
              </div>
              <p className="text-center text-gray-600 text-sm max-w-[250px] leading-relaxed">
                No active trades. Select produce from market to begin.
              </p>
            </motion.div>
          ) : (
            assetDetails.map((asset) => (
              <motion.div
                key={asset.commodityId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                layout
                className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4"
              >
                <div className="flex items-center gap-3">
                  {/* Commodity Image */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${isDark ? asset.commodity.darkBgColor : asset.commodity.lightBgColor}`}>
                    <img
                      src={`/images/commodities/${asset.commodity.slug}.webp`}
                      alt={asset.commodity.name}
                      className="w-full h-full object-contain p-1"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>

                  {/* Name & Weight */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{asset.commodity.name}</p>
                    <p className="text-[9px] font-black text-[#22c55e] uppercase tracking-widest mt-0.5">
                      {asset.quantity} Units = {asset.totalKg.toFixed(2)}KG
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-0 shrink-0">
                    <span className="text-[8px] font-black text-[#22c55e] uppercase tracking-widest mr-2 bg-[#22c55e]/10 px-1.5 py-0.5 rounded">QTY</span>
                    <button
                      onClick={() => updateQuantity(asset.commodityId, asset.quantity - 1)}
                      className="w-7 h-7 bg-[#1a1a1e] border border-[#2a2a2e] rounded-l-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2a2a2e] transition-colors active:scale-95"
                    >
                      <Minus size={12} />
                    </button>
                    <div className="w-8 h-7 bg-[#1a1a1e] border-y border-[#2a2a2e] flex items-center justify-center">
                      <span className="text-xs font-black text-white">{asset.quantity}</span>
                    </div>
                    <button
                      onClick={() => updateQuantity(asset.commodityId, asset.quantity + 1)}
                      className="w-7 h-7 bg-[#1a1a1e] border border-[#2a2a2e] rounded-r-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#2a2a2e] transition-colors active:scale-95"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Price + Delete */}
                <div className="flex items-center justify-end mt-2 gap-3">
                  <p className="text-base font-black text-white">₱{asset.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <button
                    onClick={() => removeAsset(asset.commodityId)}
                    className="text-gray-600 hover:text-[#ef4444] transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Summary Cards */}
      {assets.length > 0 && (
        <div className="flex flex-col gap-3 pb-4">
          {/* Total Projected Commitment */}
          <div className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Total Projected Commitment</p>
            <div className="flex justify-between items-end">
              <p className="text-gray-500 text-sm font-bold">{totalKg.toFixed(2)}kg</p>
              <p className="text-2xl font-black text-white">₱{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          {/* Inventory Liquidity Used */}
          <div className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Inventory Liquidity Used</p>
            
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-bold" style={{ color: getBarColor() }}>
                {liquidityPercent.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 font-medium">
                ₱{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ₱{liquidity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-[#1a1a1e] rounded-full overflow-hidden border border-[#2a2a2e]">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: getBarColor() }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(liquidityPercent, 100)}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              />
            </div>

            {/* Over Budget Warning */}
            {liquidityPercent >= 100 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-3 p-3 bg-[#ef4444]/10 rounded-lg border border-[#ef4444]/20"
              >
                <AlertTriangle size={14} className="text-[#ef4444] shrink-0" />
                <p className="text-[10px] font-black text-[#ef4444] uppercase tracking-wider leading-relaxed">
                  ⚠️ Warning: Projected cost exceeds available liquidity
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
