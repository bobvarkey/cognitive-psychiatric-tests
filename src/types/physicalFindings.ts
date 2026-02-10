export type Sex = 'male' | 'female';

export interface PhysicalFindingsData {
  sex: Sex | null;
  waistCircumference: number | null;
  hasAbdominalObesity: boolean;
  hasCervicalHump: boolean;
}

export interface PhysicalFindingsResult {
  data: PhysicalFindingsData;
  waistCircumferenceElevated: boolean;
  metabolicRiskFactors: string[];
  riskLevel: 'low' | 'moderate' | 'high';
}
