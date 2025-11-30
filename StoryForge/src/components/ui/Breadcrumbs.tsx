import React from 'react';
import { useLocation, Link } from 'react-router-dom';
export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  // Don't show on dashboard
  if (location.pathname === '/') return null;

  // Manual construction for better control if matches doesn't give what we want
  // simpler approach: split path
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    let label = segment.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

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
