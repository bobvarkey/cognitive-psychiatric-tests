import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sub = vi.hoisted(() => ({ value: {} as Record<string, unknown> }));
vi.mock('@/contexts/SubscriptionContext', async (orig) => ({
  ...(await orig<typeof import('@/contexts/SubscriptionContext')>()),
  useSubscription: () => sub.value,
}));

vi.mock('@/contexts/LanguageContext', async (orig) => ({
  ...(await orig<typeof import('@/contexts/LanguageContext')>()),
  useLanguage: () => ({ t: (k: string) => k, language: 'en', setLanguage: vi.fn() }),
}));

vi.mock('@/contexts/PatientInfoContext', async (orig) => ({
  ...(await orig<typeof import('@/contexts/PatientInfoContext')>()),
  usePatientInfo: () => ({ clearPatientInfo: vi.fn() }),
}));

vi.mock('react-router-dom', async (orig) => ({
  ...(await orig<typeof import('react-router-dom')>()),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: window.location.pathname }),
}));

// Stubbed so the not-locked case can be observed without rendering a real
// assessment and the context tree it pulls in (HamdAssessment renders
// PatientInfoForm, which needs providers this test does not stand up).
vi.mock('@/components/PsychiatricTriageAssessment', () => ({
  PsychiatricTriageAssessment: () => <div data-testid="triage">triage</div>,
}));
vi.mock('@/components/CcsaAssessment', () => ({
  CcsaAssessment: () => <div data-testid="ccsa">ccsa</div>,
}));

import { AssessmentSelector } from './AssessmentSelector';

const setSub = (over: Record<string, unknown>) => {
  sub.value = {
    subscription: null,
    premiumSource: 'demo',
    setShowPaywall: vi.fn(),
    tier: 'trial',
    ...over,
  };
};

const LOCKED = 'This assessment is part of Cognito Pro.';

describe('assessment lock, as rendered', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('refuses a deep link to an assessment a trial does not cover', () => {
    window.history.pushState({}, '', '/assessment/hamd');
    setSub({ tier: 'trial' });
    render(<AssessmentSelector />);

    // A deep link never passes through the click handler, so without the render
    // branch this is where the assessment itself would appear.
    expect(screen.getByText(LOCKED)).toBeTruthy();
  });

  it('opens a deep link the trial does cover', () => {
    window.history.pushState({}, '', '/assessment/triage');
    setSub({ tier: 'trial' });
    render(<AssessmentSelector />);

    // The other half of the branch: the lock must not swallow what a trial holds.
    expect(screen.getByTestId('triage')).toBeTruthy();
    expect(screen.queryByText(LOCKED)).toBeNull();
  });

  it('badges the locked tiles, and only those', () => {
    setSub({ tier: 'trial' });
    render(<AssessmentSelector />);

    // The registry sits behind the category cards, so open one that holds both a
    // covered assessment (CCSA) and an uncovered one (Lobar Functions).
    fireEvent.click(screen.getByRole('button', { name: /^Cognitive/ }));

    const tile = (name: string) =>
      screen.getByRole('button', { name: new RegExp(`^${name}`) });
    // So the free set is legible before anyone clicks — the third wiring point.
    expect(tile('CCSA').textContent).not.toContain('Pro');
    expect(tile('Lobar Functions').textContent).toContain('Pro');
  });

  it('sends a locked tile to the paywall, and opens a covered one', () => {
    const setShowPaywall = vi.fn();
    setSub({ tier: 'trial', setShowPaywall });
    render(<AssessmentSelector />);
    fireEvent.click(screen.getByRole('button', { name: /^Cognitive/ }));

    fireEvent.click(screen.getByRole('button', { name: /^Lobar Functions/ }));
    expect(setShowPaywall).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /^CCSA/ }));
    expect(setShowPaywall).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('ccsa')).toBeTruthy();
  });
});
