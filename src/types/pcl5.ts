export interface Pcl5Item {
  id: number;
  text: string;
  textMl: string;
  type?: 'screening' | 'question';
  cluster?: 'screen' | 'B' | 'C' | 'D' | 'E';
}

export interface Pcl5Response {
  itemId: number;
  score: number;
}

export interface Pcl5Result {
  totalScore: number;
  hasTraumaExposure: boolean;
  probablePTSD: boolean;
  clusterB: number;
  clusterC: number;
  clusterD: number;
  clusterE: number;
  meetsDsm5Pattern: boolean;
  interpretation: string;
  interpretationMl: string;
}

export type Pcl5Score = 0 | 1 | 2 | 3 | 4;
