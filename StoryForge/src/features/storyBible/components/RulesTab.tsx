import React from 'react';
import { Book, Zap, Scale } from 'lucide-react';

export const RulesTab: React.FC = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center">
      <div className="max-w-xl space-y-8">
        <div className="flex justify-center gap-6">
          <Book size={24} className="text-sf-text-muted" />
          <Zap size={24} className="text-sf-text-muted" />
          <Scale size={24} className="text-sf-text-muted" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-sf-text mb-4">World Rules & Systems</h2>
          <p className="text-sf-text-muted leading-relaxed">
            Define the laws of physics, magic systems, and societal rules that govern your story
            world. This module helps maintain consistency across your narrative.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="p-4 border border-sf-border rounded-sm">
            <h3 className="font-bold text-sf-text mb-2 flex items-center gap-2">
              <Zap size={16} /> Magic Systems
            </h3>
            <p className="text-sm text-sf-text-muted">
              Define costs, limitations, and sources of power.
            </p>
          </div>
          <div className="p-4 border border-sf-border rounded-sm">
            <h3 className="font-bold text-sf-text mb-2 flex items-center gap-2">
              <Scale size={16} /> Laws & Physics
            </h3>
            <p className="text-sm text-sf-text-muted">
              Establish the fundamental rules of your universe.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <span className="inline-block px-3 py-1 bg-sf-surface border border-sf-border rounded-full text-xs text-sf-text-muted uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
      </div>
    </div>
  );
};
