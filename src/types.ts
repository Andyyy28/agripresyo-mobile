export type Category = 'Fruits' | 'Vegetables' | 'Spices' | 'Roots';

export type UserRole = 'consumer' | 'vendor';

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

export interface Commodity {
  id: string;
  name: string;
  category: Category;
  price: number;
  previousPrice: number;
  percentChange: number;
  isInSeason: boolean;
  availability: 'In Season' | 'Off Season' | 'Low Stock';
  sparklineData: number[];
  emoji: string;
  unitWeight: number; // kg per unit
  priceHistory: number[];
}

export interface Vendor {
  id: string;
  name: string;
  initial: string;
  rating: number;
  reviewCount: number;
  price: number;
  color: string;
}

export interface AssetItem {
  commodityId: string;
  quantity: number;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
}
