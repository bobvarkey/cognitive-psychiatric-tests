export interface MiniAceItem {
  id: string;
  domain: 'attention' | 'memory' | 'fluency' | 'clock' | 'recall';
  title: string;
  titleMl: string;
  instructions: string;
  instructionsMl: string;
  maxScore: number;
  scoringGuidelines: string;
  scoringGuidelinesMl: string;
}

export interface MiniAceVersion {
  version: 'A' | 'B' | 'C';
  words: string[];
  wordsMl: string[];
  address: {
    name: string;
    nameMl: string;
    street: string;
    streetMl: string;
    city: string;
    cityMl: string;
    state: string;
    stateMl: string;
  };
  letterFluency: string;
}

export interface MiniAceResponse {
  version: 'A' | 'B' | 'C';
  attention: number; // 0-4
  memory: number; // 0-7
  fluency: number; // 0-7
  clock: number; // 0-5
  recall: number; // 0-7
}

export interface MiniAceResults {
  version: 'A' | 'B' | 'C';
  responses: MiniAceResponse;
  totalScore: number; // 0-30
  interpretation: string;
  interpretationMl: string;
  domainScores: {
    attention: number;
    memory: number;
    fluency: number;
    clock: number;
    recall: number;
  };
  riskLevel: 'normal' | 'mild' | 'moderate' | 'severe';
}
