import React, { useState, useMemo } from 'react';
import { commodities } from '../data/mockData';
import { Plus, Trash2, Calculator, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  id: string;
  commodityId: string;
  quantity: number;
}

const Budget: React.FC = () => {
  const [selectedCommodityId, setSelectedCommodityId] = useState(commodities[0].id);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);

  const selectedCommodity = useMemo(() => 
    commodities.find(c => c.id === selectedCommodityId)!, 
  [selectedCommodityId]);

  const currentCost = useMemo(() => 
    selectedCommodity.price * quantity, 
  [selectedCommodity, quantity]);

  const addToCart = () => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      commodityId: selectedCommodityId,
      quantity: quantity
    };
    setCart([...cart, newItem]);
    setQuantity(1);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalCost = useMemo(() => 
    cart.reduce((total, item) => {
      const commodity = commodities.find(c => c.id === item.commodityId)!;
      return total + (commodity.price * item.quantity);
    }, 0), 
  [cart]);

  return (
    <div className="px-5 py-6 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold mb-2">Budget Estimator</h1>
        <p className="text-gray-500 text-sm">Plan your market trip with real-time prices.</p>
      </header>

      {/* Estimator Form */}
      <section className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Commodity</label>
          <select
            value={selectedCommodityId}
            onChange={(e) => setSelectedCommodityId(e.target.value)}
            className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#22c55e] transition-colors"
          >
            {commodities.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.name} - ₱{c.price}/kg</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quantity (kg)</label>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl flex items-center justify-center text-xl font-bold hover:bg-[#22c55e] hover:text-black transition-all"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-3 px-4 text-center text-xl font-bold focus:outline-none focus:border-[#22c55e]"
            />
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl flex items-center justify-center text-xl font-bold hover:bg-[#22c55e] hover:text-black transition-all"
            >
              +
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1f1f23] flex justify-between items-end">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Estimated Cost</p>
            <p className="text-3xl font-bold text-[#22c55e]">₱{currentCost.toLocaleString()}</p>
          </div>
          <button 
            onClick={addToCart}
            className="bg-[#22c55e] text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform active:scale-95"
          >
            <Plus size={20} />
            Add to List
          </button>
        </div>
      </section>

      {/* Shopping List */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag size={20} className="text-[#22c55e]" />
          <h2 className="text-lg font-bold">Shopping List</h2>
          <span className="ml-auto text-xs font-bold text-gray-500 uppercase">{cart.length} Items</span>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {cart.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 text-gray-600 text-sm italic"
              >
                Your list is empty. Start adding items!
              </motion.p>
            ) : (
              cart.map((item) => {
                const commodity = commodities.find(c => c.id === item.commodityId)!;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4 flex items-center gap-4"
                  >
                    <span className="text-2xl">{commodity.emoji}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{commodity.name}</h4>
                      <p className="text-xs text-gray-500">{item.quantity}kg × ₱{commodity.price}</p>
                    </div>
                    <p className="font-bold">₱{(commodity.price * item.quantity).toLocaleString()}</p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-600 hover:text-[#ef4444] transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Total Summary */}
      {cart.length > 0 && (
        <section className="sticky bottom-4 z-10">
          <div className="bg-[#22c55e] rounded-2xl p-5 shadow-2xl shadow-[#22c55e]/20 flex justify-between items-center">
            <div>
              <p className="text-black/60 text-xs font-bold uppercase tracking-wider mb-1">Total Budget</p>
              <p className="text-3xl font-black text-black">₱{totalCost.toLocaleString()}</p>
            </div>
            <button className="bg-black text-[#22c55e] px-5 py-3 rounded-xl font-bold flex items-center gap-2">
              Checkout
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Budget;
