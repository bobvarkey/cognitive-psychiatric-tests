import type { AssessmentKey } from '@/components/AssessmentSelector';
import type { EntitlementTier } from '@/lib/entitlement';

/**
 * What the 3-day trial unlocks.
 *
 * This is presentation scope, not entitlement: the server decides *whether* an
 * account is in a trial (`entitlement_tier()`), and this decides what a trial is
 * allowed to see. Keeping the list here means the trial's contents can change
 * without touching access control.
 *
 * Membership is an explicit list of keys, never a category test. A category rule
 * cannot express "the top of the registry": `cognitive` alone would reach 38 of
 * the 96 assessments, and `triage` — the first thing a new user should try —
 * belongs to no category but `all`.
 *
 * These are the twenty entries of the registry's Triage & Core Flows section.
 * `src/__tests__/trialScope.test.ts` pins the list against the top of the
 * registry, so a renamed key fails the build rather than silently shrinking the
 * trial.
 */
export const TRIAL_KEYS: readonly AssessmentKey[] = [
  'triage',
  'adhd-outpatient',
  'adhd',
  'adhdScreener',
  'opd-psych-eval',
  'cdr',
  'fast',
  'dementia',
  'daphne6',
  'moca',
  'miniace',
  'minicog',
  'fab',
  'mse',
  'cognitiveSyndromes',
  'iqcode',
  'adam',
  'tulia',
  'callosal',
  'consciousness',
];

/** May a trial see this assessment? */
export const isVisibleInTrial = (key: AssessmentKey): boolean => TRIAL_KEYS.includes(key);

/**
 * May this tier open this assessment?
 *
 * `full` is everything; `trial` is the section above; `none` is nothing. Used at
 * every point that can reach an assessment, so the rule has one home.
 */
export const canOpenAssessment = (key: AssessmentKey, tier: EntitlementTier): boolean =>
  tier === 'full' || (tier === 'trial' && isVisibleInTrial(key));

export type { EntitlementTier };
