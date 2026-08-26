/**
 * DAPHNE-6 Screening Scale for Behavioral Variant Frontotemporal Dementia (bvFTD).
 *
 * Six-domain caregiver-based screening instrument. A domain scores 1 point if at
 * least one symptom in that domain is present, regardless of severity or count.
 * Maximum total score = 6. A score >= 4 is a positive screening result.
 *
 * Source: Boutoleau-Bretonnière C, et al. DAPHNE: A New Tool for the Assessment
 * of the Behavioral Variant of Frontotemporal Dementia. Dement Geriatr Cogn Dis
 * Extra. 2015;5(3):503-516. doi:10.1159/000440859
 */

export interface Daphne6Domain {
  id: string;            // stable key, e.g. 'D1'
  domain: string;        // domain name (English)
  domainMl: string;      // Malayalam label
  shortLabel: string;    // concise label used in the live score bar
  symptoms: string[];    // "positive when" symptom list (English)
  symptomsMl: string[];  // Malayalam symptom list
}

export const DAPHNE6_DOMAINS: Daphne6Domain[] = [
  {
    id: 'D1',
    domain: 'Disinhibition',
    domainMl: 'അനിയന്ത്രണം',
    shortLabel: 'disinhibition',
    symptoms: [
      'Loss of social convenience',
      'Inappropriate joviality',
      'Unrestrained spending habits',
      'Sexual disinhibition',
    ],
    symptomsMl: [
      'സാമൂഹിക മര്യാദ നഷ്ടപ്പെടൽ',
      'അനുചിതമായ ഉല്ലാസം',
      'അമിത ചെലവ് ശീലങ്ങൾ',
      'ലൈംഗിക അനിയന്ത്രണം',
    ],
  },
  {
    id: 'D2',
    domain: 'Apathy',
    domainMl: 'നിസ്സംഗത',
    shortLabel: 'apathy',
    symptoms: ['Loss of initiative or social interest'],
    symptomsMl: ['മുൻകൈയോ സാമൂഹിക താൽപ്പര്യമോ നഷ്ടപ്പെടൽ'],
  },
  {
    id: 'D3',
    domain: 'Perseverations',
    domainMl: 'ആവർത്തനം',
    shortLabel: 'perseverations',
    symptoms: [
      'Fixed ideas',
      'Stereotypical or repetitive behavior',
    ],
    symptomsMl: [
      'ഉറച്ച ആശയങ്ങൾ',
      'സ്റ്റീരിയോടൈപ്പിക്കൽ അല്ലെങ്കിൽ ആവർത്തന സ്വഭാവം',
    ],
  },
  {
    id: 'D4',
    domain: 'Hyperorality',
    domainMl: 'അമിത വായ്ക്കോളിത്തം',
    shortLabel: 'hyperorality',
    symptoms: [
      'New eating disorders or preference for sweets',
      'Bulimia or gluttony',
    ],
    symptomsMl: [
      'പുതിയ ഭക്ഷണ രോഗങ്ങൾ അല്ലെങ്കിൽ മധുരപലഹാരത്തോടുള്ള പ്രിയം',
      'ബുളിമിയ അല്ലെങ്കിൽ അമിത ഭക്ഷണം',
    ],
  },
  {
    id: 'D5',
    domain: 'Personal Neglect',
    domainMl: 'വ്യക്തിപരമായ അവഗണന',
    shortLabel: 'neglect',
    symptoms: [
      'Decline in personal hygiene or grooming',
      'Reduced attention to washing or changing clothes',
    ],
    symptomsMl: [
      'വ്യക്തിപരമായ ശുചിത്വത്തിലോ പരിചരണത്തിലോ കുറവ്',
      'കഴുകുന്നതോ വസ്ത്രം മാറ്റുന്നതോ ശ്രദ്ധിക്കാതിരിക്കുക',
    ],
  },
  {
    id: 'D6',
    domain: 'Loss of Empathy',
    domainMl: 'സഹാനുഭൂതി നഷ്ടം',
    shortLabel: 'empathy',
    symptoms: [
      'Emotional blunting',
      'Indifference',
      'Loss of empathy toward others',
    ],
    symptomsMl: [
      'വൈകാരിക മങ്ങൽ',
      'നിസ്സംഗത',
      'മറ്റുള്ളവരോടുള്ള സഹാനുഭൂതി നഷ്ടപ്പെടൽ',
    ],
  },
];

export const DAPHNE6_MAX_SCORE = 6;

export const DAPHNE6_CUTOFF = {
  threshold: 4, // >= 4/6 positive
  sensitivity: '92%',
  specificity: '57%',
  note:
    'Performance reported in the original validation cohort. DAPHNE-6 is a screening tool and should not be used as a stand-alone diagnosis.',
};

export const DAPHNE6_INTERPRETATION = {
  low: {
    label: 'Below screening threshold',
    labelMl: 'സ്‌ക്രീനിംഗ് പരിധിയ്ക്ക് താഴെ',
    meaning: 'bvFTD less likely on DAPHNE-6 alone',
    meaningMl: 'DAPHNE-6 അനുസരിച്ച് bvFTD സാധ്യത കുറവ്',
  },
  high: {
    label: 'Positive screening result',
    labelMl: 'പോസിറ്റീവ് സ്ക്രീനിംഗ് ഫലം',
    meaning: 'Raises suspicion for bvFTD and warrants comprehensive clinical assessment',
    meaningMl: 'bvFTD സംശയം ഉയർത്തുകയും സമഗ്രമായ ക്ലിനിക്കൽ വിലയിരുത്തൽ ആവശ്യപ്പെടുകയും ചെയ്യുന്നു',
  },
};

export const DAPHNE6_METADATA = {
  toolName: 'DAPHNE-6',
  fullName: 'DAPHNE-6 Screening Scale for Behavioral Variant Frontotemporal Dementia',
  purpose:
    'Six-domain caregiver-based screening instrument for behavioral variant frontotemporal dementia (bvFTD).',
  respondent: 'Caregiver or close informant',
  scoringMethod:
    'Score 1 point for a domain if at least one symptom in that domain is present, regardless of severity or number of symptoms. Score 0 if no symptom is present.',
  maximumScore: 6,
  importantNote:
    'The six-domain DAPHNE-6 score is distinct from DAPHNE-40. DAPHNE-40 uses the ten individual items, each scored 0-4, with a maximum score of 40.',
};
