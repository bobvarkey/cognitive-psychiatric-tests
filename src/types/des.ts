export interface DesItem {
  id: number;
  question: string;
  /** DES-T (taxon) subset items used to estimate pathological dissociation. */
  taxon?: boolean;
}

export interface DesResponse {
  itemId: number;
  /** 0, 10, 20, … 100 */
  score: number;
}

export interface DesResult {
  totalMean: number;       // 0–100
  taxonMean: number;       // 0–100, average of DES-T items
  itemsScored: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  interpretation: string;
}
