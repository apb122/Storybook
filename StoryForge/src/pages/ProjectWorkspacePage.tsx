import React from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import { NavTabs } from '@/components/ui/NavTabs';
import { useStoryStore } from '@/state/store';

export const ProjectWorkspacePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();

  // Fetch project details to show title
  const projects = useStoryStore((state) => state.projects);
  const project = projects.find((p) => p.id === projectId);

  if (!projectId) return <div className="p-8 text-sf-text-muted">Invalid Project ID</div>;
  if (!project) return <div className="p-8 text-sf-text-muted">Project not found</div>;

  const tabs = [
    { path: 'overview', label: 'Overview' },
    { path: 'story-bible', label: 'Story Bible' },
    { path: 'plot', label: 'Plot' },
    { path: 'timeline', label: 'Timeline' },
    { path: 'ai-workshop', label: 'AI Workshop' },
    { path: 'exports', label: 'Exports' },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center space-x-2 text-xs text-sf-text-muted mb-2 uppercase tracking-wider font-medium">
          <Link to="/" className="hover:text-sf-text transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-sf-text">{project.title}</span>
        </div>
        <h1 className="text-3xl font-bold text-sf-text mb-6">{project.title}</h1>
        <NavTabs tabs={tabs} />
      </div>

      <div className="flex-1 overflow-hidden border-t border-sf-border bg-sf-bg">
        <Outlet />
      </div>
    </div>
  );
};
