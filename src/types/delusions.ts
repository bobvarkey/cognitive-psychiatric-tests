export interface DelusionItem {
  id: string;
  section: 'Delusions' | 'Hallucinations';
  category: string;
  type: string;
  typeMl: string;
  description: string;
  descriptionMl: string;
  familiarity?: 'Hypofamiliarity' | 'Hyperfamiliarity';
  image?: string;
}

export interface DelusionResponse {
  itemId: string;
  present: boolean;
  severity?: number; // 1-3 (mild, moderate, severe)
}

export interface DelusionResults {
  responses: DelusionResponse[];
  totalPresent: number;
  categoriesAffected: string[];
  severityScore: number;
  delusionTypes: string[];
}

export const DELUSION_CATEGORIES = [
  'Misidentification Syndromes',
  'Content-Based Delusions',
  'Control & Influence Delusions',
  'Grandiose & Religious',
  'Somatic & Hypochondriacal',
  'Visual Hallucinations'
] as const;

export type DelusionCategory = typeof DELUSION_CATEGORIES[number];
