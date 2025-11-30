import React, { useState } from 'react';
import { useStoryStore } from '@/state/store';
import { useParams } from 'react-router-dom';
import { MessageSquare, Check, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CommentSidebarProps {
  className?: string;
}

export const CommentSidebar: React.FC<CommentSidebarProps> = ({ className = '' }) => {
  const { sceneId } = useParams<{ sceneId: string }>();
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('open');

  const comments = useStoryStore((state) =>
    state.manuscriptComments
      .filter((c) => c.sceneId === sceneId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  );

  const resolveComment = useStoryStore((state) => state.resolveManuscriptComment);
  const deleteComment = useStoryStore((state) => state.deleteManuscriptComment);

  const filteredComments = comments.filter((c) => {
    if (filter === 'open') return !c.resolved;
    if (filter === 'resolved') return c.resolved;
    return true;
  });

  if (!sceneId) return null;

  return (
    <div className={`bg-sf-surface border-l border-sf-border flex flex-col ${className}`}>
      <div className="p-4 border-b border-sf-border flex items-center justify-between">
        <h2 className="font-semibold text-sf-text flex items-center gap-2">
          <MessageSquare size={18} />
          Comments
        </h2>
        <div className="flex bg-sf-bg rounded-md p-0.5">
          {(['open', 'resolved', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-xs rounded-sm capitalize transition-colors ${
                filter === f
                  ? 'bg-sf-surface shadow-sm text-sf-text'
                  : 'text-sf-text-muted hover:text-sf-text'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center text-sf-text-muted text-sm py-8">
            No {filter === 'all' ? '' : filter} comments found.
          </div>
        ) : (
          filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-md border ${
                comment.resolved
                  ? 'bg-sf-bg/50 border-sf-border opacity-75'
                  : 'bg-sf-bg border-sf-border shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-xs text-sf-text-muted">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </div>
                <div className="flex items-center gap-1">
                  {!comment.resolved && (
                    <button
                      onClick={() => resolveComment(comment.id)}
                      className="p-1 text-sf-text-muted hover:text-green-500 transition-colors"
                      title="Resolve"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-1 text-sf-text-muted hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {comment.selectionRange && (
                <div className="mb-2 pl-2 border-l-2 border-sf-accent/50 text-xs text-sf-text-muted italic truncate">
                  "{comment.selectionRange.text}"
                </div>
              )}

              <div className="text-sm text-sf-text whitespace-pre-wrap">{comment.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
