import React, { useState, useEffect } from 'react';
import { ShoppingBag, Zap, Package, Edit2, Shield, AlertTriangle, Plus, Store, Clock, MapPin, ChevronDown, X, AlertCircle, Trash2, Check, Send, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useInventory } from '../../context/InventoryContext';
import { getCommodityBg } from '../../data/commodityColors';
import type { ShopProfile } from '../../types';

const SHOP_PROFILE_KEY = 'agripresyo_shop_profile';

const specialtyOptions = ['Fruit Seller', 'Veggie Seller', 'Mixed', 'Spices', 'Roots'];


const commodityOptions = [
  { name: 'Carabao Mango', emoji: '🥭', slug: 'mango', category: 'Fruits' },
  { name: 'Pineapple', emoji: '🍍', slug: 'pineapple', category: 'Fruits' },
  { name: 'Baguio Strawberries', emoji: '🍓', slug: 'strawberry', category: 'Fruits' },
  { name: 'Hass Avocado', emoji: '🥑', slug: 'avocado', category: 'Fruits' },
  { name: 'Seedless Watermelon', emoji: '🍉', slug: 'watermelon', category: 'Fruits' },
  { name: 'Davao Pomelo', emoji: '🍊', slug: 'pomelo', category: 'Fruits' },
  { name: 'Red Onion', emoji: '🧅', slug: 'onion', category: 'Spices' },
  { name: 'Siling Labuyo', emoji: '🌶️', slug: 'chili', category: 'Spices' },
  { name: 'Yellow Ginger', emoji: '🫚', slug: 'ginger', category: 'Spices' },
  { name: 'Highland Carrots', emoji: '🥕', slug: 'carrot', category: 'Vegetables' },
  { name: 'Pechay', emoji: '🥬', slug: 'pechay', category: 'Vegetables' },
  { name: 'Native Tomato', emoji: '🍅', slug: 'tomato', category: 'Vegetables' },
  { name: 'Sitaw', emoji: '🫛', slug: 'sitaw', category: 'Vegetables' },
  { name: 'Okra', emoji: '🥒', slug: 'okra', category: 'Vegetables' },
  { name: 'Granola Potato', emoji: '🥔', slug: 'potato', category: 'Roots' },
];

const VendorDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { isDark } = useTheme();
  const { inventory, addItem, updateItem, deleteItem, totalStock, lowStockCount } = useInventory();
  const [sellerType, setSellerType] = useState<'fruit' | 'veggie'>('fruit');

  // ===== SHOP PROFILE STATE =====
  const getDefaultProfile = (): ShopProfile => ({
    shopName: user?.shopName || `${user?.name || 'Vendor'}'s Shop`,
    specialty: sellerType === 'fruit' ? 'Fruit Seller' : 'Veggie Seller',
    location: user?.marketLocation || 'Bankerohan',
    description: 'Fresh produce sourced from local farms in Mindanao. Quality guaranteed every day.',
    openTime: '04:00',
    closeTime: '18:00',
  });

  const [shopProfile, setShopProfile] = useState<ShopProfile>(() => {
    try {
      const stored = localStorage.getItem(SHOP_PROFILE_KEY);
      if (stored) return JSON.parse(stored);
    } catch { }
    return getDefaultProfile();
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState<ShopProfile>(shopProfile);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(false);


  // ===== VERIFICATION STATE =====
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);
  const verificationStatus = user?.verificationStatus || 'none';

  // ===== REPORT ISSUE STATE =====
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportSubject, setReportSubject] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  const [reportErrors, setReportErrors] = useState<{ subject?: string; message?: string }>({});

  // ===== NEW LISTING MODAL STATE =====
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<string | null>(null);
  const [listingCommodity, setListingCommodity] = useState(commodityOptions[0]);
  const [listingPrice, setListingPrice] = useState('');
  const [listingStock, setListingStock] = useState('');
  const [listingUnit, setListingUnit] = useState('kg');
  const [listingAvailability, setListingAvailability] = useState<'in_stock' | 'out_of_stock'>('in_stock');
  const [commodityDropdownOpen, setCommodityDropdownOpen] = useState(false);

  const handleStartEdit = () => {
    setEditProfile({ ...shopProfile });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditProfile(shopProfile);
  };

  const handleSaveProfile = () => {
    if (!editProfile.shopName.trim()) return;
    setShopProfile(editProfile);
    localStorage.setItem(SHOP_PROFILE_KEY, JSON.stringify(editProfile));
    // Also update user's shopName in auth context
    updateUser({ shopName: editProfile.shopName, marketLocation: editProfile.location });
    setIsEditing(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  // ===== VERIFICATION HANDLERS =====
  const handleApplyVerification = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        setSelectedFile(target.files[0]);
      }
    };
    fileInput.click();
  };

  const handleSubmitVerification = () => {
    setIsSubmittingVerification(true);
    setTimeout(() => {
      updateUser({ verificationStatus: 'pending', isVerified: false });
      setSelectedFile(null);
      setIsSubmittingVerification(false);
    }, 1500);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  // ===== REPORT ISSUE HANDLERS =====
  const handleOpenReport = () => {
    setReportSubject('');
    setReportMessage('');
    setReportErrors({});
    setShowReportConfirm(false);
    setIsReportOpen(true);
  };

  const validateReport = (): boolean => {
    const errors: { subject?: string; message?: string } = {};
    if (!reportSubject.trim()) errors.subject = 'Subject is required';
    if (!reportMessage.trim()) errors.message = 'Message is required';
    setReportErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReportSubmitClick = () => {
    if (!validateReport()) return;
    setShowReportConfirm(true);
  };

  const handleReportGoBack = () => {
    setShowReportConfirm(false);
  };

  const handleReportConfirm = () => {
    setIsSubmittingReport(true);
    // Store in localStorage (no backend)
    const complaint = {
      id: Date.now().toString(),
      subject: reportSubject.trim(),
      message: reportMessage.trim(),
      vendorId: user?.email || 'unknown',
      vendorName: user?.name || 'Unknown Vendor',
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem('agripresyo_complaints') || '[]');
      existing.push(complaint);
      localStorage.setItem('agripresyo_complaints', JSON.stringify(existing));
    } catch {
      // fallback: just set
      localStorage.setItem('agripresyo_complaints', JSON.stringify([complaint]));
    }
    // Simulate short delay for UX
    setTimeout(() => {
      setIsSubmittingReport(false);
      setShowReportConfirm(false);
      setIsReportOpen(false);
      setReportSubject('');
      setReportMessage('');
      setReportErrors({});
      setShowReportSuccess(true);
      setTimeout(() => setShowReportSuccess(false), 3000);
    }, 800);
  };

  // ===== NEW LISTING HANDLERS =====
  const openNewListingModal = () => {
    setEditingInventoryItem(null);
    setListingCommodity(commodityOptions[0]);
    setListingPrice('');
    setListingStock('');
    setListingUnit('kg');
    setListingAvailability('in_stock');
    setIsListingModalOpen(true);
  };

  const openEditListingModal = (itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    setEditingInventoryItem(itemId);
    const matched = commodityOptions.find(c => c.name === item.name);
    setListingCommodity(matched || { name: item.name, emoji: item.emoji, category: item.category || 'Fruits' });
    setListingPrice(item.price.toString());
    setListingStock(item.stock.toString());
    setListingUnit(item.unit || 'kg');
    setListingAvailability(item.availability || 'in_stock');
    setIsListingModalOpen(true);
  };

  const handleSaveListing = () => {
    if (!listingPrice || !listingStock) return;
    if (editingInventoryItem) {
      updateItem(editingInventoryItem, {
        name: listingCommodity.name,
        emoji: listingCommodity.emoji,
        category: listingCommodity.category,
        price: parseFloat(listingPrice),
        stock: parseFloat(listingStock),
        unit: listingUnit,
        availability: listingAvailability,
      });
    } else {
      addItem({
        name: listingCommodity.name,
        emoji: listingCommodity.emoji,
        category: listingCommodity.category,
        price: parseFloat(listingPrice),
        stock: parseFloat(listingStock),
        unit: listingUnit,
        availability: listingAvailability,
      });
    }
    setIsListingModalOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const isShopOpen = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= shopProfile.openTime && currentTime <= shopProfile.closeTime;
  };

  return (
    <div className="px-5 py-6 flex flex-col gap-5">
      {/* Save Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#22c55e] text-black px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-2xl shadow-[#22c55e]/30"
          >
            <Check size={16} />
            Shop profile saved
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Success Toast */}
      <AnimatePresence>
        {showReportSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-[#22c55e] text-black px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-2xl shadow-[#22c55e]/30"
          >
            <Check size={16} />
            Complaint submitted successfully
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3 Stat Cards Row */}
      <section className="grid grid-cols-3 gap-2.5">
        {/* What I Sell */}
        <div className={`rounded-2xl border p-3.5 flex flex-col gap-2 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
          <div className="flex items-center justify-between">
            <p className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>What I Sell</p>
            <ShoppingBag size={14} className="text-[#f97316]" />
          </div>
          <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>
            {shopProfile.shopName}
          </p>
          <div className="flex gap-1.5 mt-1">
            <button
              onClick={() => setSellerType('fruit')}
              className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-wider transition-all ${sellerType === 'fruit'
                ? 'bg-[#f97316] text-white'
                : isDark ? 'bg-[#1a1a1e] text-gray-500' : 'bg-gray-100 text-gray-400'
                }`}
            >
              Fruit
            </button>
            <button
              onClick={() => setSellerType('veggie')}
              className={`px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-wider transition-all ${sellerType === 'veggie'
                ? 'bg-[#22c55e] text-white'
                : isDark ? 'bg-[#1a1a1e] text-gray-500' : 'bg-gray-100 text-gray-400'
                }`}
            >
              Veggie
            </button>
          </div>
        </div>

        {/* Market Demand Signal */}
        <div className={`rounded-2xl border p-3.5 flex flex-col gap-2 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
          <div className="flex items-center justify-between">
            <p className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Demand</p>
            <Zap size={14} className="text-[#ef4444]" />
          </div>
          <p className="text-sm font-black text-[#ef4444]">BEARISH</p>
          <p className="text-[7px] font-bold text-[#ef4444]/70 uppercase tracking-wider leading-tight">
            Caution: Declining Prices
          </p>
        </div>

        {/* Total Stock */}
        <div className={`rounded-2xl border p-3.5 flex flex-col gap-2 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
          <div className="flex items-center justify-between">
            <p className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Total Stock</p>
            <Package size={14} className="text-[#22c55e]" />
          </div>
          <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>{totalStock} <span className="text-xs font-bold text-gray-500">KG</span></p>
        </div>
      </section>

      {/* ===== SHOP PROFILE (Enhancement 3) ===== */}
      <section className={`rounded-2xl border p-5 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>Shop Profile</h2>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveProfile}
                className="flex items-center gap-1.5 bg-[#22c55e] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-[#16a34a] transition-colors"
              >
                <Check size={12} />
                SAVE
              </button>
              <button
                onClick={handleCancelEdit}
                className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${isDark ? 'bg-[#1a1a1e] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 text-[#22c55e] text-[10px] font-black uppercase tracking-wider"
            >
              <Edit2 size={12} />
              EDIT
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* Shop Name */}
          <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-[#1a1a1e]' : 'bg-gray-50'}`}>
            <Store size={14} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            <div className="flex-1 min-w-0">
              <p className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Shop Name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editProfile.shopName}
                  onChange={(e) => setEditProfile({ ...editProfile, shopName: e.target.value })}
                  className={`w-full text-sm font-bold bg-transparent border-b-2 border-[#22c55e] focus:outline-none py-0.5 ${isDark ? 'text-white' : 'text-[#111827]'}`}
                />
              ) : (
                <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{shopProfile.shopName}</p>
              )}
            </div>
          </div>

          {/* Specialty */}
          <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-[#1a1a1e]' : 'bg-gray-50'}`}>
            <ShoppingBag size={14} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            <div className="flex-1 min-w-0">
              <p className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Specialty</p>
              {isEditing ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSpecialtyDropdownOpen(!specialtyDropdownOpen)}
                    className={`w-full text-sm font-bold text-left bg-transparent border-b-2 border-[#22c55e] focus:outline-none py-0.5 flex items-center justify-between ${isDark ? 'text-white' : 'text-[#111827]'}`}
                  >
                    {editProfile.specialty}
                    <ChevronDown size={14} className={`transition-transform ${specialtyDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {specialtyDropdownOpen && (
                    <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl border overflow-hidden z-20 ${isDark ? 'bg-[#141418] border-[#22c55e]' : 'bg-white border-[#22c55e]'}`}>
                      {specialtyOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setEditProfile({ ...editProfile, specialty: opt }); setSpecialtyDropdownOpen(false); }}
                          className={`w-full text-left px-3 py-2.5 text-sm font-bold transition-colors ${editProfile.specialty === opt
                            ? isDark ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#dcfce7] text-[#16a34a]'
                            : isDark ? 'text-gray-300 hover:bg-[#1a1a1e]' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{shopProfile.specialty}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-[#1a1a1e]' : 'bg-gray-50'}`}>
            <MapPin size={14} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            <div className="flex-1 min-w-0">
              <p className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Location</p>
              {isEditing ? (
                <input
                  type="text"
                  placeholder="e.g. Kabacan, North Cotabato"
                  value={editProfile.location}
                  onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })}
                  className={`w-full text-sm font-bold bg-transparent border-b-2 border-[#22c55e] focus:outline-none py-0.5 ${isDark ? 'text-white placeholder-gray-500' : 'text-[#111827] placeholder-gray-400'}`}
                />
              ) : (
                <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{shopProfile.location}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className={`p-3 rounded-xl ${isDark ? 'bg-[#1a1a1e]' : 'bg-gray-50'}`}>
            <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Description</p>
            {isEditing ? (
              <textarea
                value={editProfile.description}
                onChange={(e) => setEditProfile({ ...editProfile, description: e.target.value })}
                rows={3}
                className={`w-full text-xs leading-relaxed bg-transparent border-b-2 border-[#22c55e] focus:outline-none resize-none ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
              />
            ) : (
              <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{shopProfile.description}</p>
            )}
          </div>

          {/* Market Hours */}
          <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-[#1a1a1e]' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <Clock size={14} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
              <div>
                <p className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Market Hours</p>
                {isEditing ? (
                  <div className="flex items-center gap-2 mt-0.5">
                    <input
                      type="time"
                      value={editProfile.openTime}
                      onChange={(e) => setEditProfile({ ...editProfile, openTime: e.target.value })}
                      className={`text-sm font-bold bg-transparent border-b-2 border-[#22c55e] focus:outline-none w-24 ${isDark ? 'text-white' : 'text-[#111827]'}`}
                    />
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>—</span>
                    <input
                      type="time"
                      value={editProfile.closeTime}
                      onChange={(e) => setEditProfile({ ...editProfile, closeTime: e.target.value })}
                      className={`text-sm font-bold bg-transparent border-b-2 border-[#22c55e] focus:outline-none w-24 ${isDark ? 'text-white' : 'text-[#111827]'}`}
                    />
                  </div>
                ) : (
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                    {shopProfile.openTime} — {shopProfile.closeTime}
                  </p>
                )}
              </div>
            </div>
            {!isEditing && (
              <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${isShopOpen()
                ? 'bg-[#22c55e]/15 text-[#22c55e]'
                : 'bg-[#ef4444]/15 text-[#ef4444]'
                }`}>
                {isShopOpen() ? 'OPEN NOW' : 'CLOSED'}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ===== VENDOR VERIFICATION (Enhancement 5) ===== */}
      <section className={`rounded-2xl border p-5 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
        <div className="flex items-center gap-3 mb-3">
          <Shield size={18} className="text-[#3b82f6]" />
          <div>
            <h2 className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>Vendor Verification</h2>
            <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Get verified to build trust with consumers</p>
          </div>
        </div>

        {verificationStatus === 'none' && (
          <>
            <button
              onClick={handleApplyVerification}
              className="w-full bg-[#22c55e] text-black py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#16a34a] transition-colors active:scale-[0.98]"
            >
              <Shield size={16} />
              Apply for Verification
            </button>

            {/* File selected state */}
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex flex-col gap-2"
              >
                <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-[#1a1a1e]' : 'bg-gray-50'}`}>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{selectedFile.name}</p>
                    <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button onClick={handleRemoveFile} className="text-gray-400 hover:text-[#ef4444] transition-colors text-xs font-bold uppercase tracking-wider ml-3">
                    Remove
                  </button>
                </div>
                <button
                  onClick={handleSubmitVerification}
                  disabled={isSubmittingVerification}
                  className="w-full bg-[#22c55e] text-black py-3 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#16a34a] transition-colors disabled:opacity-50"
                >
                  {isSubmittingVerification ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Shield size={16} />
                      Submit Verification
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </>
        )}

        {verificationStatus === 'pending' && (
          <div className="flex flex-col gap-3">
            <button
              disabled
              className="w-full bg-[#f59e0b]/20 border border-[#f59e0b]/30 text-[#f59e0b] py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Clock size={16} />
              Verification Pending
            </button>
            <p className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Documents submitted. We'll review within 3-5 business days.
            </p>
          </div>
        )}

        {verificationStatus === 'verified' && (
          <div className="flex items-center gap-2 bg-[#22c55e]/10 border border-[#22c55e]/20 px-4 py-3 rounded-xl">
            <Check size={16} className="text-[#22c55e]" />
            <span className="text-[#22c55e] text-sm font-black uppercase tracking-wider">Verified Vendor</span>
          </div>
        )}
      </section>

      {/* ===== TERMINAL ADMIN (Enhancement 4) ===== */}
      <section className={`rounded-2xl border p-5 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
        <div className="mb-3">
          <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>Terminal Admin</h2>
          <p className={`text-[9px] font-black uppercase tracking-wider mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Managing Your Assets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleOpenReport}
            className="flex-1 bg-[#ef4444]/10 border border-[#ef4444]/20 text-[#ef4444] py-3 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#ef4444]/15 transition-colors active:scale-[0.98]"
          >
            <AlertTriangle size={14} />
            Report Issue
          </button>
          <button
            onClick={openNewListingModal}
            className="flex-1 bg-[#22c55e] text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#16a34a] transition-colors active:scale-[0.98]"
          >
            <Plus size={14} />
            New Listing
          </button>
        </div>
      </section>

      {/* ===== INVENTORY LIST (Enhancement 4) ===== */}
      <section className={`rounded-2xl border p-5 ${isDark ? 'bg-[#141418] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'}`}>
        {inventory.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e]' : 'bg-gray-50 border-[#e5e7eb]'}`}>
              <Package size={28} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
            </div>
            <p className={`text-sm font-black uppercase tracking-wider text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Node Inventory Depleted
            </p>
            <p className={`text-xs text-center max-w-[240px] leading-relaxed ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              Initialize your first listing to begin trading
            </p>
            <button
              onClick={openNewListingModal}
              className="mt-2 bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#22c55e]/15 transition-colors"
            >
              <Plus size={12} />
              Add First Listing
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                <Package size={14} className="text-[#22c55e]" />
                Inventory ({inventory.length})
              </h3>
              {lowStockCount > 0 && (
                <span className="bg-[#ef4444]/15 text-[#ef4444] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {lowStockCount} Low Stock
                </span>
              )}
            </div>
            {inventory.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border p-3.5 flex items-center gap-3 ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e]' : 'bg-gray-50 border-[#e5e7eb]'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 ${getCommodityBg((commodityOptions.find(c => c.name === item.name)?.slug) || '', isDark)}`}>
                  <img
                    src={`/images/commodities/${(commodityOptions.find(c => c.name === item.name)?.slug) || item.name.toLowerCase().replace(/\s+/g, '-')}.webp`}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-bold text-sm truncate ${isDark ? 'text-white' : 'text-[#111827]'}`}>{item.name}</h4>
                  <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{item.category || 'General'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.stock}kg</p>
                    {item.stock < 10 && (
                      <span className="bg-[#ef4444]/15 text-[#ef4444] text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                        <AlertCircle size={7} />
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <p className="font-bold text-sm text-[#22c55e]">₱{item.price}/kg</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditListingModal(item.id)}
                      className={`transition-colors ${isDark ? 'text-gray-600 hover:text-[#22c55e]' : 'text-gray-400 hover:text-[#22c55e]'}`}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className={`transition-colors ${isDark ? 'text-gray-600 hover:text-[#ef4444]' : 'text-gray-400 hover:text-[#ef4444]'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== NEW LISTING MODAL ===== */}
      <AnimatePresence>
        {isListingModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsListingModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] border-t rounded-t-[32px] p-7 z-[70] ${isDark ? 'bg-[#111114] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
                }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                  {editingInventoryItem ? 'Edit Listing' : 'New Listing'}
                </h3>
                <button onClick={() => setIsListingModalOpen(false)} className={`p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Commodity Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Commodity</label>
                  <div className="relative">
                    <button
                      onClick={() => setCommodityDropdownOpen(!commodityDropdownOpen)}
                      className={`w-full flex items-center justify-between rounded-xl py-3 px-4 text-sm font-bold border ${isDark ? 'bg-[#1a1a1e] border-[#2a2a2e] text-white' : 'bg-[#f3f4f6] border-[#e5e7eb] text-[#111827]'}`}
                    >
                      <span className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${getCommodityBg(listingCommodity.slug, isDark)}`}>
                          <img
                            src={`/images/commodities/${listingCommodity.slug}.webp`}
                            alt={listingCommodity.name}
                            className="w-full h-full object-contain p-0.5"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        {listingCommodity.name}
                      </span>
                      <ChevronDown size={16} className={`transition-transform ${commodityDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {commodityDropdownOpen && (
                      <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl border overflow-hidden z-20 max-h-48 overflow-y-auto ${isDark ? 'bg-[#141418] border-[#22c55e]' : 'bg-white border-[#22c55e]'}`}>
                        {commodityOptions.map((opt) => (
                          <button
                            key={opt.name}
                            onClick={() => { setListingCommodity(opt); setCommodityDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-bold flex items-center gap-2 transition-colors ${listingCommodity.name === opt.name
                              ? isDark ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-[#dcfce7] text-[#16a34a]'
                              : isDark ? 'text-gray-300 hover:bg-[#1a1a1e]' : 'text-gray-700 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${getCommodityBg(opt.slug, isDark)}`}>
                              <img
                                src={`/images/commodities/${opt.slug}.webp`}
                                alt={opt.name}
                                className="w-full h-full object-contain p-0.5"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                            </div>
                            {opt.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Price + Stock */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Price per kg</label>
                    <div className="relative">
                      <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold ${isDark ? 'text-[#22c55e]' : 'text-[#16a34a]'}`}>₱</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={listingPrice}
                        onChange={(e) => setListingPrice(e.target.value)}
                        className={`w-full rounded-xl py-3 pl-8 pr-4 text-sm font-bold focus:outline-none focus:border-[#22c55e]/50 ${isDark ? 'bg-[#1a1a1e] border border-[#2a2a2e] text-white' : 'bg-[#f3f4f6] border border-[#e5e7eb] text-[#111827]'
                          }`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Stock</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0"
                        value={listingStock}
                        onChange={(e) => setListingStock(e.target.value)}
                        className={`w-full rounded-xl py-3 pl-4 pr-10 text-sm font-bold focus:outline-none focus:border-[#22c55e]/50 ${isDark ? 'bg-[#1a1a1e] border border-[#2a2a2e] text-white' : 'bg-[#f3f4f6] border border-[#e5e7eb] text-[#111827]'
                          }`}
                      />
                      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>kg</span>
                    </div>
                  </div>
                </div>

                {/* Unit + Availability */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Unit</label>
                    <div className="flex gap-1.5">
                      {['kg', 'bundle', 'piece', 'cavan'].map((u) => (
                        <button
                          key={u}
                          onClick={() => setListingUnit(u)}
                          className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${listingUnit === u
                            ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                            : isDark ? 'bg-[#1a1a1e] text-gray-500 border border-[#2a2a2e]' : 'bg-gray-100 text-gray-400 border border-[#e5e7eb]'
                            }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Availability</label>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setListingAvailability('in_stock')}
                        className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${listingAvailability === 'in_stock'
                          ? 'bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30'
                          : isDark ? 'bg-[#1a1a1e] text-gray-500 border border-[#2a2a2e]' : 'bg-gray-100 text-gray-400 border border-[#e5e7eb]'
                          }`}
                      >
                        In Stock
                      </button>
                      <button
                        onClick={() => setListingAvailability('out_of_stock')}
                        className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${listingAvailability === 'out_of_stock'
                          ? 'bg-[#ef4444]/15 text-[#ef4444] border border-[#ef4444]/30'
                          : isDark ? 'bg-[#1a1a1e] text-gray-500 border border-[#2a2a2e]' : 'bg-gray-100 text-gray-400 border border-[#e5e7eb]'
                          }`}
                      >
                        Out
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleSaveListing}
                    className="flex-1 bg-[#22c55e] text-black py-3.5 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-[#16a34a] transition-colors active:scale-[0.98]"
                  >
                    {editingInventoryItem ? 'Update Listing' : 'Add Listing'}
                  </button>
                  <button
                    onClick={() => setIsListingModalOpen(false)}
                    className={`px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-colors ${isDark ? 'bg-[#1a1a1e] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== REPORT ISSUE MODAL ===== */}
      <AnimatePresence>
        {isReportOpen && !showReportConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReportOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] border-t rounded-t-[32px] p-7 z-[70] ${isDark ? 'bg-[#111114] border-[#1f1f23]' : 'bg-white border-[#e5e7eb]'
                }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-1">
                <h3 className={`text-xl font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-[#111827]'}`}>
                  Report Issue
                </h3>
                <button
                  onClick={() => setIsReportOpen(false)}
                  className={`p-2 transition-colors ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <X size={20} />
                </button>
              </div>
              <p className={`text-xs mb-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Submit a complaint to admin</p>

              <div className="flex flex-col gap-4">
                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Subject</label>
                  <input
                    type="text"
                    placeholder="Enter subject..."
                    value={reportSubject}
                    onChange={(e) => { setReportSubject(e.target.value); if (reportErrors.subject) setReportErrors(prev => ({ ...prev, subject: undefined })); }}
                    className={`w-full rounded-xl py-3 px-4 text-sm font-bold focus:outline-none transition-colors ${reportErrors.subject
                      ? isDark ? 'bg-[#1a1a1e] border-2 border-[#ef4444] text-white placeholder-gray-600' : 'bg-[#f3f4f6] border-2 border-[#ef4444] text-[#111827] placeholder-gray-400'
                      : isDark ? 'bg-[#1a1a1e] border border-[#2a2a2e] text-white placeholder-gray-600 focus:border-[#22c55e]/50' : 'bg-[#f3f4f6] border border-[#e5e7eb] text-[#111827] placeholder-gray-400 focus:border-[#22c55e]/50'
                      }`}
                  />
                  {reportErrors.subject && (
                    <p className="text-[10px] font-bold text-[#ef4444] flex items-center gap-1">
                      <AlertCircle size={10} />
                      {reportErrors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Message</label>
                  <textarea
                    placeholder="Describe the issue..."
                    rows={4}
                    value={reportMessage}
                    onChange={(e) => { setReportMessage(e.target.value); if (reportErrors.message) setReportErrors(prev => ({ ...prev, message: undefined })); }}
                    className={`w-full rounded-xl py-3 px-4 text-sm font-bold focus:outline-none resize-none transition-colors ${reportErrors.message
                      ? isDark ? 'bg-[#1a1a1e] border-2 border-[#ef4444] text-white placeholder-gray-600' : 'bg-[#f3f4f6] border-2 border-[#ef4444] text-[#111827] placeholder-gray-400'
                      : isDark ? 'bg-[#1a1a1e] border border-[#2a2a2e] text-white placeholder-gray-600 focus:border-[#22c55e]/50' : 'bg-[#f3f4f6] border border-[#e5e7eb] text-[#111827] placeholder-gray-400 focus:border-[#22c55e]/50'
                      }`}
                  />
                  {reportErrors.message && (
                    <p className="text-[10px] font-bold text-[#ef4444] flex items-center gap-1">
                      <AlertCircle size={10} />
                      {reportErrors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleReportSubmitClick}
                  className="w-full bg-[#ef4444] text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#dc2626] transition-colors active:scale-[0.98] mt-1"
                >
                  <Send size={16} />
                  Submit Complaint
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===== REPORT CONFIRMATION MODAL ===== */}
      <AnimatePresence>
        {showReportConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-48px)] max-w-[380px] rounded-3xl p-7 z-[90] shadow-2xl ${isDark ? 'bg-[#111114] border border-[#1f1f23]' : 'bg-white border border-[#e5e7eb]'
                }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#ef4444]/15 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-[#ef4444]" />
                </div>
                <div>
                  <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-[#111827]'}`}>Confirm Submission</h3>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Are you sure you want to submit this complaint?</p>
                </div>
              </div>

              {/* Preview */}
              <div className={`rounded-2xl p-4 flex flex-col gap-3 mb-6 ${isDark ? 'bg-[#1a1a1e]' : 'bg-[#f3f4f6]'}`}>
                <div>
                  <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Subject</p>
                  <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{reportSubject}</p>
                </div>
                <div className={`border-t ${isDark ? 'border-[#2a2a2e]' : 'border-[#e5e7eb]'}`} />
                <div>
                  <p className={`text-[9px] font-black uppercase tracking-wider mb-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Message</p>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{reportMessage}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleReportGoBack}
                  disabled={isSubmittingReport}
                  className={`flex-1 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${isDark ? 'bg-[#1a1a1e] text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <ArrowLeft size={14} />
                  Go Back
                </button>
                <button
                  onClick={handleReportConfirm}
                  disabled={isSubmittingReport}
                  className="flex-1 bg-[#ef4444] text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#dc2626] transition-colors active:scale-[0.98] disabled:opacity-70"
                >
                  {isSubmittingReport ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      Confirm
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorDashboard;
