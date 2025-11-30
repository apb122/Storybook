import React, { useState, useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import { generateId } from '@/utils/ids';
import { Modal } from '@/components/ui/Modal';
import type { StoryVariable } from '@/types';

interface StoryVariablesPanelProps {
  projectId: string;
}

type SortField = 'label' | 'key' | 'type' | 'lastUpdated' | 'status';
type SortOrder = 'asc' | 'desc';

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

  // -- Local State for UI --
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StoryVariable['status'] | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('lastUpdated');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
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

  // -- Derived State --
  const filteredVariables = useMemo(() => {
    let result = [...variables];

    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.label.toLowerCase().includes(q) ||
          v.key.toLowerCase().includes(q) ||
          v.description?.toLowerCase().includes(q) ||
          v.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by Status
    if (statusFilter !== 'all') {
      result = result.filter((v) => v.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle potentially undefined values if any (though types say required)
      if (valA === undefined) valA = '';
      if (valB === undefined) valB = '';

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [variables, searchQuery, statusFilter, sortField, sortOrder]);

  // -- Handlers --

  const handleOpenModal = (variable?: StoryVariable) => {
    if (variable) {
      setEditingId(variable.id);
      setFormData({
        key: variable.key,
        label: variable.label,
        type: variable.type,
        value: variable.value,
        description: variable.description,
        status: variable.status || 'tentative', // Fallback for existing data
        tags: variable.tags || [],
      });
    } else {
      setEditingId(null);
      setFormData({
        key: '',
        label: '',
        type: 'string',
        value: '',
        description: '',
        status: 'tentative',
        tags: [],
      });
    }
    setTagInput('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key || !formData.label) return;

    const variableData = {
      ...formData,
      status: formData.status || 'tentative',
      tags: formData.tags || [],
      lastUpdated: new Date().toISOString(),
    };

    if (editingId) {
      updateVariable(editingId, variableData);
    } else {
      const newVariable: StoryVariable = {
        id: generateId(),
        projectId,
        key: formData.key!,
        label: formData.label!,
        type: formData.type || 'string',
        value: formData.value || '',
        description: formData.description || '',
        status: formData.status || 'tentative',
        tags: formData.tags || [],
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
    // Ensure suggestion has new fields
    const enrichedVariable = {
      ...variable,
      status: 'tentative' as const,
      tags: [],
      lastUpdated: new Date().toISOString(),
    };
    addVariable(enrichedVariable);
    removeSuggestedVariable(variable.id);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
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

  // -- Render Helpers --

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'locked':
        return 'bg-red-900/50 text-red-200 border-red-800';
      case 'confirmed':
        return 'bg-green-900/50 text-green-200 border-green-800';
      case 'tentative':
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Suggestions Section */}
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

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-white">Story Variables</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search variables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 sm:w-64 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Add Variable
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 items-center overflow-x-auto pb-2">
        <span className="text-xs text-gray-500 uppercase font-medium mr-2">Status:</span>
        {(['all', 'tentative', 'confirmed', 'locked'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              statusFilter === status
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('label')}
                >
                  Label / Key {sortField === 'label' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('type')}
                >
                  Type {sortField === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('lastUpdated')}
                >
                  Updated {sortField === 'lastUpdated' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredVariables.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                    {searchQuery
                      ? 'No variables match your search.'
                      : 'No variables defined yet. Create one to get started.'}
                  </td>
                </tr>
              ) : (
                filteredVariables.map((variable) => (
                  <tr key={variable.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{variable.label}</span>
                        <span className="text-xs text-gray-500 font-mono">{variable.key}</span>
                        {variable.tags && variable.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {variable.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-gray-700 text-gray-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full border ${getStatusColor(
                          variable.status
                        )}`}
                      >
                        {variable.status || 'Tentative'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-4 font-mono rounded bg-gray-900 text-gray-400 border border-gray-700">
                        {variable.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-300 truncate max-w-xs font-mono bg-gray-900/50 px-2 py-1 rounded"
                        title={variable.value}
                      >
                        {variable.value}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(variable.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(variable)}
                        className="text-indigo-400 hover:text-indigo-300 mr-4 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(variable.id)}
                        className={`text-red-400 hover:text-red-300 transition-colors ${
                          variable.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={variable.status === 'locked'}
                        title={variable.status === 'locked' ? 'Cannot delete locked variable' : ''}
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
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Variable' : 'Add Variable'}
      >
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

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {editingId ? 'Save Changes' : 'Create Variable'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
