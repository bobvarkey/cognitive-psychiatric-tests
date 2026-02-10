export type TuliaScore = 0 | 1;

export type TuliaCategory = 'meaningless' | 'intransitive' | 'transitive';
export type TuliaDomain = 'imitation' | 'pantomime';

export interface TuliaItem {
  id: number;
  category: TuliaCategory;
  domain: TuliaDomain;
  instruction: {
    en: string;
    ml: string;
  };
  description: {
    en: string;
    ml: string;
  };
  note?: {
    en: string;
    ml: string;
  };
}

export interface TuliaResponse {
  itemId: number;
  score: TuliaScore;
}

export interface TuliaResults {
  responses: TuliaResponse[];
  totalScore: number;
  imitationScore: number;
  pantomimeScore: number;
  meaninglessScore: number;
  intransitiveScore: number;
  transitiveScore: number;
  interpretation: 'normal' | 'mild-apraxia' | 'severe-apraxia';
}
