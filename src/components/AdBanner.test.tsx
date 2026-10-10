import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useSubscription = vi.hoisted(() => vi.fn());
vi.mock('@/contexts/SubscriptionContext', () => ({ useSubscription }));

import { AdBanner } from './AdBanner';

const subscription = (over: Partial<Record<string, unknown>> = {}) => ({
  checkingServerAccess: false,
  isPremium: false,
  demoTrialActive: false,
  setShowPaywall: vi.fn(),
  features: [],
  ...over,
});

describe('AdBanner', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows no upgrade banner while the server is still answering', () => {
    // Before the server has answered, a paying customer looks exactly like a
    // free one; showing an upgrade banner here is the flash the spec forbids.
    useSubscription.mockReturnValue(subscription({ checkingServerAccess: true }));
    render(<AdBanner />);
    expect(screen.queryByRole('button', { name: /upgrade to cognito pro/i })).toBeNull();
  });

  it('still shows the banner to a free user once the server has answered', () => {
    useSubscription.mockReturnValue(subscription());
    render(<AdBanner />);
    expect(screen.getByRole('button', { name: /upgrade to cognito pro/i })).toBeTruthy();
  });
});
