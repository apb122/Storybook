import React, { useState, useMemo } from 'react';
import { generateId } from '@/utils/ids';
import { useStoryStore } from '@/state/store';
import { SplitView } from '@/components/ui/SplitView';
import type { Character } from '@/types/story';
import { CharacterList } from './CharacterList';
import { CharacterEditor } from './CharacterEditor';

interface CharacterTabProps {
  projectId: string;
}

export const CharacterTab: React.FC<CharacterTabProps> = ({ projectId }) => {
  const characters = useStoryStore((state) => state.characters);
  const addCharacter = useStoryStore((state) => state.addCharacter);
  const updateCharacter = useStoryStore((state) => state.updateCharacter);
  const deleteCharacter = useStoryStore((state) => state.deleteCharacter);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const projectCharacters = useMemo(() => {
    return characters
      .filter((c) => c.projectId === projectId)
      .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [characters, projectId, searchQuery]);

  const selectedCharacter = useMemo(() => {
    return characters.find((c) => c.id === selectedId);
  }, [characters, selectedId]);

  const handleCreate = () => {
    const newCharacter: Character = {
      id: generateId(),
      projectId,
      name: 'New Character',
      role: 'supporting',
      relationships: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addCharacter(newCharacter);
    setSelectedId(newCharacter.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      deleteCharacter(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
    }
  };

  const handleUpdate = (id: string, updates: Partial<Character>) => {
    updateCharacter(id, updates);
  };

  return (
    <SplitView
      sidebar={
        <CharacterList
          characters={projectCharacters}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={handleDelete}
          onCreate={handleCreate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      content={
        selectedCharacter ? (
          <CharacterEditor
            key={selectedCharacter.id}
            character={selectedCharacter}
            onSave={handleUpdate}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-900">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-2xl opacity-50">?</span>
            </div>
            <p className="text-lg font-medium">Select a character or create a new one</p>
          </div>
        )
      }
    />
  );
};
