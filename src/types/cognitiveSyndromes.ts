export interface CognitiveSyndrome {
  id: string;
  name: string;
  nameMl: string;
  category: CognitiveSyndromeCategory;
  etymology?: string;
  description: string;
  descriptionMl: string;
  clinicalNote?: string;
  clinicalNoteMl?: string;
  relatedConditions?: string[];
}

export type CognitiveSyndromeCategory =
  | 'Attention & Psychomotor'
  | 'Perceptual Disorders'
  | 'Body Schema & Awareness'
  | 'Delusional Misidentification'
  | 'Other Delusions'
  | 'Frontal Lobe Signs'
  | 'Movement & Behaviour';

export interface FrontalLobeTest {
  id: string;
  name: string;
  nameMl: string;
  description: string;
  descriptionMl: string;
  domain: string;
}

export interface CognitiveSyndromeCheckResult {
  presentSyndromes: string[];
  presentFrontalTests: string[];
  notes: string;
}
