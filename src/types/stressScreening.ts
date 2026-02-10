export interface StressScreeningItem {
  id: string;
  category: 'stressor' | 'duration' | 'severity' | 'impairment' | 'qualitative' | 'mse';
  question: string;
  questionMl: string;
  redFlag?: boolean; // indicates a finding suggestive of mental disorder
}

export interface StressScreeningResponse {
  [itemId: string]: boolean | null;
}

export interface StressScreeningResult {
  totalRedFlags: number;
  redFlagsByCategory: Record<string, string[]>;
  likelihood: 'low' | 'moderate' | 'high';
  interpretation: string;
  interpretationMl: string;
  recommendations: string[];
  recommendationsMl: string[];
}
