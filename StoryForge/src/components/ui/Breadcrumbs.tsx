import React from 'react';
import { useLocation, Link, useMatches } from 'react-router-dom';
import { useStoryStore } from '@/state/store';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const matches = useMatches();
  const projects = useStoryStore((state) => state.projects);

  // Don't show on dashboard
  if (location.pathname === '/') return null;

  const crumbs = matches
    .filter((match) => Boolean(match.handle || match.pathname !== '/'))
    .map((match) => {
      // Custom logic to resolve names
      let label = 'Unknown';

      if (match.pathname === '/') {
        label = 'StoryForge';
      } else if (match.params.projectId) {
        const project = projects.find((p) => p.id === match.params.projectId);
        // If this is the project root match
        if (match.pathname.endsWith(match.params.projectId)) {
          label = project?.title || 'Project';
        } else {
          // It's a sub-route, try to derive label from path segment
          const segment = match.pathname.split('/').pop();
          label = segment
            ? segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
            : 'Page';

          // Special cases
          if (segment === 'story-bible') label = 'Story Bible';
          if (segment === 'ai-workshop') label = 'AI Workshop';
        }
      } else {
        // Fallback for non-project routes
        const segment = match.pathname.split('/').pop();
        label = segment
          ? segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
          : 'Page';
      }

      return {
        path: match.pathname,
        label,
      };
    });

  // Manual construction for better control if matches doesn't give what we want
  // simpler approach: split path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    let label = segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

    // If it's a project ID, try to find the name
    const project = projects.find((p) => p.id === segment);
    if (project) {
      label = project.title;
    }

    // Special mapping
    if (segment === 'story-bible') label = 'Story Bible';
    if (segment === 'ai-workshop') label = 'AI Workshop';

    return { path, label };
  });

  return (
    <nav className="flex items-center text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-white transition-colors">
        StoryForge
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          <span className="mx-2 text-gray-600">/</span>
          {index === breadcrumbs.length - 1 ? (
            <span className="text-white font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-white transition-colors">
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
