import type { Category } from '@/components/AssessmentSelector';

/**
 * What the 3-day trial unlocks.
 *
 * The home page groups its assessments into eleven category tabs; the trial
 * opens three of them. This is presentation scope, not entitlement: the server
 * decides *whether* an account is in a trial (`entitlement_tier()`), and this
 * decides what a trial is allowed to see. Keeping the list here means the
 * trial's contents can change without touching access control.
 *
 * `all` is deliberately absent. It is a view over every other category, so
 * including it would hand a trial the entire library — the UI must filter that
 * tab down to these categories rather than simply hide it.
 *
 * `all`-only tools (the `triage` flow) therefore fall outside the trial. Add
 * their key explicitly if a trial should include them.
 */
export const TRIAL_CATEGORIES: readonly Category[] = ['cognitive', 'mood', 'sleep'];

/**
 * May a trial see this assessment?
 *
 * Takes the assessment's own category list, because one assessment can belong
 * to several (`adhd` is `all` + `cognitive`, `triage` is only `all`).
 */
export const isVisibleInTrial = (categories: readonly Category[]): boolean =>
  categories.some((category) => TRIAL_CATEGORIES.includes(category));
