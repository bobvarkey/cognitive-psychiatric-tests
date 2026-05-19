export type HamaScore = 0 | 1 | 2 | 3 | 4;

export interface HamaItem {
  id: number;
  title: string;
  titleMl: string;
  description: string;
  descriptionMl: string;
}

export interface HamaResponse {
  itemId: number;
  score: HamaScore;
}

export interface HamaResult {
  responses: HamaResponse[];
  totalScore: number;
  interpretation: string;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
}
