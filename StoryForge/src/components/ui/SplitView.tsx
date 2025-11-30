import React from 'react';

interface SplitViewProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  sidebarPosition?: 'left' | 'right';
}

export const SplitView: React.FC<SplitViewProps> = ({
  sidebar,
  content,
  className = '',
  sidebarPosition = 'left',
}) => {
  return (
    <div className={`flex flex-col md:flex-row h-full gap-8 ${className}`}>
      {sidebarPosition === 'left' && (
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col">{sidebar}</div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">{content}</div>

      {sidebarPosition === 'right' && (
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col">{sidebar}</div>
      )}
    </div>
  );
};
