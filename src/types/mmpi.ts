export interface MmpiItem {
  id: string;
  scale: string;
  scaleAbbr: string;
  statement: string;
  statementMl: string;
}

export interface MmpiResponse {
  itemId: string;
  answer: boolean | null; // true = True, false = False, null = not answered
}

export interface MmpiResults {
  responses: MmpiResponse[];
  trueCount: number;
  riskLevel: 'low' | 'mild' | 'high';
  actionRecommendation: string;
  flaggedScales: string[];
}
