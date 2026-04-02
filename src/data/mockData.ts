import { Commodity, Announcement } from '../types';

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
    emoji: '🍍'
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
    emoji: '🍉'
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
    emoji: '🍓'
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
    emoji: '🥑'
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
    emoji: '🍊'
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
    emoji: '🥭'
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
    emoji: '🌶️'
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
    emoji: '🧅'
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
    emoji: '🫚'
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
    emoji: '🥔'
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
    emoji: '🥕'
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
    emoji: '🥬'
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
    emoji: '🫛'
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
    emoji: '🍅'
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
    emoji: '🥒'
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
