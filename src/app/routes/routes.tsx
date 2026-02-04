import {ProtectedRoute} from "@/app/routes/ProtectedRoute.tsx";
import {Dashboard} from "@/widgets/dashboard";
import {Home} from "@/pages/home";
import {Profile} from "@/pages/profile";
import {CardSets, CustomCards, ExpressionsBank, Vocabulary, WordsBank} from "@/pages/vocabulary";
import {vocabularyHeaderLinks} from "@/features/vocabulary/config/vocabularyHeaderLinks.ts";
import {AuthLayout} from "@/pages/auth/auth-layout";
import {Login} from "@/pages/auth/login";
import {Register} from "@/pages/auth/register";
import {ForgotPassword} from "@/pages/auth/forgot-password";
import {ResetPassword} from "@/pages/auth/reset-password";
import {AppInitWrapper} from "@/app/ui/AppInitWrapper.tsx";
import {DailyPractice} from "@/pages/daily-practice";
import {Writing} from "@/pages/writing";
import {Speaking} from "@/pages/speaking";
import {Listening} from "@/pages/listening";
import {Reading} from "@/pages/reading";
import {Theory} from "@/pages/theory";
import {Rating} from "@/pages/rating";
import {Settings} from "@/pages/settings";
import {NotFound} from "@/pages/not-found";

export const routes = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppInitWrapper>
          <Dashboard />
        </AppInitWrapper>
      </ProtectedRoute>
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
        element: <Vocabulary />,
        handle: {
          headerLinks: vocabularyHeaderLinks,
        },
        children: [
          { path: 'card-sets', element: <CardSets /> },
          { path: 'custom-cards', element: <CustomCards /> },
          { path: 'words-bank', element: <WordsBank /> },
          { path: 'expressions-bank', element: <ExpressionsBank /> },
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