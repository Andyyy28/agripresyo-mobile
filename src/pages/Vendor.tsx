import React, { useState } from 'react';
import { announcements } from '../data/mockData';
import { Store, CheckCircle, Package, AlertCircle, Edit2, Trash2, Plus, Bell, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  emoji: string;
}

const Vendor: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Carabao Mango', stock: 45, price: 220, emoji: '🥭' },
    { id: '2', name: 'Pineapple', stock: 8, price: 85, emoji: '🍍' },
    { id: '3', name: 'Red Onion', stock: 120, price: 180, emoji: '🧅' },
    { id: '4', name: 'Siling Labuyo', stock: 5, price: 600, emoji: '🌶️' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const lowStockCount = inventory.filter(item => item.stock < 10).length;

  return (
    <div className="px-5 py-6 flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
        
        {/* Vendor Profile Card */}
        <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-5 flex items-center gap-4">
          <div className="w-16 h-16 bg-[#22c55e]/10 rounded-2xl flex items-center justify-center text-[#22c55e] border border-[#22c55e]/20">
            <Store size={32} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold">Mang Juan's Fresh</h2>
              <CheckCircle size={16} className="text-[#22c55e]" />
            </div>
            <p className="text-gray-500 text-sm">Stall #42-B • Main Market</p>
          </div>
          <button className="p-2 bg-[#1a1a1e] rounded-xl border border-[#1f1f23] text-gray-400">
            <Edit2 size={18} />
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 flex flex-col gap-1">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Products</p>
          <p className="text-2xl font-black text-white">{inventory.length}</p>
        </div>
        <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 flex flex-col gap-1">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Low Stock</p>
          <p className={lowStockCount > 0 ? "text-2xl font-black text-[#ef4444]" : "text-2xl font-black text-white"}>
            {lowStockCount}
          </p>
        </div>
        <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 flex flex-col gap-1">
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Updates</p>
          <p className="text-2xl font-black text-[#22c55e]">12</p>
        </div>
      </section>

      {/* Inventory List */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Package size={20} className="text-[#22c55e]" />
            Current Inventory
          </h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-[#22c55e] text-xs font-bold uppercase tracking-widest flex items-center gap-1"
          >
            <Plus size={14} />
            Add New
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {inventory.map((item) => (
            <div key={item.id} className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4 flex items-center gap-4">
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 font-bold">{item.stock}kg in stock</p>
                  {item.stock < 10 && (
                    <span className="bg-[#ef4444]/20 text-[#ef4444] text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                      <AlertCircle size={8} />
                      Low Stock
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">₱{item.price}/kg</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="text-gray-600 hover:text-[#22c55e] transition-colors"><Edit2 size={14} /></button>
                  <button className="text-gray-600 hover:text-[#ef4444] transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Announcements */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Bell size={20} className="text-[#22c55e]" />
          Market Announcements
        </h2>
        <div className="flex flex-col gap-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-[#22c55e]">{ann.title}</h4>
                <div className="flex items-center gap-1 text-gray-500 text-[10px] font-bold">
                  <Calendar size={12} />
                  {ann.date}
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{ann.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#22c55e] text-black rounded-full shadow-2xl shadow-[#22c55e]/40 flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Add Product Modal (Slide-up) */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#111114] border-t border-[#1f1f23] rounded-t-[32px] p-8 z-[70]"
            >
              <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-8" />
              <h3 className="text-2xl font-bold mb-6">Add New Product</h3>
              
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Product Name</label>
                  <input type="text" placeholder="e.g. Carabao Mango" className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-4 px-5 text-white focus:outline-none focus:border-[#22c55e]" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock (kg)</label>
                    <input type="number" placeholder="0" className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-4 px-5 text-white focus:outline-none focus:border-[#22c55e]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Price (₱/kg)</label>
                    <input type="number" placeholder="0" className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-4 px-5 text-white focus:outline-none focus:border-[#22c55e]" />
                  </div>
                </div>

                <button className="w-full bg-[#22c55e] text-black py-4 rounded-xl font-black text-lg mt-4 hover:bg-[#1db053] transition-colors">
                  SAVE PRODUCT
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Vendor;
