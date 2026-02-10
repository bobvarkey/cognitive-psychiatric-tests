export interface DpdrItem {
  id: number;
  question: string;
  questionMl: string;
  domain: 'depersonalization' | 'derealization' | 'distress';
}

export interface DpdrResponse {
  itemId: number;
  score: number; // 0-4 (Never, Rarely, Sometimes, Often, Always)
}

export interface DpdrResult {
  totalScore: number;
  depersonalizationScore: number;
  derealizationScore: number;
  distressScore: number;
  interpretation: string;
  interpretationMl: string;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
}
