export type FabScore = 0 | 1 | 2 | 3;

export interface FabItem {
  id: number;
  domain: string;
  domainMl: string;
  task: string;
  taskMl: string;
  instruction: string;
  instructionMl: string;
  scoring: {
    score: FabScore;
    criteria: string;
    criteriaMl: string;
  }[];
}

export interface FabResponse {
  itemId: number;
  score: FabScore;
}

export interface FabResult {
  responses: FabResponse[];
  totalScore: number;
  interpretation: string;
  severity: 'severe-impairment' | 'moderate-impairment' | 'mild-impairment' | 'normal';
}
