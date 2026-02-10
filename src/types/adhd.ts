export type AdhdSymptomDomain = 'inattention' | 'hyperactivity-impulsivity';

export interface AdhdSymptom {
  id: string;
  domain: AdhdSymptomDomain;
  label: string;
  labelMl: string;
  description: string;
  descriptionMl: string;
}

export interface AdhdCriterion {
  id: 'B' | 'C' | 'D' | 'E';
  question: string;
  questionMl: string;
  description: string;
  descriptionMl: string;
}

export interface AdhdSymptomResponse {
  symptomId: string;
  present: boolean;
}

export interface AdhdCriterionResponse {
  criterionId: 'B' | 'C' | 'D' | 'E';
  met: boolean;
}

export interface AdhdResults {
  symptomResponses: AdhdSymptomResponse[];
  criterionResponses: AdhdCriterionResponse[];
  inattentionCount: number;
  hyperactivityCount: number;
  totalSymptoms: number;
  allCriteriaMet: boolean;
  presentation: 'combined' | 'predominantly-inattentive' | 'predominantly-hyperactive' | 'subthreshold';
  age17Plus: boolean;
}
