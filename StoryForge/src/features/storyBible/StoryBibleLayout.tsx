import React from 'react';

interface StoryBibleLayoutProps {
    sidebar: React.ReactNode;
    header: React.ReactNode;
    content: React.ReactNode;
}

export const StoryBibleLayout: React.FC<StoryBibleLayoutProps> = ({
    sidebar,
    header,
    content,
}) => {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-indigo-500/30">
            <div className="max-w-[1280px] mx-auto h-screen flex flex-col">
                {/* Top Header Area */}
                <header className="h-14 border-b border-gray-800 flex items-center px-6 bg-gray-900/50 backdrop-blur-sm shrink-0">
                    {header}
                </header>

                {/* Main Grid */}
                <div className="flex-1 min-h-0 grid grid-cols-[260px_1fr] divide-x divide-gray-800">
                    {/* Sidebar */}
                    <aside className="overflow-y-auto bg-gray-900/30">
                        {sidebar}
                    </aside>

                    {/* Content Area */}
                    <main className="overflow-y-auto bg-gray-900 relative">
                        {content}
                    </main>
                </div>
            </div>
        </div>
    );
};
