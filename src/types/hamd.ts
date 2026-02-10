export type HamdScore = 0 | 1 | 2 | 3 | 4;

export interface HamdItem {
  id: number;
  question: string;
  questionMl: string;
  maxScore: 2 | 3 | 4;
  options: string[];
  optionsMl: string[];
}

export interface HamdResponse {
  itemId: number;
  score: HamdScore;
}

export interface HamdResult {
  responses: HamdResponse[];
  totalScore: number;
  interpretation: string;
  severity: 'normal' | 'mild' | 'moderate' | 'severe' | 'very-severe';
}
