import React from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Users, MapPin, FileText, Activity, Plus, ArrowRight } from 'lucide-react';

export const ProjectOverview: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useStoryStore((state) => state.projects.find((p) => p.id === projectId));

  const stats = useStoryStore(
    useShallow((state) => {
      if (!projectId) return null;
      return {
        characters: state.characters.filter((c) => c.projectId === projectId).length,
        locations: state.locations.filter((l) => l.projectId === projectId).length,
        items: state.items.filter((i) => i.projectId === projectId).length,
        scenes: state.plotNodes.filter((n) => n.projectId === projectId && n.type === 'scene')
          .length,
      };
    })
  );

  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-sf-text tracking-tight">{project.title}</h1>
          <p className="text-sf-text-muted mt-1 text-lg">{project.logline || 'No logline set.'}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/app/project/${projectId}/story-bible`}
            className="btn-secondary flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Story Bible
          </Link>
          <Link
            to={`/app/project/${projectId}/plot`}
            className="btn-primary flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Continue Writing
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Characters"
          value={stats?.characters || 0}
          icon={<Users className="w-5 h-5 text-indigo-400" />}
        />
        <StatCard
          label="Locations"
          value={stats?.locations || 0}
          icon={<MapPin className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Scenes"
          value={stats?.scenes || 0}
          icon={<FileText className="w-5 h-5 text-amber-400" />}
        />
        <StatCard
          label="Word Count"
          value={project.stats?.wordCount || 0}
          icon={<BookOpen className="w-5 h-5 text-blue-400" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Activity & Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <section className="bg-sf-surface border border-sf-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-sf-text-muted" />
                Recent Activity
              </h2>
            </div>

            <div className="space-y-4">
              {/* Placeholder for activity feed */}
              <div className="flex items-start gap-4 p-4 rounded-md bg-sf-bg/50 border border-sf-border/50">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-sf-text">
                    <span className="font-medium">Alex Writer</span> updated scene{' '}
                    <span className="font-medium">"The Confrontation"</span>
                  </p>
                  <p className="text-xs text-sf-text-muted mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-md bg-sf-bg/50 border border-sf-border/50">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-sf-text">
                    <span className="font-medium">Alex Writer</span> created character{' '}
                    <span className="font-medium">"Elara"</span>
                  </p>
                  <p className="text-xs text-sf-text-muted mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="text-center pt-2">
                <button className="text-sm text-sf-text-muted hover:text-sf-text transition-colors">
                  View all activity
                </button>
              </div>
            </div>
          </section>

          {/* Plot Progress (Placeholder) */}
          <section className="bg-sf-surface border border-sf-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Plot Progress</h2>
            <div className="h-4 w-full bg-sf-bg rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[35%]"></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-sf-text-muted">
              <span>Act 1: Setup</span>
              <span>35% Complete</span>
            </div>
          </section>
        </div>

        {/* Right Column: Quick Actions & Notes */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <section className="bg-sf-surface border border-sf-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                to={`/app/project/${projectId}/plot`}
                className="w-full flex items-center justify-between p-3 rounded-md border border-sf-border hover:bg-sf-bg transition-colors group"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Plus className="w-4 h-4 text-sf-text-muted group-hover:text-sf-text" />
                  New Scene
                </span>
                <ArrowRight className="w-4 h-4 text-sf-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to={`/app/project/${projectId}/story-bible?tab=characters`}
                className="w-full flex items-center justify-between p-3 rounded-md border border-sf-border hover:bg-sf-bg transition-colors group"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Plus className="w-4 h-4 text-sf-text-muted group-hover:text-sf-text" />
                  New Character
                </span>
                <ArrowRight className="w-4 h-4 text-sf-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                to={`/app/project/${projectId}/story-bible?tab=locations`}
                className="w-full flex items-center justify-between p-3 rounded-md border border-sf-border hover:bg-sf-bg transition-colors group"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Plus className="w-4 h-4 text-sf-text-muted group-hover:text-sf-text" />
                  New Location
                </span>
                <ArrowRight className="w-4 h-4 text-sf-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </section>

          {/* Project Notes (Mini) */}
          <section className="bg-sf-surface border border-sf-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Scratchpad</h2>
            <textarea
              className="w-full h-40 bg-sf-bg border border-sf-border rounded-md p-3 text-sm resize-none focus:outline-none focus:border-sf-accent transition-colors"
              placeholder="Jot down quick ideas here..."
            />
          </section>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="bg-sf-surface border border-sf-border rounded-lg p-4 flex items-center gap-4 hover:border-sf-accent/50 transition-colors">
    <div className="p-3 bg-sf-bg rounded-md border border-sf-border">{icon}</div>
    <div>
      <p className="text-xs font-medium text-sf-text-muted uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-sf-text">{value}</p>
    </div>
  </div>
);
