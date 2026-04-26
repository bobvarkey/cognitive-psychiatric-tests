// Per-item bedside procedure, scoring rules, and category-specific interpretation
// for the DAPHNE-40 / DAPHNE-6 (Boutoleau-Bretonnière, 2015).

export interface DaphneLearnMore {
  procedure: string;            // How to elicit the symptom at the bedside
  scoring: string;              // What 0–4 mean for this item
  interpretations: {            // Category-specific clinical meaning
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
  };
}

const SHARED_SCORING =
  '0 = no trouble; 1 = very mild; 2 = mild; 3 = moderate; 4 = severe. Anchor each rating to the closest behavioural description shown above.';

export const DAPHNE_LEARN_MORE: Record<string, DaphneLearnMore> = {
  disinhibition: {
    procedure:
      'Interview the caregiver about social comportment over the last 6 months. Ask: tactless or hurtful remarks, intrusion into strangers’ activities, public-order breaches (urinating in public, obscene language), loss of social tact at family gatherings.',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'Socially appropriate. Contributes nothing to the disinhibition domain of DAPHNE-6.',
      1: 'Subtle tactlessness toward intimates only — early warning; flag for follow-up.',
      2: 'Tactless toward strangers — clinically meaningful disinhibition; counts toward DAPHNE-6 disinhibition domain.',
      3: 'Cannot sustain ordinary social activity — moderate disinhibition; supports bvFTD frontal-orbital dysfunction.',
      4: 'Frank breaches of public order — severe disinhibition; classic orbitofrontal sign.',
    },
  },
  'inappropriate-joviality': {
    procedure:
      'Ask the informant about untimely laughter, joking at funerals, in waiting rooms, with children, or in response to bad news. Distinguish from pseudobulbar affect (uncontrolled laughter without congruent mood).',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'No inappropriate jocularity.',
      1: 'Excess but redirectable — mild trait change.',
      2: 'Cannot stop on request in inappropriate contexts — clear disinhibition.',
      3: 'Joviality in embarrassing situations — moderate; right-frontal involvement common.',
      4: 'Cruel or shocking jokes in solemn settings (Witzelsucht) — severe.',
    },
  },
  'unrestrained-spending': {
    procedure:
      'Ask family about new shopping patterns, online purchases, hoarded low-value items, gambling debts, or out-of-character generosity. Review bank statements if available.',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'Spending unchanged.',
      1: 'Repetitive low-value purchases but reasons with family — early.',
      2: 'Refractory to family advice — clinically significant disinhibition.',
      3: 'Cannot judge cost or appropriateness — moderate; loss of value reasoning.',
      4: 'Debt or gambling losses — severe; medico-legal/financial-capacity concern.',
    },
  },
  'sexual-disinhibition': {
    procedure:
      'Ask sensitively about new sexual remarks, public undressing, inappropriate touching, paraphilic interests, or sexual approaches to inappropriate targets. Use the partner separately if needed.',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'No sexual disinhibition.',
      1: 'Lewd jokes that stop on request — mild.',
      2: 'Acts on inappropriate sexual remarks; public indecency — significant.',
      3: 'Unwanted/illegal sexual behaviour — severe; safeguarding action required.',
      4: 'Reserved (item caps at 3 for this domain).',
    },
  },
  apathy: {
    procedure:
      'Ask the caregiver: does the patient initiate activities, finish them, restart after stimulation? Quantify time spent inactive in chair/bed. Distinguish from depression (low mood, anhedonia, guilt).',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'Spontaneous activity preserved.',
      1: 'Needs encouragement only for non-routine tasks — mild.',
      2: 'Starts but does not finish; needs prompting — clinically significant apathy.',
      3: 'Stops and does not restart even when stimulated — moderate.',
      4: 'Akinetic; chair- or bed-bound by inertia — severe; supports medial-frontal/anterior cingulate involvement.',
    },
  },
  'loss-of-empathy': {
    procedure:
      'Ask informant about emotional warmth, interest in others’ news, response to others’ distress, ability to read facial expression. Ask the patient to describe a recent emotional family event.',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'Normal emotional engagement.',
      1: 'Self-reported emotional flatness — mild.',
      2: 'Indifferent to relatives’ stories; difficulty naming feelings — significant.',
      3: 'Emotional indifference to family members — moderate; right-temporal/orbitofrontal sign.',
      4: 'Cannot decode or express emotion; incongruent reactions — severe.',
    },
  },
  perseverations: {
    procedure:
      'Ask about repetitive routines, hoarding, fixed times for daily acts, stereotyped phrases, motor stereotypies (rocking, tapping, lip-smacking). Observe in clinic for stereotyped speech or movement.',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'No stereotypy or compulsion.',
      1: 'Ordinary collecting/routines — mild.',
      2: 'Ritualised behaviour compatible with social life — significant.',
      3: 'Compulsions interfere with daily/social function — moderate.',
      4: 'Continuous motor or verbal stereotypies — severe; striatal/orbitofrontal involvement.',
    },
  },
  hyperorality: {
    procedure:
      'Ask about new sweet tooth, food fads, attempts to eat inedible objects, drinking from others’ cups, raids on the fridge. Ask whether locks have been added to cupboards.',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'Normal eating preferences.',
      1: 'New sweet preference — mild; common early bvFTD sign.',
      2: 'New/bizarre food choices but listens to reason — significant.',
      3: 'Excess intake unresponsive to advice; cupboards locked — moderate.',
      4: 'Eats from others’ plates or eats inedibles — severe; classic Klüver-Bucy-like change.',
    },
  },
  'bulimia-gluttony': {
    procedure:
      'Ask about speed and manner of eating, table manners, choking risk, mouth-stuffing, weight gain. Ask the family for a weight trajectory if available.',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'Normal table behaviour.',
      1: 'Increased intake with weight gain — mild.',
      2: 'Voracious but tidy — significant.',
      3: 'Eats fast and messily; choking risk — moderate; aspiration safety concern.',
      4: 'Eats with hands, holds food in mouth, marked weight gain — severe.',
    },
  },
  'personal-neglect': {
    procedure:
      'Inspect grooming, nails, hair, clothing, dental hygiene, body odour. Ask the carer how often the patient washes or changes clothes spontaneously vs after prompting.',
    scoring: SHARED_SCORING,
    interpretations: {
      0: 'Self-care preserved.',
      1: 'Less neat than baseline — mild.',
      2: 'Needs stimulation to wash/change — significant.',
      3: 'Will only wash when threatened or tricked — moderate; supports advanced bvFTD.',
      4: 'Frank squalor — severe; safeguarding/social-care referral indicated.',
    },
  },
};
