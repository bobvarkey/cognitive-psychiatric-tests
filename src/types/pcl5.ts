export interface Pcl5Item {
  id: number;
  text: string;
  textMl: string;
  type?: 'screening' | 'question'; // screening for trauma exposure question
}

export interface Pcl5Response {
  itemId: number;
  score: number; // 0 (No) or 1 (Yes)
}

export interface Pcl5Result {
  totalScore: number;
  hasTraumaExposure: boolean;
  probablePTSD: boolean;
  interpretation: string;
  interpretationMl: string;
}

export type Pcl5Score = 0 | 1; // Yes/No
