import { describe, it, expect } from 'vitest';
import { render, act } from '@testing-library/react';
import { ConsciousnessAssessment } from './ConsciousnessAssessment';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

const MALAYALAM_RE = /[\u0D00-\u0D7F]/;

const renderWithProvider = () => {
  let api: ReturnType<typeof useLanguage> | null = null;
  const Capture = () => {
    api = useLanguage();
    return null;
  };
  const utils = render(
    <LanguageProvider>
      <Capture />
      <ConsciousnessAssessment />
    </LanguageProvider>
  );
  return { ...utils, getApi: () => api! };
};

describe('ConsciousnessAssessment language gating', () => {
  it('default language is English — no Malayalam characters anywhere', () => {
    const { container, getApi } = renderWithProvider();
    expect(getApi().language).toBe('en');
    expect(container.textContent ?? '').not.toMatch(MALAYALAM_RE);
  });

  it('renders English tab labels and section titles by default', () => {
    const { container } = renderWithProvider();
    const text = container.textContent ?? '';
    expect(text).toContain('Glasgow Coma Scale');
    expect(text).toContain('Eye opening (E)');
  });

  it('exposes only English and Malayalam in the language toggle list', async () => {
    const { LANGUAGES } = await import('@/contexts/LanguageContext');
    expect(LANGUAGES.map((l) => l.code).sort()).toEqual(['en', 'ml']);
  });

  it('renders Malayalam translations when toggled to ML, and removes them when toggled back', () => {
    const { container, getApi } = renderWithProvider();
    expect(container.textContent ?? '').not.toMatch(MALAYALAM_RE);

    act(() => getApi().setLanguage('ml'));
    expect(getApi().language).toBe('ml');
    const ml = container.textContent ?? '';
    expect(ml).toMatch(MALAYALAM_RE);
    // Malayalam GCS title should be present, English title should not
    expect(ml).toContain('ഗ്ലാസ്ഗോ കോമ സ്കെയിൽ');
    expect(ml).not.toContain('Glasgow Coma Scale');

    act(() => getApi().setLanguage('en'));
    expect(container.textContent ?? '').not.toMatch(MALAYALAM_RE);
  });
});
