import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AssetItem } from '../types';

interface AssetContextType {
  assets: AssetItem[];
  liquidity: number;
  addAsset: (commodityId: string) => void;
  removeAsset: (commodityId: string) => void;
  updateQuantity: (commodityId: string, quantity: number) => void;
  setLiquidity: (amount: number) => void;
  toggleMode: (commodityId: string) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [liquidityState, setLiquidityState] = useState<number>(1000);

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
      return [...prev, { commodityId, quantity: 1, mode: 'qty' }];
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

  const toggleMode = useCallback((commodityId: string) => {
    setAssets(prev =>
      prev.map(a => {
        if (a.commodityId !== commodityId) return a;
        const currentMode = a.mode || 'qty';
        if (currentMode === 'qty') {
          // Switching to KG: convert units to kg (quantity * unitWeight handled by caller)
          // Reset to a sensible default kg value
          return { ...a, mode: 'kg', quantity: 0.5 };
        } else {
          // Switching to QTY: reset to 1 unit
          return { ...a, mode: 'qty', quantity: 1 };
        }
      })
    );
  }, []);

  return (
    <AssetContext.Provider value={{ assets, liquidity: liquidityState, addAsset, removeAsset, updateQuantity, setLiquidity, toggleMode }}>
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
