import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '@/state/store';
import { SeriesCard } from '@/components/series/SeriesCard';
import { CreateSeriesModal } from '@/components/series/CreateSeriesModal';

export const SeriesListPage: React.FC = () => {
  const navigate = useNavigate();
  const series = useStoryStore((state) => state.series);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateSeries = () => {
    setIsCreateModalOpen(true);
  };

  const handleSeriesClick = (seriesId: string) => {
    navigate(`/app/series/${seriesId}`);
  };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-sf-text mb-2">Series</h1>
          <p className="text-sf-text-muted">Organize multiple projects into shared universes</p>
        </div>
        <button
          onClick={handleCreateSeries}
          className="px-4 py-2 bg-sf-accent text-white rounded-sm hover:opacity-90 transition-opacity font-medium"
        >
          Create Series
        </button>
      </div>

      {series.length === 0 ? (
        <div className="border border-sf-border rounded-sm p-12 text-center bg-sf-surface">
          <h3 className="text-lg font-semibold text-sf-text mb-2">No Series Yet</h3>
          <p className="text-sf-text-muted mb-6">
            Create a series to group multiple books into a shared story universe
          </p>
          <button
            onClick={handleCreateSeries}
            className="px-6 py-3 bg-sf-accent text-white rounded-sm hover:opacity-90 transition-opacity font-medium"
          >
            Create Your First Series
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {series.map((s) => (
            <SeriesCard key={s.id} series={s} onClick={() => handleSeriesClick(s.id)} />
          ))}
        </div>
      )}

      {isCreateModalOpen && <CreateSeriesModal onClose={() => setIsCreateModalOpen(false)} />}
    </div>
  );
};
