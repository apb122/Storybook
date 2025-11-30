import React from 'react';
import type { Series } from '@/types';
import { useStoryStore } from '@/state/store';

interface SeriesCardProps {
  series: Series;
  onClick: () => void;
}

export const SeriesCard: React.FC<SeriesCardProps> = ({ series, onClick }) => {
  const projects = useStoryStore((state) =>
    state.projects.filter((p) => series.projectIds.includes(p.id))
  );

  const sharedCharacterCount = series.sharedCharacterIds?.length || 0;
  const sharedLocationCount = series.sharedLocationIds?.length || 0;

  return (
    <button
      onClick={onClick}
      className="border border-sf-border rounded-sm p-4 bg-sf-surface hover:border-sf-accent transition-colors text-left w-full"
    >
      <h3 className="text-lg font-semibold text-sf-text mb-2">{series.title}</h3>
      {series.description && (
        <p className="text-sm text-sf-text-muted mb-4 line-clamp-2">{series.description}</p>
      )}

      <div className="flex flex-wrap gap-3 text-xs text-sf-text-muted">
        <div className="flex items-center gap-1">
          <span className="font-medium">{projects.length}</span>
          <span>{projects.length === 1 ? 'Project' : 'Projects'}</span>
        </div>

        {sharedCharacterCount > 0 && (
          <div className="flex items-center gap-1">
            <span className="font-medium">{sharedCharacterCount}</span>
            <span>Shared {sharedCharacterCount === 1 ? 'Character' : 'Characters'}</span>
          </div>
        )}

        {sharedLocationCount > 0 && (
          <div className="flex items-center gap-1">
            <span className="font-medium">{sharedLocationCount}</span>
            <span>Shared {sharedLocationCount === 1 ? 'Location' : 'Locations'}</span>
          </div>
        )}
      </div>

      {series.tags && series.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {series.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-sf-bg text-xs text-sf-text-muted rounded-sm border border-sf-border"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </button>
  );
};
