import React from 'react';
import { Link } from 'react-router-dom';
import type { StoryProject } from '../../types/story';

interface ProjectCardProps {
    project: StoryProject;
    onArchive: (id: string) => void;
    onDuplicate: (project: StoryProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onArchive, onDuplicate }) => {
    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        }).format(new Date(dateString));
    };

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-indigo-500 transition-all group relative">
            <Link to={`/project/${project.id}`} className="block">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors truncate pr-8">
                        {project.title}
                    </h3>
                </div>

                {project.genre && (
                    <p className="text-indigo-300 text-sm mb-2">{project.genre}</p>
                )}

                <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full border ${project.status === 'planning' ? 'bg-blue-900/30 border-blue-700 text-blue-300' :
                            project.status === 'drafting' ? 'bg-green-900/30 border-green-700 text-green-300' :
                                project.status === 'revising' ? 'bg-yellow-900/30 border-yellow-700 text-yellow-300' :
                                    'bg-gray-700 text-gray-300 border-gray-600'
                        }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                </div>

                <p className="text-gray-500 text-xs">
                    Updated {formatDate(project.updatedAt)}
                </p>
            </Link>

            {/* Actions Menu (Visible on Hover) */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onDuplicate(project);
                    }}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                    title="Duplicate Project"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onArchive(project.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                    title="Archive Project"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
