import React from 'react';
import ConsumerBottomNav from './ConsumerBottomNav';
import VendorBottomNav from './VendorBottomNav';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  variant: 'consumer' | 'vendor';
}

const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen font-sans flex justify-center ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8faf8] text-[#111827]'}`}>
      <div className={`w-full max-w-[430px] relative flex flex-col min-h-screen pb-20 shadow-2xl border-x ${isDark ? 'bg-[#0a0a0a] border-[#1f1f23]' : 'bg-[#f8faf8] border-[#e5e7eb]'}`}>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        {variant === 'consumer' ? <ConsumerBottomNav /> : <VendorBottomNav />}
      </div>
    </div>
  );
};

export default Layout;
