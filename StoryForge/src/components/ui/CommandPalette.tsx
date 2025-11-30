import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStoryStore } from '@/state/store';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const projects = useStoryStore((state) => state.projects);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const actions = [
    { id: 'dashboard', label: 'Go to Dashboard', type: 'navigation', path: '/' },
    { id: 'settings', label: 'Go to Settings', type: 'navigation', path: '/settings' },
  ];

  const projectActions = projects.map((p) => ({
    id: `project-${p.id}`,
    label: `Open Project: ${p.title}`,
    type: 'project',
    path: `/project/${p.id}/overview`,
  }));

  const allItems = [...actions, ...projectActions].filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        handleSelect(allItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (item: any) => {
    navigate(item.path);
    onClose();
    setQuery('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center border-b border-gray-800 px-4 py-3">
          <svg
            className="w-5 h-5 text-gray-400 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="text-xs text-gray-500 border border-gray-700 rounded px-1.5 py-0.5">
            ESC
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {allItems.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">No results found.</div>
          ) : (
            <ul className="space-y-1 px-2">
              {allItems.map((item, index) => (
                <li key={item.id}>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group transition-colors ${
                      index === selectedIndex
                        ? 'bg-indigo-600/20 text-indigo-300'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="flex items-center">
                      {item.type === 'project' ? (
                        <span className="w-4 h-4 mr-3 opacity-50">📁</span>
                      ) : (
                        <span className="w-4 h-4 mr-3 opacity-50">⚡</span>
                      )}
                      {item.label}
                    </span>
                    {index === selectedIndex && <span className="text-xs opacity-50">↵</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-gray-900 border-t border-gray-800 px-4 py-2 text-xs text-gray-500 flex justify-between">
          <span>Use arrows to navigate</span>
          <span>StoryForge Command</span>
        </div>
      </div>
    </div>
  );
};
