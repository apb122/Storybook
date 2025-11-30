import React, { useState, useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { ProjectCard } from '@/features/dashboard/ProjectCard';
import { CreateProjectModal } from '@/features/dashboard/CreateProjectModal';
import { Search, Plus, Filter } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const projects = useStoryStore((state) => state.projects);

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => !p.isArchived)
      .filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [projects, searchQuery, statusFilter]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-sf-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-sf-text mb-2">Projects</h1>
          <p className="text-sf-text-muted">Manage your stories and creative worlds.</p>
        </div>
        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sf-text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-sf-border focus:border-sf-text transition-colors outline-none text-sf-text placeholder:text-sf-text-muted"
            aria-label="Search projects"
          />
        </div>
        <div className="relative w-full md:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-sf-text-muted w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent border-b border-sf-border focus:border-sf-text transition-colors outline-none text-sf-text appearance-none cursor-pointer"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="planning">Planning</option>
            <option value="drafting">Drafting</option>
            <option value="revising">Revising</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-sf-border rounded-sm">
          <h3 className="text-lg font-medium text-sf-text mb-2">No projects found</h3>
          <p className="text-sf-text-muted mb-6">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first story project'}
          </p>
          {searchQuery || statusFilter !== 'all' ? (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-sf-accent hover:text-sf-text underline underline-offset-4"
            >
              Clear filters
            </button>
          ) : (
            <button onClick={() => setIsNewProjectModalOpen(true)} className="btn-secondary">
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
      />
    </div>
  );
};
