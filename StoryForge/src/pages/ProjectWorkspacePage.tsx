import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs } from '../components/ui/Tabs';
import { StoryBibleView } from '../features/storyBible/StoryBibleView';
import { useStoryStore } from '../state/store';

export const ProjectWorkspacePage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch project details to show title
    const projects = useStoryStore((state) => state.projects);
    const project = projects.find(p => p.id === projectId);

    if (!projectId) return <div>Invalid Project ID</div>;
    if (!project) return <div>Project not found</div>;

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'story-bible', label: 'Story Bible' },
        { id: 'plot', label: 'Plot' },
        { id: 'timeline', label: 'Timeline & Beats' },
        { id: 'ai-workshop', label: 'AI Workshop' },
        { id: 'exports', label: 'Exports' },
    ];

    return (
        <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                        <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
                        <span>/</span>
                        <span>{project.title}</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                </div>
            </div>

            <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            <div className="flex-1 overflow-hidden">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Project Stats</h2>
                            <p className="text-gray-400">Word count, scene count, etc. coming soon.</p>
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                            <p className="text-gray-400">No recent activity.</p>
                        </div>
                    </div>
                )}

                {activeTab === 'story-bible' && (
                    <StoryBibleView projectId={projectId} />
                )}

                {activeTab === 'plot' && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Plot Outline</h2>
                        <p className="text-gray-400">Acts, Chapters, Scenes... (Coming Soon)</p>
                    </div>
                )}

                {activeTab === 'timeline' && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Timeline</h2>
                        <p className="text-gray-400">Chronological events... (Coming Soon)</p>
                    </div>
                )}

                {activeTab === 'ai-workshop' && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">AI Workshop</h2>
                        <p className="text-gray-400">Brainstorming, drafting assistance... (Coming Soon)</p>
                    </div>
                )}

                {activeTab === 'exports' && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Exports</h2>
                        <p className="text-gray-400">Export to PDF, Word, etc... (Coming Soon)</p>
                    </div>
                )}
            </div>
        </div>
    );
};
