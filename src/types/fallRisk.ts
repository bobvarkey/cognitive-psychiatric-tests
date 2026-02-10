export interface FallRiskItem {
  id: string;
  question: string;
  questionMl: string;
  points: number;
  explanation?: string;
  explanationMl?: string;
}

export interface MorseItem {
  id: string;
  name: string;
  nameMl: string;
  options: {
    label: string;
    labelMl: string;
    value: number;
  }[];
}

export interface SteadiItem {
  id: string;
  question: string;
  questionMl: string;
  points: number;
  explanation: string;
  explanationMl: string;
}

export interface FallRiskResponse {
  steadi: Record<string, boolean>;
  morse: Record<string, number>;
  tug: number | null;
  chairStand: number | null;
  balanceTest: {
    stage1: boolean;
    stage2: boolean;
    stage3: boolean;
    stage4: boolean;
  };
  fallHistory: {
    fellPastYear: boolean;
    numberOfFalls: number;
    wasInjured: boolean;
  };
  threeKeyQuestions: {
    unsteady: boolean;
    worriedAboutFalling: boolean;
    fallenPastYear: boolean;
  };
}

export interface FallRiskResult {
  steadiScore: number;
  steadiAtRisk: boolean;
  morseScore: number;
  morseRiskLevel: 'no_risk' | 'low_risk' | 'high_risk';
  tugAtRisk: boolean;
  chairStandAtRisk: boolean;
  balanceAtRisk: boolean;
  overallRiskLevel: 'low' | 'moderate' | 'high';
  recommendations: string[];
  recommendationsMl: string[];
  interpretation: string;
  interpretationMl: string;
}
