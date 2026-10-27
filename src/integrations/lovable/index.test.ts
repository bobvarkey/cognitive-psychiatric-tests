import { beforeEach, describe, expect, it, vi } from 'vitest';

// The SDK and the Supabase client are the two things this wrapper exists to
// join, so both are replaced at the module boundary and nothing else is.
const signInWithOAuth = vi.hoisted(() => vi.fn());
const setSession = vi.hoisted(() => vi.fn());

vi.mock('@lovable.dev/cloud-auth-js', () => ({
  createLovableAuth: () => ({ signInWithOAuth }),
}));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { auth: { setSession } } }));

import { lovable } from './index';

const OPTS = { redirect_uri: 'https://app.example.com', extraParams: { prompt: 'select_account' } };
const TOKENS = { access_token: 'access-token', refresh_token: 'refresh-token' };

beforeEach(() => {
  vi.clearAllMocks();
});

describe('lovable.auth.signInWithOAuth', () => {
  it('forwards the provider and options to the SDK unchanged', async () => {
    signInWithOAuth.mockResolvedValue({ redirected: true, error: null });

    await lovable.auth.signInWithOAuth('google', OPTS);

    expect(signInWithOAuth).toHaveBeenCalledWith('google', OPTS);
  });

  it('sets no session when the SDK navigated the page away', async () => {
    signInWithOAuth.mockResolvedValue({ redirected: true, error: null });

    const result = await lovable.auth.signInWithOAuth('google', OPTS);

    expect(result).toMatchObject({ redirected: true });
    expect(setSession).not.toHaveBeenCalled();
  });

  it('passes an SDK error through without setting a session', async () => {
    const error = new Error('Popup was blocked');
    signInWithOAuth.mockResolvedValue({ error });

    const result = await lovable.auth.signInWithOAuth('google', OPTS);

    expect(result.error).toBe(error);
    expect(setSession).not.toHaveBeenCalled();
  });

  it('establishes the session from the tokens the popup returned', async () => {
    signInWithOAuth.mockResolvedValue({ tokens: TOKENS, error: null });
    setSession.mockResolvedValue({ data: {}, error: null });

    const result = await lovable.auth.signInWithOAuth('google', OPTS);

    expect(setSession).toHaveBeenCalledWith(TOKENS);
    expect(result.tokens).toEqual(TOKENS);
  });

  it('reports a failure to store the session instead of claiming success', async () => {
    signInWithOAuth.mockResolvedValue({ tokens: TOKENS, error: null });
    setSession.mockRejectedValue(new Error('storage unavailable'));

    const result = await lovable.auth.signInWithOAuth('google', OPTS);

    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe('storage unavailable');
    expect(result.tokens).toBeUndefined();
  });
});
