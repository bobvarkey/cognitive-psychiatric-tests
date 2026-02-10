export interface MocaItem {
  id: string;
  domain: MocaDomain;
  title: string;
  description: string;
  type: 'visual' | 'verbal' | 'numeric' | 'drawing' | 'recall';
  maxScore: number;
  instructions?: string;
  imageUrl?: string;
}

export interface MocaResponse {
  itemId: string;
  score: number;
}

export interface MocaResults {
  responses: MocaResponse[];
  totalScore: number; // 0-30
  domainScores: Record<MocaDomain, number>;
  interpretation: string;
  educationAdjusted: boolean;
  finalScore: number; // after education adjustment
}

export const MOCA_DOMAINS = [
  'visuospatial',
  'naming', 
  'memory',
  'attention',
  'language',
  'abstraction',
  'delayedRecall',
  'orientation'
] as const;

export type MocaDomain = typeof MOCA_DOMAINS[number];

export const MOCA_DOMAIN_MAX_SCORES: Record<MocaDomain, number> = {
  visuospatial: 5,
  naming: 3,
  memory: 5,
  attention: 6,
  language: 3,
  abstraction: 2,
  delayedRecall: 5,
  orientation: 6
};