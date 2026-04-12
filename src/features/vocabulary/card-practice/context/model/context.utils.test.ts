import { describe, expect, it } from 'vitest';

import {
  escapeRegExp,
  pickContextExample,
} from '@/features/vocabulary/card-practice/context/model/context.utils.ts';

describe('escapeRegExp', () => {
  it('escapes regexp special characters', () => {
    expect(escapeRegExp('a.b+c?^$()[]{}|\\')).toBe(
      'a\\.b\\+c\\?\\^\\$\\(\\)\\[\\]\\{\\}\\|\\\\',
    );
  });

  it('returns same string when there are no special characters', () => {
    expect(escapeRegExp('hello world')).toBe('hello world');
  });

  it('returns empty string for empty input', () => {
    expect(escapeRegExp('')).toBe('');
  });
});

describe('pickContextExample', () => {
  it('returns null when value is empty', () => {
    expect(pickContextExample('', ['some example'])).toBeNull();
    expect(pickContextExample('   ', ['some example'])).toBeNull();
  });

  it('returns null when examples list is empty', () => {
    expect(pickContextExample('word', [])).toBeNull();
  });

  it('returns null when all examples are empty', () => {
    expect(pickContextExample('word', ['', '   '])).toBeNull();
  });

  it('returns first matching example and masked version', () => {
    expect(
      pickContextExample('apple', [
        'I like apple juice.',
        'Apple pie is tasty.',
      ]),
    ).toEqual({
      example: 'I like apple juice.',
      masked: 'I like _____ juice.',
    });
  });

  it('matches case-insensitively', () => {
    expect(
      pickContextExample('apple', ['I like Apple juice.']),
    ).toEqual({
      example: 'I like Apple juice.',
      masked: 'I like _____ juice.',
    });
  });

  it('trims value and example before returning', () => {
    expect(
      pickContextExample('  apple  ', ['  I like apple juice.  ']),
    ).toEqual({
      example: 'I like apple juice.',
      masked: 'I like _____ juice.',
    });
  });

  it('matches whole word only', () => {
    expect(
      pickContextExample('app', ['application is useful', 'this app works']),
    ).toEqual({
      example: 'this app works',
      masked: 'this _____ works',
    });
  });

  it('returns null when only substring match exists', () => {
    expect(
      pickContextExample('app', ['application is useful']),
    ).toBeNull();
  });

  it('escapes special regexp characters in value', () => {
    expect(
      pickContextExample('a.b', ['Example with a.b inside']),
    ).toEqual({
      example: 'Example with a.b inside',
      masked: 'Example with _____ inside',
    });
  });

  it('skips empty examples and continues search', () => {
    expect(
      pickContextExample('apple', ['', '   ', 'Apple is red']),
    ).toEqual({
      example: 'Apple is red',
      masked: '_____ is red',
    });
  });

  it('returns null when there are no matching examples', () => {
    expect(
      pickContextExample('apple', ['Orange is tasty', 'Banana is yellow']),
    ).toBeNull();
  });

  it('replaces only the first matched occurrence', () => {
    expect(
      pickContextExample('apple', ['apple and apple together']),
    ).toEqual({
      example: 'apple and apple together',
      masked: '_____ and apple together',
    });
  });
});