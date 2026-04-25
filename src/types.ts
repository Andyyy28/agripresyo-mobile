export type Category = 'Fruits' | 'Vegetables' | 'Spices' | 'Roots';

export type UserRole = 'consumer' | 'vendor';

export type AuthMethod = 'email' | 'google' | 'facebook';

export type VerificationStatus = 'none' | 'pending' | 'verified';

export interface ShopProfile {
  shopName: string;
  specialty: string;
  location: string;
  description: string;
  openTime: string;
  closeTime: string;
}

export interface User {
  email: string;
  name: string;
  role: UserRole;
  authMethod: AuthMethod;
  shopName?: string;
  marketLocation?: string;
  isVerified?: boolean;
  verificationStatus?: VerificationStatus;
  shopProfile?: ShopProfile;
}

export interface Commodity {
  id: string;
  name: string;
  slug: string;
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
  // Replace images in /public/images/commodities/ with your own JPEG/PNG files
  image: string;
  lightBgColor: string;
  darkBgColor: string;
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

export interface ShopVendor {
  id: string;
  name: string;
  initial: string;
  rating: number;
  reviewCount: number;
  location: string;
  category: 'Fruits' | 'Vegetables' | 'Spices';
  isOpen: boolean;
  isNew: boolean;
  commodities: string[]; // emoji list
  commodityIds?: string[]; // commodity ID mapping for dynamic filtering
}

export interface AssetItem {
  commodityId: string;
  quantity: number;
  mode?: 'qty' | 'kg'; // 'qty' = whole units, 'kg' = decimal kg
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
