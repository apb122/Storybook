import React from 'react';
import type { StoryVariable } from '@/types';

interface VariableSuggestionsProps {
  suggestions: StoryVariable[];
  onAccept: (variable: StoryVariable) => void;
  onDismiss: (id: string) => void;
}

export const VariableSuggestions: React.FC<VariableSuggestionsProps> = ({
  suggestions,
  onAccept,
  onDismiss,
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-indigo-900/20 border border-indigo-900/50 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-3">
        Suggested Variables
      </h3>
      <div className="space-y-3">
        {suggestions.map((variable) => (
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
                onClick={() => onAccept(variable)}
                className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
              >
                Accept
              </button>
              <button
                onClick={() => onDismiss(variable.id)}
                className="px-3 py-1 text-gray-400 hover:text-white text-xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
