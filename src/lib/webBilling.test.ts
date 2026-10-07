import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const STORE_KEY = 'psycognito.webPremium.v1';
const DEV_EMAIL = 'dev-tester@example.com';

// DEVELOPER_EMAILS is computed at module load, so stub env first and then
// import a fresh copy of the module.
async function loadBilling(env: { dev: boolean; emails?: string }) {
  vi.resetModules();
  vi.stubEnv('DEV', env.dev);
  vi.stubEnv('PROD', !env.dev);
  vi.stubEnv('VITE_DEVELOPER_EMAILS', env.emails ?? '');
  return import('./webBilling');
}

describe('webBilling developer unlock', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => {
    vi.unstubAllEnvs();
    localStorage.clear();
  });

  it('parses the email list', async () => {
    const { parseDeveloperEmails } = await loadBilling({ dev: true });
    expect(parseDeveloperEmails(' A@x.com, ,b@Y.com ')).toEqual(['a@x.com', 'b@y.com']);
    expect(parseDeveloperEmails(undefined)).toEqual([]);
  });

  it('dev build: whitelisted email unlocks with a dev-marked entitlement', async () => {
    const billing = await loadBilling({ dev: true, emails: `Other@x.com, ${DEV_EMAIL.toUpperCase()}` });
    expect(billing.isDeveloperEmail(DEV_EMAIL)).toBe(true);
    const found = await billing.restoreWebPurchase(`  ${DEV_EMAIL} `);
    expect(found).toMatchObject({ email: DEV_EMAIL, plan: 'yearly', source: 'dev' });
    expect(billing.getWebPremium()).toMatchObject({ email: DEV_EMAIL, source: 'dev' });
  });

  it('dev build: non-whitelisted email still finds nothing', async () => {
    const billing = await loadBilling({ dev: true, emails: DEV_EMAIL });
    expect(await billing.restoreWebPurchase('someone@else.com')).toBeNull();
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });

  it('production build: developer emails are ignored and nothing is stored', async () => {
    const billing = await loadBilling({ dev: false, emails: DEV_EMAIL });
    expect(billing.DEVELOPER_EMAILS).toEqual([]);
    expect(billing.isDeveloperEmail(DEV_EMAIL)).toBe(false);
    expect(await billing.restoreWebPurchase(DEV_EMAIL)).toBeNull();
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });

  it('production build: ignores dev-marked entitlements but keeps other stored data', async () => {
    const future = new Date(Date.now() + 86400_000).toISOString();
    const billing = await loadBilling({ dev: false });

    localStorage.setItem(STORE_KEY, JSON.stringify({ email: DEV_EMAIL, plan: 'yearly', currentPeriodEnd: future, source: 'dev' }));
    expect(billing.getWebPremium()).toBeNull();
    expect(localStorage.getItem(STORE_KEY)).not.toBeNull(); // not deleted

    const paid = { email: 'paid@example.com', plan: 'monthly', currentPeriodEnd: future };
    localStorage.setItem(STORE_KEY, JSON.stringify(paid));
    expect(billing.getWebPremium()).toEqual(paid);
  });
});
