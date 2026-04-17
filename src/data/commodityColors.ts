/**
 * Commodity color mapping for dynamic light/dark themed backgrounds.
 * Maps commodity slug → { lightBg, darkBg } Tailwind class strings.
 * Consistent with the colors defined in mockData.ts commodities.
 */

export interface CommodityColorPair {
  lightBg: string;
  darkBg: string;
}

const commodityColorMap: Record<string, CommodityColorPair> = {
  // Fruits
  pineapple:   { lightBg: 'bg-[#fef9c3]', darkBg: 'bg-[#2a2518]' },   // yellow
  watermelon:  { lightBg: 'bg-[#fce7f3]', darkBg: 'bg-[#2a1520]' },   // pink
  strawberry:  { lightBg: 'bg-[#fee2e2]', darkBg: 'bg-[#2a1515]' },   // red
  avocado:     { lightBg: 'bg-[#dcfce7]', darkBg: 'bg-[#152a18]' },   // green
  pomelo:      { lightBg: 'bg-[#ffedd5]', darkBg: 'bg-[#2a1f15]' },   // orange
  mango:       { lightBg: 'bg-[#fef3c7]', darkBg: 'bg-[#2a2415]' },   // amber

  // Spices
  chili:       { lightBg: 'bg-[#fee2e2]', darkBg: 'bg-[#2a1515]' },   // red
  onion:       { lightBg: 'bg-[#f3e8ff]', darkBg: 'bg-[#1f152a]' },   // purple
  ginger:      { lightBg: 'bg-[#fef3c7]', darkBg: 'bg-[#2a2415]' },   // amber

  // Vegetables
  carrot:      { lightBg: 'bg-[#ffedd5]', darkBg: 'bg-[#2a1f15]' },   // orange
  pechay:      { lightBg: 'bg-[#dcfce7]', darkBg: 'bg-[#152a18]' },   // green
  sitaw:       { lightBg: 'bg-[#dcfce7]', darkBg: 'bg-[#152a18]' },   // green
  tomato:      { lightBg: 'bg-[#fee2e2]', darkBg: 'bg-[#2a1515]' },   // red
  okra:        { lightBg: 'bg-[#dcfce7]', darkBg: 'bg-[#152a18]' },   // green

  // Roots
  potato:      { lightBg: 'bg-[#fef3c7]', darkBg: 'bg-[#2a2415]' },   // amber
};

// Fallback for unknown slugs
const defaultColors: CommodityColorPair = {
  lightBg: 'bg-[#f3f4f6]',
  darkBg: 'bg-[#1a1a1e]',
};

/**
 * Get the themed background class for a commodity.
 * @param slug - commodity slug (e.g. 'mango', 'tomato')
 * @param isDark - current theme mode
 * @returns Tailwind background class string
 */
export function getCommodityBg(slug: string, isDark: boolean): string {
  const colors = commodityColorMap[slug] || defaultColors;
  return isDark ? colors.darkBg : colors.lightBg;
}

/**
 * Get both light and dark background classes for a commodity.
 * @param slug - commodity slug
 * @returns CommodityColorPair with lightBg and darkBg classes
 */
export function getCommodityColors(slug: string): CommodityColorPair {
  return commodityColorMap[slug] || defaultColors;
}

/**
 * Map commodity display names to their slugs.
 */
const nameToSlugMap: Record<string, string> = {
  'Carabao Mango': 'mango',
  'Pineapple': 'pineapple',
  'Baguio Strawberries': 'strawberry',
  'Hass Avocado': 'avocado',
  'Seedless Watermelon': 'watermelon',
  'Davao Pomelo': 'pomelo',
  'Red Onion': 'onion',
  'Siling Labuyo': 'chili',
  'Yellow Ginger': 'ginger',
  'Highland Carrots': 'carrot',
  'Pechay': 'pechay',
  'Native Tomato': 'tomato',
  'Sitaw': 'sitaw',
  'Okra': 'okra',
  'Granola Potato': 'potato',
};

/**
 * Resolve a commodity name to its slug.
 * @param name - commodity display name (e.g. 'Carabao Mango')
 * @returns slug string (e.g. 'mango')
 */
export function getSlugFromName(name: string): string {
  return nameToSlugMap[name] || name.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Get the themed background class for a commodity by its display name.
 * @param name - commodity display name
 * @param isDark - current theme mode
 * @returns Tailwind background class string
 */
export function getCommodityBgByName(name: string, isDark: boolean): string {
  const slug = getSlugFromName(name);
  return getCommodityBg(slug, isDark);
}
