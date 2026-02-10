export interface HareItem {
  id: string;
  factor: 'interpersonal-affective' | 'lifestyle-antisocial';
  question: string;
  questionMl?: string;
}

export interface HareResponse {
  itemId: string;
  score: number; // 0-2
}

export interface HareResults {
  responses: HareResponse[];
  totalScore: number; // 0-40
  factor1Score: number; // Interpersonal/Affective (0-16)
  factor2Score: number; // Lifestyle/Antisocial (0-20)
  interpretation: string;
}

export const HARE_FACTORS = [
  'interpersonal-affective',
  'lifestyle-antisocial'
] as const;

export type HareFactor = typeof HARE_FACTORS[number];
