import React from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';

interface CharacterContinuityViewProps {
  characterId: string;
  projectId: string;
}

export const CharacterContinuityView: React.FC<CharacterContinuityViewProps> = ({
  characterId,
  projectId,
}) => {
  const issues = useStoryStore(
    useShallow((state) =>
      state.continuityIssues.filter(
        (i) => i.projectId === projectId && i.relatedEntityIds?.includes(characterId)
      )
    )
  );

  const characterName = useStoryStore(
    (state) => state.characters.find((c) => c.id === characterId)?.name
  );

  const variables = useStoryStore(
    useShallow((state) =>
      state.variables.filter(
        (v) =>
          v.projectId === projectId &&
          (v.label.includes(characterName || '') || v.description?.includes(characterName || ''))
      )
    )
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Variables Section */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Related Variables</h3>
          {variables.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No variables explicitly linked to this character.
            </p>
          ) : (
            <div className="space-y-2">
              {variables.map((v) => (
                <div key={v.id} className="bg-gray-900/50 p-3 rounded border border-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-indigo-300">{v.label}</div>
                      <div className="text-xs text-gray-400">{v.value}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-500 border border-gray-700">
                      {v.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Issues Section */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Continuity Issues</h3>
          {issues.length === 0 ? (
            <p className="text-gray-500 text-sm">No unresolved continuity issues detected.</p>
          ) : (
            <div className="space-y-2">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="bg-gray-900/50 p-3 rounded border border-gray-700/50"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-[10px] font-bold px-1.5 rounded ${
                        issue.severity === 'major'
                          ? 'bg-red-900 text-red-200'
                          : issue.severity === 'moderate'
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-blue-900 text-blue-200'
                      }`}
                    >
                      {issue.severity.toUpperCase()}
                    </span>
                    {issue.resolved && <span className="text-green-500 text-xs">✓ Resolved</span>}
                  </div>
                  <p className="text-sm text-gray-300">{issue.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
