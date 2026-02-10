export interface MiniCogItem {
  id: string;
  step: 'registration' | 'clock' | 'recall';
  title: string;
  description: string;
  maxScore: number;
  instructions: string;
  wordListVersion?: number;
  wordList?: string[];
}

export interface MiniCogResponse {
  itemId: string;
  score: number;
  wordListVersion?: number;
}

export interface MiniCogResults {
  responses: MiniCogResponse[];
  wordRecallScore: number; // 0-3 points
  clockDrawScore: number; // 0 or 2 points
  totalScore: number; // 0-5 points
  interpretation: string;
  wordListVersion: number;
}

export const MINI_COG_WORD_LISTS = [
  { version: 1, words: ['Banana', 'Sunrise', 'Chair'], wordsMl: ['വാഴപ്പഴം', 'സൂര്യോദയം', 'കസേര'] },
  { version: 2, words: ['Leader', 'Season', 'Table'], wordsMl: ['നേതാവ്', 'സീസൺ', 'മേശ'] },
  { version: 3, words: ['Village', 'Kitchen', 'Baby'], wordsMl: ['ഗ്രാമം', 'അടുക്കള', 'കുഞ്ഞ്'] },
  { version: 4, words: ['River', 'Nation', 'Finger'], wordsMl: ['നദി', 'രാഷ്ട്രം', 'വിരൽ'] },
  { version: 5, words: ['Captain', 'Garden', 'Picture'], wordsMl: ['ക്യാപ്റ്റൻ', 'തോട്ടം', 'ചിത്രം'] },
  { version: 6, words: ['Daughter', 'Heaven', 'Mountain'], wordsMl: ['മകൾ', 'സ്വർഗം', 'മല'] }
];
