import { Timestamp } from 'firebase/firestore';

export interface Cheese {
  id: string;
  nom: string;
  origine: string;
  typeLait?: string;
  pate?: string;
  affinage?: string;
  notes?: string[];
  imageUrl?: string;
  description?: string;
}

export interface FeaturedSection {
  id: string;
  title: string;
  subtitle?: string;
  active: boolean;
  updatedAt: Timestamp;
  updatedBy?: string;
}

export interface CheeseOfTheWeek extends FeaturedSection {
  cheeseId: string;
}

export interface TrendingCheeses extends FeaturedSection {
  cheeseIds: string[];
  maxCount: number;
}

export interface NewCheeses extends FeaturedSection {
  cheeseIds: string[];
  maxCount: number;
}

export interface FeaturedContent {
  cheeseOfTheWeek?: CheeseOfTheWeek;
  trendingCheeses?: TrendingCheeses;
  newCheeses?: NewCheeses;
}

// Interfaces pour les actualités Fromiznews
export interface FromizActu {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: 'production' | 'événement' | 'découverte' | 'conseil' | 'actualité';
  publishDate: Date;
  author: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
}

export interface NewsConfig {
  maxDisplayCount: number;
  showFeaturedOnly: boolean;
  active: boolean;
  updatedAt: Date;
  updatedBy: string;
}
