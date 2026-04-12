import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  emoji: string;
  category?: string;
  unit?: string;
  availability?: 'in_stock' | 'out_of_stock';
}

interface InventoryContextType {
  inventory: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  totalStock: number;
  lowStockCount: number;
  totalValue: number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const INVENTORY_STORAGE_KEY = 'agripresyo_inventory';

const defaultInventory: InventoryItem[] = [
  { id: '1', name: 'Carabao Mango', stock: 45, price: 220, emoji: '🥭', category: 'Fruits', unit: 'kg', availability: 'in_stock' },
  { id: '2', name: 'Pineapple', stock: 8, price: 85, emoji: '🍍', category: 'Fruits', unit: 'kg', availability: 'in_stock' },
  { id: '3', name: 'Red Onion', stock: 120, price: 180, emoji: '🧅', category: 'Spices', unit: 'kg', availability: 'in_stock' },
  { id: '4', name: 'Siling Labuyo', stock: 5, price: 600, emoji: '🌶️', category: 'Spices', unit: 'kg', availability: 'in_stock' },
  { id: '5', name: 'Highland Carrots', stock: 60, price: 80, emoji: '🥕', category: 'Vegetables', unit: 'kg', availability: 'in_stock' },
  { id: '6', name: 'Native Tomato', stock: 3, price: 110, emoji: '🍅', category: 'Vegetables', unit: 'kg', availability: 'in_stock' },
];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(INVENTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultInventory;
    } catch {
      return defaultInventory;
    }
  });

  useEffect(() => {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(inventory));
  }, [inventory]);

  const addItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
    };
    setInventory(prev => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setInventory(prev => prev.filter(item => item.id !== id));
  }, []);

  const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = inventory.filter(item => item.stock < 10).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);

  return (
    <InventoryContext.Provider value={{ inventory, addItem, updateItem, deleteItem, totalStock, lowStockCount, totalValue }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
