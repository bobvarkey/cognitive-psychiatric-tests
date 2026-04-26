export interface CdsItem {
  id: number;
  question: string;
}

export interface CdsResponse {
  itemId: number;
  frequency: number; // 0–4
  duration: number;  // 1–6
}

export interface CdsResult {
  totalScore: number;          // sum of (frequency + duration), max = 29 * (4 + 6) = 290
  frequencyScore: number;      // sum of frequencies (0–116)
  durationScore: number;       // sum of durations (29–174)
  itemsEndorsed: number;       // items with frequency >= 1
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  interpretation: string;
}
