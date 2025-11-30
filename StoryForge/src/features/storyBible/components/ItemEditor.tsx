import React, { useState, useEffect } from 'react';
import type { StoryItem } from '@/types/story';
import { Package, AlignLeft } from 'lucide-react';

interface ItemEditorProps {
  item: StoryItem;
  onSave: (id: string, updates: Partial<StoryItem>) => void;
}

export const ItemEditor: React.FC<ItemEditorProps> = ({ item, onSave }) => {
  const [formData, setFormData] = useState<Partial<StoryItem>>(item);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(() => {
      onSave(item.id, formData);
      setIsDirty(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, isDirty, item.id, onSave]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-sf-border">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="text-3xl font-bold bg-transparent border-none p-0 focus:ring-0 text-sf-text placeholder-sf-text-muted w-full"
            placeholder="Item Name"
            aria-label="Item Name"
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              className="text-sm bg-transparent border-none p-0 text-sf-text-muted font-mono uppercase tracking-wider focus:ring-0 w-32"
              placeholder="TYPE"
              aria-label="Item Type"
            />
            <span className="text-sf-border">|</span>
            <span className="text-xs text-sf-text-muted">{isDirty ? 'Saving...' : 'Saved'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <Package size={12} /> Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-sf-text-muted mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full"
                    aria-label="Name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sf-text-muted mb-1">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type || ''}
                    onChange={handleChange}
                    className="w-full"
                    aria-label="Type"
                  />
                </div>
                <div>
                  <label className="block text-xs text-sf-text-muted mb-1">Importance</label>
                  <select
                    name="importance"
                    value={formData.importance || 'minor'}
                    onChange={handleChange}
                    className="w-full bg-transparent border border-sf-border rounded-sm px-3 py-2 text-sf-text focus:border-sf-text outline-none"
                    aria-label="Importance"
                  >
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="mcguffin">McGuffin</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          {/* Middle & Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                <AlignLeft size={12} /> Description
              </h3>
              <textarea
                name="description"
                rows={8}
                value={formData.description || ''}
                onChange={handleChange}
                className="w-full"
                placeholder="Describe this item..."
                aria-label="Description"
              />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
