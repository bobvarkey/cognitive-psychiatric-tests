import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
const oauth = vi.hoisted(() => vi.fn());
const error = vi.hoisted(() => vi.fn());
vi.mock('@/integrations/lovable', () => ({ lovable: { auth: { signInWithOAuth: oauth } } }));
vi.mock('sonner', () => ({ toast: { error } }));
import { GoogleSignInButton } from './GoogleSignInButton';
beforeEach(() => { vi.clearAllMocks(); });
it('verifies ownership through Google rather than requesting an email code', async () => {
  oauth.mockResolvedValue({ redirected: true });
  render(<GoogleSignInButton />);
  await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));
  expect(oauth).toHaveBeenCalledWith('google', {
    redirect_uri: window.location.origin, extraParams: { prompt: 'select_account' },
  });
});
it('surfaces Google failures without granting access', async () => {
  oauth.mockResolvedValue({ error: new Error('Connection failed') });
  render(<GoogleSignInButton />);
  await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));
  expect(error).toHaveBeenCalledWith('Connection failed');
});