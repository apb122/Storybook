import React, { useState } from 'react';
import { useStoryStore } from '@/state/store';
import { createEmptyProject } from '@/types/validators';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TemplateType = 'blank' | 'novel' | 'screenplay' | 'game';

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState<TemplateType>('blank');
  const addProject = useStoryStore((state) => state.addProject);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = createEmptyProject();
    newProject.title = title || 'Untitled Project';
    newProject.status = 'planning';

    // Apply template logic
    if (template === 'novel') {
      newProject.genre = ['Fiction'];
      newProject.stats = { ...newProject.stats!, sceneCount: 0 };
    } else if (template === 'screenplay') {
      newProject.genre = ['Screenplay'];
    } else if (template === 'game') {
      newProject.genre = ['Game Narrative'];
    }

    addProject(newProject);
    onClose();
    setTitle('');
    setTemplate('blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Next Great Story..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Choose Template</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'blank', label: 'Blank', icon: '📄' },
                { id: 'novel', label: 'Novel', icon: '📚' },
                { id: 'screenplay', label: 'Screenplay', icon: '🎬' },
                { id: 'game', label: 'Game', icon: '🎮' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id as TemplateType)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    template === t.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="font-medium text-sm">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
