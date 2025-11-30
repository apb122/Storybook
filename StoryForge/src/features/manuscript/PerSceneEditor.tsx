import React, { useCallback } from 'react';
import { useStoryStore } from '@/state/store';
import { ManuscriptEditor } from './components/ManuscriptEditor';
import type { ManuscriptContent } from '@/types';
import { createEmptyManuscriptContent } from '@/types/manuscriptValidators';

interface PerSceneEditorProps {
  sceneId: string;
}

export const PerSceneEditor: React.FC<PerSceneEditorProps> = ({ sceneId }) => {
  const scene = useStoryStore((state) => state.plotNodes.find((n) => n.id === sceneId));
  const updateSceneManuscript = useStoryStore((state) => state.updateSceneManuscript);
  const addComment = useStoryStore((state) => state.addManuscriptComment);

  const handleUpdate = useCallback(
    (content: ManuscriptContent, wordCount: number) => {
      if (sceneId) {
        updateSceneManuscript(sceneId, content, wordCount);
      }
    },
    [sceneId, updateSceneManuscript]
  );

  const handleAddComment = useCallback(
    (selection: { from: number; to: number; text: string }) => {
      if (!sceneId || !scene) return;

      const content = window.prompt('Add a comment:');
      if (!content) return;

      const newComment = {
        id: crypto.randomUUID(),
        projectId: scene.projectId,
        sceneId: scene.id,
        content,
        selectionRange: {
          from: selection.from,
          to: selection.to,
          text: selection.text,
        },
        authorId: 'current-user', // TODO: Real user ID
        resolved: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addComment(newComment);
    },
    [sceneId, scene, addComment]
  );

  if (!scene) {
    return (
      <div className="flex items-center justify-center h-full text-sf-text-muted">
        Scene not found
      </div>
    );
  }

  // Ensure we have valid content to start with
  const initialContent = scene.manuscriptContent || createEmptyManuscriptContent();

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-sf-text">{scene.title}</h2>
        {/* description is optional on PlotNode */}
        {scene.summary && <p className="text-sm text-sf-text-muted">{scene.summary}</p>}
      </div>

      <div className="flex-1 min-h-0">
        <ManuscriptEditor
          initialContent={initialContent}
          onUpdate={handleUpdate}
          onAddComment={handleAddComment}
          className="h-full"
          placeholder={`Write the scene "${scene.title}"...`}
        />
      </div>
    </div>
  );
};
