import React, { useState } from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import { generateId } from '@/utils/ids';
import { Modal } from '@/components/ui/Modal';
import type { StoryVariable } from '@/types';

interface StoryVariablesPanelProps {
  projectId: string;
}

export const StoryVariablesPanel: React.FC<StoryVariablesPanelProps> = ({ projectId }) => {
  const variables = useStoryStore(
    useShallow((state) => state.variables.filter((v) => v.projectId === projectId))
  );
  const suggestedVariables = useStoryStore(
    useShallow((state) => state.suggestedVariables?.filter((v) => v.projectId === projectId) || [])
  );
  const addVariable = useStoryStore((state) => state.addVariable);
  const updateVariable = useStoryStore((state) => state.updateVariable);
  const deleteVariable = useStoryStore((state) => state.deleteVariable);
  const removeSuggestedVariable = useStoryStore((state) => state.removeSuggestedVariable);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<StoryVariable>>({
    key: '',
    label: '',
    type: 'string',
    value: '',
    description: '',
  });

  const handleOpenModal = (variable?: StoryVariable) => {
    if (variable) {
      setEditingId(variable.id);
      setFormData({
        key: variable.key,
        label: variable.label,
        type: variable.type,
        value: variable.value,
        description: variable.description,
      });
    } else {
      setEditingId(null);
      setFormData({
        key: '',
        label: '',
        type: 'string',
        value: '',
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key || !formData.label) return;

    if (editingId) {
      updateVariable(editingId, {
        ...formData,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      const newVariable: StoryVariable = {
        id: generateId(),
        projectId,
        key: formData.key!,
        label: formData.label!,
        type: formData.type || 'string',
        value: formData.value || '',
        description: formData.description || '',
        lastUpdated: new Date().toISOString(),
      };
      addVariable(newVariable);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this variable?')) {
      deleteVariable(id);
    }
  };

  const handleAcceptSuggestion = (variable: StoryVariable) => {
    addVariable(variable);
    removeSuggestedVariable(variable.id);
  };

  return (
    <div className="space-y-6">
      {suggestedVariables.length > 0 && (
        <div className="bg-indigo-900/20 border border-indigo-900/50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-3">
            Suggested Variables
          </h3>
          <div className="space-y-3">
            {suggestedVariables.map((variable) => (
              <div
                key={variable.id}
                className="flex items-center justify-between bg-gray-800/50 p-3 rounded border border-gray-700"
              >
                <div>
                  <div className="text-sm font-medium text-white">{variable.label}</div>
                  <div className="text-xs text-gray-400">{variable.description}</div>
                  <div className="text-xs text-gray-500 font-mono mt-1">
                    Key: {variable.key} | Type: {variable.type}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptSuggestion(variable)}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => removeSuggestedVariable(variable.id)}
                    className="px-3 py-1 text-gray-400 hover:text-white text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Story Variables</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Variable
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Label / Key
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Value
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Last Updated
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {variables.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No variables defined yet.
                </td>
              </tr>
            ) : (
              variables.map((variable) => (
                <tr key={variable.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{variable.label}</div>
                    <div className="text-xs text-gray-500 font-mono">{variable.key}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
                      {variable.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 truncate max-w-xs" title={variable.value}>
                      {variable.value}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(variable.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(variable)}
                      className="text-indigo-400 hover:text-indigo-300 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(variable.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Variable' : 'Add Variable'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. hero_age"
            />
          </div>
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
            <label htmlFor="variable-value" className="block text-sm font-medium text-gray-300">
              Value
            </label>
            <input
              id="variable-value"
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Current value..."
            />
          </div>
          <div>
            <label
              htmlFor="variable-description"
              className="block text-sm font-medium text-gray-300"
            >
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
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {editingId ? 'Save Changes' : 'Create Variable'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
