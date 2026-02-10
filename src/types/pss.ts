export type PssScore = 0 | 1 | 2 | 3 | 4;

export interface PssItem {
  id: number;
  question: string;
  questionMl: string;
  isReversed: boolean;
}

export interface PssResponse {
  itemId: number;
  score: PssScore;
}

export interface PssResult {
  responses: PssResponse[];
  totalScore: number;
  interpretation: string;
  severity: 'low' | 'moderate' | 'high';
}
