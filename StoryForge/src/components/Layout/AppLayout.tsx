import { Outlet } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { CommandPalette } from '../ui/CommandPalette';
import { useState, useEffect } from 'react';

export const AppLayout: React.FC = () => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans">
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />

      {/* Left Sidebar */}
      <SidebarNav />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Optional, can be part of pages or global) */}
        <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center">
            <Breadcrumbs />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center text-sm text-gray-400 hover:text-white transition-colors border border-gray-700 rounded px-2 py-1 bg-gray-800"
            >
              <span className="mr-2">Search...</span>
              <kbd className="text-xs bg-gray-700 px-1 rounded">⌘K</kbd>
            </button>
            {/* Placeholder for user/settings */}
            <div className="w-8 h-8 rounded-full bg-gray-700"></div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>

      {/* Right Inspector Panel (Placeholder) */}
      <aside className="w-72 bg-gray-900 border-l border-gray-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Inspector
          </h3>
        </div>
        <div className="flex-1 p-4 text-sm text-gray-500">
          <p>Select an element to view details or use AI tools here.</p>
        </div>
      </aside>
    </div>
  );
};
