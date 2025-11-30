import React from 'react';
import type { Location } from '@/types/story';
import { Search, Trash2, MapPin } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-700 w-80">
      <div className="p-4 border-b border-gray-700 space-y-4">
        <button
          onClick={onCreate}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          <MapPin size={18} />
          <span>New Location</span>
        </button>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md pl-9 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {locations.length === 0 ? (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-600">
              <MapPin size={24} />
            </div>
            <p>No locations found.</p>
            {searchQuery && <p className="text-xs text-gray-600">Try adjusting your search.</p>}
          </div>
        ) : (
          locations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => onSelect(loc.id)}
              className={`p-3 rounded-md cursor-pointer transition-colors flex justify-between items-center group ${
                selectedId === loc.id
                  ? 'bg-indigo-900/50 border border-indigo-500/50'
                  : 'hover:bg-gray-800 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    selectedId === loc.id ? 'bg-indigo-700' : 'bg-gray-700'
                  }`}
                >
                  <MapPin size={14} className="text-gray-300" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{loc.name}</h4>
                  <span className="text-xs text-gray-400 capitalize block">
                    {loc.type} • {loc.usedInSceneIds?.length || 0} scenes
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(loc.id);
                }}
                title="Delete Location"
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1 hover:bg-gray-700 rounded"
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
