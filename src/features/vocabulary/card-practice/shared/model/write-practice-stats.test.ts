import { beforeEach,describe, expect, it, vi } from 'vitest';

import { writeContextStats } from '@/features/vocabulary/card-practice/context/model/context.storage';
import { writeListeningStats } from '@/features/vocabulary/card-practice/listening/model/listening.storage';
import { writeRecognitionStats } from '@/features/vocabulary/card-practice/recognition/model/recognition.storage';
import { writeTypingStats } from '@/features/vocabulary/card-practice/typing/model/typing.storage';

import { writePracticeModeStats } from './practice.storage';

vi.mock('./practice.storage', () => ({
  writePracticeModeStats: vi.fn(),
}));

describe('write*Stats wrappers', () => {
  const stats = {
    totalCards: 10,
    completedCards: 9,
    totalAnswers: 12,
    correctAnswers: 9,
    firstTryCorrectCards: 7,
    wrongAnswers: 2,
    skippedCards: 1,
    avgTimeMs: 500,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls writePracticeModeStats with listening mode', () => {
    writeListeningStats('set-1', stats);

    expect(writePracticeModeStats).toHaveBeenCalledWith(
      'set-1',
      'listening',
      stats,
    );
  });

  it('calls writePracticeModeStats with context mode', () => {
    writeContextStats('set-1', stats);

    expect(writePracticeModeStats).toHaveBeenCalledWith(
      'set-1',
      'context',
      stats,
    );
  });

  it('calls writePracticeModeStats with recognition mode', () => {
    writeRecognitionStats('set-1', stats);

    expect(writePracticeModeStats).toHaveBeenCalledWith(
      'set-1',
      'recognition',
      stats,
    );
  });

  it('calls writePracticeModeStats with typing mode', () => {
    writeTypingStats('set-1', stats);

    expect(writePracticeModeStats).toHaveBeenCalledWith(
      'set-1',
      'typing',
      stats,
    );
  });
});