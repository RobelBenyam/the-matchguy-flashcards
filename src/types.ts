export interface CardContent {
  text?: string;
  images?: string[];
  videos?: string[];
  tables?: string[][][];
  formulas?: string[];
}

export interface Card {
  id: string;
  front: string | CardContent;
  back: string | CardContent;
  createdAt: number;
  lastReviewed?: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  cardCount: number;
  color: string;
}
