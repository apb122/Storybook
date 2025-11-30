import React from 'react';
import { Book, Zap, Scale } from 'lucide-react';

export const RulesTab: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-900 text-white items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <div className="flex justify-center space-x-4 mb-8">
          <div className="p-4 bg-indigo-900/30 rounded-full border border-indigo-500/30">
            <Book size={32} className="text-indigo-400" />
          </div>
          <div className="p-4 bg-purple-900/30 rounded-full border border-purple-500/30">
            <Zap size={32} className="text-purple-400" />
          </div>
          <div className="p-4 bg-emerald-900/30 rounded-full border border-emerald-500/30">
            <Scale size={32} className="text-emerald-400" />
          </div>
        </div>

        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          World Rules & Systems
        </h2>

        <p className="text-gray-400 text-lg leading-relaxed">
          Define the laws of physics, magic systems, and societal rules that govern your story
          world. This module will help you maintain consistency and track how these rules affect
          your characters and plot.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-8">
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2 text-indigo-400">
              <Zap size={20} />
              <h3 className="font-semibold">Magic Systems</h3>
            </div>
            <p className="text-sm text-gray-500">
              Define costs, limitations, and sources of power.
            </p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Scale size={20} />
              <h3 className="font-semibold">Laws & Physics</h3>
            </div>
            <p className="text-sm text-gray-500">
              Establish the fundamental rules of your universe.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <span className="inline-block px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-500 border border-gray-700">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};
