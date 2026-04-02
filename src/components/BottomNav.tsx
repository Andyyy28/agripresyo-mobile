import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, Store, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/market', icon: BarChart2, label: 'Market' },
    { to: '/vendor', icon: Store, label: 'Vendors' },
    { to: '/analytics', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[#111114] border-t border-[#1f1f23] px-6 py-3 flex justify-between items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center gap-1 transition-colors duration-200',
              isActive ? 'text-[#22c55e]' : 'text-[#71717a]'
            )
          }
        >
          <item.icon size={24} />
          <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
