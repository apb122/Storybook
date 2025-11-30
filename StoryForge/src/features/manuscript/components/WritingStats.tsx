import React, { useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { useParams } from 'react-router-dom';
import { BarChart2, Clock } from 'lucide-react';

interface WritingStatsProps {
  className?: string;
}

export const WritingStats: React.FC<WritingStatsProps> = ({ className = '' }) => {
  const { projectId, sceneId } = useParams<{ projectId: string; sceneId: string }>();

  const project = useStoryStore((state) => state.projects.find((p) => p.id === projectId));

  const plotNodes = useStoryStore((state) =>
    state.plotNodes.filter((n) => n.projectId === projectId)
  );

  const currentScene = useStoryStore((state) => state.plotNodes.find((n) => n.id === sceneId));

  const stats = useMemo(() => {
    const totalWords = plotNodes.reduce((sum, node) => sum + (node.wordCount || 0), 0);
    const sceneWords = currentScene?.wordCount || 0;
    const targetWords = project?.manuscriptTarget?.targetWords || 50000; // Default target
    const progress = Math.min(100, (totalWords / targetWords) * 100);

    return {
      totalWords,
      sceneWords,
      targetWords,
      progress,
    };
  }, [plotNodes, currentScene, project]);

  if (!project) return null;

  return (
    <div className={`bg-sf-surface border-l border-sf-border flex flex-col ${className}`}>
      <div className="p-4 border-b border-sf-border">
        <h2 className="font-semibold text-sf-text flex items-center gap-2">
          <BarChart2 size={18} />
          Stats & Goals
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Scene Stats */}
        {currentScene && (
          <div>
            <h3 className="text-xs font-medium text-sf-text-muted uppercase mb-2">Current Scene</h3>
            <div className="bg-sf-bg p-3 rounded-md">
              <div className="text-2xl font-bold text-sf-text">
                {stats.sceneWords.toLocaleString()}
              </div>
              <div className="text-xs text-sf-text-muted">words</div>
            </div>
          </div>
        )}

        {/* Project Stats */}
        <div>
          <h3 className="text-xs font-medium text-sf-text-muted uppercase mb-2">
            Total Manuscript
          </h3>
          <div className="bg-sf-bg p-3 rounded-md mb-2">
            <div className="text-2xl font-bold text-sf-text">
              {stats.totalWords.toLocaleString()}
            </div>
            <div className="text-xs text-sf-text-muted">
              of {stats.targetWords.toLocaleString()} target
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-sf-border rounded-full overflow-hidden">
            <div
              className="h-full bg-sf-accent transition-all duration-500"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <div className="mt-1 text-right text-xs text-sf-text-muted">
            {stats.progress.toFixed(1)}% complete
          </div>
        </div>

        {/* Session Info (Placeholder) */}
        <div>
          <h3 className="text-xs font-medium text-sf-text-muted uppercase mb-2">Session</h3>
          <div className="flex items-center gap-2 text-sm text-sf-text">
            <Clock size={14} className="text-sf-text-muted" />
            <span>0 words today</span>
          </div>
        </div>
      </div>
    </div>
  );
};
