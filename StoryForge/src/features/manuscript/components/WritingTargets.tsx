import React, { useState } from 'react';
import { useStoryStore } from '@/state/store';
import { Target, Edit2, Check, X } from 'lucide-react';

interface WritingTargetsProps {
  className?: string;
}

export const WritingTargets: React.FC<WritingTargetsProps> = ({ className = '' }) => {
  const writingTargets = useStoryStore((state) => state.writingTargets);
  const setWritingTargets = useStoryStore((state) => state.setWritingTargets);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    daily: writingTargets.daily,
    total: writingTargets.total,
  });

  const handleSave = () => {
    setWritingTargets({
      ...writingTargets,
      daily: editValues.daily,
      total: editValues.total,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      daily: writingTargets.daily,
      total: writingTargets.total,
    });
    setIsEditing(false);
  };

  // Calculate progress
  // Note: Actual daily progress calculation requires tracking session start.
  // For now, we visualize the target values.
  // Ideally, we'd compare `sessionStartWordCount` with current total word count of the project,
  // but that requires summing up all scenes.

  const plotNodes = useStoryStore((state) => state.plotNodes);
  const totalWordCount = plotNodes.reduce((sum, node) => sum + (node.wordCount || 0), 0);

  // Daily progress is tricky without a persistent "start of day" snapshot.
  // We'll use the session tracking from the store if available, or just show 0 for now if not fully implemented.
  const dailyProgress = Math.max(0, totalWordCount - writingTargets.sessionStartWordCount);

  return (
    <div className={`bg-sf-surface border-l border-sf-border flex flex-col ${className}`}>
      <div className="p-4 border-b border-sf-border flex items-center justify-between">
        <h2 className="font-semibold text-sf-text flex items-center gap-2">
          <Target size={18} />
          Targets
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-sf-text-muted hover:text-sf-text transition-colors"
            aria-label="Edit targets"
            title="Edit targets"
          >
            <Edit2 size={14} />
          </button>
        ) : (
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="p-1 text-green-500 hover:text-green-600 transition-colors"
              aria-label="Save targets"
              title="Save targets"
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 text-red-500 hover:text-red-600 transition-colors"
              aria-label="Cancel editing"
              title="Cancel editing"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Daily Target */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-sf-text-muted">Daily Goal</span>
            <span className="font-medium text-sf-text">
              {isEditing ? (
                <input
                  type="number"
                  value={editValues.daily}
                  onChange={(e) =>
                    setEditValues({ ...editValues, daily: parseInt(e.target.value) || 0 })
                  }
                  className="w-16 bg-sf-bg border border-sf-border rounded px-1 text-right"
                  aria-label="Daily word count goal"
                  placeholder="0"
                />
              ) : (
                `${dailyProgress} / ${writingTargets.daily}`
              )}
            </span>
          </div>
          <div className="h-2 bg-sf-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${writingTargets.daily > 0 ? Math.min(100, (dailyProgress / writingTargets.daily) * 100) : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Total Target */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-sf-text-muted">Total Goal</span>
            <span className="font-medium text-sf-text">
              {isEditing ? (
                <input
                  type="number"
                  value={editValues.total}
                  onChange={(e) =>
                    setEditValues({ ...editValues, total: parseInt(e.target.value) || 0 })
                  }
                  className="w-20 bg-sf-bg border border-sf-border rounded px-1 text-right"
                  aria-label="Total word count goal"
                  placeholder="0"
                />
              ) : (
                `${totalWordCount} / ${writingTargets.total}`
              )}
            </span>
          </div>
          <div className="h-2 bg-sf-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-500"
              style={{
                width: `${writingTargets.total > 0 ? Math.min(100, (totalWordCount / writingTargets.total) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
