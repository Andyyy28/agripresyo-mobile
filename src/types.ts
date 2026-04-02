export type Category = 'Fruits' | 'Vegetables' | 'Spices' | 'Roots';

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
