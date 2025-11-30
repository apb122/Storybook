import React, { useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { PlotNode } from '@/types';

interface FullManuscriptViewProps {
  className?: string;
}

const SceneRenderer: React.FC<{ scene: PlotNode }> = ({ scene }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: scene.manuscriptContent || {},
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 text-sf-text">{scene.title}</h3>
      <div className="bg-sf-surface p-6 rounded-lg shadow-sm border border-sf-border">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export const FullManuscriptView: React.FC<FullManuscriptViewProps> = ({ className = '' }) => {
  const plotNodes = useStoryStore((state) => state.plotNodes);

  // Get all scenes and sort them
  // This is a simplified sort. In a real app, we'd traverse the tree (Act -> Chapter -> Scene)
  // For now, we'll assume a flat list or simple ordering for demonstration if the tree structure isn't fully enforced yet
  // But strictly, we should traverse. Let's try to filter by type 'scene' and sort by order for now.
  // A better approach is to find the root nodes and traverse down.

  const sortedScenes = useMemo(() => {
    return plotNodes.filter((node) => node.type === 'scene').sort((a, b) => a.order - b.order); // This might be insufficient if they are in different chapters
  }, [plotNodes]);

  return (
    <div className={`overflow-y-auto p-8 ${className}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-sf-text">Full Manuscript</h1>
        {sortedScenes.length === 0 ? (
          <div className="text-center text-sf-text-muted">
            No scenes found. Start writing to see your manuscript here.
          </div>
        ) : (
          sortedScenes.map((scene) => <SceneRenderer key={scene.id} scene={scene} />)
        )}
      </div>
    </div>
  );
};
