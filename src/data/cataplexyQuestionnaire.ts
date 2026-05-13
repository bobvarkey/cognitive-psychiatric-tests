export interface CataplexyItem {
  id: string;
  number: number;
  question: string;
  description: string;
  type: 'trigger' | 'characteristic' | 'associated';
}

export const CATAPLEXY_ITEMS: CataplexyItem[] = [
  // Screening questions - triggers (items 1-6)
  {
    id: 'laughter',
    number: 1,
    question: 'Do you experience sudden muscle weakness when laughing?',
    description: 'For example, head dropping, jaw sagging, knees buckling, or difficulty speaking triggered by laughter or telling/hearing jokes.',
    type: 'trigger'
  },
  {
    id: 'anger',
    number: 2,
    question: 'Do you experience sudden muscle weakness when angry or frustrated?',
    description: 'For example, feeling weak, dropping things, or slurring speech when becoming angry or intensely frustrated.',
    type: 'trigger'
  },
  {
    id: 'surprise',
    number: 3,
    question: 'Do you experience sudden muscle weakness when surprised?',
    description: 'For example, knees buckling, dropping objects, or going limp when startled by an unexpected event.',
    type: 'trigger'
  },
  {
    id: 'excitement',
    number: 4,
    question: 'Do you experience sudden muscle weakness when excited?',
    description: 'For example, difficulty speaking, weakness in arms or legs, or head dropping during moments of intense excitement or anticipation.',
    type: 'trigger'
  },
  {
    id: 'jokes',
    number: 5,
    question: 'Do you experience sudden muscle weakness when telling jokes or in humorous situations?',
    description: 'For example, slurred speech, jaw dropping, or arm weakness while telling or hearing a funny story.',
    type: 'trigger'
  },
  {
    id: 'stress',
    number: 6,
    question: 'Do you experience sudden muscle weakness during stress or intense emotions?',
    description: 'For example, feeling weak when under significant emotional stress, before public speaking, or during arguments.',
    type: 'trigger'
  },
  // Detailed characteristics (items 7-10)
  {
    id: 'body_parts',
    number: 7,
    question: 'Which body parts are affected during these episodes?',
    description: 'Select all that apply: face/jaw (drooping), neck (head dropping), arms (weakness/dropping things), legs (knees buckling/collapsing), or generalized (whole body).',
    type: 'characteristic'
  },
  {
    id: 'frequency',
    number: 8,
    question: 'How often do these episodes of muscle weakness occur?',
    description: 'Rate the frequency of cataplexy-like episodes over the past month.',
    type: 'characteristic'
  },
  {
    id: 'duration',
    number: 9,
    question: 'How long do these episodes of muscle weakness typically last?',
    description: 'Cataplexy episodes typically last from a few seconds to less than 2 minutes. Determine how long the patient\'s episodes last.',
    type: 'characteristic'
  },
  {
    id: 'consciousness',
    number: 10,
    question: 'Are you fully conscious and aware during these episodes?',
    description: 'In true cataplexy, consciousness is preserved. Patients should be fully aware of what is happening during the episode.',
    type: 'characteristic'
  },
  // Associated features (items 11-12)
  {
    id: 'falls',
    number: 11,
    question: 'Have you ever fallen to the ground during one of these episodes?',
    description: 'In severe cataplexy, complete loss of muscle tone can lead to collapse or falling. This distinguishes severe cataplexy from milder forms.',
    type: 'associated'
  },
  {
    id: 'trigger_situations',
    number: 12,
    question: 'Can you identify specific situations or emotions that reliably trigger these episodes?',
    description: 'Cataplexy is typically triggered by strong positive emotions (especially laughter). Having identifiable and reproducible triggers helps differentiate from other causes of weakness.',
    type: 'associated'
  }
];

export const CATAPLEXY_TRIGGER_SCORING: Record<number, string> = {
  0: 'No',
  1: 'Possibly / Unsure',
  2: 'Yes'
};

export const CATAPLEXY_FREQUENCY_OPTIONS: Record<number, string> = {
  0: 'Never / None in the past month',
  1: 'Less than once per month',
  2: '1-3 times per month',
  3: '1-3 times per week',
  4: 'Daily or nearly daily'
};

export const CATAPLEXY_DURATION_OPTIONS: Record<number, string> = {
  0: 'N/A (no episodes)',
  1: 'Less than 10 seconds',
  2: '10 seconds to 1 minute',
  3: '1-2 minutes',
  4: 'More than 2 minutes'
};

export const CATAPLEXY_BODY_PARTS_OPTIONS = [
  { id: 'face_jaw', label: 'Face / Jaw (drooping, sagging)' },
  { id: 'neck', label: 'Neck (head dropping)' },
  { id: 'arms', label: 'Arms (weakness, dropping things)' },
  { id: 'legs', label: 'Legs (knees buckling, collapsing)' },
  { id: 'generalized', label: 'Generalized (whole body weakness)' }
];

export const CATAPLEXY_INTERPRETATION = {
  low: {
    level: 'Low Suspicion for Cataplexy',
    severity: 'Low',
    severityColor: 'text-green-600 bg-green-50 border-green-200',
    description: 'Fewer than 3 emotional triggers associated with muscle weakness, or episodes do not have characteristic features of cataplexy (brief duration, preserved consciousness, specific triggers). Cataplexy is unlikely.',
    recommendations: [
      'Continue evaluation for other causes of muscle weakness or falls.',
      'If excessive daytime sleepiness is present, consider other causes such as insufficient sleep, sleep apnea, or medication effects.',
      'Consider neurology consultation if muscle weakness is progressive or unexplained.',
      'Document episodes and triggers for future comparison.'
    ]
  },
  moderate: {
    level: 'Moderate Suspicion for Cataplexy',
    severity: 'Moderate',
    severityColor: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    description: 'Some features are suggestive of cataplexy but the clinical picture is not definitive. Further evaluation including sleep studies and specialist consultation is recommended.',
    recommendations: [
      'Refer for sleep medicine consultation with narcolepsy expertise.',
      'Order polysomnography (PSG) followed by Multiple Sleep Latency Test (MSLT).',
      'CSF hypocretin-1 (orexin-A) measurement may be indicated if clinical suspicion is high and MSLT is equivocal.',
      'Consider screening for HLA-DQB1*06:02 if narcolepsy type 1 is strongly suspected.',
      'Maintain a detailed symptom diary documenting episodes, triggers, and durations.',
      'Evaluate and address excessive daytime sleepiness if present.'
    ]
  },
  high: {
    level: 'High Suspicion for Cataplexy',
    severity: 'High',
    severityColor: 'text-red-600 bg-red-50 border-red-200',
    description: 'Three or more emotional triggers reliably produce muscle weakness. Episodes are brief (seconds to <2 minutes), consciousness is preserved, and triggers are identifiable (especially laughter). Clinical picture is highly consistent with cataplexy and suggests type 1 narcolepsy.',
    recommendations: [
      'Urgent referral to sleep medicine specialist for confirmation of narcolepsy type 1 diagnosis.',
      'Order polysomnography (PSG) followed by Multiple Sleep Latency Test (MSLT) for objective diagnosis.',
      'CSF hypocretin-1 (orexin-A) measurement is the gold standard for diagnosing narcolepsy type 1 (values < 110 pg/mL are diagnostic).',
      'Consider HLA-DQB1*06:02 testing as supporting evidence.',
      'Initiate safety counseling: advise against driving during untreated periods, discuss fall precautions.',
      'If diagnosed, treatment options include sodium oxybate (recommended first-line for cataplexy), pitolisant, solriamfetol, or traditional stimulants for EDS management.',
      'Antidepressants (venlafaxine, fluoxetine, clomipramine) may be considered for cataplexy suppression.',
      'Provide patient education about narcolepsy spectrum disorders and available support resources.'
    ]
  }
};
