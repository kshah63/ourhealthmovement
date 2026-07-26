/**
 * Seasonal eating data.
 *
 * Produce lists reflect a temperate (UK / Northern European) growing calendar —
 * the best guide for "eat local" will always be your own region and a nearby
 * market, so treat this as a well-informed starting point. The `/eat` page lets
 * visitors flip between Northern and Southern hemispheres (seasons offset by six
 * months); the produce itself is broadly shared across temperate climates.
 */

export type SeasonKey = 'spring' | 'summer' | 'autumn' | 'winter';

export interface Season {
  key: SeasonKey;
  name: string;
  tagline: string;
  months: { north: string; south: string };
  element: string; // TCM
  organ: string; // TCM organ network
  dosha: string; // Ayurveda
  quality: string; // energetic quality to balance
  guidance: string;
  favour: string[]; // ways of eating / cooking
  vegetables: string[];
  fruit: string[];
  accent: 'sage' | 'ochre' | 'terracotta' | 'clay';
}

export const seasons: Season[] = [
  {
    key: 'spring',
    name: 'Spring',
    tagline: 'Lighten & renew',
    months: { north: 'March – May', south: 'September – November' },
    element: 'Wood',
    organ: 'Liver & Gallbladder',
    dosha: 'Kapha rising',
    quality: 'Shake off winter’s heaviness with light, fresh, gently bitter foods.',
    guidance:
      'As the world wakes up, so does the body. Both Ayurveda and TCM see spring as a time for gentle lightening after winter’s rich, stored food — favour fresh greens, sprouts and bitter leaves that support the liver’s natural spring renewal. Cook a little less; eat a little lighter.',
    favour: ['Fresh leafy greens', 'Sprouted seeds & pulses', 'Bitter & astringent tastes', 'Lighter cooking — steaming, quick sautés'],
    vegetables: ['Asparagus', 'Purple sprouting broccoli', 'Spring greens', 'Radishes', 'Rocket', 'Watercress', 'Spring onions', 'Peas', 'New potatoes', 'Wild garlic'],
    fruit: ['Rhubarb', 'Late stored apples', 'First strawberries'],
    accent: 'sage',
  },
  {
    key: 'summer',
    name: 'Summer',
    tagline: 'Cool & hydrate',
    months: { north: 'June – August', south: 'December – February' },
    element: 'Fire',
    organ: 'Heart & Small Intestine',
    dosha: 'Pitta rising',
    quality: 'Balance the season’s heat with cooling, hydrating, water-rich foods.',
    guidance:
      'Summer runs hot — Pitta season in Ayurveda, the Fire element in TCM. The body asks for cooling and hydration: sweet, juicy fruit, crisp raw vegetables, mint and coriander, and lighter meals eaten earlier. This is the one season to lean into raw and cool rather than warm and heavy.',
    favour: ['Water-rich vegetables & fruit', 'Cooling herbs — mint, coriander, fennel', 'Salads & lightly cooked dishes', 'Sweet & slightly bitter tastes'],
    vegetables: ['Tomatoes', 'Courgettes', 'Cucumber', 'Lettuce', 'Runner beans', 'Sweetcorn', 'Peppers', 'Aubergine', 'Fennel', 'Fresh herbs'],
    fruit: ['Strawberries', 'Raspberries', 'Cherries', 'Peaches', 'Blackcurrants', 'Melon', 'Apricots'],
    accent: 'ochre',
  },
  {
    key: 'autumn',
    name: 'Autumn',
    tagline: 'Ground & gather',
    months: { north: 'September – November', south: 'March – May' },
    element: 'Metal',
    organ: 'Lungs & Large Intestine',
    dosha: 'Vata rising',
    quality: 'Steady the season’s dryness and wind with warm, moist, grounding food.',
    guidance:
      'As the air turns dry and cool, Vata rises — the body wants warmth, moisture and grounding. This is the season of the harvest: roots, squash, apples and pears. Move from raw toward cooked, from cool toward warm. Soups, roasts and stews return to the table, seasoned with warming spices.',
    favour: ['Roots & winter squash', 'Warm, moist cooking — soups, roasts, stews', 'Warming spices — ginger, cinnamon, cumin', 'Sweet, sour & salty tastes'],
    vegetables: ['Pumpkin & squash', 'Beetroot', 'Carrots', 'Leeks', 'Kale', 'Cavolo nero', 'Celeriac', 'Wild mushrooms', 'Parsnips', 'Brussels tops'],
    fruit: ['Apples', 'Pears', 'Plums', 'Blackberries', 'Quince', 'Elderberries'],
    accent: 'clay',
  },
  {
    key: 'winter',
    name: 'Winter',
    tagline: 'Warm & restore',
    months: { north: 'December – February', south: 'June – August' },
    element: 'Water',
    organ: 'Kidneys & Bladder',
    dosha: 'Vata & Kapha',
    quality: 'Conserve energy with deeply warming, nourishing, slow-cooked food.',
    guidance:
      'Winter is the year’s most inward season — a time to rest and restore reserves. TCM associates it with the Water element and the kidneys, our deep store of energy. Eat warm and slow-cooked: hearty stews, roasted roots, warming spices and the season’s gift of bright citrus to keep spirits and immunity up.',
    favour: ['Slow-cooked stews, broths & soups', 'Roasted roots & stored vegetables', 'Warming spices & bone or vegetable broths', 'Bright citrus for lift & vitamin C'],
    vegetables: ['Kale', 'Cabbage', 'Brussels sprouts', 'Swede', 'Celeriac', 'Leeks', 'Jerusalem artichoke', 'Chard', 'Stored roots', 'Cavolo nero'],
    fruit: ['Oranges & blood oranges', 'Satsumas', 'Lemons', 'Grapefruit', 'Stored apples & pears', 'Pomegranate'],
    accent: 'terracotta',
  },
];

/** Northern-hemisphere month (0–11) → season. Southern flips by two positions. */
export function seasonForMonth(month: number, hemisphere: 'north' | 'south' = 'north'): SeasonKey {
  const north: SeasonKey[] = [
    'winter', 'winter', 'spring', 'spring', 'spring', 'summer',
    'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter',
  ];
  const key = north[month % 12];
  if (hemisphere === 'north') return key;
  const flip: Record<SeasonKey, SeasonKey> = {
    spring: 'autumn', autumn: 'spring', summer: 'winter', winter: 'summer',
  };
  return flip[key];
}
