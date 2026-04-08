import { beforeEach, describe, expect, it, vi } from 'vitest';

import { readPracticeStats, writePracticeModeStats } from './practice.storage';

describe('practice.storage', () => {
  const cardSetId = 'test-set';
  const storageKey = `practiceStats:${cardSetId}`;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('readPracticeStats', () => {
    it('returns empty object when no data', () => {
      const result = readPracticeStats(cardSetId);

      expect(result).toEqual({});
    });

    it('returns parsed object when valid JSON exists', () => {
      const data = { typing: { score: 10 } };

      localStorage.setItem(storageKey, JSON.stringify(data));

      const result = readPracticeStats(cardSetId);

      expect(result).toEqual(data);
    });

    it('returns empty object for invalid JSON', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid-json');

      const result = readPracticeStats(cardSetId);

      expect(result).toEqual({});
    });

    it('returns empty object when parsed value is not object', () => {
      localStorage.setItem(storageKey, JSON.stringify('string'));

      const result = readPracticeStats(cardSetId);

      expect(result).toEqual({});
    });
  });

  describe('writePracticeModeStats', () => {
    it('writes new mode stats when storage is empty', () => {
      writePracticeModeStats(cardSetId, 'typing', { score: 5 });

      const stored = JSON.parse(localStorage.getItem(storageKey)!);

      expect(stored).toEqual({
        typing: { score: 5 },
      });
    });

    it('merges with existing modes without overwriting them', () => {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          typing: { score: 5 },
        }),
      );

      writePracticeModeStats(cardSetId, 'listening', { score: 10 });

      const stored = JSON.parse(localStorage.getItem(storageKey)!);

      expect(stored).toEqual({
        typing: { score: 5 },
        listening: { score: 10 },
      });
    });

    it('overwrites only specific mode', () => {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          typing: { score: 5 },
        }),
      );

      writePracticeModeStats(cardSetId, 'typing', { score: 20 });

      const stored = JSON.parse(localStorage.getItem(storageKey)!);

      expect(stored).toEqual({
        typing: { score: 20 },
      });
    });
  });
});