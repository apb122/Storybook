import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '../state/store';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { NewProjectModal } from '../components/dashboard/NewProjectModal';
import type { StoryProject } from '../types/story';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const projects = useStoryStore((state) => state.projects);
    const addProject = useStoryStore((state) => state.addProject);
    const updateProject = useStoryStore((state) => state.updateProject);

    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredProjects = useMemo(() => {
        return projects
            .filter((p) => !p.isArchived) // Hide archived by default
            .filter((p) => {
                const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [projects, searchQuery, statusFilter]);

    const handleCreateProject = (data: { title: string; genre: string; logline: string; themes: string; tone: string }) => {
        const newProject: StoryProject = {
            id: crypto.randomUUID(),
            title: data.title,
            genre: data.genre || undefined,
            logline: data.logline || undefined,
            themes: data.themes ? data.themes.split(',').map((t) => t.trim()).filter(Boolean) : undefined,
            tone: data.tone || undefined,
            status: 'planning',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isArchived: false,
        };

        addProject(newProject);
        navigate(`/project/${newProject.id}`);
    };

    const handleArchiveProject = (id: string) => {
        if (window.confirm('Are you sure you want to archive this project?')) {
            updateProject(id, { isArchived: true });
        }
    };

    const handleDuplicateProject = (project: StoryProject) => {
        const newProject: StoryProject = {
            ...project,
            id: crypto.randomUUID(),
            title: `${project.title} (Copy)`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        addProject(newProject);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <button
                    onClick={() => setIsNewProjectModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors shadow-lg shadow-indigo-900/20"
                >
                    New Project
                </button>
            </div>

            {/* Filters */}
            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="w-full md:w-48">
                    <select
                        title="Status Filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Statuses</option>
                        <option value="planning">Planning</option>
                        <option value="drafting">Drafting</option>
                        <option value="revising">Revising</option>
                        <option value="on_hold">On Hold</option>
                    </select>
                </div>
            </div>

            {/* Project Grid */}
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            onArchive={handleArchiveProject}
                            onDuplicate={handleDuplicateProject}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700/50 border-dashed">
                    <p className="text-gray-400 text-lg">No projects found.</p>
                    {projects.length === 0 && (
                        <p className="text-gray-500 mt-2">Get started by creating your first story!</p>
                    )}
                </div>
            )}

            <NewProjectModal
                isOpen={isNewProjectModalOpen}
                onClose={() => setIsNewProjectModalOpen(false)}
                onSubmit={handleCreateProject}
            />
        </div>
    );
};
