import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoryStore } from '@/state/store';

export const SeriesDetailView: React.FC = () => {
  const { seriesId } = useParams<{ seriesId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'resources'>('overview');

  const series = useStoryStore((state) => state.series.find((s) => s.id === seriesId));
  const updateSeries = useStoryStore((state) => state.updateSeries);
  const deleteSeries = useStoryStore((state) => state.deleteSeries);
  const projects = useStoryStore((state) =>
    series ? state.projects.filter((p) => series.projectIds.includes(p.id)) : []
  );
  const characters = useStoryStore((state) => state.characters);
  const locations = useStoryStore((state) => state.locations);

  const [title, setTitle] = useState(series?.title || '');
  const [description, setDescription] = useState(series?.description || '');
  const [isEditing, setIsEditing] = useState(false);

  if (!series || !seriesId) {
    return (
      <div className="border border-sf-border rounded-sm p-6 text-center">
        <h3 className="text-lg font-semibold text-sf-text mb-2">Series Not Found</h3>
        <button
          onClick={() => navigate('/app/series')}
          className="px-4 py-2 bg-sf-accent text-white rounded-sm hover:opacity-90 transition-opacity"
        >
          Back to Series
        </button>
      </div>
    );
  }

  const handleSave = () => {
    updateSeries(seriesId, {
      title: title.trim() || series.title,
      description: description.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${series.title}"?`)) {
      deleteSeries(seriesId);
      navigate('/app/series');
    }
  };

  // Calculate statistics
  const totalCharacters = projects.reduce((sum, p) => {
    const count = characters.filter((c) => c.projectId === p.id).length;
    return sum + count;
  }, 0);

  const totalScenes = projects.reduce((sum, p) => {
    return sum + (p.stats?.sceneCount || 0);
  }, 0);

  const sharedCharacters = characters.filter((c) => series.sharedCharacterIds?.includes(c.id));

  const sharedLocations = locations.filter((l) => series.sharedLocationIds?.includes(l.id));

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <button
            onClick={() => navigate('/app/series')}
            className="text-sf-text-muted hover:text-sf-text transition-colors text-sm mb-2"
          >
            ← Back to Series
          </button>
        </div>

        {isEditing ? (
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-sf-text bg-sf-bg border border-sf-border rounded-sm px-3 py-2 w-full mb-3"
              aria-label="Series title"
              placeholder="Series title"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-sf-border rounded-sm bg-sf-bg text-sf-text resize-none"
              rows={3}
              placeholder="Series description..."
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-sf-accent text-white rounded-sm hover:opacity-90 transition-opacity"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setTitle(series.title);
                  setDescription(series.description || '');
                  setIsEditing(false);
                }}
                className="px-4 py-2 border border-sf-border rounded-sm text-sf-text hover:bg-sf-bg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-sf-text">{series.title}</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1 border border-sf-border rounded-sm text-sm text-sf-text hover:bg-sf-bg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 border border-sf-danger text-sf-danger rounded-sm text-sm hover:bg-sf-danger hover:text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            {series.description && <p className="text-sf-text-muted mt-2">{series.description}</p>}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-sf-border mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-sf-accent text-sf-text font-medium'
                : 'border-transparent text-sf-text-muted hover:text-sf-text'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'projects'
                ? 'border-sf-accent text-sf-text font-medium'
                : 'border-transparent text-sf-text-muted hover:text-sf-text'
            }`}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'resources'
                ? 'border-sf-accent text-sf-text font-medium'
                : 'border-transparent text-sf-text-muted hover:text-sf-text'
            }`}
          >
            Shared Resources
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-sf-border rounded-sm p-4 bg-sf-surface">
            <div className="text-3xl font-bold text-sf-text">{projects.length}</div>
            <div className="text-sm text-sf-text-muted">
              {projects.length === 1 ? 'Project' : 'Projects'}
            </div>
          </div>
          <div className="border border-sf-border rounded-sm p-4 bg-sf-surface">
            <div className="text-3xl font-bold text-sf-text">{totalCharacters}</div>
            <div className="text-sm text-sf-text-muted">Total Characters</div>
          </div>
          <div className="border border-sf-border rounded-sm p-4 bg-sf-surface">
            <div className="text-3xl font-bold text-sf-text">{totalScenes}</div>
            <div className="text-sm text-sf-text-muted">Total Scenes</div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div>
          {projects.length === 0 ? (
            <div className="border border-sf-border rounded-sm p-8 text-center">
              <p className="text-sf-text-muted">No projects linked to this series yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-sf-border rounded-sm p-4 bg-sf-surface hover:border-sf-accent transition-colors cursor-pointer"
                  onClick={() => navigate(`/app/project/${project.id}`)}
                >
                  <h3 className="font-semibold text-sf-text">{project.title}</h3>
                  {project.subtitle && (
                    <p className="text-sm text-sf-text-muted mt-1">{project.subtitle}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-sf-text mb-3">Shared Characters</h3>
            {sharedCharacters.length === 0 ? (
              <p className="text-sf-text-mut text-sm">No shared characters marked</p>
            ) : (
              <div className="space-y-2">
                {sharedCharacters.map((char) => (
                  <div
                    key={char.id}
                    className="border border-sf-border rounded-sm p-3 bg-sf-surface"
                  >
                    <div className="font-medium text-sf-text">{char.name}</div>
                    <div className="text-xs text-sf-text-muted capitalize">{char.role}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-sf-text mb-3">Shared Locations</h3>
            {sharedLocations.length === 0 ? (
              <p className="text-sf-text-muted text-sm">No shared locations marked</p>
            ) : (
              <div className="space-y-2">
                {sharedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="border border-sf-border rounded-sm p-3 bg-sf-surface"
                  >
                    <div className="font-medium text-sf-text">{loc.name}</div>
                    {loc.type && <div className="text-xs text-sf-text-muted">{loc.type}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
