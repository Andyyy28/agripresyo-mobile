import React from 'react';
import ConsumerBottomNav from './ConsumerBottomNav';
import VendorBottomNav from './VendorBottomNav';

interface LayoutProps {
  children: React.ReactNode;
  variant: 'consumer' | 'vendor';
}

const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex justify-center">
      <div className="w-full max-w-[430px] bg-[#0a0a0a] relative flex flex-col min-h-screen pb-20 shadow-2xl border-x border-[#1f1f23]">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        {variant === 'consumer' ? <ConsumerBottomNav /> : <VendorBottomNav />}
      </div>
    </div>
  );
};

export default Layout;
