export interface DaphneItem {
  id: string;
  domain: string;
  title: string;
  descriptions: {
    normal: string;
    veryMild: string;
    mild: string;
    moderate: string;
    severe: string;
  };
}

export interface DaphneResponse {
  itemId: string;
  score: number; // 0-4
}

export interface DaphneResults {
  responses: DaphneResponse[];
  daphne6Score: number; // 0-6 screening score
  daphne40Score: number; // 0-40 diagnostic score
  domainScores: Record<string, number>;
  /** Structured DAPHNE-6 result (typed), available after scoring. */
  daphne6?: Daphne6Result;
}

export const DAPHNE_DOMAINS = [
  'disinhibition',
  'apathy', 
  'empathy',
  'perseverations',
  'hyperorality',
  'neglect'
] as const;

export type DaphneDomain = typeof DAPHNE_DOMAINS[number];

/**
 * Binary presence (0/1) per DAPHNE domain — a domain counts as affected when
 * ANY of its constituent items is scored > 0. Max = 6.
 */
export type Daphne6Domains = Record<DaphneDomain, boolean>;

/**
 * Structured DAPHNE-6 result object.
 * totalScore 0–6 (sum of affected domains); riskCategory derived from the
 * validated ≥4 screening cut-off (Boutoleau-Bretonnière et al., 2015).
 */
export type Daphne6Result = {
  totalScore: number; // 0–6
  riskCategory: 'Low' | 'High'; // based on ≥4 cut-off
  domains: Daphne6Domains;
  metadata: {
    scoreName: 'DAPHNE-6';
    version: '1.0.0';
    sourceCitation:
      'Boutoleau-Bretonnière C, et al. DAPHNE: A New Tool for the Assessment of the Behavioral Variant of Frontotemporal Dementia. Dement Geriatr Cogn Dis Extra. 2015;5(3):503–516. doi:10.1159/000440859';
    lastClinicalReview: '2026-08-23';
    limitations: [
      'Validated in a multicenter French cohort (bvFTD vs AD/PSP/bipolar).',
      'Caregiver-reported; may be influenced by caregiver characteristics.',
      'Not a standalone diagnostic test; use with clinical assessment and imaging/biomarkers as appropriate.',
      'Cut-off ≥4 optimized for screening (high sensitivity, moderate specificity).',
    ];
    disclaimer:
      'This tool provides risk estimates for clinician decision support only. It does not diagnose bvFTD, prescribe treatment, or replace clinical judgment.';
  };
};

/**
 * Build a structured DAPHNE-6 result from raw item responses.
 *
 * A domain is marked present when ANY of its items has score > 0. The binary
 * present/absent flags are summed to `totalScore` (0–6). riskCategory is
 * 'High' at the validated ≥4 screening cut-off.
 *
 * @param responses raw item responses (score 0–4 each)
 * @returns a typed Daphne6Result
 */
export function buildDaphne6Result(responses: DaphneResponse[]): Daphne6Result {
  const domains: Daphne6Domains = {
    disinhibition: false,
    apathy: false,
    empathy: false,
    perseverations: false,
    hyperorality: false,
    neglect: false
  };

  responses.forEach((r) => {
    if (r.score > 0) {
      const domain = (DAPHNE_SCALE_TO_DOMAINS as Record<string, DaphneDomain>)[r.itemId];
      if (domain) domains[domain] = true;
    }
  });

  const totalScore = DAPHNE_DOMAINS.filter((d) => domains[d]).length;

  return {
    totalScore,
    riskCategory: totalScore >= 4 ? 'High' : 'Low',
    domains,
    metadata: {
      scoreName: 'DAPHNE-6',
      version: '1.0.0',
      sourceCitation:
        'Boutoleau-Bretonnière C, et al. DAPHNE: A New Tool for the Assessment of the Behavioral Variant of Frontotemporal Dementia. Dement Geriatr Cogn Dis Extra. 2015;5(3):503–516. doi:10.1159/000440859',
      lastClinicalReview: '2026-08-23',
      limitations: [
        'Validated in a multicenter French cohort (bvFTD vs AD/PSP/bipolar).',
        'Caregiver-reported; may be influenced by caregiver characteristics.',
        'Not a standalone diagnostic test; use with clinical assessment and imaging/biomarkers as appropriate.',
        'Cut-off ≥4 optimized for screening (high sensitivity, moderate specificity).',
      ],
      disclaimer:
        'This tool provides risk estimates for clinician decision support only. It does not diagnose bvFTD, prescribe treatment, or replace clinical judgment.',
    },
  };
}

// Maps each DAPHNE item id to its domain (used by buildDaphne6Result).
const DAPHNE_SCALE_TO_DOMAINS = {
  disinhibition: 'disinhibition',
  'inappropriate-joviality': 'disinhibition',
  'unrestrained-spending': 'disinhibition',
  'sexual-disinhibition': 'disinhibition',
  apathy: 'apathy',
  'loss-of-empathy': 'empathy',
  perseverations: 'perseverations',
  hyperorality: 'hyperorality',
  'bulimia-gluttony': 'hyperorality',
  'personal-neglect': 'neglect',
} as const satisfies Record<string, DaphneDomain>;