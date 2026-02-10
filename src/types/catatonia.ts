export interface CatatoniaItem {
  id: string;
  number: number;
  name: string;
  nameMl: string;
  description: string;
  descriptionMl: string;
  isScreening: boolean;
  scoringGuide: {
    0: string;
    1: string;
    2: string;
    3: string;
  };
  scoringGuideMl: {
    0: string;
    1: string;
    2: string;
    3: string;
  };
}

export interface CatatoniaResponse {
  scores: Record<string, number>;
}

export interface CatatoniaResults {
  screeningScore: number;
  totalScore: number;
  positiveItems: string[];
  screeningPositive: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  interpretation: string;
  interpretationMl: string;
  recommendations: string[];
  recommendationsMl: string[];
}
