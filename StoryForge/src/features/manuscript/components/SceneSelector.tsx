import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStoryStore } from '@/state/store';
import { FileText, Folder, FolderOpen } from 'lucide-react';
import type { PlotNode } from '@/types';

interface SceneSelectorProps {
  className?: string;
}

export const SceneSelector: React.FC<SceneSelectorProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { projectId, sceneId } = useParams<{ projectId: string; sceneId: string }>();
  const plotNodes = useStoryStore((state) =>
    state.plotNodes.filter((n) => n.projectId === projectId)
  );

  // Organize nodes into hierarchy
  const hierarchy = useMemo(() => {
    const acts = plotNodes.filter((n) => n.type === 'act').sort((a, b) => a.order - b.order);

    return acts.map((act) => {
      const chapters = plotNodes
        .filter((n) => n.parentId === act.id && n.type === 'chapter')
        .sort((a, b) => a.order - b.order);

      const actScenes = plotNodes
        .filter((n) => n.parentId === act.id && n.type === 'scene')
        .sort((a, b) => a.order - b.order);

      return {
        ...act,
        children: [
          ...chapters.map((chapter) => ({
            ...chapter,
            children: plotNodes
              .filter((n) => n.parentId === chapter.id && n.type === 'scene')
              .sort((a, b) => a.order - b.order),
          })),
          ...actScenes, // Scenes directly under act
        ],
      };
    });
  }, [plotNodes]);

  // Also handle orphaned scenes or flat structures if no acts exist
  const orphanedScenes = useMemo(() => {
    return plotNodes
      .filter((n) => n.type === 'scene' && !n.parentId)
      .sort((a, b) => a.order - b.order);
  }, [plotNodes]);

  const renderNode = (node: PlotNode & { children?: PlotNode[] }, level: number = 0) => {
    const isSelected = node.id === sceneId;
    const isScene = node.type === 'scene';
    const hasChildren = node.children && node.children.length > 0;

    // Simple indentation based on level
    const paddingLeft = `${level * 12 + 12}px`;

    if (isScene) {
      return (
        <div
          key={node.id}
          onClick={() => navigate(`/app/project/${projectId}/manuscript/${node.id}`)}
          className={`
            flex items-center gap-2 py-1.5 pr-2 cursor-pointer text-sm transition-colors
            ${
              isSelected
                ? 'bg-sf-accent/10 text-sf-accent border-r-2 border-sf-accent'
                : 'text-sf-text-muted hover:text-sf-text hover:bg-sf-surface-hover'
            }
          `}
          style={{ paddingLeft }}
        >
          <FileText size={14} className={isSelected ? 'text-sf-accent' : 'opacity-70'} />
          <span className="truncate">{node.title}</span>
        </div>
      );
    }

    // Container nodes (Act, Chapter)
    return (
      <div key={node.id} className="mb-1">
        <div
          className="flex items-center gap-2 py-1.5 pr-2 text-sm font-medium text-sf-text select-none"
          style={{ paddingLeft }}
        >
          {hasChildren ? (
            <FolderOpen size={14} className="text-sf-text-muted" />
          ) : (
            <Folder size={14} className="text-sf-text-muted" />
          )}
          <span className="truncate opacity-80">{node.title}</span>
        </div>
        {hasChildren && <div>{node.children!.map((child) => renderNode(child, level + 1))}</div>}
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full bg-sf-surface border-r border-sf-border ${className}`}>
      <div className="p-4 border-b border-sf-border">
        <h2 className="font-semibold text-sf-text">Manuscript</h2>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {hierarchy.length === 0 && orphanedScenes.length === 0 && (
          <div className="p-4 text-sm text-sf-text-muted text-center">
            No scenes found. Go to the Plot tab to create your story structure.
          </div>
        )}
        {hierarchy.map((act) => renderNode(act))}
        {orphanedScenes.map((scene) => renderNode(scene))}
      </div>
    </div>
  );
};
