import React, { useState, useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { generateId } from '@/utils/ids';
import { StoryBibleLayout } from './StoryBibleLayout';
import { StorySidebar } from './components/StorySidebar';
import type { SectionType } from './components/StorySidebar';
import { CharacterEditor } from './components/CharacterEditor';
import { LocationEditor } from './components/LocationEditor';
import { ItemEditor } from './components/ItemEditor';
import { StoryVariablesPanel } from './components/StoryVariablesPanel';
import { RulesTab } from './components/RulesTab';
import { ExportView } from './components/ExportView';
import type { Character, Location, StoryItem as Item } from '@/types/story';

interface StoryBibleViewProps {
  projectId: string;
}

export const StoryBibleView: React.FC<StoryBibleViewProps> = ({ projectId }) => {
  const [activeSection, setActiveSection] = useState<SectionType>('characters');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const characters = useStoryStore((state) => state.characters);
  const locations = useStoryStore((state) => state.locations);
  const items = useStoryStore((state) => state.items);

  const addCharacter = useStoryStore((state) => state.addCharacter);
  const addLocation = useStoryStore((state) => state.addLocation);
  const addItem = useStoryStore((state) => state.addItem);

  const updateCharacter = useStoryStore((state) => state.updateCharacter);
  const updateLocation = useStoryStore((state) => state.updateLocation);
  const updateItem = useStoryStore((state) => state.updateItem);

  // Filter data by project
  const projectCharacters = useMemo(() =>
    characters.filter(c => c.projectId === projectId).sort((a, b) => a.name.localeCompare(b.name)),
    [characters, projectId]);

  const projectLocations = useMemo(() =>
    locations.filter(l => l.projectId === projectId).sort((a, b) => a.name.localeCompare(b.name)),
    [locations, projectId]);

  const projectItems = useMemo(() =>
    items.filter(i => i.projectId === projectId).sort((a, b) => a.name.localeCompare(b.name)),
    [items, projectId]);

  // Handlers
  const handleNavigate = (section: SectionType, itemId?: string) => {
    setActiveSection(section);
    if (itemId) setSelectedItemId(itemId);
    else if (['variables', 'rules', 'exports'].includes(section)) setSelectedItemId(null);
  };

  const handleCreateItem = (type: 'character' | 'location' | 'item') => {
    const id = generateId();
    const now = new Date().toISOString();

    if (type === 'character') {
      const newChar: Character = {
        id, projectId, name: 'New Character', role: 'supporting', relationships: [], createdAt: now, updatedAt: now
      };
      addCharacter(newChar);
      handleNavigate('characters', id);
    } else if (type === 'location') {
      const newLoc: Location = {
        id, projectId, name: 'New Location', type: 'place', createdAt: now, updatedAt: now
      };
      addLocation(newLoc);
      handleNavigate('locations', id);
    } else if (type === 'item') {
      const newItem: Item = {
        id, projectId, name: 'New Item', type: 'object', createdAt: now, updatedAt: now
      };
      addItem(newItem);
      handleNavigate('items', id);
    }
  };

  // Content Rendering
  const renderContent = () => {
    if (activeSection === 'characters' && selectedItemId) {
      const char = projectCharacters.find(c => c.id === selectedItemId);
      if (char) return <CharacterEditor key={char.id} character={char} onSave={(id, updates) => updateCharacter(id, updates)} />;
    }

    if (activeSection === 'locations' && selectedItemId) {
      const loc = projectLocations.find(l => l.id === selectedItemId);
      if (loc) return <LocationEditor key={loc.id} location={loc} onSave={(id, updates) => updateLocation(id, updates)} />;
    }

    if (activeSection === 'items' && selectedItemId) {
      const item = projectItems.find(i => i.id === selectedItemId);
      if (item) return <ItemEditor key={item.id} item={item} onSave={(id, updates) => updateItem(id, updates)} />;
    }

    if (activeSection === 'variables') return <StoryVariablesPanel projectId={projectId} />;
    if (activeSection === 'rules') return <RulesTab />;
    if (activeSection === 'exports') return <ExportView projectId={projectId} />;

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
          <span className="text-2xl opacity-50">←</span>
        </div>
        <p className="text-lg font-medium">Select an item from the sidebar</p>
      </div>
    );
  };

  const getBreadcrumb = () => {
    const sectionName = activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
    let itemName = '';

    if (selectedItemId) {
      if (activeSection === 'characters') itemName = projectCharacters.find(c => c.id === selectedItemId)?.name || '';
      if (activeSection === 'locations') itemName = projectLocations.find(l => l.id === selectedItemId)?.name || '';
      if (activeSection === 'items') itemName = projectItems.find(i => i.id === selectedItemId)?.name || '';
    }

    return (
      <div className="flex items-center text-sm text-gray-400">
        <span className="hover:text-gray-200 cursor-pointer">Story Bible</span>
        <span className="mx-2">/</span>
        <span className={!itemName ? 'text-gray-200 font-medium' : ''}>{sectionName}</span>
        {itemName && (
          <>
            <span className="mx-2">/</span>
            <span className="text-gray-200 font-medium">{itemName}</span>
          </>
        )}
      </div>
    );
  };

  return (
    <StoryBibleLayout
      header={getBreadcrumb()}
      sidebar={
        <StorySidebar
          activeSection={activeSection}
          selectedItemId={selectedItemId}
          onNavigate={handleNavigate}
          onCreateItem={handleCreateItem}
          characters={projectCharacters}
          locations={projectLocations}
          items={projectItems}
        />
      }
      content={renderContent()}
    />
  );
};
