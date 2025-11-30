import React from 'react';
import { useStoryStore } from '../../state/store';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const projects = useStoryStore((state) => state.projects);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shadow-sm z-10">
        <div className="text-xl font-bold text-indigo-600">StoryForge</div>
        <div className="ml-4 px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full font-medium">
          {projects.length} Projects
        </div>
        <nav className="ml-auto flex gap-4">
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Projects
          </a>
          <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors">
            Settings
          </a>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Navigation
          </div>
          <ul className="space-y-2">
            <li className="p-2 rounded hover:bg-gray-100 cursor-pointer text-sm font-medium text-gray-700">
              Dashboard
            </li>
            <li className="p-2 rounded hover:bg-gray-100 cursor-pointer text-sm font-medium text-gray-700">
              My Stories
            </li>
            <li className="p-2 rounded hover:bg-gray-100 cursor-pointer text-sm font-medium text-gray-700">
              Characters
            </li>
            <li className="p-2 rounded hover:bg-gray-100 cursor-pointer text-sm font-medium text-gray-700">
              World Building
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">{children}</div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 bg-white border-l border-gray-200 hidden lg:flex flex-col p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Tools & Context
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-bold text-indigo-800 mb-1">Quick Note</h4>
            <p className="text-xs text-indigo-700">Jot down ideas here...</p>
          </div>
          <div className="flex-1 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Context Panel Placeholder
          </div>
        </aside>
      </div>
    </div>
  );
};
