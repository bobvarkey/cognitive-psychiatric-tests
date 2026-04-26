export type DssDomain =
  | 'depersonalization'
  | 'derealization'
  | 'gaps'        // gaps in awareness/memory
  | 'sensory'     // sensory misperceptions
  | 'cognitive'   // cognitive-behavioural reexperiencing
  | 'identity';   // identity dissociation

export interface DssItem {
  id: number;
  question: string;
  domain: DssDomain;
}

export interface DssResponse {
  itemId: number;
  score: number; // 0–4
}

export interface DssSubscaleScore {
  domain: DssDomain;
  mean: number;     // 0–4
  itemsScored: number;
  elevated: boolean; // mean ≥ 1.0 → clinically elevated (Carlson et al., 2018)
}

export interface DssResult {
  totalMean: number;             // mean of all 20 items, 0–4
  subscales: DssSubscaleScore[];
  itemsScored: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  interpretation: string;
}
