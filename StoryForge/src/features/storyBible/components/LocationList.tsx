import React from 'react';
import type { Location } from '@/types/story';
import { Search, Trash2, Plus } from 'lucide-react';

interface LocationListProps {
  locations: Location[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const LocationList: React.FC<LocationListProps> = ({
  locations,
  selectedId,
  onSelect,
  onDelete,
  onCreate,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col h-full border-r border-sf-border pr-6">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-sf-text">Locations</h2>
          <button
            onClick={onCreate}
            className="btn-ghost p-1 hover:bg-sf-border rounded-sm"
            title="New Location"
            aria-label="New Location"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="relative">
          <Search
            className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sf-text-muted"
            size={14}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-transparent border border-sf-border rounded-sm pl-8 pr-2 py-1.5 text-sm text-sf-text focus:border-sf-text transition-colors outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 -mr-2 pr-2">
        {locations.length === 0 ? (
          <div className="text-center py-8 text-sf-text-muted text-sm">
            <p>No locations found.</p>
          </div>
        ) : (
          locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => onSelect(loc.id)}
              className={`
                group flex justify-between items-center p-2 rounded-sm cursor-pointer transition-colors text-sm
                ${selectedId === loc.id ? 'bg-sf-text text-sf-bg' : 'hover:bg-sf-surface text-sf-text'}
              `}
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{loc.name}</div>
                <div
                  className={`text-xs truncate ${selectedId === loc.id ? 'text-sf-bg/70' : 'text-sf-text-muted'}`}
                >
                  {loc.type}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(loc.id);
                }}
                className={`
                  opacity-0 group-hover:opacity-100 p-1 rounded transition-all
                  ${selectedId === loc.id ? 'hover:bg-sf-bg/20 text-sf-bg' : 'hover:bg-sf-border text-sf-text-muted hover:text-sf-danger'}
                `}
                aria-label="Delete location"
                title="Delete location"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
