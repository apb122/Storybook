import React from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import type { ContinuityIssue } from '@/types';

interface ContinuityIssuesPanelProps {
  projectId: string;
}

export const ContinuityIssuesPanel: React.FC<ContinuityIssuesPanelProps> = ({ projectId }) => {
  const issues = useStoryStore(
    useShallow((state) => state.continuityIssues.filter((i) => i.projectId === projectId))
  );
  const updateContinuityIssue = useStoryStore((state) => state.updateContinuityIssue);
  const deleteContinuityIssue = useStoryStore((state) => state.deleteContinuityIssue);

  const handleToggleResolved = (issue: ContinuityIssue) => {
    updateContinuityIssue(issue.id, {
      resolved: !issue.resolved,
      resolvedAt: !issue.resolved ? new Date().toISOString() : undefined,
    });
  };

  const getSeverityColor = (severity: ContinuityIssue['severity']) => {
    switch (severity) {
      case 'major':
        return 'text-red-400 border-red-900 bg-red-900/20';
      case 'moderate':
        return 'text-yellow-400 border-yellow-900 bg-yellow-900/20';
      case 'minor':
        return 'text-blue-400 border-blue-900 bg-blue-900/20';
      default:
        return 'text-gray-400 border-gray-700 bg-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Continuity Issues
      </h3>

      {issues.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No continuity issues found.
          <br />
          Use the "Check Continuity" mode in AI Workshop to find potential errors.
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className={`p-3 rounded-lg border ${issue.resolved ? 'opacity-50 border-gray-700 bg-gray-800/50' : 'border-gray-700 bg-gray-800'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded border ${getSeverityColor(issue.severity)} capitalize`}
                >
                  {issue.severity}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(issue.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className={`text-sm text-gray-300 mb-2 ${issue.resolved ? 'line-through' : ''}`}>
                {issue.description}
              </p>

              {issue.suggestedFix && !issue.resolved && (
                <div className="mb-3 p-2 bg-indigo-900/20 border border-indigo-900/50 rounded text-xs text-indigo-300">
                  <span className="font-semibold">Suggestion:</span> {issue.suggestedFix}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleToggleResolved(issue)}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    issue.resolved
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'bg-green-900/30 text-green-400 hover:bg-green-900/50 border border-green-900'
                  }`}
                >
                  {issue.resolved ? 'Mark Unresolved' : 'Resolve'}
                </button>
                <button
                  onClick={() => deleteContinuityIssue(issue.id)}
                  className="text-xs px-2 py-1 text-red-400 hover:text-red-300"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
