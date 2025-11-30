import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { StoryProject } from '@/types';
import { useStoryStore } from '@/state/store';

interface ProjectCardProps {
  project: StoryProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const duplicateProject = useStoryStore((state) => state.duplicateProject);
  const archiveProject = useStoryStore((state) => state.archiveProject);

  const handleOpen = () => {
    navigate(`/app/project/${project.id}/overview`);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateProject(project.id);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    archiveProject(project.id, !project.isArchived);
  };

  const statusColors = {
    planning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    drafting: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    revising: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    on_hold: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      onClick={handleOpen}
      className="group relative bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <div
          className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[project.status] || statusColors.planning}`}
        >
          {project.status.replace('_', ' ').toUpperCase()}
        </div>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDuplicate}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title="Duplicate"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button
            onClick={handleArchive}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded"
            title={project.isArchived ? 'Unarchive' : 'Archive'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors line-clamp-1">
        {project.title}
      </h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2 h-10">
        {project.logline || project.subtitle || 'No description provided.'}
      </p>

      <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
        <div className="flex space-x-3">
          <span title="Characters">👥 {project.stats?.characterCount || 0}</span>
          <span title="Scenes">🎬 {project.stats?.sceneCount || 0}</span>
          {project.stats?.issueCount ? (
            <span title="Continuity Issues" className="text-amber-500">
              ⚠️ {project.stats.issueCount}
            </span>
          ) : null}
        </div>
        <span>Updated {formatDate(project.lastUpdated || project.updatedAt)}</span>
      </div>
    </div>
  );
};
