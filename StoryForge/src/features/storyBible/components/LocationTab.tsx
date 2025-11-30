import React, { useState, useMemo } from 'react';
import { generateId } from '@/utils/ids';
import { useStoryStore } from '@/state/store';
import { SplitView } from '@/components/ui/SplitView';
import type { Location } from '@/types/story';
import { LocationList } from './LocationList';
import { LocationEditor } from './LocationEditor';

interface LocationTabProps {
  projectId: string;
}

export const LocationTab: React.FC<LocationTabProps> = ({ projectId }) => {
  const locations = useStoryStore((state) => state.locations);
  const addLocation = useStoryStore((state) => state.addLocation);
  const updateLocation = useStoryStore((state) => state.updateLocation);
  const deleteLocation = useStoryStore((state) => state.deleteLocation);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const projectLocations = useMemo(() => {
    return locations
      .filter((l) => l.projectId === projectId)
      .filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [locations, projectId, searchQuery]);

  const selectedLocation = useMemo(() => {
    return locations.find((l) => l.id === selectedId);
  }, [locations, selectedId]);

  const handleCreate = () => {
    const newLocation: Location = {
      id: generateId(),
      projectId,
      name: 'New Location',
      type: 'City',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addLocation(newLocation);
    setSelectedId(newLocation.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      deleteLocation(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
    }
  };

  const handleUpdate = (id: string, updates: Partial<Location>) => {
    updateLocation(id, updates);
  };

  return (
    <SplitView
      sidebar={
        <LocationList
          locations={projectLocations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={handleDelete}
          onCreate={handleCreate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      content={
        selectedLocation ? (
          <LocationEditor
            key={selectedLocation.id}
            location={selectedLocation}
            onSave={handleUpdate}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-900">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-2xl opacity-50">?</span>
            </div>
            <p className="text-lg font-medium">Select a location or create a new one</p>
          </div>
        )
      }
    />
  );
};
