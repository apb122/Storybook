import React, { useState } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { TRAIT_CATEGORIES } from './traitData';

interface TraitLibraryProps {
  onSelect: (trait: string) => void;
  onClose: () => void;
  selectedTraits: string[];
}

export const TraitLibrary: React.FC<TraitLibraryProps> = ({
  onSelect,
  onClose,
  selectedTraits,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCategories = TRAIT_CATEGORIES.map((category) => ({
    ...category,
    traits: category.traits.filter((trait) =>
      trait.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.traits.length > 0);

  const displayedCategories =
    activeCategory === 'all'
      ? filteredCategories
      : filteredCategories.filter((c) => c.id === activeCategory);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-700">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Trait Library</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700 space-y-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search traits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded-md pl-9 pr-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            {TRAIT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {displayedCategories.map((category) => (
            <div key={category.id}>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {category.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {category.traits.map((trait) => {
                  const isSelected = selectedTraits.includes(trait);
                  return (
                    <button
                      key={trait}
                      onClick={() => onSelect(trait)}
                      disabled={isSelected}
                      className={`px-3 py-2 rounded-md text-sm text-left transition-colors flex justify-between items-center group ${
                        isSelected
                          ? 'bg-indigo-900/30 text-indigo-400 cursor-default border border-indigo-900'
                          : 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-transparent'
                      }`}
                    >
                      <span>{trait}</span>
                      {!isSelected && (
                        <Plus
                          size={14}
                          className="opacity-0 group-hover:opacity-100 text-gray-400"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {displayedCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No traits found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
