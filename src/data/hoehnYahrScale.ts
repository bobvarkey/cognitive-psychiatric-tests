export interface HoehnYahrStage {
  stage: string;
  description: string;
  characteristics: string[];
}

export const HOEHN_YAHR_STAGES: HoehnYahrStage[] = [
  {
    stage: 'Stage 0',
    description: 'No signs of disease',
    characteristics: [
      'No motor symptoms present',
      'No signs of Parkinson\'s disease detected'
    ]
  },
  {
    stage: 'Stage 1',
    description: 'Unilateral disease (symptoms on one side of body)',
    characteristics: [
      'Symptoms appear on one side of the body only',
      'Minimal functional impairment',
      'Symptoms may include tremor, rigidity, or bradykinesia on one side'
    ]
  },
  {
    stage: 'Stage 1.5',
    description: 'Unilateral plus axial involvement',
    characteristics: [
      'Symptoms on one side of body (dominant)',
      'Early midline involvement (neck, trunk)',
      'Postural reflexes may be impaired'
    ]
  },
  {
    stage: 'Stage 2',
    description: 'Bilateral disease without postural instability',
    characteristics: [
      'Symptoms appear on both sides of the body',
      'No postural instability present',
      'Patient can maintain balance when standing or turning',
      'May have some gait abnormalities'
    ]
  },
  {
    stage: 'Stage 2.5',
    description: 'Bilateral disease with recovery on pull test',
    characteristics: [
      'Bilateral symptoms present',
      'Impaired postural reflexes (but can recover balance with assistance)',
      'Patient recovers balance when pulled backward (positive pull test)'
    ]
  },
  {
    stage: 'Stage 3',
    description: 'Mild to moderate bilateral disease with postural instability',
    characteristics: [
      'Bilateral disease symptoms',
      'Postural instability present',
      'Patient can still stand and walk independently',
      'Increased risk of falls',
      'Significant functional impairment'
    ]
  },
  {
    stage: 'Stage 4',
    description: 'Severe bilateral disease with loss of postural reflexes',
    characteristics: [
      'Severe bilateral symptoms',
      'Marked postural instability',
      'Cannot stand or walk without assistance',
      'Patient may be confined to bed or wheelchair',
      'Severe functional limitation'
    ]
  },
  {
    stage: 'Stage 5',
    description: 'Severe disease with inability to care for self',
    characteristics: [
      'Severe bilateral symptoms',
      'Profound postural instability',
      'Patient is confined to bed or wheelchair',
      'Completely dependent on caregivers',
      'Unable to perform activities of daily living',
      'Severe cognitive or psychiatric changes possible'
    ]
  }
];
