import React from 'react';
import { NavLink } from 'react-router-dom';

interface Tab {
  path: string;
  label: string;
}

interface NavTabsProps {
  tabs: Tab[];
}

export const NavTabs: React.FC<NavTabsProps> = ({ tabs }) => {
  return (
    <nav className="flex space-x-6">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `pb-2 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
              isActive
                ? 'border-sf-text text-sf-text'
                : 'border-transparent text-sf-text-muted hover:text-sf-text hover:border-sf-border'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
};
