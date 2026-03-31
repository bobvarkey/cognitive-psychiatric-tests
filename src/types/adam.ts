export type AdamLikertScore = 0 | 1 | 2 | 3;

export type AdamItemType = 'likert' | 'bdi';

export interface AdamLikertOption {
  value: number;
  label: string;
  labelMl: string;
}

export interface AdamBdiOption {
  value: number;
  label: string;
  labelMl: string;
}

export interface AdamItem {
  id: number;
  text: string;
  textMl: string;
  type: AdamItemType;
  domain: 'apathy-behavioural' | 'apathy-social' | 'apathy-emotional' | 'anhedonia' | 'depression';
  domainLabel: string;
  domainLabelMl: string;
  reverseScored: boolean;
  options?: AdamBdiOption[];
}

export interface AdamResponse {
  itemId: number;
  score: number;
}

export interface AdamDemographics {
  age: string;
  gender: string;
  educationLevel: string;
  yearsOfEducation: string;
  takingAntidepressants: string;
}

export interface AdamResult {
  responses: AdamResponse[];
  totalScore: number;
  apathyScore: number;
  depressionScore: number;
  anhedoniaScore: number;
  domainScores: {
    apathyBehavioural: number;
    apathySocial: number;
    apathyEmotional: number;
    anhedonia: number;
    depression: number;
  };
  interpretation: string;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
}
