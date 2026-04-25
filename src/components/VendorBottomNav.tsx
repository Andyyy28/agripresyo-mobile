import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, BarChart3, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VendorBottomNav: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const navItems = [
    { to: '/vendor/dashboard', icon: LayoutDashboard, label: t('nav_dashboard') },
    { to: '/vendor/market', icon: ShoppingCart, label: t('nav_market') },
    { to: '/vendor/analytics', icon: BarChart3, label: t('nav_analytics') },
    { to: '/vendor/profile', icon: User, label: t('nav_profile') },
  ];

  return (
    <nav className={cn(
      "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] backdrop-blur-xl px-6 py-3 flex justify-around items-center z-50 border-t",
      isDark
        ? "bg-[#0d0d0d]/95 border-[#1f1f23]"
        : "bg-white/95 border-[#e5e7eb]"
    )}>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 transition-all duration-200 px-3 py-1',
              isActive ? 'text-[#22c55e]' : isDark ? 'text-[#71717a]' : 'text-gray-400'
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className={cn(
                "p-1.5 rounded-xl transition-all duration-200",
                isActive ? "bg-[#22c55e]/10" : ""
              )}>
                <item.icon size={22} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default VendorBottomNav;
