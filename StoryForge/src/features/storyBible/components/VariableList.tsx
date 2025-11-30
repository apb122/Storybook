import React from 'react';
import type { StoryVariable } from '@/types';

interface VariableListProps {
  variables: StoryVariable[];
  sortField: 'label' | 'key' | 'type' | 'lastUpdated' | 'status';
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'label' | 'key' | 'type' | 'lastUpdated' | 'status') => void;
  onEdit: (variable: StoryVariable) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
}

export const VariableList: React.FC<VariableListProps> = ({
  variables,
  sortField,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  searchQuery,
}) => {
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
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => onSort('label')}
              >
                Label / Key {sortField === 'label' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => onSort('status')}
              >
                Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white"
                onClick={() => onSort('type')}
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
                onClick={() => onSort('lastUpdated')}
              >
                Updated {sortField === 'lastUpdated' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {variables.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  {searchQuery
                    ? 'No variables match your search.'
                    : 'No variables defined yet. Create one to get started.'}
                </td>
              </tr>
            ) : (
              variables.map((variable) => (
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
                      onClick={() => onEdit(variable)}
                      className="text-indigo-400 hover:text-indigo-300 mr-4 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(variable.id)}
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
  );
};
