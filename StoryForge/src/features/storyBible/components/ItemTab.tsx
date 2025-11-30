import React, { useState, useMemo } from 'react';
import { generateId } from '@/utils/ids';
import { useStoryStore } from '@/state/store';
import { SplitView } from '@/components/ui/SplitView';
import type { StoryItem } from '@/types/story';
import { ItemList } from './ItemList';
import { ItemEditor } from './ItemEditor';

interface ItemTabProps {
  projectId: string;
}

export const ItemTab: React.FC<ItemTabProps> = ({ projectId }) => {
  const items = useStoryStore((state) => state.items);
  const addItem = useStoryStore((state) => state.addItem);
  const updateItem = useStoryStore((state) => state.updateItem);
  const deleteItem = useStoryStore((state) => state.deleteItem);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const projectItems = useMemo(() => {
    return items
      .filter((i) => i.projectId === projectId)
      .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, projectId, searchQuery]);

  const selectedItem = useMemo(() => {
    return items.find((i) => i.id === selectedId);
  }, [items, selectedId]);

  const handleCreate = () => {
    const newItem: StoryItem = {
      id: generateId(),
      projectId,
      name: 'New Item',
      type: 'Object',
      importance: 'minor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addItem(newItem);
    setSelectedId(newItem.id);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
      if (selectedId === id) {
        setSelectedId(null);
      }
    }
  };

  const handleUpdate = (id: string, updates: Partial<StoryItem>) => {
    updateItem(id, updates);
  };

  return (
    <SplitView
      sidebar={
        <ItemList
          items={projectItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={handleDelete}
          onCreate={handleCreate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      }
      content={
        selectedItem ? (
          <ItemEditor key={selectedItem.id} item={selectedItem} onSave={handleUpdate} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-900">
            <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-2xl opacity-50">?</span>
            </div>
            <p className="text-lg font-medium">Select an item or create a new one</p>
          </div>
        )
      }
    />
  );
};
