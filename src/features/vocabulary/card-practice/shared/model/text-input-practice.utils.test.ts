import { describe, expect, it } from 'vitest';

import { norm, round } from './text-input-practice.utils';

describe('text-input-practice.utils', () => {
  describe('norm', () => {
    it('trims whitespace and converts string to lowercase', () => {
      expect(norm('  HeLLo WoRLD  ')).toBe('hello world');
    });

    it('returns empty string for whitespace-only input', () => {
      expect(norm('   \n\t   ')).toBe('');
    });

    it('keeps inner whitespace intact', () => {
      expect(norm('  Hello   World  ')).toBe('hello   world');
    });
  });

  describe('round', () => {
    it('rounds down when fractional part is less than 0.5', () => {
      expect(round(10.4)).toBe(10);
    });

    it('rounds up when fractional part is 0.5 or greater', () => {
      expect(round(10.5)).toBe(11);
      expect(round(10.6)).toBe(11);
    });

    it('returns integer unchanged', () => {
      expect(round(15)).toBe(15);
    });
  });
});