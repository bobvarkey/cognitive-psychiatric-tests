import { describe, it, expect } from 'vitest';
import { DAPHNE_SCALE_ITEMS_EN, DAPHNE_SCALE_ITEMS_ML } from '../data/daphneScale';
import { DAPHNE_DOMAINS } from '../types/daphne';

describe('DAPHNE Scale Data Validation', () => {
  it('should have 10 items in English version', () => {
    expect(DAPHNE_SCALE_ITEMS_EN.length).toBe(10);
  });

  it('should have 10 items in Malayalam version', () => {
    expect(DAPHNE_SCALE_ITEMS_ML.length).toBe(10);
  });

  it('should map all English items to valid domains', () => {
    DAPHNE_SCALE_ITEMS_EN.forEach(item => {
      expect(DAPHNE_DOMAINS).toContain(item.domain);
    });
  });

  it('should map all Malayalam items to valid domains', () => {
    DAPHNE_SCALE_ITEMS_ML.forEach(item => {
      expect(DAPHNE_DOMAINS).toContain(item.domain);
    });
  });

  it('should have unique IDs for all items', () => {
    const ids = DAPHNE_SCALE_ITEMS_EN.map(item => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have all 5 description levels for each item', () => {
    DAPHNE_SCALE_ITEMS_EN.forEach(item => {
      expect(item.descriptions.normal).toBeDefined();
      expect(item.descriptions.veryMild).toBeDefined();
      expect(item.descriptions.mild).toBeDefined();
      expect(item.descriptions.moderate).toBeDefined();
      // Note: Some severe descriptions might be empty strings if not applicable, but property must exist
      expect(item.descriptions.severe).toBeDefined();
    });
  });
});
