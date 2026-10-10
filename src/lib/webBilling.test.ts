import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const STORE_KEY = 'psycognito.webPremium.v1';
const DEV_EMAIL = 'dev-tester@example.com';

// Mocked Supabase client: no session unless a test provides one.
const sb = vi.hoisted(() => ({
  getSession: vi.fn(),
  signInWithOtp: vi.fn(),
  verifyOtp: vi.fn(),
  invoke: vi.fn(),
}));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { getSession: sb.getSession, signInWithOtp: sb.signInWithOtp, verifyOtp: sb.verifyOtp },
    functions: { invoke: sb.invoke },
  },
}));

const noSession = () => sb.getSession.mockResolvedValue({ data: { session: null }, error: null });
const withSession = (email = 'payer@example.com') =>
  sb.getSession.mockResolvedValue({
    data: { session: { access_token: 'user-jwt', user: { email } } },
    error: null,
  });

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
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    noSession();
  });
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

describe('webBilling restore requires a verified email session', () => {
  const future = new Date(Date.now() + 30 * 86400_000).toISOString();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    noSession();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    localStorage.clear();
  });

  it('typed email without a verified session: no lookup, no premium, nothing stored', async () => {
    const billing = await loadBilling({ dev: false });
    expect(await billing.restoreWebPurchase('payer@example.com')).toBeNull();
    expect(sb.invoke).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
    expect(billing.getWebPremium()).toBeNull();
  });

  it('verified lookup asks billing-restore, and stores nothing in the browser', async () => {
    // The restore flow used to write a localStorage flag from the server's
    // answer. The server writes the grant now; this browser writes nothing, so
    // that a stolen laptop cannot carry access away with it.
    sb.verifyOtp.mockResolvedValue({ data: { session: { access_token: 'user-jwt' } }, error: null });
    withSession('payer@example.com');
    sb.invoke.mockResolvedValue({
      data: { restored: true, plan: 'monthly', expiresAt: future },
      error: null,
    });
    const billing = await loadBilling({ dev: false });

    const found = await billing.verifyRestoreCode('payer@example.com', '123456');

    expect(sb.invoke.mock.calls.at(-1)?.[0]).toBe('billing-restore');
    expect(sb.invoke.mock.calls.some(([fn]: unknown[]) => fn === 'razorpay-status')).toBe(false);
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
    expect(found).toMatchObject({ plan: 'monthly' });
  });

  it('a restore the server does not recognise writes nothing at all', async () => {
    sb.verifyOtp.mockResolvedValue({ data: { session: { access_token: 'user-jwt' } }, error: null });
    withSession('payer@example.com');
    sb.invoke.mockResolvedValue({ data: { restored: false }, error: null });
    const billing = await loadBilling({ dev: false });

    await expect(billing.verifyRestoreCode('payer@example.com', '123456')).resolves.toBeNull();
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });

  it('requestRestoreCode emails a one-time code and unlocks nothing yet', async () => {
    sb.signInWithOtp.mockResolvedValue({ data: {}, error: null });
    const billing = await loadBilling({ dev: false });
    expect(await billing.requestRestoreCode(' Payer@Example.com ')).toBeNull();
    expect(sb.signInWithOtp).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'payer@example.com', options: expect.objectContaining({ shouldCreateUser: true }) }),
    );
    expect(sb.invoke).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });

  it('requestRestoreCode surfaces send errors', async () => {
    sb.signInWithOtp.mockResolvedValue({ data: {}, error: { message: 'Rate limit exceeded' } });
    const billing = await loadBilling({ dev: false });
    await expect(billing.requestRestoreCode('payer@example.com')).rejects.toThrow('Rate limit exceeded');
  });

  it('verifyRestoreCode: bad code format never calls Supabase', async () => {
    const billing = await loadBilling({ dev: false });
    await expect(billing.verifyRestoreCode('payer@example.com', '12ab')).rejects.toThrow();
    expect(sb.verifyOtp).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });

  it('verifyRestoreCode: wrong/expired code stores nothing', async () => {
    sb.verifyOtp.mockResolvedValue({ data: { session: null }, error: { message: 'Token has expired or is invalid' } });
    const billing = await loadBilling({ dev: false });
    await expect(billing.verifyRestoreCode('payer@example.com', '123456')).rejects.toThrow(/invalid or has expired/);
    expect(sb.invoke).not.toHaveBeenCalled();
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });

  it('verifyRestoreCode: valid code then verified lookup restores access', async () => {
    sb.verifyOtp.mockResolvedValue({ data: { session: { access_token: 'user-jwt' } }, error: null });
    withSession('payer@example.com');
    sb.invoke.mockResolvedValue({
      data: { restored: true, plan: 'yearly', expiresAt: future },
      error: null,
    });
    const billing = await loadBilling({ dev: false });
    const found = await billing.verifyRestoreCode('payer@example.com', '123456');
    expect(sb.verifyOtp).toHaveBeenCalledWith({ email: 'payer@example.com', token: '123456', type: 'email' });
    expect(found).toMatchObject({ email: 'payer@example.com', plan: 'yearly' });
  });

  it('dev build: developer email unlocks at step 1 without sending a code', async () => {
    const billing = await loadBilling({ dev: true, emails: DEV_EMAIL });
    const found = await billing.requestRestoreCode(DEV_EMAIL);
    expect(found).toMatchObject({ email: DEV_EMAIL, source: 'dev' });
    expect(sb.signInWithOtp).not.toHaveBeenCalled();
    expect(sb.invoke).not.toHaveBeenCalled();
  });

  it('production build: developer email at step 1 just sends a code', async () => {
    sb.signInWithOtp.mockResolvedValue({ data: {}, error: null });
    const billing = await loadBilling({ dev: false, emails: DEV_EMAIL });
    expect(await billing.requestRestoreCode(DEV_EMAIL)).toBeNull();
    expect(sb.signInWithOtp).toHaveBeenCalled();
    expect(localStorage.getItem(STORE_KEY)).toBeNull();
  });

  it('email-link completion only runs when a restore is pending', async () => {
    withSession('payer@example.com');
    sb.invoke.mockResolvedValue({
      data: { restored: true, plan: 'yearly', expiresAt: future },
      error: null,
    });
    const billing = await loadBilling({ dev: false });
    expect(await billing.completeRestoreFromEmailLink()).toBeNull();
    expect(sb.invoke).not.toHaveBeenCalled();

    sb.signInWithOtp.mockResolvedValue({ data: {}, error: null });
    await billing.requestRestoreCode('payer@example.com');
    expect(await billing.completeRestoreFromEmailLink()).toMatchObject({ email: 'payer@example.com' });
    expect(localStorage.getItem('psycognito.restorePending.v1')).toBeNull();
  });
});

