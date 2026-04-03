import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingCart, Package, Bell, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VendorBottomNav: React.FC = () => {
  const navItems = [
    { to: '/vendor/market', icon: ShoppingCart, label: 'Market' },
    { to: '/vendor/inventory', icon: Package, label: 'Inventory' },
    { to: '/vendor/notifications', icon: Bell, label: 'Alerts' },
    { to: '/vendor/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#111114]/95 backdrop-blur-xl border-t border-[#1f1f23] px-6 py-3 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 transition-all duration-200 px-3 py-1',
              isActive ? 'text-[#22c55e]' : 'text-[#71717a]'
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
