import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PerSceneEditor } from './PerSceneEditor';
import { SceneSelector } from './components/SceneSelector';
import { WritingStats } from './components/WritingStats';
import { CommentSidebar } from './components/CommentSidebar';
import { FullManuscriptView } from './components/FullManuscriptView';
import { WritingTargets } from './components/WritingTargets';
import { BarChart2, MessageSquare, Target, BookOpen } from 'lucide-react';

export const ManuscriptPage: React.FC = () => {
    const { projectId, sceneId } = useParams<{ projectId: string; sceneId: string }>();
    const navigate = useNavigate();
    const [rightPanel, setRightPanel] = useState<'stats' | 'comments' | 'goals'>('stats');

    const handleFullViewClick = () => {
        // Navigate to the manuscript root (clearing sceneId)
        if (projectId) {
            navigate(`/app/project/${projectId}/manuscript`);
        } else {
            // Fallback: navigate up one level from the scene view
            // Assuming structure is .../manuscript/scene/:id
            // We want to go to .../manuscript
            navigate('..', { relative: 'path' });
        }
    };

    const isFullView = !sceneId;

    return (
        <div className="flex h-full overflow-hidden">
            <div className="flex flex-col w-64 flex-shrink-0 border-r border-sf-border bg-sf-surface">
                <div className="p-2 border-b border-sf-border">
                    <button
                        onClick={handleFullViewClick}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isFullView
                                ? 'bg-sf-accent/10 text-sf-accent'
                                : 'text-sf-text-muted hover:bg-sf-bg hover:text-sf-text'
                            }`}
                    >
                        <BookOpen size={16} />
                        Full Manuscript
                    </button>
                </div>
                <SceneSelector className="flex-1" />
            </div>

            <div className="flex-1 min-w-0 bg-sf-bg flex flex-col relative">
                {isFullView ? (
                    <FullManuscriptView className="h-full" />
                ) : (
                    <PerSceneEditor sceneId={sceneId!} />
                )}
            </div>

            <div className="w-72 flex-shrink-0 hidden lg:flex flex-col border-l border-sf-border bg-sf-surface">
                <div className="flex border-b border-sf-border">
                    <button
                        onClick={() => setRightPanel('stats')}
                        className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${rightPanel === 'stats'
                                ? 'text-sf-accent border-b-2 border-sf-accent'
                                : 'text-sf-text-muted hover:text-sf-text'
                            }`}
                        title="Statistics"
                    >
                        <BarChart2 size={16} />
                    </button>
                    <button
                        onClick={() => setRightPanel('goals')}
                        className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${rightPanel === 'goals'
                                ? 'text-sf-accent border-b-2 border-sf-accent'
                                : 'text-sf-text-muted hover:text-sf-text'
                            }`}
                        title="Goals"
                    >
                        <Target size={16} />
                    </button>
                    <button
                        onClick={() => setRightPanel('comments')}
                        className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${rightPanel === 'comments'
                                ? 'text-sf-accent border-b-2 border-sf-accent'
                                : 'text-sf-text-muted hover:text-sf-text'
                            }`}
                        title="Comments"
                    >
                        <MessageSquare size={16} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    {rightPanel === 'stats' && <WritingStats className="h-full" />}
                    {rightPanel === 'goals' && <WritingTargets className="h-full" />}
                    {rightPanel === 'comments' && <CommentSidebar className="h-full border-l-0" />}
                </div>
            </div>
        </div>
    );
};
