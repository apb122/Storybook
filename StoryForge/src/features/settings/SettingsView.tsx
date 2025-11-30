import React from 'react';
// import { useStoryStore } from '@/state/store';

export const SettingsView: React.FC = () => {
  // const resetStore = useStoryStore((state) => state.reset); // Not needed if we reload

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to delete ALL projects and data? This action cannot be undone.'
      )
    ) {
      // Clear localStorage
      localStorage.removeItem('storyforge-storage');

      // Reset store
      // Assuming the store has a reset action, otherwise we might need to reload or manually clear
      // If the store doesn't have a reset action exposed, clearing localStorage and reloading is the safest bet

      // Reload page to reset state from fresh storage
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

      <div className="max-w-2xl space-y-8">
        {/* Appearance Section */}
        <section className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 font-medium">Compact Mode</p>
              <p className="text-sm text-gray-500">
                Reduce spacing for higher information density.
              </p>
            </div>
            <button
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-4 py-2 rounded transition-colors"
              onClick={() => alert('Compact mode coming soon!')}
            >
              Toggle
            </button>
          </div>
        </section>

        {/* Data Management Section */}
        <section className="bg-gray-800 rounded-lg p-6 border border-gray-700 border-l-4 border-l-red-600">
          <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>

          <div className="space-y-4">
            <div>
              <p className="text-gray-300 font-medium text-red-400">Danger Zone</p>
              <p className="text-sm text-gray-500 mt-1">
                StoryForge currently stores all data in your browser's Local Storage. Clearing this
                will permanently delete all your projects, characters, and settings.
              </p>
            </div>

            <button
              onClick={handleResetData}
              className="bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-800 px-4 py-2 rounded transition-colors font-medium"
            >
              Reset All Data
            </button>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">About StoryForge</h2>
          <div className="text-sm text-gray-400 space-y-2">
            <p>Version: 0.1.0 (Alpha)</p>
            <p>
              StoryForge is a tool for planning and organizing your stories. It is currently in
              active development.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
