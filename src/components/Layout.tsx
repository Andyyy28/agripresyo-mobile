import React from 'react';
import BottomNav from './BottomNav';
import PriceTicker from './PriceTicker';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex justify-center">
      <div className="w-full max-w-[430px] bg-[#0a0a0a] relative flex flex-col min-h-screen pb-20 shadow-2xl border-x border-[#1f1f23]">
        <PriceTicker />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default Layout;
