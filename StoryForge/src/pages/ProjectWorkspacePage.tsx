import React from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import { NavTabs } from '@/components/ui/NavTabs';
import { useStoryStore } from '@/state/store';

export const ProjectWorkspacePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // Fetch project details to show title
  const projects = useStoryStore((state) => state.projects);
  const project = projects.find((p) => p.id === projectId);

  if (!projectId) return <div>Invalid Project ID</div>;
  if (!project) return <div>Project not found</div>;

  const tabs = [
    { path: 'overview', label: 'Overview' },
    { path: 'story-bible', label: 'Story Bible' },
    { path: 'plot', label: 'Plot' },
    { path: 'timeline', label: 'Timeline & Beats' },
    { path: 'ai-workshop', label: 'AI Workshop' },
    { path: 'exports', label: 'Exports' },
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
            <Link to="/" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span>{project.title}</span>
          </div>
          <h1 className="text-3xl font-bold text-white">{project.title}</h1>
        </div>
      </div>

      <NavTabs tabs={tabs} />

      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
