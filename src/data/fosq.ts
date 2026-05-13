export interface FosqItem {
  id: string;
  number: number;
  subscale: number;
  subscaleName: string;
  question: string;
  description: string;
}

export const FOSQ_ITEMS: FosqItem[] = [
  // Subscale 1: Activity Level (items 1-9)
  {
    id: 'fosq_01', number: 1, subscale: 1, subscaleName: 'Activity Level',
    question: 'Do you feel you have difficulty concentrating on the things you do because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on concentration.'
  },
  {
    id: 'fosq_02', number: 2, subscale: 1, subscaleName: 'Activity Level',
    question: 'Do you feel that your general ability to remember things is affected because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on memory.'
  },
  {
    id: 'fosq_03', number: 3, subscale: 1, subscaleName: 'Activity Level',
    question: 'Do you have difficulty finishing a meal because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on eating.'
  },
  {
    id: 'fosq_04', number: 4, subscale: 1, subscaleName: 'Activity Level',
    question: 'If your activities involve working on a hobby (e.g., sewing, collecting, gardening), do you have difficulty doing this because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on hobbies.'
  },
  {
    id: 'fosq_05', number: 5, subscale: 1, subscaleName: 'Activity Level',
    question: 'Do you have difficulty doing work around the house (e.g., cleaning house, doing laundry, taking out the trash) because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on household chores.'
  },
  {
    id: 'fosq_06', number: 6, subscale: 1, subscaleName: 'Activity Level',
    question: 'Do you have difficulty operating a motor vehicle for SHORT distances (less than 100 km / 60 miles) because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on short-distance driving.'
  },
  {
    id: 'fosq_07', number: 7, subscale: 1, subscaleName: 'Activity Level',
    question: 'Do you have difficulty operating a motor vehicle for LONG distances (greater than 100 km / 60 miles) because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on long-distance driving.'
  },
  {
    id: 'fosq_08', number: 8, subscale: 1, subscaleName: 'Activity Level',
    question: 'Do you have difficulty getting things done because you are too sleepy or tired to drive or take public transportation?',
    description: 'Assess impact of sleepiness on transportation and errands.'
  },
  {
    id: 'fosq_09', number: 9, subscale: 1, subscaleName: 'Activity Level',
    question: 'Do you have difficulty exercising or participating in a sport because you are too sleepy or tired?',
    description: 'Assess impact of sleepiness on physical activity and exercise.'
  },
  // Subscale 2: Vigilance (items 10-16)
  {
    id: 'fosq_10', number: 10, subscale: 2, subscaleName: 'Vigilance',
    question: 'Do you have difficulty watching a movie or videotape to its completion because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on sustained attention during entertainment.'
  },
  {
    id: 'fosq_11', number: 11, subscale: 2, subscaleName: 'Vigilance',
    question: 'Do you have difficulty enjoying an event (e.g., concert, lecture, religious service, sports event) because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on event attendance and enjoyment.'
  },
  {
    id: 'fosq_12', number: 12, subscale: 2, subscaleName: 'Vigilance',
    question: 'Do you have difficulty watching television to completion because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on TV watching.'
  },
  {
    id: 'fosq_13', number: 13, subscale: 2, subscaleName: 'Vigilance',
    question: 'Do you have difficulty being as active as you want to be in the evening because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on evening activity level.'
  },
  {
    id: 'fosq_14', number: 14, subscale: 2, subscaleName: 'Vigilance',
    question: 'Do you have difficulty being as active as you want to be in the morning because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on morning activity level.'
  },
  {
    id: 'fosq_15', number: 15, subscale: 2, subscaleName: 'Vigilance',
    question: 'Do you have difficulty staying awake while sitting quietly (e.g., at a meeting, in a theater) because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on passive vigilance tasks.'
  },
  {
    id: 'fosq_16', number: 16, subscale: 2, subscaleName: 'Vigilance',
    question: 'Do you have difficulty visiting with your family or friends in their homes because you become sleepy or tired?',
    description: 'Assess impact of sleepiness on social visits.'
  },
  // Subscale 3: Intimacy and Sexual Relationships (items 17-20)
  {
    id: 'fosq_17', number: 17, subscale: 3, subscaleName: 'Intimacy and Sexual Relationships',
    question: 'Has your relationship with family, friends, or work colleagues been affected because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on personal relationships.'
  },
  {
    id: 'fosq_18', number: 18, subscale: 3, subscaleName: 'Intimacy and Sexual Relationships',
    question: 'Has your intimate or sexual relationship been affected because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on intimate relationships.'
  },
  {
    id: 'fosq_19', number: 19, subscale: 3, subscaleName: 'Intimacy and Sexual Relationships',
    question: 'Has your desire for intimacy or sex been affected because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on libido and desire.'
  },
  {
    id: 'fosq_20', number: 20, subscale: 3, subscaleName: 'Intimacy and Sexual Relationships',
    question: 'Do you feel your ability to engage in sexual activity has been affected because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on sexual performance/ability.'
  },
  // Subscale 4: General Productivity (items 21-28)
  {
    id: 'fosq_21', number: 21, subscale: 4, subscaleName: 'General Productivity',
    question: 'Do you have difficulty keeping pace with others your own age because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on keeping up with peers.'
  },
  {
    id: 'fosq_22', number: 22, subscale: 4, subscaleName: 'General Productivity',
    question: 'Do you have difficulty completing tasks that require sustained attention because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on sustained-task completion.'
  },
  {
    id: 'fosq_23', number: 23, subscale: 4, subscaleName: 'General Productivity',
    question: 'Do you feel you have less productivity in your work (paid or volunteer) because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on work productivity.'
  },
  {
    id: 'fosq_24', number: 24, subscale: 4, subscaleName: 'General Productivity',
    question: 'Do you have difficulty taking care of financial affairs and doing paperwork (e.g., paying bills, keeping records) because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on financial management.'
  },
  {
    id: 'fosq_25', number: 25, subscale: 4, subscaleName: 'General Productivity',
    question: 'Do you have difficulty doing work that requires organization and planning because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on executive function tasks.'
  },
  {
    id: 'fosq_26', number: 26, subscale: 4, subscaleName: 'General Productivity',
    question: 'Do you have difficulty completing a task that requires thinking because you are too sleepy or tired?',
    description: 'Assess impact of sleepiness on cognitive task completion.'
  },
  {
    id: 'fosq_27', number: 27, subscale: 4, subscaleName: 'General Productivity',
    question: 'Do you find it difficult to maintain your usual level of performance at work because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on work performance.'
  },
  {
    id: 'fosq_28', number: 28, subscale: 4, subscaleName: 'General Productivity',
    question: 'Do you have difficulty performing your job well (paid or volunteer) because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on job performance quality.'
  },
  // Subscale 5: Social Outcome (items 29-30)
  {
    id: 'fosq_29', number: 29, subscale: 5, subscaleName: 'Social Outcome',
    question: 'Do you have difficulty participating in social activities because you are sleepy or tired?',
    description: 'Assess impact of sleepiness on social participation.'
  },
  {
    id: 'fosq_30', number: 30, subscale: 5, subscaleName: 'Social Outcome',
    question: 'Do you find it difficult to take trips or vacations because of sleepiness or tiredness?',
    description: 'Assess impact of sleepiness on travel and leisure activities.'
  }
];

export const FOSQ_SCORING_GUIDE: Record<number, string> = {
  1: 'Extreme difficulty',
  2: 'Moderate difficulty',
  3: 'Little difficulty',
  4: 'No difficulty'
};

export const FOSQ_SUBSCALE_NAMES: Record<number, string> = {
  1: 'Activity Level',
  2: 'Vigilance',
  3: 'Intimacy and Sexual Relationships',
  4: 'General Productivity',
  5: 'Social Outcome'
};

export const FOSQ_INTERPRETATION = {
  normal: {
    range: '>18',
    level: 'Normal Functioning',
    severity: 'Normal',
    description: 'Patient reports normal daytime functioning. Sleepiness does not significantly impair activities of daily living, vigilance, intimacy, productivity, or social outcomes.',
    recommendations: [
      'Maintain current sleep habits and good sleep hygiene.',
      'Continue routine monitoring at follow-up visits.',
      'No sleep-specific intervention required at this time.'
    ],
    color: 'green'
  },
  mild: {
    range: '15-18',
    level: 'Mild Functional Impairment',
    severity: 'Mild',
    description: 'Patient reports mild functional impairment related to sleepiness. Some aspects of daily functioning are affected but overall function is largely preserved.',
    recommendations: [
      'Provide targeted sleep hygiene counseling.',
      'Identify specific subscales with the most impairment and address corresponding areas.',
      'Consider sleep study if not already performed.',
      'Monitor functional status over time; repeat assessment after intervention.',
      'Evaluate for underlying sleep disorders (OSA, insomnia, RLS).'
    ],
    color: 'yellow'
  },
  moderateSevere: {
    range: '<15',
    level: 'Moderate to Severe Functional Impairment',
    severity: 'Moderate-Severe',
    description: 'Patient reports significant functional impairment related to sleepiness across multiple domains. Sleepiness is substantially interfering with quality of life and daily functioning.',
    recommendations: [
      'Urgent referral for comprehensive sleep medicine evaluation.',
      'Polysomnography (PSG) or home sleep apnea testing (HSAT) strongly recommended.',
      'Assess each subscale domain individually to guide targeted interventions.',
      'Consider CPAP therapy if OSA is diagnosed.',
      'Implement CBT-I if insomnia is a contributing factor.',
      'Occupational therapy evaluation for adaptive strategies.',
      'Screen for comorbid depression, anxiety, and other psychiatric conditions.',
      'Discuss driving safety — patients with significant sleepiness may be at risk for motor vehicle accidents.',
      'Close multidisciplinary follow-up with sleep specialist, psychiatrist, and primary care.'
    ],
    color: 'red'
  }
};
