import React, { useState, useEffect } from 'react';
import type { StoryVariable } from '@/types';
import { Modal } from '@/components/ui/Modal';

interface VariableEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<StoryVariable>) => void;
  initialData?: Partial<StoryVariable>;
  isEditing: boolean;
}

export const VariableEditor: React.FC<VariableEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing,
}) => {
  const [formData, setFormData] = useState<Partial<StoryVariable>>({
    key: '',
    label: '',
    type: 'string',
    value: '',
    description: '',
    status: 'tentative',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(
        initialData || {
          key: '',
          label: '',
          type: 'string',
          value: '',
          description: '',
          status: 'tentative',
          tags: [],
        }
      );
      setTagInput('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key || !formData.label) return;
    onSave(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Variable' : 'Add Variable'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="variable-label" className="block text-sm font-medium text-gray-300">
              Label
            </label>
            <input
              id="variable-label"
              type="text"
              required
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. Hero's Age"
            />
          </div>
          <div>
            <label htmlFor="variable-key" className="block text-sm font-medium text-gray-300">
              Key (Unique ID)
            </label>
            <input
              id="variable-key"
              type="text"
              required
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
              placeholder="e.g. hero_age"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="variable-type" className="block text-sm font-medium text-gray-300">
              Type
            </label>
            <select
              id="variable-type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as StoryVariable['type'] })
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
              <option value="enum">Enum</option>
              <option value="rule">Rule</option>
            </select>
          </div>
          <div>
            <label htmlFor="variable-status" className="block text-sm font-medium text-gray-300">
              Status
            </label>
            <select
              id="variable-status"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as StoryVariable['status'] })
              }
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="tentative">Tentative</option>
              <option value="confirmed">Confirmed</option>
              <option value="locked">Locked (Canon)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="variable-value" className="block text-sm font-medium text-gray-300">
            Value
          </label>
          <input
            id="variable-value"
            type="text"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
            placeholder="Current value..."
          />
        </div>

        <div>
          <label htmlFor="variable-tags" className="block text-sm font-medium text-gray-300">
            Tags
          </label>
          <div className="flex gap-2 mt-1">
            <input
              id="variable-tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-900 text-indigo-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-indigo-300 hover:text-white"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="variable-description" className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            id="variable-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="What does this variable track?"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            {isEditing ? 'Save Changes' : 'Create Variable'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
