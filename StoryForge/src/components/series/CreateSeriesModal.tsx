import React, { useState } from 'react';
import { useStoryStore } from '@/state/store';
import { createEmptySeries } from '@/types';

interface CreateSeriesModalProps {
  onClose: () => void;
}

export const CreateSeriesModal: React.FC<CreateSeriesModalProps> = ({ onClose }) => {
  const addSeries = useStoryStore((state) => state.addSeries);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    const newSeries = {
      ...createEmptySeries(),
      title: title.trim(),
      description: description.trim() || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    addSeries(newSeries);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-sf-surface border border-sf-border rounded-sm p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <h2 className="text-xl font-bold text-sf-text mb-4">Create New Series</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="series-title" className="block text-sm font-medium text-sf-text mb-2">
              Title <span className="text-sf-danger">*</span>
            </label>
            <input
              id="series-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-sf-border rounded-sm bg-sf-bg text-sf-text focus:outline-none focus:border-sf-accent"
              placeholder="The Chronicles of..."
              autoFocus
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="series-description"
              className="block text-sm font-medium text-sf-text mb-2"
            >
              Description
            </label>
            <textarea
              id="series-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-sf-border rounded-sm bg-sf-bg text-sf-text focus:outline-none focus:border-sf-accent resize-none"
              placeholder="A brief description of your series universe..."
              rows={3}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="series-tags" className="block text-sm font-medium text-sf-text mb-2">
              Tags
            </label>
            <input
              id="series-tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-sf-border rounded-sm bg-sf-bg text-sf-text focus:outline-none focus:border-sf-accent"
              placeholder="fantasy, epic, magic (comma-separated)"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-sf-border rounded-sm text-sf-text hover:bg-sf-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 bg-sf-accent text-white rounded-sm hover:opacity-90 transition-opacity font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Series
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
