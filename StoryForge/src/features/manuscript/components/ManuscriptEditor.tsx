import React, { useEffect } from 'react';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { EditorToolbar } from './EditorToolbar';
import type { ManuscriptContent } from '@/types';

interface ManuscriptEditorProps {
  initialContent?: ManuscriptContent;
  onUpdate?: (content: ManuscriptContent, wordCount: number) => void;
  onAddComment?: (selection: { from: number; to: number; text: string }) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export const ManuscriptEditor: React.FC<ManuscriptEditorProps> = ({
  initialContent,
  onUpdate,
  onAddComment,
  placeholder = 'Start writing...',
  readOnly = false,
  className = '',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
    ],
    content: initialContent as JSONContent,
    editable: !readOnly,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[500px] px-8 py-6 text-sf-text',
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        const json = editor.getJSON() as ManuscriptContent;
        const wordCount = editor.storage.characterCount.words();
        onUpdate(json, wordCount);
      }
    },
  });

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [readOnly, editor]);

  const handleAddCommentClick = () => {
    if (editor && onAddComment) {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      onAddComment({ from, to, text });
    }
  };

  return (
    <div className={`flex flex-col border border-sf-border rounded-sm bg-sf-bg ${className}`}>
      {!readOnly && (
        <EditorToolbar
          editor={editor}
          onAddComment={onAddComment ? handleAddCommentClick : undefined}
        />
      )}
      <div className="flex-1 overflow-y-auto bg-sf-bg">
        <EditorContent editor={editor} />
      </div>
      <div className="border-t border-sf-border p-2 text-xs text-sf-text-muted flex justify-end bg-sf-surface">
        {editor ? (
          <span>
            {editor.storage.characterCount.words()} words •{' '}
            {editor.storage.characterCount.characters()} characters
          </span>
        ) : (
          <span>Loading stats...</span>
        )}
      </div>
    </div>
  );
};
