import React, { useState, useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import { generateId } from '@/utils/ids';
import { Modal } from '@/components/ui/Modal';
import type { ContinuityIssue } from '@/types';

interface ContinuityIssuesPanelProps {
  projectId: string;
}

type SortField = 'severity' | 'type' | 'createdAt' | 'resolved';
type SortOrder = 'asc' | 'desc';

export const ContinuityIssuesPanel: React.FC<ContinuityIssuesPanelProps> = ({ projectId }) => {
  const issues = useStoryStore(
    useShallow((state) => state.continuityIssues.filter((i) => i.projectId === projectId))
  );
  const addIssue = useStoryStore((state) => state.addContinuityIssue);
  const updateIssue = useStoryStore((state) => state.updateContinuityIssue);
  const deleteIssue = useStoryStore((state) => state.deleteContinuityIssue);

  // -- Local State --
  const [filterSeverity, setFilterSeverity] = useState<ContinuityIssue['severity'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ContinuityIssue>>({
    description: '',
    type: 'logic',
    severity: 'minor',
    suggestedFix: '',
  });

  // -- Derived State --
  const filteredIssues = useMemo(() => {
    let result = [...issues];

    // Filter by Status
    if (filterStatus === 'unresolved') {
      result = result.filter((i) => !i.resolved);
    } else if (filterStatus === 'resolved') {
      result = result.filter((i) => i.resolved);
    }

    // Filter by Severity
    if (filterSeverity !== 'all') {
      result = result.filter((i) => i.severity === filterSeverity);
    }

    // Sort
    result.sort((a, b) => {
      let valA: string | boolean | number = a[sortField];
      let valB: string | boolean | number = b[sortField];

      // Custom sort for severity
      if (sortField === 'severity') {
        const severityMap = { minor: 1, moderate: 2, major: 3 };
        valA = severityMap[a.severity];
        valB = severityMap[b.severity];
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [issues, filterStatus, filterSeverity, sortField, sortOrder]);

  // -- Handlers --
  const handleOpenModal = (issue?: ContinuityIssue) => {
    if (issue) {
      setEditingId(issue.id);
      setFormData({
        description: issue.description,
        type: issue.type,
        severity: issue.severity,
        suggestedFix: issue.suggestedFix || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        description: '',
        type: 'logic',
        severity: 'minor',
        suggestedFix: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;

    if (editingId) {
      updateIssue(editingId, formData);
    } else {
      const newIssue: ContinuityIssue = {
        id: generateId(),
        projectId,
        description: formData.description!,
        type: formData.type || 'logic',
        severity: formData.severity || 'minor',
        suggestedFix: formData.suggestedFix,
        resolved: false,
        createdAt: new Date().toISOString(),
      };
      addIssue(newIssue);
    }
    setIsModalOpen(false);
  };

  const handleToggleResolved = (issue: ContinuityIssue) => {
    updateIssue(issue.id, {
      resolved: !issue.resolved,
      resolvedAt: !issue.resolved ? new Date().toISOString() : undefined,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      deleteIssue(id);
    }
  };

  // -- Render Helpers --
  const getSeverityBadge = (severity: ContinuityIssue['severity']) => {
    switch (severity) {
      case 'major':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-900 text-red-200 border border-red-700">
            MAJOR
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-900 text-yellow-200 border border-yellow-700">
            MODERATE
          </span>
        );
      case 'minor':
        return (
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-900 text-blue-200 border border-blue-700">
            MINOR
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-white">Continuity Issues</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          Report Issue
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase font-medium">Show:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'unresolved' | 'resolved')}
            className="bg-gray-700 border-gray-600 text-white text-xs rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Filter by status"
          >
            <option value="all">All Issues</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase font-medium">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) =>
              setFilterSeverity(e.target.value as ContinuityIssue['severity'] | 'all')
            }
            className="bg-gray-700 border-gray-600 text-white text-xs rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Filter by severity"
          >
            <option value="all">All Severities</option>
            <option value="major">Major</option>
            <option value="moderate">Moderate</option>
            <option value="minor">Minor</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase font-medium">Sort:</span>
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortField(field as SortField);
              setSortOrder(order as SortOrder);
            }}
            className="bg-gray-700 border-gray-600 text-white text-xs rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"
            aria-label="Sort issues"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="severity-desc">Highest Severity</option>
            <option value="severity-asc">Lowest Severity</option>
            <option value="type-asc">Type (A-Z)</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-800 rounded-lg border border-gray-700">
            No continuity issues found matching your filters.
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`bg-gray-800 border rounded-lg p-4 transition-all ${
                issue.resolved
                  ? 'border-green-900/30 opacity-75'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getSeverityBadge(issue.severity)}
                    <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                      {issue.type}
                    </span>
                    {issue.resolved && (
                      <span className="text-xs text-green-400 font-medium flex items-center gap-1">
                        ✓ Resolved
                      </span>
                    )}
                  </div>
                  <p className="text-white text-sm mb-2">{issue.description}</p>
                  {issue.suggestedFix && (
                    <div className="bg-gray-900/50 p-2 rounded text-xs text-gray-300 border border-gray-700/50">
                      <strong className="text-indigo-300">Suggestion:</strong> {issue.suggestedFix}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleToggleResolved(issue)}
                    className={`px-3 py-1 text-xs font-medium rounded border transition-colors ${
                      issue.resolved
                        ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                        : 'bg-green-900/20 text-green-300 border-green-900/50 hover:bg-green-900/40'
                    }`}
                  >
                    {issue.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                  </button>
                  <button
                    onClick={() => handleOpenModal(issue)}
                    className="text-indigo-400 hover:text-indigo-300 text-xs text-right"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(issue.id)}
                    className="text-red-400 hover:text-red-300 text-xs text-right"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Issue' : 'Report Continuity Issue'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="issue-desc" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="issue-desc"
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe the inconsistency..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="issue-type" className="block text-sm font-medium text-gray-300">
                Type
              </label>
              <select
                id="issue-type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as ContinuityIssue['type'] })
                }
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="logic">Logic</option>
                <option value="character">Character</option>
                <option value="timeline">Timeline</option>
                <option value="world_rule">World Rule</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="issue-severity" className="block text-sm font-medium text-gray-300">
                Severity
              </label>
              <select
                id="issue-severity"
                value={formData.severity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    severity: e.target.value as ContinuityIssue['severity'],
                  })
                }
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="major">Major</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="issue-fix" className="block text-sm font-medium text-gray-300">
              Suggested Fix (Optional)
            </label>
            <textarea
              id="issue-fix"
              rows={2}
              value={formData.suggestedFix}
              onChange={(e) => setFormData({ ...formData, suggestedFix: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="How should this be resolved?"
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
              {editingId ? 'Save Changes' : 'Report Issue'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
