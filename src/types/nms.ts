export interface NmsItem {
  id: string;
  name: string;
  nameMl: string;
  description: string;
  descriptionMl: string;
  category: 'temperature' | 'extrapyramidal' | 'autonomic' | 'consciousness' | 'catatonia' | 'laboratory';
  maxScore: number;
  scoringGuide: Record<number, string>;
  scoringGuideMl: Record<number, string>;
}

export interface NmsResponse {
  scores: Record<string, number>;
  ratingPeriod: 'wholeDay' | 'oneTimePoint';
}

export interface NmsResults {
  totalScore: number;
  maxScore: number;
  categoryScores: {
    temperature: number;
    extrapyramidal: number;
    autonomic: number;
    consciousness: number;
    catatonia: number;
    laboratory: number;
  };
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  diagnosticCategory: 'noNms' | 'possibleNms' | 'definiteNms';
  domainsWithScore2OrMore: number;
  meetsStrongDiagnosticCriteria: boolean;
  interpretation: string;
  interpretationMl: string;
  recommendations: string[];
  recommendationsMl: string[];
}
