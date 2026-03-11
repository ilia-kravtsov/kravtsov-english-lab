export type DashboardSection = {
  id: string;
  to: string;
  title: string;
  description: string;
};

export const dashboardSections: DashboardSection[] = [
  {
    id: 'daily',
    to: 'daily-practice',
    title: 'Daily Practice',
    description:
      'Short focused exercises that help you practice English every day and build a consistent learning habit.',
  },
  {
    id: 'writing',
    to: 'writing',
    title: 'Writing',
    description:
      'Tasks for sentence building, short messages, descriptions, and longer texts to improve clear written expression.',
  },
  {
    id: 'speaking',
    to: 'speaking',
    title: 'Speaking',
    description:
      'Pronunciation and speaking exercises that help you become more fluent, confident, and natural in conversation.',
  },
  {
    id: 'listening',
    to: 'listening',
    title: 'Listening',
    description:
      'Dialogues, phrases, and short stories that train comprehension and improve understanding of natural speech.',
  },
  {
    id: 'reading',
    to: 'reading',
    title: 'Reading',
    description:
      'Reading practice with texts of different difficulty levels to improve comprehension, speed, and vocabulary.',
  },
  {
    id: 'vocabulary',
    to: 'vocabulary',
    title: 'Vocabulary',
    description:
      'Manage your vocabulary, save new words, organize them into sets, and practice them in different learning modes.',
  },
  {
    id: 'theory',
    to: 'theory',
    title: 'Theory',
    description:
      'Grammar explanations, language structures, and useful guides that support practical exercises in other sections.',
  },
  {
    id: 'profile',
    to: 'profile',
    title: 'Profile',
    description:
      'Your personal information, learning progress, activity, and statistics collected while using the platform.',
  },
  {
    id: 'rating',
    to: 'rating',
    title: 'Rating',
    description:
      'Leaderboards, achievements, and progress comparison designed to increase motivation and consistency.',
  },
  {
    id: 'settings',
    to: 'settings',
    title: 'Settings',
    description:
      'Account preferences, interface options, and study settings that let you adapt the platform to your needs.',
  },
];