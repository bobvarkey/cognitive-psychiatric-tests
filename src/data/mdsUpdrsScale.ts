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
    id: 'speech_daily',
    number: 11,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Speech',
    description: 'Over the past week, have you had problems with your speech?',
    scoring: {
      0: 'Normal',
      1: 'Slight - Speech is soft, slurred or uneven, but no difficulty being understood',
      2: 'Mild - Speech is difficult to understand, but only occasionally',
      3: 'Moderate - Speech is difficult to understand most of the time',
      4: 'Severe - Speech is unintelligible most of the time'
    }
  },
  {
    id: 'saliva_daily',
    number: 12,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Saliva & Drooling',
    description: 'Over the past week, have you had too much saliva in your mouth or drooling?',
    scoring: {
      0: 'Normal',
      1: 'Slight - Saliva builds up but no drooling',
      2: 'Mild - Rare drooling (e.g., while sleeping)',
      3: 'Moderate - Occasional drooling while awake',
      4: 'Severe - Persistent drooling'
    }
  },
  {
    id: 'swallowing_daily',
    number: 13,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Chewing and Swallowing',
    description: 'Over the past week, have you had trouble chewing or swallowing food or drink?',
    scoring: {
      0: 'Normal',
      1: 'Slight - Rare choking or need to cut food small',
      2: 'Mild - Occasionally need to cut food small or avoid certain foods',
      3: 'Moderate - Require soft food or liquids are difficult',
      4: 'Severe - Require feeding tube or significant assistance'
    }
  },
  {
    id: 'eating_daily',
    number: 14,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Eating Tasks',
    description: 'Over the past week, have you had trouble handling your food (e.g., cutting meat, using utensils)?',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight - Slow but no help needed',
      2: 'Mild - Occasionally need help with difficult tasks',
      3: 'Moderate - Frequently need help with eating',
      4: 'Severe - Need to be fed most of the time'
    }
  },
  {
    id: 'dressing_daily',
    number: 15,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Dressing',
    description: 'Over the past week, have you had trouble dressing (e.g., buttons, laces)?',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight - Slow but no help needed',
      2: 'Mild - Occasionally need help',
      3: 'Moderate - Frequently need help',
      4: 'Severe - Need help most of the time'
    }
  },
  {
    id: 'hygiene_daily',
    number: 16,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Hygiene',
    description: 'Over the past week, have you had trouble with bathing, brushing teeth, or combing hair?',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight - Slow but no help needed',
      2: 'Mild - Occasionally need help',
      3: 'Moderate - Frequently need help',
      4: 'Severe - Need help most of the time'
    }
  },
  {
    id: 'handwriting_daily',
    number: 17,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Handwriting',
    description: 'Over the past week, have your handwriting or typing become smaller or difficult?',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight - Slow or slightly smaller',
      2: 'Mild - Noticeably smaller or illegible in parts',
      3: 'Moderate - Frequently illegible',
      4: 'Severe - Unable to write or type'
    }
  },
  {
    id: 'hobbies_daily',
    number: 18,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Hobbies and Other Activities',
    description: 'Over the past week, have you had trouble with your hobbies or other activities?',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight - Slow or slightly less involvement',
      2: 'Mild - Noticeable interference',
      3: 'Moderate - Significantly less involvement',
      4: 'Severe - Unable to participate'
    }
  },
  {
    id: 'turning_in_bed_daily',
    number: 19,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Turning in Bed',
    description: 'Over the past week, have you had trouble turning over in bed?',
    scoring: {
      0: 'Normal',
      1: 'Slight - Slow but no help needed',
      2: 'Mild - Occasionally need help',
      3: 'Moderate - Frequently need help',
      4: 'Severe - Need help most of the time'
    }
  },
  {
    id: 'tremor_daily',
    number: 20,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Tremor',
    description: 'Over the past week, have you had shaking or tremor?',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight - Present but not interfering',
      2: 'Mild - Interferes with some activities',
      3: 'Moderate - Interferes with many activities',
      4: 'Severe - Interferes with most activities'
    }
  },
  {
    id: 'getting_out_of_bed_daily',
    number: 21,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Getting Out of Bed or Chair',
    description: 'Over the past week, have you had trouble getting out of bed or a chair?',
    scoring: {
      0: 'Normal',
      1: 'Slight - Slow but no help needed',
      2: 'Mild - Occasionally need help',
      3: 'Moderate - Frequently need help',
      4: 'Severe - Need help most of the time'
    }
  },
  {
    id: 'walking_daily',
    number: 22,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Walking and Balance',
    description: 'Over the past week, have you had trouble with walking or balance?',
    scoring: {
      0: 'Normal',
      1: 'Slight - Slightly slow or clumsy',
      2: 'Mild - Occasionally lose balance or trip',
      3: 'Moderate - Frequently lose balance or trip',
      4: 'Severe - Unable to walk without help'
    }
  },
  {
    id: 'freezing_daily',
    number: 23,
    part: 'Part II',
    domain: 'Motor Aspects of Daily Living',
    question: 'Freezing',
    description: 'Over the past week, have you had freezing (feet feel glued to the floor)?',
    scoring: {
      0: 'Normal',
      1: 'Slight - Occasional freezing while walking',
      2: 'Mild - Frequent freezing while walking',
      3: 'Moderate - Freezing happens frequently',
      4: 'Severe - Freezing prevents walking'
    }
  },
  // Part III: Motor Examination (Physical Examination)
  {
    id: 'speech',
    number: 14,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Speech',
    description: 'Assess volume, inflection, and clarity.',
    scoring: {
      0: 'Normal',
      1: 'Slight loss of expression, diction and/or volume',
      2: 'Monotone, slurred but understandable; moderately impaired',
      3: 'Marked impairment, difficult to understand',
      4: 'Unintelligible'
    }
  },
  {
    id: 'facial_expression',
    number: 15,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Facial expression',
    description: 'Observe for masked face (hypomimia).',
    scoring: {
      0: 'Normal',
      1: 'Minimal hypomimia, could be normal "poker face"',
      2: 'Slight but definitely abnormal diminution of facial expression',
      3: 'Moderate hypomimia; lips parted some of the time',
      4: 'Masked or fixed expression with severe or complete loss of facial expression; lips parted 1/4 inch or more'
    }
  },
  {
    id: 'rigidity',
    number: 16,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Rigidity',
    description: 'Assess major joints (Neck, RUE, LUE, RLE, LLE) with patient relaxed in sitting position.',
    isLateralized: true, // Special handling for Neck + 4 limbs
    scoring: {
      0: 'Absent',
      1: 'Slight or detectable only when activated by mirror or other movements',
      2: 'Mild to moderate',
      3: 'Marked, but full range of motion easily achieved',
      4: 'Severe, range of motion achieved with difficulty'
    }
  },
  {
    id: 'finger_tapping',
    number: 17,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Finger Tapping',
    description: 'Tap index finger on thumb 10 times as quickly and widely as possible.',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight slowing and/or reduction in amplitude (1-2 taps interrupted)',
      2: 'Mild slowing and/or reduction in amplitude (3-5 taps interrupted)',
      3: 'Moderate slowing and/or reduction in amplitude (6-9 taps interrupted)',
      4: 'Severe slowing, can barely perform the task'
    }
  },
  {
    id: 'hand_movements',
    number: 18,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Hand Movements',
    description: 'Make a tight fist with the arm bent at the elbow so that the palm faces the examiner. Have the patient open the hand 10 times as fully and as quickly as possible.',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight slowing and/or reduction in amplitude',
      2: 'Mild slowing and/or reduction in amplitude',
      3: 'Moderate slowing and/or reduction in amplitude',
      4: 'Severe slowing, can barely perform the task'
    }
  },
  {
    id: 'pronation_supination',
    number: 19,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Pronation-supination movements of hands',
    description: 'Arm outstretched, palm down. Patient should tap index finger on thumb 10 times as quickly and widely as possible.',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight slowing and/or reduction in amplitude',
      2: 'Mild slowing and/or reduction in amplitude',
      3: 'Moderate slowing and/or reduction in amplitude',
      4: 'Severe slowing, can barely perform the task'
    }
  },
  {
    id: 'toe_tapping',
    number: 20,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Toe Tapping',
    description: 'Have the patient tap the ball of the foot 10 times as quickly and widely as possible.',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight slowing and/or reduction in amplitude',
      2: 'Mild slowing and/or reduction in amplitude',
      3: 'Moderate slowing and/or reduction in amplitude',
      4: 'Severe slowing, can barely perform the task'
    }
  },
  {
    id: 'leg_agility',
    number: 21,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Leg Agility',
    description: 'Have the patient tap the heel on the ground 10 times as quickly and widely as possible.',
    isLateralized: true,
    scoring: {
      0: 'Normal',
      1: 'Slight slowing and/or reduction in amplitude',
      2: 'Mild slowing and/or reduction in amplitude',
      3: 'Moderate slowing and/or reduction in amplitude',
      4: 'Severe slowing, can barely perform the task'
    }
  },
  {
    id: 'arising_from_chair',
    number: 22,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Arising from chair',
    description: 'Patient attempts to rise from a straight-back chair with arms folded across chest.',
    scoring: {
      0: 'Normal',
      1: 'Slow or may need more than one attempt',
      2: 'Pushes self up from arms of chair',
      3: 'Tends to fall back and may have to try more than once, but can get up without help',
      4: 'Unable to arise without help'
    }
  },
  {
    id: 'gait',
    number: 23,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Gait',
    description: 'Observe walking pattern. Assess stride length, arm swing, and posture.',
    scoring: {
      0: 'Normal',
      1: 'Walks slowly, may shuffle with short steps, but no festination or propulsion',
      2: 'Walks with difficulty, but requires little or no assistance',
      3: 'Severe disturbance of gait, requiring assistance',
      4: 'Cannot walk at all, even with assistance'
    }
  },
  {
    id: 'freezing_of_gait',
    number: 24,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Freezing of gait',
    description: 'Assess for hesitation or freezing during walking.',
    scoring: {
      0: 'Normal',
      1: 'Freezing on turning only',
      2: 'Occasional freezing when walking',
      3: 'Frequent freezing when walking',
      4: 'Cannot walk because of freezing'
    }
  },
  {
    id: 'postural_stability',
    number: 25,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Postural stability',
    description: 'Use pull test: stand behind patient and gently pull backward at shoulders.',
    scoring: {
      0: 'Normal - Recovers quickly',
      1: 'Retropulsion, but recovers unaided',
      2: 'Absence of postural response; would fall if not caught by examiner',
      3: 'Very unstable, tends to lose balance spontaneously',
      4: 'Unable to stand without assistance'
    }
  },
  {
    id: 'posture',
    number: 26,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Posture',
    description: 'Observe patient standing.',
    scoring: {
      0: 'Normal erect',
      1: 'Not quite erect, slightly stooped posture; could be normal for older person',
      2: 'Moderately stooped posture, definitely abnormal; can be slightly leaning to one side',
      3: 'Severely stooped posture with kyphosis; can be moderately leaning to one side',
      4: 'Marked flexion with extreme abnormality of posture'
    }
  },
  {
    id: 'global_bradykinesia',
    number: 27,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Global spontaneity of movement (Bradykinesia)',
    description: 'Based on global observation during the examination.',
    scoring: {
      0: 'Normal',
      1: 'Slight slowness and poverty of movement',
      2: 'Mild slowness and poverty of movement',
      3: 'Moderate slowness and poverty of movement',
      4: 'Marked slowness and poverty of movement'
    }
  },
  {
    id: 'postural_tremor_hands',
    number: 28,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Postural tremor of hands',
    description: 'Arms outstretched, palms down.',
    isLateralized: true,
    scoring: {
      0: 'Absent',
      1: 'Slight; present with action',
      2: 'Mild in amplitude; present with action',
      3: 'Moderate in amplitude; present with action',
      4: 'Marked in amplitude; present with action'
    }
  },
  {
    id: 'kinetic_tremor_hands',
    number: 29,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Kinetic tremor of hands',
    description: 'Finger-to-nose testing.',
    isLateralized: true,
    scoring: {
      0: 'Absent',
      1: 'Slight; present with action',
      2: 'Mild in amplitude; present with action',
      3: 'Moderate in amplitude; present with action',
      4: 'Marked in amplitude; present with action'
    }
  },
  {
    id: 'resting_tremor_amplitude',
    number: 30,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Resting tremor amplitude',
    description: 'Assess Lip/Jaw, RUE, LUE, RLE, LLE.',
    isLateralized: true, // Special handling for Lip/Jaw + 4 limbs
    scoring: {
      0: 'Absent',
      1: 'Slight (<1 cm) and infrequently present',
      2: 'Mild (>1 cm but <3 cm) and persistent',
      3: 'Moderate (3-10 cm) and present most of the time',
      4: 'Marked (>10 cm) and present most of the time'
    }
  },
  {
    id: 'resting_tremor_constancy',
    number: 31,
    part: 'Part III',
    domain: 'Motor Examination',
    question: 'Constancy of rest tremor',
    description: 'Global observation during examination.',
    scoring: {
      0: 'Absent',
      1: 'Tremor at rest is present <=25% of the time',
      2: 'Tremor at rest is present 26-50% of the time',
      3: 'Tremor at rest is present 51-75% of the time',
      4: 'Tremor at rest is present 76-100% of the time'
    }
  }
];

export const MDS_UPDRS_INTERPRETATION = {
  mild: {
    range: '0-32',
    level: 'Mild Parkinson\'s Disease',
    description: 'Minimal motor and non-motor impairment.'
  },
  moderate: {
    range: '33-58',
    level: 'Moderate Parkinson\'s Disease',
    description: 'Moderate functional impairment across domains.'
  },
  severe: {
    range: '≥59',
    level: 'Severe Parkinson\'s Disease',
    description: 'Significant functional impairment requiring comprehensive management.'
  }
};
