export interface MdsUpdrsItem {
  id: string;
  number: number;
  part: string;
  domain: string;
  question: string;
  description: string;
  isLateralized?: boolean;
  scoring: {
    [key: number]: string;
  };
}

export const MDS_UPDRS_ITEMS: MdsUpdrsItem[] = [
  // Part I: Non-Motor Aspects of Experiences of Daily Living
  {
    id: 'complex_cognition',
    number: 1,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Complex cognition',
    description: 'Have you had difficulty with thinking, memory, concentration, or decision-making?',
    scoring: {
      0: 'Normal',
      1: 'Mild - Difficulty with complex thinking, slight decrease in thinking speed',
      2: 'Mild-moderate - Difficulty with complex thinking, but can manage daily tasks',
      3: 'Moderate - Difficulty with complex thinking affects daily function',
      4: 'Severe - Difficulty with complex thinking significantly impairs daily function'
    }
  },
  {
    id: 'hallucinations',
    number: 2,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Hallucinations',
    description: 'Have you had hallucinations (seeing, hearing, or experiencing things that are not there)?',
    scoring: {
      0: 'Normal - No hallucinations',
      1: 'Mild - Occasional hallucinations, non-intrusive',
      2: 'Mild-moderate - Frequent hallucinations but patient aware they are not real',
      3: 'Moderate - Frequent hallucinations, patient sometimes confused about reality',
      4: 'Severe - Constant hallucinations with patient unsure about reality'
    }
  },
  {
    id: 'depression',
    number: 3,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Depression',
    description: 'Have you felt sad, discouraged, hopeless, or depressed?',
    scoring: {
      0: 'Normal - No depression',
      1: 'Mild - Occasionally sad or discouraged',
      2: 'Mild-moderate - Often sad or discouraged, slight impact on function',
      3: 'Moderate - Frequently sad/discouraged, noticeable impact on daily activities',
      4: 'Severe - Severely depressed most of the time'
    }
  },
  {
    id: 'anxiety',
    number: 4,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Anxiety',
    description: 'Have you felt anxious, worried, or tense?',
    scoring: {
      0: 'Normal - No anxiety',
      1: 'Mild - Occasionally anxious or worried',
      2: 'Mild-moderate - Often anxious, mild impact on function',
      3: 'Moderate - Frequently anxious, noticeable impact on daily activities',
      4: 'Severe - Severe anxiety most of the time'
    }
  },
  {
    id: 'apathy',
    number: 5,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Apathy',
    description: 'Have you felt indifferent, unmotivated, or lacking enthusiasm?',
    scoring: {
      0: 'Normal - Normal motivation',
      1: 'Mild - Slightly reduced motivation',
      2: 'Mild-moderate - Reduced motivation but can initiate activities',
      3: 'Moderate - Significantly reduced motivation affecting daily activities',
      4: 'Severe - Severe apathy; minimal motivation for activities'
    }
  },
  {
    id: 'sleep_problems',
    number: 6,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Sleep problems',
    description: 'Have you had difficulty sleeping at night?',
    scoring: {
      0: 'Normal - No sleep problems',
      1: 'Mild - Occasional sleep difficulties',
      2: 'Mild-moderate - Frequent sleep difficulties, slightly reduced sleep quality',
      3: 'Moderate - Significant sleep difficulties affecting daytime function',
      4: 'Severe - Severe sleep disturbance'
    }
  },
  {
    id: 'daytime_sleepiness',
    number: 7,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Daytime sleepiness',
    description: 'Have you felt excessively sleepy or taken unplanned naps during the day?',
    scoring: {
      0: 'Normal - No daytime sleepiness',
      1: 'Mild - Occasional daytime sleepiness',
      2: 'Mild-moderate - Frequent daytime sleepiness',
      3: 'Moderate - Excessive daytime sleepiness affecting function',
      4: 'Severe - Severe daytime sleepiness'
    }
  },
  {
    id: 'pain',
    number: 8,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Pain',
    description: 'Have you had pain in your body?',
    scoring: {
      0: 'Normal - No pain',
      1: 'Mild - Occasional mild pain',
      2: 'Mild-moderate - Frequent mild pain or occasional moderate pain',
      3: 'Moderate - Frequent moderate pain affecting function',
      4: 'Severe - Severe pain affecting daily activities'
    }
  },
  {
    id: 'urinary_problems',
    number: 9,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Urinary problems',
    description: 'Have you had urinary problems (urgency, frequency, nocturia)?',
    scoring: {
      0: 'Normal - No urinary problems',
      1: 'Mild - Occasional urinary symptoms',
      2: 'Mild-moderate - Frequent urinary symptoms',
      3: 'Moderate - Frequent bothersome urinary symptoms affecting function',
      4: 'Severe - Severe urinary symptoms'
    }
  },
  {
    id: 'constipation',
    number: 10,
    part: 'Part I',
    domain: 'Non-Motor Aspects of Daily Living',
    question: 'Constipation',
    description: 'Have you had difficulty with bowel movements?',
    scoring: {
      0: 'Normal - No constipation',
      1: 'Mild - Occasional constipation',
      2: 'Mild-moderate - Frequent constipation',
      3: 'Moderate - Frequent constipation affecting function',
      4: 'Severe - Severe constipation'
    }
  },
  // Part II: Motor Aspects of Experiences of Daily Living
  {
    id: 'tremor_daily',
    number: 11,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Tremor',
    description: 'How much does tremor interfere with your daily activities?',
    scoring: {
      0: 'Normal - No interference',
      1: 'Mild - Slight interference',
      2: 'Mild-moderate - Noticeable interference',
      3: 'Moderate - Significant interference',
      4: 'Severe - Severe interference with activities'
    }
  },
  {
    id: 'rigidity_daily',
    number: 12,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Rigidity',
    description: 'How much does muscle stiffness interfere with your daily activities?',
    scoring: {
      0: 'Normal - No interference',
      1: 'Mild - Slight interference',
      2: 'Mild-moderate - Noticeable interference',
      3: 'Moderate - Significant interference',
      4: 'Severe - Severe interference with activities'
    }
  },
  {
    id: 'bradykinesia_daily',
    number: 13,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Bradykinesia (slowness of movement)',
    description: 'How much does slowness of movement interfere with your daily activities?',
    scoring: {
      0: 'Normal - No interference',
      1: 'Mild - Slight interference',
      2: 'Mild-moderate - Noticeable interference',
      3: 'Moderate - Significant interference',
      4: 'Severe - Severe interference with activities'
    }
  },
  // Part III: Motor Examination (Physical Examination)
  {
    id: 'resting_tremor_hand',
    number: 14,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Resting tremor amplitude - Hands',
    description: 'Assess resting tremor of hands at rest',
    isLateralized: true,
    scoring: {
      0: 'Absent',
      1: 'Slight and infrequently present',
      2: 'Mild in amplitude and persistent, or moderate in amplitude but present intermittently',
      3: 'Moderate in amplitude and present most of the time',
      4: 'Marked in amplitude and present most of the time'
    }
  },
  {
    id: 'rigidity_arm',
    number: 15,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Rigidity - Arms',
    description: 'Assess muscle rigidity of arms during passive movement',
    isLateralized: true,
    scoring: {
      0: 'Absent',
      1: 'Slight, evident only with activation maneuver',
      2: 'Mild to moderate',
      3: 'Moderate to marked',
      4: 'Severe'
    }
  },
  {
    id: 'finger_tapping',
    number: 16,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Finger tapping',
    description: 'Ask patient to tap index finger and thumb repeatedly. Assess amplitude and speed.',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight slowing and/or reduction in amplitude',
      2: 'Mild slowing and reduction in amplitude',
      3: 'Moderately slowed, small amplitude',
      4: 'Severely slowed, very small amplitude'
    }
  },
  {
    id: 'hand_grasp',
    number: 17,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Hand movements',
    description: 'Ask patient to open and close hand in rapid succession. Assess speed and amplitude.',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight slowing and/or reduction in amplitude',
      2: 'Mild slowing and reduction in amplitude',
      3: 'Moderately slowed, small amplitude',
      4: 'Severely slowed, very small amplitude'
    }
  },
  {
    id: 'pronation_supination',
    number: 18,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Pronation-supination movements',
    description: 'Assess rapid pronation and supination (turning hand palm up and down) movements.',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight slowing and/or reduction in amplitude',
      2: 'Mild slowing and reduction in amplitude',
      3: 'Moderately slowed, small amplitude',
      4: 'Severely slowed, very small amplitude'
    }
  },
  {
    id: 'toe_tapping',
    number: 19,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Toe tapping',
    description: 'Ask patient to tap foot. Assess amplitude and speed.',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight slowing and/or reduction in amplitude',
      2: 'Mild slowing and reduction in amplitude',
      3: 'Moderately slowed, small amplitude',
      4: 'Severely slowed, very small amplitude'
    }
  },
  {
    id: 'gait',
    number: 20,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Gait',
    description: 'Observe walking pattern. Assess stride length, arm swing, and posture.',
    scoring: {
      0: 'Normal',
      1: 'Slight slowness, or reduction in arm swing',
      2: 'Mild reduction in speed or amplitude of movement',
      3: 'Moderate slowing of gait or mild difficulty',
      4: 'Severe gait impairment'
    }
  },
  {
    id: 'postural_stability',
    number: 21,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Postural stability',
    description: 'Use pull test: stand behind patient and gently pull backward at shoulders.',
    scoring: {
      0: 'Normal - Recovers quickly',
      1: 'Mild - Pulls back but recovers with few steps',
      2: 'Moderate - Pulls back and falls backward without catching self',
      3: 'Marked - Severely impaired',
      4: 'Severe - Unable to stand independently'
    }
  }
];

export const MDS_UPDRS_INTERPRETATION = {
  mild: {
    range: '0-30',
    level: 'Mild Parkinson\'s Disease',
    description: 'Mild motor and non-motor symptoms.'
  },
  moderate: {
    range: '31-59',
    level: 'Moderate Parkinson\'s Disease',
    description: 'Moderate motor and non-motor symptoms affecting function.'
  },
  severe: {
    range: '>60',
    level: 'Severe Parkinson\'s Disease',
    description: 'Severe motor and non-motor symptoms with significant functional impairment.'
  }
};
