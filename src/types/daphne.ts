export interface DaphneItem {
  id: string;
  domain: string;
  title: string;
  descriptions: {
    normal: string;
    veryMild: string;
    mild: string;
    moderate: string;
    severe: string;
  };
}

export interface DaphneResponse {
  itemId: string;
  score: number; // 0-4
}

export interface DaphneResults {
  responses: DaphneResponse[];
  daphne6Score: number; // 0-6 screening score
  daphne40Score: number; // 0-40 diagnostic score
  domainScores: Record<string, number>;
}

export const DAPHNE_DOMAINS = [
  'disinhibition',
  'apathy', 
  'empathy',
  'perseverations',
  'hyperorality',
  'neglect'
] as const;

export type DaphneDomain = typeof DAPHNE_DOMAINS[number];