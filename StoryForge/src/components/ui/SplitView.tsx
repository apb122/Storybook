import React from 'react';

interface SplitViewProps {
    sidebar: React.ReactNode;
    content: React.ReactNode;
    className?: string;
}

export const SplitView: React.FC<SplitViewProps> = ({ sidebar, content, className = '' }) => {
    return (
        <div className={`flex flex-col md:flex-row h-[calc(100vh-12rem)] gap-6 ${className}`}>
            <div className="w-full md:w-1/3 lg:w-1/4 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col">
                {sidebar}
            </div>
            <div className="w-full md:w-2/3 lg:w-3/4 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden flex flex-col">
                {content}
            </div>
        </div>
    );
};
