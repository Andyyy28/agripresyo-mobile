import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, CheckCircle, Settings, Bell, Moon, Globe, ChevronRight, LogOut, Shield, MapPin, Package } from 'lucide-react';
import { motion } from 'motion/react';

const VendorProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const stallInfo = {
    name: "Mang Juan's Fresh",
    location: 'Stall #42-B • Main Market',
    verified: true,
  };

  const commoditiesSold = [
    { name: 'Carabao Mango', emoji: '🥭' },
    { name: 'Pineapple', emoji: '🍍' },
    { name: 'Red Onion', emoji: '🧅' },
    { name: 'Siling Labuyo', emoji: '🌶️' },
    { name: 'Highland Carrots', emoji: '🥕' },
    { name: 'Native Tomato', emoji: '🍅' },
  ];

  const settingsItems = [
    { icon: Bell, label: 'Notifications', value: 'On', color: '#22c55e' },
    { icon: Moon, label: 'Dark Mode', value: 'Always', color: '#8b5cf6' },
    { icon: Globe, label: 'Language', value: 'English', color: '#3b82f6' },
    { icon: Shield, label: 'Privacy', value: '', color: '#f59e0b' },
  ];

  return (
    <div className="px-5 py-6 flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-black mb-6">Profile</h1>

        {/* Vendor Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#141418] to-[#1a1a20] rounded-2xl border border-[#1f1f23] p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/5 rounded-full blur-3xl" />
          
          <div className="flex items-center gap-4 relative z-10 mb-4">
            <div className="w-16 h-16 bg-[#22c55e]/10 rounded-2xl flex items-center justify-center text-[#22c55e] border border-[#22c55e]/20">
              <Store size={32} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-black">{stallInfo.name}</h2>
                {stallInfo.verified && (
                  <CheckCircle size={16} className="text-[#22c55e]" />
                )}
              </div>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                <MapPin size={12} />
                <p>{stallInfo.location}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <div className="bg-[#22c55e]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Store size={12} className="text-[#22c55e]" />
              <span className="text-[#22c55e] text-[10px] font-black uppercase tracking-wider">Vendor</span>
            </div>
            <div className="bg-[#3b82f6]/10 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle size={12} className="text-[#3b82f6]" />
              <span className="text-[#3b82f6] text-[10px] font-black uppercase tracking-wider">Verified</span>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Account Info */}
      <section className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-5">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Account</h3>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Name</span>
            <span className="font-semibold">{user?.name || 'Vendor'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Email</span>
            <span className="font-semibold">{user?.email || 'vendor@email.com'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Member Since</span>
            <span className="font-semibold">Jan 2026</span>
          </div>
        </div>
      </section>

      {/* Commodities Sold */}
      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
          <Package size={12} />
          Commodities Sold
        </h3>
        <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4">
          <div className="flex flex-wrap gap-2">
            {commoditiesSold.map((item) => (
              <div key={item.name} className="bg-[#1a1a1e] border border-[#2a2a2e] rounded-lg px-3 py-2 flex items-center gap-2">
                <span className="text-sm">{item.emoji}</span>
                <span className="text-xs font-bold text-gray-300">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Settings */}
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 mb-1">Settings</h3>
        <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] divide-y divide-[#1f1f23] overflow-hidden">
          {settingsItems.map((item) => (
            <button key={item.label} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#1a1a1e] transition-colors text-left">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                <item.icon size={18} />
              </div>
              <span className="flex-1 text-sm font-semibold">{item.label}</span>
              {item.value && <span className="text-gray-500 text-xs font-bold">{item.value}</span>}
              <ChevronRight size={16} className="text-gray-700" />
            </button>
          ))}
        </div>
      </section>

      {/* Logout */}
      <section>
        <button
          id="vendor-logout"
          onClick={handleLogout}
          className="w-full bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-2xl py-4 flex items-center justify-center gap-3 text-[#ef4444] font-bold text-sm hover:bg-[#ef4444]/15 transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </section>

      <p className="text-center text-gray-700 text-[10px] font-bold uppercase tracking-widest pb-4">
        AgriPresyo v1.0.0
      </p>
    </div>
  );
};

export default VendorProfile;
