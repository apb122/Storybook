import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

export const SidebarNav: React.FC = () => {
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem('sidebar-width');
    return saved ? parseInt(saved, 10) : 256; // Default 256px (w-64)
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  };

  useEffect(() => {
    const stopResizing = () => setIsResizing(false);

    const resize = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.max(200, Math.min(400, e.clientX));
        setWidth(newWidth);
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  useEffect(() => {
    localStorage.setItem('sidebar-width', width.toString());
  }, [width]);

  return (
    <aside
      ref={sidebarRef}
      className="bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 relative group"
      style={{ width: `${width}px` }}
    >
      <div className="p-4 flex items-center justify-center border-b border-gray-800 h-14">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <span className="ml-3 font-bold text-lg tracking-tight text-white">StoryForge</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          <span className="mr-3">🏠</span>
          Dashboard
        </NavLink>

        <div className="pt-4 pb-2">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Library
          </p>
        </div>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          <span className="mr-3">⚙️</span>
          Settings
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-xs text-gray-500">v0.1.0-alpha</span>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-indigo-500 transition-colors z-10 opacity-0 group-hover:opacity-100"
        onMouseDown={startResizing}
      />
    </aside>
  );
};
