export interface SeizureType {
  id: string;
  code: string;
  name: string;
  description: string;
  subcategories?: SeizureType[];
}

export const ILAE_SEIZURE_CLASSIFICATION: SeizureType[] = [
  {
    id: 'focal',
    code: 'F',
    name: 'Focal Seizures',
    description: 'Seizures originating in a specific brain region',
    subcategories: [
      {
        id: 'focal-preserved-consciousness',
        code: 'FPC',
        name: 'Focal with Preserved Consciousness',
        description: 'Patient maintains awareness during seizure',
      },
      {
        id: 'focal-impaired-consciousness',
        code: 'FIC',
        name: 'Focal with Impaired Consciousness',
        description: 'Altered awareness during seizure',
      },
      {
        id: 'focal-to-bilateral-tonic-clonic',
        code: 'FBTC',
        name: 'Focal-to-Bilateral Tonic-Clonic',
        description: 'Begins focally, progresses to bilateral involvement',
      },
    ],
  },
  {
    id: 'unknown',
    code: 'U',
    name: 'Unknown Focal or Generalized',
    description: 'Cannot determine if seizure is focal or generalized',
    subcategories: [
      {
        id: 'unknown-preserved-consciousness',
        code: 'UPC',
        name: 'Unknown - Preserved Consciousness',
        description: 'Cannot determine origin; awareness preserved',
      },
      {
        id: 'unknown-impaired-consciousness',
        code: 'UIC',
        name: 'Unknown - Impaired Consciousness',
        description: 'Cannot determine origin; awareness impaired',
      },
      {
        id: 'unknown-bilateral-tonic-clonic',
        code: 'UBTC',
        name: 'Unknown - Bilateral Tonic-Clonic',
        description: 'Cannot determine origin; bilateral tonic-clonic presentation',
      },
    ],
  },
  {
    id: 'generalized',
    code: 'G',
    name: 'Generalized Seizures',
    description: 'Seizures involving both brain hemispheres from onset',
    subcategories: [
      {
        id: 'absence-seizures',
        code: 'AS',
        name: 'Absence Seizures',
        description: 'Brief lapses in consciousness',
        subcategories: [
          {
            id: 'typical-absence',
            code: 'TA',
            name: 'Typical Absence',
            description: 'Classic absence seizure with abrupt onset and offset',
          },
          {
            id: 'atypical-absence',
            code: 'AA',
            name: 'Atypical Absence',
            description: 'More gradual onset/offset than typical',
          },
          {
            id: 'myoclonic-absence',
            code: 'MA',
            name: 'Myoclonic Absence',
            description: 'Absence seizure with prominent myoclonic jerks',
          },
          {
            id: 'eyelid-myoclonia',
            code: 'EMA',
            name: 'Eyelid Myoclonia',
            description: 'Eyelid myoclonia with or without absence',
          },
        ],
      },
      {
        id: 'tonic-clonic-seizures',
        code: 'GTC',
        name: 'Generalized Tonic-Clonic Seizures',
        description: 'Classic generalized seizures with tonic and clonic phases',
        subcategories: [
          {
            id: 'myoclonic-tonic-clonic',
            code: 'MTC',
            name: 'Myoclonic Tonic-Clonic',
            description: 'Myoclonic jerks followed by tonic-clonic activity',
          },
          {
            id: 'absence-to-tonic-clonic',
            code: 'ATC',
            name: 'Absence-to-Tonic-Clonic',
            description: 'Absence seizure evolving to tonic-clonic',
          },
        ],
      },
      {
        id: 'other-generalized',
        code: 'G-Other',
        name: 'Other Generalized Seizures',
        description: 'Grouping term for other generalized seizure types',
        subcategories: [
          {
            id: 'generalized-myoclonic',
            code: 'GM',
            name: 'Generalized Myoclonic',
            description: 'Bilateral jerky movements',
          },
          {
            id: 'generalized-clonic',
            code: 'GC',
            name: 'Generalized Clonic',
            description: 'Bilateral repetitive jerky movements',
          },
          {
            id: 'generalized-negative-myoclonic',
            code: 'GNM',
            name: 'Generalized Negative Myoclonic',
            description: 'Brief loss of muscle tone (dropping attacks)',
          },
          {
            id: 'generalized-epileptic-spasms',
            code: 'GES',
            name: 'Generalized Epileptic Spasms',
            description: 'Brief symmetric contractions (infantile spasms)',
          },
          {
            id: 'generalized-tonic',
            code: 'GT',
            name: 'Generalized Tonic',
            description: 'Sustained muscle stiffening',
          },
          {
            id: 'generalized-atonic',
            code: 'GA',
            name: 'Generalized Atonic',
            description: 'Sudden loss of muscle tone (drop attacks)',
          },
          {
            id: 'generalized-myoclonic-atonic',
            code: 'GMA',
            name: 'Generalized Myoclonic-Atonic',
            description: 'Myoclonic jerks followed by loss of tone',
          },
        ],
      },
    ],
  },
  {
    id: 'unclassified',
    code: 'UC',
    name: 'Unclassified Seizures',
    description: 'Seizures that cannot be classified into other categories',
  },
];

export const DESCRIPTORS = {
  BASIC: {
    title: 'Basic Descriptors',
    items: [
      'With observable manifestations',
      'Without observable manifestations',
    ],
  },
  EXPANDED: {
    title: 'Expanded Descriptors',
    items: [
      'Semiology descriptors in chronological sequence',
      'Somatotopic modifiers (location-specific)',
      'Associated features',
    ],
  },
};

export const SEIZURE_NOTES = [
  'Expanded classifications of focal (F) and unknown (U) seizures include detailed semiology descriptors',
  'Descriptors should be applied in chronological order of manifestation',
  'For focal seizures, consciousness status is a primary classifier',
  'For generalized seizures, the bilateral nature is intrinsic to the classification',
  'Seizure type can be further defined by provocation, modifiers, and associated features',
];

export const CLINICAL_CONTEXT = {
  title: 'Clinical Application Guide',
  sections: [
    {
      heading: 'When to Use This Classification',
      content: [
        'During initial seizure evaluation and diagnosis',
        'When documenting seizure events in clinical notes',
        'For treatment planning and medication selection',
        'For prognostication and counseling',
        'For research and epidemiological purposes',
      ],
    },
    {
      heading: 'Key Distinguishing Features',
      content: [
        'Focal vs. Generalized onset is primary distinction',
        'Consciousness status in focal seizures is important for classification',
        'Observable manifestations guide detailed characterization',
        'EEG findings support but do not replace clinical observation',
      ],
    },
    {
      heading: 'Common Abbreviations',
      content: [
        'FPC: Focal with Preserved Consciousness',
        'FIC: Focal with Impaired Consciousness',
        'FBTC: Focal-to-Bilateral Tonic-Clonic',
        'GTC: Generalized Tonic-Clonic',
        'TA: Typical Absence',
        'GM: Generalized Myoclonic',
        'GA: Generalized Atonic (Drop attacks)',
      ],
    },
  ],
};
