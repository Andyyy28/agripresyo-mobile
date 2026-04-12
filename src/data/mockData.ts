import { Commodity, Announcement, Vendor, ShopVendor } from '../types';

function generatePriceHistory(basePrice: number, volatility: number = 0.08): number[] {
  const points: number[] = [];
  let price = basePrice * (1 - volatility * 2);
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.45) * basePrice * volatility;
    price = Math.max(basePrice * 0.7, Math.min(basePrice * 1.3, price + change));
    points.push(Math.round(price * 100) / 100);
  }
  // Ensure the last point is close to current price
  points[29] = basePrice;
  return points;
}

// Replace images in /public/images/commodities/ with your own JPEG/PNG files
export const commodities: Commodity[] = [
  {
    id: '1',
    name: 'Pineapple',
    category: 'Fruits',
    price: 85,
    previousPrice: 80,
    percentChange: 6.25,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [80, 82, 81, 84, 83, 85],
    emoji: '🍍',
    unitWeight: 1.5,
    priceHistory: generatePriceHistory(85),
    image: '/images/commodities/pineapple.jpg',
  },
  {
    id: '2',
    name: 'Seedless Watermelon',
    category: 'Fruits',
    price: 120,
    previousPrice: 135,
    percentChange: -11.11,
    isInSeason: false,
    availability: 'Off Season',
    sparklineData: [135, 130, 128, 125, 122, 120],
    emoji: '🍉',
    unitWeight: 4.0,
    priceHistory: generatePriceHistory(120),
    image: '/images/commodities/watermelon.jpg',
  },
  {
    id: '3',
    name: 'Baguio Strawberries',
    category: 'Fruits',
    price: 450,
    previousPrice: 420,
    percentChange: 7.14,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [420, 430, 425, 440, 445, 450],
    emoji: '🍓',
    unitWeight: 0.25,
    priceHistory: generatePriceHistory(450),
    image: '/images/commodities/strawberries.jpg',
  },
  {
    id: '4',
    name: 'Hass Avocado',
    category: 'Fruits',
    price: 180,
    previousPrice: 175,
    percentChange: 2.86,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [175, 178, 176, 179, 182, 180],
    emoji: '🥑',
    unitWeight: 0.3,
    priceHistory: generatePriceHistory(180),
    image: '/images/commodities/avocado.jpg',
  },
  {
    id: '5',
    name: 'Davao Pomelo',
    category: 'Fruits',
    price: 150,
    previousPrice: 155,
    percentChange: -3.23,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [155, 153, 154, 152, 151, 150],
    emoji: '🍊',
    unitWeight: 1.2,
    priceHistory: generatePriceHistory(150),
    image: '/images/commodities/pomelo.jpg',
  },
  {
    id: '6',
    name: 'Carabao Mango',
    category: 'Fruits',
    price: 220,
    previousPrice: 200,
    percentChange: 10.0,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [200, 210, 205, 215, 218, 220],
    emoji: '🥭',
    unitWeight: 0.35,
    priceHistory: generatePriceHistory(220),
    image: '/images/commodities/mango.jpg',
  },
  {
    id: '7',
    name: 'Siling Labuyo',
    category: 'Spices',
    price: 600,
    previousPrice: 550,
    percentChange: 9.09,
    isInSeason: false,
    availability: 'Low Stock',
    sparklineData: [550, 570, 560, 580, 590, 600],
    emoji: '🌶️',
    unitWeight: 0.1,
    priceHistory: generatePriceHistory(600),
    image: '/images/commodities/siling-labuyo.jpg',
  },
  {
    id: '8',
    name: 'Red Onion',
    category: 'Spices',
    price: 180,
    previousPrice: 190,
    percentChange: -5.26,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [190, 185, 188, 184, 182, 180],
    emoji: '🧅',
    unitWeight: 0.15,
    priceHistory: generatePriceHistory(180),
    image: '/images/commodities/red-onion.jpg',
  },
  {
    id: '9',
    name: 'Yellow Ginger',
    category: 'Spices',
    price: 120,
    previousPrice: 115,
    percentChange: 4.35,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [115, 118, 116, 119, 121, 120],
    emoji: '🫚',
    unitWeight: 0.2,
    priceHistory: generatePriceHistory(120),
    image: '/images/commodities/ginger.jpg',
  },
  {
    id: '10',
    name: 'Granola Potato',
    category: 'Roots',
    price: 95,
    previousPrice: 100,
    percentChange: -5.0,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [100, 98, 99, 97, 96, 95],
    emoji: '🥔',
    unitWeight: 0.3,
    priceHistory: generatePriceHistory(95),
    image: '/images/commodities/potato.jpg',
  },
  {
    id: '11',
    name: 'Highland Carrots',
    category: 'Vegetables',
    price: 80,
    previousPrice: 75,
    percentChange: 6.67,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [75, 78, 76, 79, 81, 80],
    emoji: '🥕',
    unitWeight: 0.25,
    priceHistory: generatePriceHistory(80),
    image: '/images/commodities/carrots.jpg',
  },
  {
    id: '12',
    name: 'Pechay',
    category: 'Vegetables',
    price: 60,
    previousPrice: 65,
    percentChange: -7.69,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [65, 63, 64, 62, 61, 60],
    emoji: '🥬',
    unitWeight: 0.5,
    priceHistory: generatePriceHistory(60),
    image: '/images/commodities/pechay.jpg',
  },
  {
    id: '13',
    name: 'Sitaw',
    category: 'Vegetables',
    price: 70,
    previousPrice: 68,
    percentChange: 2.94,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [68, 70, 69, 71, 72, 70],
    emoji: '🫛',
    unitWeight: 0.3,
    priceHistory: generatePriceHistory(70),
    image: '/images/commodities/sitaw.jpg',
  },
  {
    id: '14',
    name: 'Native Tomato',
    category: 'Vegetables',
    price: 110,
    previousPrice: 120,
    percentChange: -8.33,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [120, 115, 118, 114, 112, 110],
    emoji: '🍅',
    unitWeight: 0.2,
    priceHistory: generatePriceHistory(110),
    image: '/images/commodities/tomato.jpg',
  },
  {
    id: '15',
    name: 'Okra',
    category: 'Vegetables',
    price: 50,
    previousPrice: 45,
    percentChange: 11.11,
    isInSeason: true,
    availability: 'In Season',
    sparklineData: [45, 48, 46, 49, 51, 50],
    emoji: '🥒',
    unitWeight: 0.15,
    priceHistory: generatePriceHistory(50),
    image: '/images/commodities/okra.jpg',
  }
];

export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'New Market Operating Hours',
    date: 'Apr 01, 2026',
    content: 'Starting next week, the market will open at 4:00 AM to accommodate more early morning deliveries.'
  },
  {
    id: '2',
    title: 'Agricultural Subsidy Program',
    date: 'Mar 28, 2026',
    content: 'Local government is offering seed subsidies for vegetable farmers in the region. Visit the market office for details.'
  }
];

const vendorColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function getVendorsForCommodity(commodity: Commodity): Vendor[] {
  const vendorNames = [
    { name: "NANAY CORING'S TROPICALS", initial: 'N' },
    { name: "MANG TOMAS FARM GOODS", initial: 'M' },
    { name: "ATE LOURDES PRODUCE", initial: 'A' },
    { name: "KUYA BERT'S HARVEST", initial: 'K' },
    { name: "ALING NENA'S GARDEN", initial: 'A' },
    { name: "TATAY DOMING AGRI", initial: 'T' },
    { name: "INAY ROSA'S FRESH PICKS", initial: 'I' },
    { name: "DON PEPE FARMS", initial: 'D' },
  ];

  // Use commodity id as seed for consistent vendor selection
  const seed = parseInt(commodity.id);
  const selectedVendors = [];

  for (let i = 0; i < 4; i++) {
    const vendorIndex = (seed + i * 3) % vendorNames.length;
    const vendor = vendorNames[vendorIndex];
    // Price varies ±15% from base price
    const priceVariation = 0.85 + (((seed * (i + 1) * 7) % 30) / 100);
    const price = Math.round(commodity.price * priceVariation * 100) / 100;

    selectedVendors.push({
      id: `v-${commodity.id}-${i}`,
      name: vendor.name,
      initial: vendor.initial,
      rating: Math.round((4.0 + ((seed * (i + 1)) % 10) / 10) * 10) / 10,
      reviewCount: 10 + ((seed * (i + 2) * 13) % 90),
      price: price,
      color: vendorColors[(seed + i) % vendorColors.length],
    });
  }

  // Sort by lowest price first
  return selectedVendors.sort((a, b) => a.price - b.price);
}

// Mock shop vendor data for the Shops tab
export const shopVendors: ShopVendor[] = [
  {
    id: 'sv-1',
    name: "Nanay Coring's Tropicals",
    initial: 'N',
    rating: 4.9,
    reviewCount: 42,
    location: 'Bankerohan',
    category: 'Fruits',
    isOpen: true,
    isNew: true,
    commodities: ['🥭', '🍍', '🍌', '🍊'],
    commodityIds: ['1', '3', '5', '6'], // Pineapple, Strawberries, Pomelo, Mango
  },
  {
    id: 'sv-2',
    name: "Tita Merly's Orchard",
    initial: 'T',
    rating: 4.7,
    reviewCount: 64,
    location: 'Agdao Market',
    category: 'Fruits',
    isOpen: true,
    isNew: false,
    commodities: ['🍓', '🥑', '🍇', '🍉'],
    commodityIds: ['2', '3', '4', '6'], // Watermelon, Strawberries, Avocado, Mango
  },
  {
    id: 'sv-3',
    name: "Aling Nena's Prutas",
    initial: 'A',
    rating: 4.8,
    reviewCount: 120,
    location: 'Uyanguren',
    category: 'Fruits',
    isOpen: false,
    isNew: false,
    commodities: ['🍍', '🥭', '🍊', '🍋'],
    commodityIds: ['1', '5', '6'], // Pineapple, Pomelo, Mango
  },
  {
    id: 'sv-4',
    name: 'Polomolok Fruit Stand',
    initial: 'P',
    rating: 4.8,
    reviewCount: 110,
    location: 'South Cotabato',
    category: 'Fruits',
    isOpen: true,
    isNew: true,
    commodities: ['🍌', '🍍', '🥥', '🥭'],
    commodityIds: ['1', '4', '6'], // Pineapple, Avocado, Mango
  },
  {
    id: 'sv-5',
    name: 'Alabel Farmers Market',
    initial: 'A',
    rating: 4.9,
    reviewCount: 342,
    location: 'Sarangani',
    category: 'Vegetables',
    isOpen: true,
    isNew: false,
    commodities: ['🥕', '🥬', '🍅', '🫛'],
    commodityIds: ['11', '12', '13', '14', '15'], // Carrots, Pechay, Sitaw, Tomato, Okra
  },
  {
    id: 'sv-6',
    name: 'GenSan Market Hub',
    initial: 'G',
    rating: 4.8,
    reviewCount: 120,
    location: 'General Santos City',
    category: 'Vegetables',
    isOpen: true,
    isNew: true,
    commodities: ['🧅', '🥔', '🌶️', '🥕'],
    commodityIds: ['7', '8', '9', '10', '11', '14'], // Siling, Onion, Ginger, Potato, Carrots, Tomato
  },
  {
    id: 'sv-7',
    name: 'Cotabato Agri-Trading',
    initial: 'C',
    rating: 4.7,
    reviewCount: 240,
    location: 'Cotabato City',
    category: 'Vegetables',
    isOpen: false,
    isNew: false,
    commodities: ['🥬', '🫚', '🧄', '🍅'],
    commodityIds: ['9', '12', '14', '15'], // Ginger, Pechay, Tomato, Okra
  },
  {
    id: 'sv-8',
    name: 'Koronadal Fresh Veggies',
    initial: 'K',
    rating: 4.6,
    reviewCount: 85,
    location: 'Koronadal City',
    category: 'Vegetables',
    isOpen: true,
    isNew: false,
    commodities: ['🫛', '🥒', '🥬', '🥕'],
    commodityIds: ['11', '12', '13', '15'], // Carrots, Pechay, Sitaw, Okra
  },
];

// Get shop vendors that carry a specific commodity, with dynamic pricing
export function getShopVendorsForCommodity(commodity: Commodity) {
  const matchingVendors = shopVendors.filter(
    v => v.commodityIds?.includes(commodity.id)
  );

  return matchingVendors.map(v => {
    // Generate a consistent price variation based on vendor + commodity id
    const seed = parseInt(v.id.replace('sv-', '')) * parseInt(commodity.id);
    const variation = 0.9 + ((seed * 7) % 20) / 100; // 90% to 110%
    const price = Math.round(commodity.price * variation * 100) / 100;
    return {
      ...v,
      dynamicPrice: price,
    };
  }).sort((a, b) => a.dynamicPrice - b.dynamicPrice);
}
