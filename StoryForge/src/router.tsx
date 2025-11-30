import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProjectWorkspacePage } from '@/pages/ProjectWorkspacePage';
import { SettingsView } from '@/features/settings/SettingsView';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { StoryBibleView } from '@/features/storyBible/StoryBibleView';
import { PlotOutlineView } from '@/features/storyBible/components/PlotOutlineView';
import { TimelineView } from '@/features/timeline/TimelineView';
import { AiWorkshopView } from '@/features/ai/AiWorkshopView';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
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
            element: (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Project Stats</h2>
                  <p className="text-gray-400">Word count, scene count, etc. coming soon.</p>
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                  <p className="text-gray-400">No recent activity.</p>
                </div>
              </div>
            ),
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
            path: 'exports',
            element: (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Exports</h2>
                <p className="text-gray-400">Export to PDF, Word, etc... (Coming Soon)</p>
              </div>
            ),
          },
        ],
      },
      {
        path: 'settings',
        element: <SettingsView />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

// Wrapper components to extract params and pass to features
function StoryBibleWrapper() {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) return null;
  return <StoryBibleView projectId={projectId} />;
}

function PlotWrapper() {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) return null;
  return <PlotOutlineView projectId={projectId} />;
}

function TimelineWrapper() {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) return null;
  return <TimelineView projectId={projectId} />;
}

function AiWorkshopWrapper() {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) return null;
  return <AiWorkshopView projectId={projectId} />;
}
