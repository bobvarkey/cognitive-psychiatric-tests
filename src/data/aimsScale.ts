export interface AimsItem {
  id: string;
  number: number;
  area: string;
  body_region: string;
  description: string;
  scoring: {
    [key: number]: string;
  };
}

export const AIMS_ITEMS: AimsItem[] = [
  {
    id: 'facial_movements',
    number: 1,
    area: 'Orofacial Area',
    body_region: 'Facial movements',
    description: 'Observe face and lips at rest and in conversation. Rate any involuntary movements of the face.',
    scoring: {
      0: 'Normal - no involuntary movements',
      1: 'Minimal - rare, slight movements of face',
      2: 'Mild - obvious slight movements; present less than half the time',
      3: 'Moderate - involuntary movements present approximately half the time',
      4: 'Severe - involuntary movements almost always present'
    }
  },
  {
    id: 'lip_puckering',
    number: 2,
    area: 'Orofacial Area',
    body_region: 'Lip puckering',
    description: 'Observe lips at rest and during movements. Rate lip puckering, pouting, or pursing.',
    scoring: {
      0: 'Normal - no involuntary movements',
      1: 'Minimal - rare, slight movements of lips',
      2: 'Mild - obvious slight movements; present less than half the time',
      3: 'Moderate - involuntary movements present approximately half the time',
      4: 'Severe - involuntary movements almost always present'
    }
  },
  {
    id: 'jaw_movements',
    number: 3,
    area: 'Orofacial Area',
    body_region: 'Jaw movements',
    description: 'Observe jaw and lateral movements. Rate jaw clenching, lateral movements, or clicking.',
    scoring: {
      0: 'Normal - no involuntary movements',
      1: 'Minimal - rare, slight jaw movements',
      2: 'Mild - obvious slight movements; present less than half the time',
      3: 'Moderate - involuntary movements present approximately half the time',
      4: 'Severe - involuntary movements almost always present'
    }
  },
  {
    id: 'tongue_protrusion',
    number: 4,
    area: 'Orofacial Area',
    body_region: 'Tongue movements (when mouth is open)',
    description: 'Ask patient to open mouth. Observe tongue protrusion and involuntary tongue movements.',
    scoring: {
      0: 'Normal - no involuntary movements',
      1: 'Minimal - rare protrusions or slight movements',
      2: 'Mild - obvious movements; present less than half the time',
      3: 'Moderate - involuntary movements present approximately half the time',
      4: 'Severe - tongue movements almost always present'
    }
  },
  {
    id: 'upper_extremity_right',
    number: 5,
    area: 'Extremities',
    body_region: 'Upper extremity (right arm and hand)',
    description: 'Observe right arm and hand for involuntary movements, including choreoathetoid movements, dystonia, or ballismus.',
    scoring: {
      0: 'Normal - no involuntary movements',
      1: 'Minimal - occasional choreiform movements',
      2: 'Mild - obvious involuntary movements; less than half the observation time',
      3: 'Moderate - involuntary movements approximately half the time',
      4: 'Severe - involuntary movements almost constantly present'
    }
  },
  {
    id: 'upper_extremity_left',
    number: 6,
    area: 'Extremities',
    body_region: 'Upper extremity (left arm and hand)',
    description: 'Observe left arm and hand for involuntary movements, including choreoathetoid movements, dystonia, or ballismus.',
    scoring: {
      0: 'Normal - no involuntary movements',
      1: 'Minimal - occasional choreiform movements',
      2: 'Mild - obvious involuntary movements; less than half the observation time',
      3: 'Moderate - involuntary movements approximately half the time',
      4: 'Severe - involuntary movements almost constantly present'
    }
  },
  {
    id: 'lower_extremity_right',
    number: 7,
    area: 'Extremities',
    body_region: 'Lower extremity (right leg and foot)',
    description: 'Observe right leg and foot for involuntary movements, including choreoathetoid movements, dystonia, or ballismus.',
    scoring: {
      0: 'Normal - no involuntary movements',
      1: 'Minimal - occasional choreiform movements',
      2: 'Mild - obvious involuntary movements; less than half the observation time',
      3: 'Moderate - involuntary movements approximately half the time',
      4: 'Severe - involuntary movements almost constantly present'
    }
  },
  {
    id: 'lower_extremity_left',
    number: 8,
    area: 'Extremities',
    body_region: 'Lower extremity (left leg and foot)',
    description: 'Observe left leg and foot for involuntary movements, including choreoathetoid movements, dystonia, or ballismus.',
    scoring: {
      0: 'Normal - no involuntary movements',
      1: 'Minimal - occasional choreiform movements',
      2: 'Mild - obvious involuntary movements; less than half the observation time',
      3: 'Moderate - involuntary movements approximately half the time',
      4: 'Severe - involuntary movements almost constantly present'
    }
  },
  {
    id: 'trunk',
    number: 9,
    area: 'Trunk and Other Areas',
    body_region: 'Trunk movements (neck, shoulders, hips)',
    description: 'Observe trunk for involuntary movements including neck twisting, shoulder shrugging, or hip swaying.',
    scoring: {
      0: 'Normal - no involuntary movements',
      1: 'Minimal - occasional movements',
      2: 'Mild - obvious movements; present less than half the time',
      3: 'Moderate - involuntary movements approximately half the time',
      4: 'Severe - involuntary movements almost constantly present'
    }
  },
  {
    id: 'global_severity',
    number: 10,
    area: 'Global Assessment',
    body_region: 'Global assessment of severity',
    description: 'Evaluate the overall severity of involuntary movements across the entire body.',
    scoring: {
      0: 'None - normal movement',
      1: 'Minimal severity',
      2: 'Mild severity - movements are noticeable but not functionally impairing',
      3: 'Moderate severity - movements cause some functional impairment',
      4: 'Severe - movements are markedly functionally impairing'
    }
  },
  {
    id: 'incapacity',
    number: 11,
    area: 'Global Assessment',
    body_region: 'Patient\'s awareness of involuntary movements',
    description: 'Ask patient: "Are you aware of any movements in your body that you cannot control?" Rate patient\'s awareness.',
    scoring: {
      0: 'No awareness',
      1: 'Minimal awareness - occasional realization of movements',
      2: 'Moderate awareness - aware of movements sometimes',
      3: 'Marked awareness - frequently aware of movements',
      4: 'Complete awareness - constantly aware of involuntary movements'
    }
  }
];

export const AIMS_INTERPRETATION = {
  normal: {
    range: '0-8',
    level: 'Normal',
    description: 'No dyskinesia detected.'
  },
  borderline: {
    range: '9-15',
    level: 'Borderline Dyskinesia',
    description: 'Minimal involuntary movements detected. Monitor for progression.'
  },
  mild: {
    range: '16-25',
    level: 'Mild Dyskinesia',
    description: 'Mild involuntary movements present. Consider medication adjustment.'
  },
  moderate: {
    range: '26-40',
    level: 'Moderate Dyskinesia',
    description: 'Moderate involuntary movements with some functional impact.'
  },
  severe: {
    range: '>40',
    level: 'Severe Dyskinesia',
    description: 'Severe involuntary movements with significant functional impairment. Consider therapeutic intervention.'
  }
};
