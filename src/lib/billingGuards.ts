export const ALREADY_SUBSCRIBED_MESSAGE =
  'You already have an active subscription. Manage it from your Account page.';

/** Sources that mean the account already pays (or never needs to). */
export const hasPaidAccess = (source: string): boolean =>
  source === 'web' || source === 'store' || source === 'developer';
