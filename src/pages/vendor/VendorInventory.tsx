import React, { useState } from 'react';
import { Package, AlertCircle, Edit2, Trash2, Plus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  emoji: string;
}

const VendorInventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Carabao Mango', stock: 45, price: 220, emoji: '🥭' },
    { id: '2', name: 'Pineapple', stock: 8, price: 85, emoji: '🍍' },
    { id: '3', name: 'Red Onion', stock: 120, price: 180, emoji: '🧅' },
    { id: '4', name: 'Siling Labuyo', stock: 5, price: 600, emoji: '🌶️' },
    { id: '5', name: 'Highland Carrots', stock: 60, price: 80, emoji: '🥕' },
    { id: '6', name: 'Native Tomato', stock: 3, price: 110, emoji: '🍅' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formName, setFormName] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formEmoji, setFormEmoji] = useState('📦');

  const lowStockCount = inventory.filter(item => item.stock < 10).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormStock('');
    setFormPrice('');
    setFormEmoji('📦');
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormStock(item.stock.toString());
    setFormPrice(item.price.toString());
    setFormEmoji(item.emoji);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formName || !formStock || !formPrice) return;
    
    if (editingItem) {
      setInventory(inventory.map(item => 
        item.id === editingItem.id 
          ? { ...item, name: formName, stock: parseInt(formStock), price: parseInt(formPrice), emoji: formEmoji }
          : item
      ));
    } else {
      const newItem: InventoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: formName,
        stock: parseInt(formStock),
        price: parseInt(formPrice),
        emoji: formEmoji,
      };
      setInventory([...inventory, newItem]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-black mb-4">Inventory</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-3.5 flex flex-col gap-1">
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider">Products</p>
            <p className="text-xl font-black text-white">{inventory.length}</p>
          </div>
          <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-3.5 flex flex-col gap-1">
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider">Low Stock</p>
            <p className={lowStockCount > 0 ? "text-xl font-black text-[#ef4444]" : "text-xl font-black text-white"}>
              {lowStockCount}
            </p>
          </div>
          <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-3.5 flex flex-col gap-1">
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-wider">Value</p>
            <p className="text-xl font-black text-[#22c55e]">₱{(totalValue / 1000).toFixed(1)}k</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#141418] border border-[#1f1f23] rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#22c55e]/50 transition-colors placeholder-gray-600"
          />
        </div>
      </header>

      {/* Inventory List */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider">
            <Package size={16} className="text-[#22c55e]" />
            Current Stock
          </h2>
          <button 
            onClick={openAddModal}
            className="text-[#22c55e] text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
          >
            <Plus size={12} />
            Add New
          </button>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredInventory.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141418] rounded-xl border border-[#1f1f23] p-4 flex items-center gap-4"
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500 font-bold">{item.stock}kg</p>
                  {item.stock < 10 && (
                    <span className="bg-[#ef4444]/15 text-[#ef4444] text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                      <AlertCircle size={7} />
                      Low Stock
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">₱{item.price}/kg</p>
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => openEditModal(item)} 
                    className="text-gray-600 hover:text-[#22c55e] transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="text-gray-600 hover:text-[#ef4444] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* FAB */}
      <button 
        onClick={openAddModal}
        className="fixed bottom-24 right-1/2 translate-x-[calc(215px-2.5rem)] w-14 h-14 bg-[#22c55e] text-black rounded-2xl shadow-2xl shadow-[#22c55e]/30 flex items-center justify-center hover:scale-105 transition-transform active:scale-95 z-40"
      >
        <Plus size={28} />
      </button>

      {/* Add/Edit Product Modal */}
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
              className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#111114] border-t border-[#1f1f23] rounded-t-[32px] p-7 z-[70]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black">{editingItem ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Carabao Mango" 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Stock (kg)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                      className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Price (₱/kg)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full bg-[#1a1a1e] border border-[#2a2a2e] rounded-xl py-3.5 px-4 text-white text-sm focus:outline-none focus:border-[#22c55e]/50" 
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSave}
                  className="w-full bg-[#22c55e] text-black py-4 rounded-xl font-black text-sm uppercase tracking-wider mt-2 hover:bg-[#1db053] transition-colors active:scale-[0.98]"
                >
                  {editingItem ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorInventory;
