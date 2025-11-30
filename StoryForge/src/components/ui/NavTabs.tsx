import React from 'react';
import { NavLink } from 'react-router-dom';

interface Tab {
  path: string;
  label: string;
  end?: boolean;
}

interface NavTabsProps {
  tabs: Tab[];
  className?: string;
}

export const NavTabs: React.FC<NavTabsProps> = ({ tabs, className = '' }) => {
  return (
    <div className={`border-b border-gray-700 ${className}`}>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.end}
            className={({ isActive }) => `
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                isActive
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
