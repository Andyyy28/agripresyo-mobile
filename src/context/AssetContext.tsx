import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AssetItem } from '../types';

interface AssetContextType {
  assets: AssetItem[];
  liquidity: number;
  addAsset: (commodityId: string) => void;
  removeAsset: (commodityId: string) => void;
  updateQuantity: (commodityId: string, quantity: number) => void;
  setLiquidity: (amount: number) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [liquidity, setLiquidityState] = useState<number>(1000);

  const addAsset = useCallback((commodityId: string) => {
    setAssets(prev => {
      const existing = prev.find(a => a.commodityId === commodityId);
      if (existing) {
        return prev.map(a =>
          a.commodityId === commodityId
            ? { ...a, quantity: a.quantity + 1 }
            : a
        );
      }
      return [...prev, { commodityId, quantity: 1 }];
    });
  }, []);

  const removeAsset = useCallback((commodityId: string) => {
    setAssets(prev => prev.filter(a => a.commodityId !== commodityId));
  }, []);

  const updateQuantity = useCallback((commodityId: string, quantity: number) => {
    if (quantity <= 0) {
      setAssets(prev => prev.filter(a => a.commodityId !== commodityId));
      return;
    }
    setAssets(prev =>
      prev.map(a =>
        a.commodityId === commodityId ? { ...a, quantity } : a
      )
    );
  }, []);

  const setLiquidity = useCallback((amount: number) => {
    setLiquidityState(Math.max(0, amount));
  }, []);

  return (
    <AssetContext.Provider value={{ assets, liquidity, addAsset, removeAsset, updateQuantity, setLiquidity }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = (): AssetContextType => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};
