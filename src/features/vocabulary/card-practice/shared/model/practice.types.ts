export type PracticeModeStats = {
  totalCards: number;
  completedCards: number;
  firstTryCorrectCards: number;
  wrongAnswers: number;
  skippedCards: number;
  totalAnswers: number;
  correctAnswers: number;
  avgTimeMs: number;
};

export type PracticeStats = {
  recognition?: PracticeModeStats;
  typing?: PracticeModeStats;
  listening?: PracticeModeStats;
  context?: PracticeModeStats;
};
