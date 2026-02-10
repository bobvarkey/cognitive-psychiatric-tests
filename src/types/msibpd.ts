export type MsiBpdScore = 0 | 1;

export interface MsiBpdItem {
  id: number;
  question: string;
  questionMl: string;
}

export interface MsiBpdResponse {
  itemId: number;
  score: MsiBpdScore;
}

export interface MsiBpdResult {
  responses: MsiBpdResponse[];
  totalScore: number;
  interpretation: string;
  severity: 'not-consistent' | 'further-evaluation' | 'above-cutoff';
}
