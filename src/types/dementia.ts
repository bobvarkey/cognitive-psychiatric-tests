export interface Behav5Item {
  id: string;
  title: string;
  titleMl: string;
  description: string;
  descriptionMl: string;
}

export interface SoftSignItem {
  id: string;
  title: string;
  titleMl: string;
  description: string;
  descriptionMl: string;
  instructions: string;
  instructionsMl: string;
}

export interface VatItem {
  id: string;
  cueObject: string;
  cueObjectMl: string;
  targetObject: string;
  targetObjectMl: string;
  associationImage: string;
  cueImage: string;
  question: string;
  questionMl: string;
}

export interface HistoryItem {
  id: string;
  label: string;
  labelMl: string;
  category: 'medical' | 'lifestyle' | 'family' | 'aetiological' | 'behavioral';
}

export interface ClinicalExamItem {
  id: string;
  label: string;
  labelMl: string;
  category: 'frontal' | 'temporal' | 'parietal' | 'occipital' | 'general';
}

export interface TestItem {
  id: string;
  label: string;
  labelMl: string;
  category: 'routine' | 'special' | 'imaging';
}

export interface IqcodeItem {
  id: string;
  question: string;
  questionMl: string;
}

export interface CdrDomain {
  id: string;
  name: string;
  nameMl: string;
  description: string;
  descriptionMl: string;
  ratings: {
    score: number;
    label: string;
    labelMl: string;
    description: string;
    descriptionMl: string;
  }[];
}

export interface DementiaResponse {
  behav5: Record<string, boolean>;
  softSigns: {
    mhd: 'positive' | 'negative' | null;
    sts: 'positive' | 'negative' | null;
    hts: 'positive' | 'negative' | null;
    applause: 'positive' | 'negative' | null;
    glabellar: 'positive' | 'negative' | null;
    palmomental: 'positive' | 'negative' | null;
    snout: 'positive' | 'negative' | null;
  };
  vat: Record<string, boolean>;
  clinicalExam: Record<string, boolean>;
  history: Record<string, boolean>;
  tests: Record<string, boolean>;
  iqcode: Record<string, number>; // 1-5 scale
  cdr: Record<string, number>; // 0-3 scale for each domain
}

export interface DementiaResults {
  behav5Score: number;
  behav5Positive: string[];
  softSignsFindings: {
    mhd: 'positive' | 'negative' | null;
    sts: 'positive' | 'negative' | null;
    hts: 'positive' | 'negative' | null;
    applause: 'positive' | 'negative' | null;
    glabellar: 'positive' | 'negative' | null;
    palmomental: 'positive' | 'negative' | null;
    snout: 'positive' | 'negative' | null;
  };
  vatScore: number;
  vatMaxScore: number;
  clinicalExamFindings: {
    frontal: string[];
    temporal: string[];
    parietal: string[];
    occipital: string[];
    general: string[];
  };
  historyFindings: string[];
  testsOrdered: string[];
  iqcodeScore: number;
  iqcodeInterpretation: string;
  iqcodeInterpretationMl: string;
  cdrGlobalScore: number;
  cdrDomainScores: Record<string, number>;
  cdrInterpretation: string;
  cdrInterpretationMl: string;
  riskLevel: 'low' | 'moderate' | 'high';
  interpretation: string;
  interpretationMl: string;
  recommendations: string[];
  recommendationsMl: string[];
}
