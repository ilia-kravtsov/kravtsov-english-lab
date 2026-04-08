import { describe, expect, it } from 'vitest';

import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('does not mutate original array', () => {
    const original = [1, 2, 3, 4];
    const copy = [...original];

    shuffle(original);

    expect(original).toEqual(copy);
  });

  it('returns array with same length', () => {
    const arr = [1, 2, 3, 4, 5];

    const result = shuffle(arr);

    expect(result.length).toBe(arr.length);
  });

  it('returns array with same elements', () => {
    const arr = [1, 2, 3, 4, 5];

    const result = shuffle(arr);

    expect(result.sort()).toEqual([...arr].sort());
  });

  it('works with empty array', () => {
    const result = shuffle([]);

    expect(result).toEqual([]);
  });

  it('works with single element array', () => {
    const result = shuffle([42]);

    expect(result).toEqual([42]);
  });
});