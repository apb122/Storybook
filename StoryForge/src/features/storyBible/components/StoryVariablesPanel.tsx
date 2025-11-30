import React, { useState, useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import { generateId } from '@/utils/ids';
import type { StoryVariable } from '@/types';
import { VariableList } from './VariableList';
import { VariableEditor } from './VariableEditor';
import { VariableSuggestions } from './VariableSuggestions';

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
  const [modalInitialData, setModalInitialData] = useState<Partial<StoryVariable>>({});

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
      setModalInitialData({
        key: variable.key,
        label: variable.label,
        type: variable.type,
        value: variable.value,
        description: variable.description,
        status: variable.status || 'tentative',
        tags: variable.tags || [],
      });
    } else {
      setEditingId(null);
      setModalInitialData({
        key: '',
        label: '',
        type: 'string',
        value: '',
        description: '',
        status: 'tentative',
        tags: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveVariable = (formData: Partial<StoryVariable>) => {
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

  return (
    <div className="space-y-6">
      <VariableSuggestions
        suggestions={suggestedVariables}
        onAccept={handleAcceptSuggestion}
        onDismiss={removeSuggestedVariable}
      />

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

      <VariableList
        variables={filteredVariables}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        onEdit={handleOpenModal}
        onDelete={handleDelete}
        searchQuery={searchQuery}
      />

      <VariableEditor
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVariable}
        initialData={modalInitialData}
        isEditing={!!editingId}
      />
    </div>
  );
};
