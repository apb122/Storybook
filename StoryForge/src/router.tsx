import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProjectWorkspacePage } from '@/pages/ProjectWorkspacePage';
import { SettingsView } from '@/features/settings/SettingsView';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LandingPage } from '@/pages/LandingPage';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { SignupForm } from '@/features/auth/components/SignupForm';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
  StoryBibleWrapper,
  PlotWrapper,
  TimelineWrapper,
  AiWorkshopWrapper,
} from '@/components/RouterWrappers';
import { ProjectOverview } from '@/features/project/ProjectOverview';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SeriesListPage } from '@/pages/SeriesListPage';
import { SeriesDetailView } from '@/features/series/SeriesDetailView';
import { ManuscriptPage } from '@/features/manuscript';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/signup',
    element: <SignupForm />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/app',
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'project/:projectId',
            element: <ProjectWorkspacePage />,
            children: [
              {
                index: true,
                element: <Navigate to="overview" replace />,
              },
              {
                path: 'overview',
                element: <ProjectOverview />,
              },
              {
                path: 'story-bible',
                element: <StoryBibleWrapper />,
              },
              {
                path: 'plot',
                element: <PlotWrapper />,
              },
              {
                path: 'timeline',
                element: <TimelineWrapper />,
              },
              {
                path: 'ai-workshop',
                element: <AiWorkshopWrapper />,
              },
              {
                path: 'manuscript',
                children: [
                  {
                    index: true,
                    element: <ManuscriptPage />,
                  },
                  {
                    path: ':sceneId',
                    element: <ManuscriptPage />,
                  },
                ],
              },
              {
                path: 'exports',
                element: (
                  <div className="p-6 border border-sf-border rounded-sm bg-sf-surface">
                    <h2 className="text-lg font-bold text-sf-text mb-4">Exports</h2>
                    <p className="text-sf-text-muted">Export to PDF, Word, etc... (Coming Soon)</p>
                  </div>
                ),
              },
            ],
          },
          {
            path: 'series',
            children: [
              {
                index: true,
                element: <SeriesListPage />,
              },
              {
                path: ':seriesId',
                element: <SeriesDetailView />,
              },
            ],
          },
          {
            path: 'settings',
            element: <SettingsView />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
