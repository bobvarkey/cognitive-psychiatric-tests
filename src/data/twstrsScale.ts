export interface TwstrsItem {
  id: string;
  number: number;
  subscale: string;
  item_name: string;
  description: string;
  scoring: {
    [key: number]: string;
  };
  max_score?: number;
}

export const TWSTRS_ITEMS: TwstrsItem[] = [
  // Severity Subscale (0-25)
  {
    id: 'duration',
    number: 1,
    subscale: 'Severity',
    item_name: 'Duration',
    description: 'How long has the head been turned or tilted for most of the time?',
    scoring: {
      0: 'Never present during day',
      1: 'Present less than 25% of day',
      2: 'Present 25-50% of day',
      3: 'Present 50-75% of day',
      4: 'Present more than 75% of day'
    },
    max_score: 4
  },
  {
    id: 'severity_rotation',
    number: 2,
    subscale: 'Severity',
    item_name: 'Severity of head rotation',
    description: 'What is the maximum degree of head rotation abnormality? (Measure the maximum horizontal angle of head deviation)',
    scoring: {
      0: 'Normal, 0-5 degrees',
      1: 'Mild, 6-15 degrees',
      2: 'Moderate, 16-25 degrees',
      3: 'Marked, 26-40 degrees',
      4: 'Severe, >40 degrees'
    },
    max_score: 4
  },
  {
    id: 'severity_laterocollis',
    number: 3,
    subscale: 'Severity',
    item_name: 'Severity of head tilt (laterocollis)',
    description: 'What is the maximum degree of head tilt abnormality? (Measure the angle of tilt toward shoulder)',
    scoring: {
      0: 'Normal, 0-5 degrees',
      1: 'Mild, 6-15 degrees',
      2: 'Moderate, 16-25 degrees',
      3: 'Marked, 26-40 degrees',
      4: 'Severe, >40 degrees'
    },
    max_score: 4
  },
  {
    id: 'severity_anterocollis',
    number: 4,
    subscale: 'Severity',
    item_name: 'Severity of forward head tilt (anterocollis)',
    description: 'What is the maximum degree of forward head tilt? (Measure angle of flexion)',
    scoring: {
      0: 'Absent',
      1: 'Mild flexion of neck',
      2: 'Moderate flexion of neck',
      3: 'Marked flexion of neck',
      4: 'Severe flexion of neck'
    },
    max_score: 4
  },
  {
    id: 'severity_retrocollis',
    number: 5,
    subscale: 'Severity',
    item_name: 'Severity of backward head tilt (retrocollis)',
    description: 'What is the maximum degree of backward head tilt? (Measure angle of extension)',
    scoring: {
      0: 'Absent',
      1: 'Mild extension of neck',
      2: 'Moderate extension of neck',
      3: 'Marked extension of neck',
      4: 'Severe extension of neck'
    },
    max_score: 4
  },
  {
    id: 'shoulder_elevation',
    number: 6,
    subscale: 'Severity',
    item_name: 'Shoulder elevation',
    description: 'Is there shoulder elevation or shrugging?',
    scoring: {
      0: 'Absent',
      1: 'Mild shoulder elevation on one or both sides',
      2: 'Moderate shoulder elevation',
      3: 'Marked shoulder elevation',
      4: 'Severe shoulder elevation'
    },
    max_score: 4
  },
  // Disability Subscale (0-30)
  {
    id: 'work_limitations',
    number: 7,
    subscale: 'Disability',
    item_name: 'Work limitations',
    description: 'To what extent does the condition interfere with your work or daily activities?',
    scoring: {
      0: 'No interference with work or hobbies',
      1: 'Slight interference with work or hobbies',
      2: 'Moderate interference with work or hobbies',
      3: 'Marked interference with work or hobbies',
      4: 'Unable to work or hobbies due to dystonia',
      5: 'Unable to perform any activities'
    },
    max_score: 5
  },
  {
    id: 'social_withdrawal',
    number: 8,
    subscale: 'Disability',
    item_name: 'Social withdrawal',
    description: 'Have you withdrawn from social situations?',
    scoring: {
      0: 'No social withdrawal',
      1: 'Minimal social withdrawal',
      2: 'Moderate social withdrawal - avoids some social situations',
      3: 'Marked social withdrawal - avoids most social situations',
      4: 'Severe social withdrawal - essentially withdrawn from all social activities',
      5: 'Complete social isolation'
    },
    max_score: 5
  },
  {
    id: 'emotional_wellbeing',
    number: 9,
    subscale: 'Disability',
    item_name: 'Emotional well-being',
    description: 'How has the condition affected your mood and emotional state?',
    scoring: {
      0: 'No emotional effect',
      1: 'Minimal emotional distress',
      2: 'Mild emotional distress - occasional mood changes',
      3: 'Moderate emotional distress - frequent mood changes',
      4: 'Marked emotional distress - significant mood changes affecting daily life',
      5: 'Severe emotional distress - mood severely affected'
    },
    max_score: 5
  },
  {
    id: 'head_control',
    number: 10,
    subscale: 'Disability',
    item_name: 'Head control',
    description: 'Can you control the abnormal head position?',
    scoring: {
      0: 'Full control of head position',
      1: 'Can usually control head position with effort',
      2: 'Can control head position sometimes',
      3: 'Difficulty controlling head position',
      4: 'Minimal control of head position',
      5: 'No control of head position'
    },
    max_score: 5
  },
  {
    id: 'pain',
    number: 11,
    subscale: 'Disability',
    item_name: 'Pain',
    description: 'How much pain do you experience in your neck region?',
    scoring: {
      0: 'No pain',
      1: 'Minimal pain',
      2: 'Mild pain - occasional discomfort',
      3: 'Moderate pain - frequent discomfort affecting activity',
      4: 'Marked pain - severe pain limiting activities',
      5: 'Severe pain - debilitating, continuous'
    },
    max_score: 5
  },
  // Disability Subscale Continued
  {
    id: 'tremor',
    number: 12,
    subscale: 'Disability',
    item_name: 'Tremor',
    description: 'Is there head tremor present?',
    scoring: {
      0: 'No tremor',
      1: 'Occasional mild tremor',
      2: 'Mild tremor - noticeable but not functionally impairing',
      3: 'Moderate tremor - interferes with function',
      4: 'Marked tremor - significantly interferes with function',
      5: 'Severe tremor - severely functionally impairing'
    },
    max_score: 5
  }
];

export const TWSTRS_INTERPRETATION = {
  mild: {
    range: '0-20',
    level: 'Mild Cervical Dystonia',
    description: 'Minimal symptoms with little functional impairment.'
  },
  moderate: {
    range: '21-40',
    level: 'Moderate Cervical Dystonia',
    description: 'Noticeable symptoms with some functional impairment.'
  },
  severe: {
    range: '41-60',
    level: 'Severe Cervical Dystonia',
    description: 'Significant symptoms with marked functional impairment.'
  },
  verysevere: {
    range: '>60',
    level: 'Very Severe Cervical Dystonia',
    description: 'Severe symptoms with substantial functional impairment and disability.'
  }
};
