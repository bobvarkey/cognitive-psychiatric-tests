// Somatic Delusions — clinical taxonomy & decision aid data.
// Educational/reference content (no scoring). Structured from the
// taxonomy of somatic delusions by content theme, bizarreness, and
// clinical context (DSM-5-TR).

export interface SomaticTheme {
  id: string;
  name: string;
  definition: string;
  examples: string[];
  redFlags: string[];
}

export interface BizarrenessCategory {
  id: 'bizarre' | 'nonBizarre';
  name: string;
  description: string;
  examples: string[];
  implication: string;
}

export interface ClinicalContext {
  id: string;
  name: string;
  features: string[];
  commonThemes: string[];
}

export interface Differential {
  condition: string;
  key: string;
  insight: string;
  content: string;
}

export interface SomaticDelusionsData {
  title: string;
  subtitle: string;
  definition: string;
  themes: SomaticTheme[];
  bizarreness: BizarrenessCategory[];
  contexts: ClinicalContext[];
  differential: Differential[];
}

export const SOMATIC_DELUSIONS_DATA: SomaticDelusionsData = {
  title: 'Somatic Delusions',
  subtitle: 'Taxonomy & decision aid — content theme, bizarreness, and clinical context',
  definition:
    'Somatic delusions are fixed false beliefs about the body — its structure, function, or contents — held with delusional conviction and no insight. They are not a single uniform phenomenon; they group by content theme, bizarreness, and clinical context. Seen in delusional disorder (somatic type), schizophrenia, and mood disorders with psychotic features.',
  themes: [
    {
      id: 'infestation',
      name: 'Infestation / Parasitosis (Delusional Infestation)',
      definition:
        'Fixed belief that insects, parasites, worms, or other organisms are living in or on the body (often skin).',
      examples: [
        'Formication — tactile hallucination of crawling sensations',
        'Excoriations from scratching',
        '"Matchbox sign" — bringing samples of "bugs" to clinic',
        'Repeated dermatology / infectious-disease visits',
      ],
      redFlags: ['Skin excoriations', 'Specimen samples', 'Repeated negative workups'],
    },
    {
      id: 'disease',
      name: 'Disease / Serious Illness Despite Negative Workup',
      definition:
        'Conviction of having a specific serious disease (cancer, HIV, MS, organ failure) despite repeated normal investigations and reassurance.',
      examples: [
        'More "medicalized" content than delusional infestation',
        'Held with delusional conviction and no insight',
        'Persists despite normal labs and imaging',
      ],
      redFlags: ['Normal workup', 'No insight', 'Fixed conviction'],
    },
    {
      id: 'organ',
      name: 'Organ Malfunction, Decay, or Deformation',
      definition:
        'Beliefs that internal organs or tissues are rotting, dissolving, necrotic, missing, shrunk, enlarged, twisted, or replaced.',
      examples: [
        '"My liver has turned to stone"',
        '"My intestines are tied in knots"',
        '"My nose is collapsing"',
        '"My skull is caving in"',
      ],
      redFlags: ['Physiologically implausible', 'Bizarre content'],
    },
    {
      id: 'odor',
      name: 'Bodily Emissions / Odor (Olfactory Reference Syndrome–type)',
      definition:
        'Fixed belief that one emits a foul odor (breath, sweat, genitals, flatulence) that others notice and react to, despite no objective evidence.',
      examples: [
        'Excessive washing or perfume use',
        'Repeated dental procedures',
        'Social avoidance',
      ],
      redFlags: ['Social avoidance', 'Excessive hygiene behaviors'],
    },
    {
      id: 'nihilistic',
      name: 'Nihilistic / Catastrophic (Cotard’s Spectrum)',
      definition:
        'Belief that parts of the body are missing, nonfunctional, or that the person is already dead or decomposing.',
      examples: [
        '"My organs are rotting"',
        '"I am already dead"',
        'Often in severe depression with psychotic features or organic states',
      ],
      redFlags: ['Severe depression', 'Mood-congruent', 'Catastrophic content'],
    },
    {
      id: 'foreign',
      name: 'Foreign Body / Implant / Contamination',
      definition:
        'Conviction that objects, devices, toxins, or substances are inside the body.',
      examples: [
        '"Chips implanted in my brain"',
        '"Poison in my blood"',
        '"Plastic in my organs"',
      ],
      redFlags: ['Stimulant-associated psychosis', 'Bizarre content'],
    },
    {
      id: 'functional',
      name: 'Functional / Sensory Somatic Delusions',
      definition:
        'Beliefs about abnormal bodily functions or sensations — the core is the interpretive belief, which may overlap with somatic hallucinations.',
      examples: [
        '"My blood is flowing backwards"',
        '"My heart has stopped but I’m still alive"',
        '"My nerves are burning out"',
      ],
      redFlags: ['Overlaps with somatic hallucinations'],
    },
  ],
  bizarreness: [
    {
      id: 'nonBizarre',
      name: 'Non-bizarre',
      description: 'Could in principle happen, but is false in this case.',
      examples: ['"I have undiagnosed cancer"', '"I’m infested with bedbugs"', '"I emit a terrible smell"'],
      implication: 'More consistent with delusional disorder or mood disorder with psychotic features.',
    },
    {
      id: 'bizarre',
      name: 'Bizarre',
      description: 'Physiologically impossible or patently implausible.',
      examples: [
        '"My organs have been replaced with someone else’s"',
        '"My bones have twisted into a figure-eight"',
        '"My blood has turned into acid"',
      ],
      implication: 'More strongly points toward a schizophrenia-spectrum or severe psychotic process.',
    },
  ],
  contexts: [
    {
      id: 'delusionalDisorder',
      name: 'Delusional Disorder, Somatic Type',
      features: [
        'One or more somatic delusions',
        'Relatively preserved functioning outside the delusional domain',
        'Minimal other psychotic symptoms',
      ],
      commonThemes: ['Infestation', 'Odor', 'Deformity', 'Disease'],
    },
    {
      id: 'schizophrenia',
      name: 'Schizophrenia / Schizoaffective Disorder',
      features: [
        'Somatic delusions alongside other psychotic features (persecutory delusions, hallucinations, disorganization)',
        'Content often more bizarre',
        'May mix with somatic hallucinations',
      ],
      commonThemes: ['Bizarre content', 'Mixed with hallucinations'],
    },
    {
      id: 'mood',
      name: 'Mood Disorders with Psychotic Features (esp. severe depression)',
      features: [
        'Mood-congruent somatic delusions: guilt/nihilism',
        'Cotard-type beliefs',
      ],
      commonThemes: ['"My organs are rotting because I’m sinful"', 'Cotard beliefs'],
    },
    {
      id: 'substance',
      name: 'Substance/Medication-Induced or Organic',
      features: [
        'Stimulants (cocaine, amphetamines) → infestation, foreign-body beliefs',
        'Neurological disease, dementia, delirium → varied somatic delusional content',
      ],
      commonThemes: ['Infestation', 'Foreign body', 'Varied organic content'],
    },
  ],
  differential: [
    {
      condition: 'Illness Anxiety Disorder / Somatic Symptom Disorder',
      key: 'Fear/worry about disease or symptoms, but not fixed false beliefs',
      insight: 'Some insight usually preserved',
      content: 'Generally non-bizarre',
    },
    {
      condition: 'Somatic Hallucinations',
      key: 'False perceptions ("I feel my organs moving") vs somatic delusions (false beliefs about what is happening)',
      insight: 'Distinct phenomena, often co-occur',
      content: 'Perceptual vs interpretive',
    },
    {
      condition: 'Body Dysmorphic Disorder',
      key: 'Preoccupation with perceived defects in appearance',
      insight: 'Usually not delusional (insight varies)',
      content: 'Focused on aesthetics, not medical/biological catastrophe',
    },
  ],
};
