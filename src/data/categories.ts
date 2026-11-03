import { Category, CategoryInfo } from '../types';

export interface CategoryGraphic {
  id: Category;
  number: string;
  name: string;
  shortTitle: string;
  tagline: string;
  color: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  description: string;
  editorialAnnotation: string;
}

export const CATEGORIES: (CategoryInfo & { number: string; editorialAnnotation: string })[] = [
  {
    id: 'FAKE_NEWS',
    number: '01',
    name: 'FAKE NEWS',
    shortTitle: 'Fake News',
    tagline: 'Fabricated headlines & missing sources',
    color: '#2563EB', // Electric Blue
    accentColor: '#60A5FA',
    bgColor: '#1E293B',
    textColor: '#FFFFFF',
    borderColor: '#3B82F6',
    iconName: 'Newspaper',
    editorialAnnotation: 'SOURCING & BYLINE VERIFICATION',
    description: 'Deconstruct fabricated articles, fake news anchors, missing reporter bylines, and recycled catastrophe photos taken years ago.'
  },
  {
    id: 'FAKE_PRODUCTS',
    number: '02',
    name: 'FAKE PRODUCTS',
    shortTitle: 'Fake Products',
    tagline: 'Deceptive storefronts & miracle claims',
    color: '#EC4899', // Pink / Magenta
    accentColor: '#F472B6',
    bgColor: '#1E293B',
    textColor: '#FFFFFF',
    borderColor: '#EC4899',
    iconName: 'ShoppingBag',
    editorialAnnotation: 'ECOMMERCE FORENSICS & SCAMS',
    description: 'Detect 95% discount traps, bot-farmed 5-star reviews, stolen Kickstarter photos, and products claiming to bend the laws of physics.'
  },
  {
    id: 'RUMOURS_GOSSIP',
    number: '03',
    name: 'RUMOURS & GOSSIP',
    shortTitle: 'Rumours & Gossip',
    tagline: 'Chat leaks, whispers & unverified claims',
    color: '#8B5CF6', // Violet
    accentColor: '#A78BFA',
    bgColor: '#1E293B',
    textColor: '#FFFFFF',
    borderColor: '#8B5CF6',
    iconName: 'MessageSquareWarning',
    editorialAnnotation: 'VIRAL CHAT ANALYSIS & SPECULATION',
    description: 'Understand how easily group chat screenshots are faked with web generators, and why breaking the forwarding chain protects innocent peers.'
  },
  {
    id: 'RAGEBAIT',
    number: '04',
    name: 'RAGEBAIT',
    shortTitle: 'Ragebait',
    tagline: 'Engineered outrage & engagement traps',
    color: '#F97316', // Orange / Flame
    accentColor: '#FB923C',
    bgColor: '#1E293B',
    textColor: '#FFFFFF',
    borderColor: '#F97316',
    iconName: 'Flame',
    editorialAnnotation: 'ALGORITHMIC OUTRAGE HARVESTING',
    description: 'Spot manipulative posts engineered to make your blood boil so you leave an angry comment—which rewards the creator with ad money.'
  },
  {
    id: 'FACT_CHECK',
    number: '05',
    name: 'FACT CHECK',
    shortTitle: 'Fact Check',
    tagline: 'Reverse search & lateral verification',
    color: '#10B981', // Emerald
    accentColor: '#34D399',
    bgColor: '#1E293B',
    textColor: '#FFFFFF',
    borderColor: '#10B981',
    iconName: 'SearchCheck',
    editorialAnnotation: 'LATERAL READING & VERIFICATION TOOLKIT',
    description: 'Master the pro fact-checker toolkit: reverse image lookups, inspecting domain endings, and opening new tabs to read across neutral sources.'
  },
  {
    id: 'MYSTERY_ROUND',
    number: '06',
    name: 'MYSTERY ROUND',
    shortTitle: 'Mystery Round',
    tagline: 'Wildcard challenge with bonus points',
    color: '#6366F1', // Indigo / Wildcard
    accentColor: '#818CF8',
    bgColor: '#1E293B',
    textColor: '#FFFFFF',
    borderColor: '#6366F1',
    iconName: 'Sparkles',
    editorialAnnotation: 'ADVANCED WILDCARD SCENARIOS',
    description: 'A surprise wildcard selected from real-world digital dilemma scenarios. Watch out for deepfakes, AI voice clones, and subtle manipulation!'
  }
];

export const CATEGORY_MAP: Record<Category, typeof CATEGORIES[0]> = CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.id] = cat;
    return acc;
  },
  {} as Record<Category, typeof CATEGORIES[0]>
);
