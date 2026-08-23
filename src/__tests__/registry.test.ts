import { describe, it, expect } from 'vitest';
import { assessments } from '../components/AssessmentSelector';

describe('Assessment Registry Validation', () => {
  it('should have unique keys for all assessments', () => {
    const keys = assessments.map((a: any) => a.key);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('should have non-empty name and subtitle for all assessments', () => {
    assessments.forEach((a: any) => {
      expect(a.name.length).toBeGreaterThan(0);
      expect(a.subtitle.length).toBeGreaterThan(0);
    });
  });

  it('should have at least one category for all assessments', () => {
    assessments.forEach((a: any) => {
      expect(a.category.length).toBeGreaterThan(0);
    });
  });

  it('should have valid icons', () => {
    assessments.forEach((a: any) => {
      expect(a.icon).toBeDefined();
    });
  });
});

