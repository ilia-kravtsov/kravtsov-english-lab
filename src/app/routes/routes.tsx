import { Profiler } from 'react';

import { ProtectedRoute } from '@/app/routes/ProtectedRoute';
import { AppInitWrapper } from '@/app/ui/AppInitWrapper';
import { CardSets } from '@/features/vocabulary/card-sets';
import { AuthLayout } from '@/pages/auth/auth-layout';
import { ForgotPassword } from '@/pages/auth/forgot-password';
import { Login } from '@/pages/auth/login';
import { Register } from '@/pages/auth/register';
import { ResetPassword } from '@/pages/auth/reset-password';
import { DailyPractice } from '@/pages/daily-practice';
import { Home } from '@/pages/home';
import { Listening } from '@/pages/listening';
import { NotFound } from '@/pages/not-found';
import { Profile } from '@/pages/profile';
import { Rating } from '@/pages/rating';
import { Reading } from '@/pages/reading';
import { Settings } from '@/pages/settings';
import { Speaking } from '@/pages/speaking';
import { Theory } from '@/pages/theory';
import { CardSetPracticePage, CardSetsPage, VocabularyLayout, WordsBank } from '@/pages/vocabulary';
import { vocabularyHeaderLinks } from '@/pages/vocabulary/model/vocabulary-header-links';
import { VocabularyIntro } from '@/pages/vocabulary/ui/vocabulary-layout/vocabulary-intro/VocabularyIntro';
import { Writing } from '@/pages/writing';
import { appProfilerOnRender } from '@/shared/lib/react-profiler';
import { Dashboard } from '@/widgets/dashboard';

export const routes = [
  {
    path: '/',
    element: (
      <Profiler id={"DashboardRoute"} onRender={appProfilerOnRender}>
        <ProtectedRoute>
          <AppInitWrapper>
            <Dashboard />
          </AppInitWrapper>
        </ProtectedRoute>
      </Profiler>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'daily-practice', element: <DailyPractice /> },
      { path: 'writing', element: <Writing /> },
      { path: 'speaking', element: <Speaking /> },
      { path: 'listening', element: <Listening /> },
      { path: 'reading', element: <Reading /> },
      { path: 'theory', element: <Theory /> },
      { path: 'profile', element: <Profile /> },
      { path: 'rating', element: <Rating /> },
      { path: 'settings', element: <Settings /> },
      {
        path: 'vocabulary',
        element: (
          <Profiler id="VocabularyLayoutRoute" onRender={appProfilerOnRender}>
            <VocabularyLayout />
          </Profiler>
        ),
        handle: {
          headerLinks: vocabularyHeaderLinks,
        },
        children: [
          { index: true, element: <VocabularyIntro /> },
          {
            path: 'cards',
            element: (
              <Profiler id={"CardSetsRoute"} onRender={appProfilerOnRender}>
                <CardSets />
              </Profiler>
            ),
          },
          {
            path: 'cards/:cardSetId',
            element: (
              <Profiler id={"CardSetsPageRoute"} onRender={appProfilerOnRender}>
                <CardSetsPage />
              </Profiler>
            ),
          },
          {
            path: 'cards/:cardSetId/practice',
            element: (
              <Profiler id={"CardSetPracticePageRoute"} onRender={appProfilerOnRender}>
                <CardSetPracticePage />
              </Profiler>
            ),
          },
          {
            path: 'words-bank',
            element: (
              <Profiler id={"WordsBankRoute"} onRender={appProfilerOnRender}>
                <WordsBank />
              </Profiler>
            ),
          },
          { path: '*', element: <NotFound /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
