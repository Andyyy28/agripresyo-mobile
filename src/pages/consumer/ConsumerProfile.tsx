import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, ShoppingBasket, Settings, Bell, Moon, Globe, ChevronRight, LogOut, Shield } from 'lucide-react';
import { motion } from 'motion/react';

const ConsumerProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

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

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#141418] to-[#1a1a20] rounded-2xl border border-[#1f1f23] p-6 flex flex-col items-center gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/5 rounded-full blur-3xl" />
          
          <div className="w-20 h-20 bg-[#1a1a1e] rounded-2xl border-2 border-[#1f1f23] flex items-center justify-center text-gray-400 relative z-10">
            <User size={40} />
          </div>
          
          <div className="text-center relative z-10">
            <h2 className="text-xl font-black">{user?.name || 'User'}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{user?.email || 'user@email.com'}</p>
          </div>

          <div className="flex items-center gap-2 bg-[#22c55e]/10 px-4 py-1.5 rounded-full relative z-10">
            <ShoppingBasket size={14} className="text-[#22c55e]" />
            <span className="text-[#22c55e] text-xs font-black uppercase tracking-wider">Consumer</span>
          </div>
        </motion.div>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-3">
        <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 text-center">
          <p className="text-xl font-black text-[#22c55e]">12</p>
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider mt-1">Saved</p>
        </div>
        <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 text-center">
          <p className="text-xl font-black">₱2.4k</p>
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider mt-1">Budget</p>
        </div>
        <div className="bg-[#141418] rounded-2xl border border-[#1f1f23] p-4 text-center">
          <p className="text-xl font-black">8</p>
          <p className="text-gray-500 text-[9px] font-bold uppercase tracking-wider mt-1">Lists</p>
        </div>
      </section>

      {/* Settings */}
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest px-1 mb-2">Settings</h3>
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
          id="consumer-logout"
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

export default ConsumerProfile;
