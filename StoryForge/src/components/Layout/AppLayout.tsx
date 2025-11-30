import React from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { useAuthStore } from '@/state/authStore';
import { useStoryStore } from '@/state/store';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export const AppLayout: React.FC = () => {
  useKeyboardShortcuts();
  const { user, logout } = useAuthStore();
  const { projectId } = useParams<{ projectId: string }>();

  // Get project name if in a project context
  const project = useStoryStore((state) =>
    projectId ? state.projects.find((p) => p.id === projectId) : null
  );

  const isProjectContext = !!projectId;

  return (
    <div className="min-h-screen flex flex-col bg-sf-bg text-sf-text font-sans">
      {/* Minimal Top Navigation */}
      <header className="border-b border-sf-border bg-sf-surface sticky top-0 z-50">
        <div className="sf-container flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <NavLink
              to="/app/dashboard"
              className="text-lg font-semibold tracking-tight hover:opacity-70 transition-opacity"
            >
              StoryForge
            </NavLink>

            {/* Primary Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <NavLink
                to="/app/dashboard"
                className={({ isActive }) =>
                  `hover:text-sf-text transition-colors ${isActive && !isProjectContext ? 'text-sf-text font-medium' : 'text-sf-text-muted'}`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/app/series"
                className={({ isActive }) =>
                  `hover:text-sf-text transition-colors ${isActive && !isProjectContext ? 'text-sf-text font-medium' : 'text-sf-text-muted'}`
                }
              >
                Series
              </NavLink>

              {isProjectContext && (
                <>
                  <span className="text-sf-border">/</span>
                  <span className="text-sf-text font-medium truncate max-w-[150px]">
                    {project?.title || 'Project'}
                  </span>
                  <div className="flex items-center gap-4 ml-2">
                    <NavLink
                      to={`/app/project/${projectId}/overview`}
                      className={({ isActive }) =>
                        `hover:text-sf-text transition-colors ${isActive ? 'text-sf-text font-medium underline underline-offset-4 decoration-sf-border' : 'text-sf-text-muted'}`
                      }
                    >
                      Overview
                    </NavLink>
                    <NavLink
                      to={`/app/project/${projectId}/story-bible`}
                      className={({ isActive }) =>
                        `hover:text-sf-text transition-colors ${isActive ? 'text-sf-text font-medium underline underline-offset-4 decoration-sf-border' : 'text-sf-text-muted'}`
                      }
                    >
                      Story Bible
                    </NavLink>
                    <NavLink
                      to={`/app/project/${projectId}/plot`}
                      className={({ isActive }) =>
                        `hover:text-sf-text transition-colors ${isActive ? 'text-sf-text font-medium underline underline-offset-4 decoration-sf-border' : 'text-sf-text-muted'}`
                      }
                    >
                      Plot
                    </NavLink>
                    <NavLink
                      to={`/app/project/${projectId}/timeline`}
                      className={({ isActive }) =>
                        `hover:text-sf-text transition-colors ${isActive ? 'text-sf-text font-medium underline underline-offset-4 decoration-sf-border' : 'text-sf-text-muted'}`
                      }
                    >
                      Timeline
                    </NavLink>
                    <NavLink
                      to={`/app/project/${projectId}/ai-workshop`}
                      className={({ isActive }) =>
                        `hover:text-sf-text transition-colors ${isActive ? 'text-sf-text font-medium underline underline-offset-4 decoration-sf-border' : 'text-sf-text-muted'}`
                      }
                    >
                      Workshop
                    </NavLink>
                  </div>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-sf-text-muted hidden sm:inline-block">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sf-text-muted hover:text-sf-danger transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        <div className="sf-container py-8">
          <Outlet />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-sf-border py-6 mt-auto">
        <div className="sf-container text-center text-xs text-sf-text-muted">
          <p>&copy; {new Date().getFullYear()} StoryForge. Minimalist Writing Environment.</p>
        </div>
      </footer>
    </div>
  );
};
