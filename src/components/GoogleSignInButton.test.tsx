import { render, screen, waitFor } from '@testing-library/react';
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

it('surfaces a sign-in that throws rather than resolving', async () => {
  // The SDK normally resolves with { error }, but a network failure or a
  // blocking browser can reject instead, and an unhandled rejection would
  // leave the button spinning with no explanation.
  oauth.mockRejectedValue(new Error('network down'));
  render(<GoogleSignInButton />);
  await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }));
  await waitFor(() => expect(error).toHaveBeenCalledWith('Google sign-in failed. Please try again.'));
});

it('disables the button while the redirect is in flight', async () => {
  // Double-tapping must not open two popups or two broker redirects.
  let finish: (value: unknown) => void = () => {};
  oauth.mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
  render(<GoogleSignInButton />);
  const button = screen.getByRole('button', { name: 'Continue with Google' });

  await userEvent.click(button);
  expect(button).toBeDisabled();

  finish({ redirected: true });
  await waitFor(() => expect(button).not.toBeDisabled());
});