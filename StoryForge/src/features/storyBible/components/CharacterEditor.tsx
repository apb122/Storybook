import React, { useState, useEffect } from 'react';
import type { Character, CharacterRelationship } from '@/types/story';
import {
  Save,
  User,
  Hash,
  AlignLeft,
  Heart,
  Target,
  AlertCircle,
  Network,
  BookOpen,
} from 'lucide-react';
import { RelationshipManager } from './RelationshipManager';
import { RelationshipGraph } from './RelationshipGraph';
import { TraitLibrary } from './TraitLibrary';

interface CharacterEditorProps {
  character: Character;
  onSave: (id: string, updates: Partial<Character>) => void;
}

export const CharacterEditor: React.FC<CharacterEditorProps> = ({ character, onSave }) => {
  const [formData, setFormData] = useState<Partial<Character>>(character);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'network'>('details');
  const [showTraitLibrary, setShowTraitLibrary] = useState(false); // Debounced save
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      onSave(character.id, formData);
      setIsDirty(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData, isDirty, character.id, onSave]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tags }));
    setIsDirty(true);
  };

  const handleTraitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const traits = e.target.value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, traits }));
    setIsDirty(true);
  };

  const handleAddTrait = (trait: string) => {
    const currentTraits = formData.traits || [];
    if (!currentTraits.includes(trait)) {
      setFormData((prev) => ({ ...prev, traits: [...currentTraits, trait] }));
      setIsDirty(true);
    }
  };

  const handleRelationshipsUpdate = (relationships: CharacterRelationship[]) => {
    setFormData((prev) => ({ ...prev, relationships }));
    setIsDirty(true);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 relative">
      {showTraitLibrary && (
        <TraitLibrary
          onClose={() => setShowTraitLibrary(false)}
          onSelect={handleAddTrait}
          selectedTraits={formData.traits || []}
        />
      )}

      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            {formData.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{formData.name}</h2>
            <span className="text-sm text-gray-400 capitalize">{formData.role}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('details')}
              className={`px - 3 py - 1.5 rounded - md text - sm font - medium transition - colors flex items - center gap - 2 ${
                activeTab === 'details'
                  ? 'bg-gray-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              } `}
            >
              <User size={14} /> Details
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`px - 3 py - 1.5 rounded - md text - sm font - medium transition - colors flex items - center gap - 2 ${
                activeTab === 'network'
                  ? 'bg-gray-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              } `}
            >
              <Network size={14} /> Network
            </button>
          </div>
          <div className="flex items-center gap-2">
            {isDirty && <span className="text-xs text-yellow-500 mr-2">Unsaved changes...</span>}
            <button
              onClick={() => {
                onSave(character.id, formData);
                setIsDirty(false);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'network' ? (
          <RelationshipGraph characterId={character.id} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Core Stats */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Core Identity
                </h3>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input
                    type="text"
                    aria-label="Character Name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
                  <select
                    name="role"
                    aria-label="Character Role"
                    value={formData.role || 'supporting'}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="protagonist">Protagonist</option>
                    <option value="antagonist">Antagonist</option>
                    <option value="supporting">Supporting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Age</label>
                  <input
                    type="text"
                    name="age"
                    aria-label="Character Age"
                    value={formData.age || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Hash size={14} /> Attributes
                  </h3>
                  <button
                    onClick={() => setShowTraitLibrary(true)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <BookOpen size={12} /> Library
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Traits (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.traits?.join(', ') || ''}
                    onChange={handleTraitsChange}
                    placeholder="Brave, Smart..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ') || ''}
                    onChange={handleTagsChange}
                    placeholder="Hero, Magic..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Middle & Right Column: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Goals & Flaws */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Target size={14} /> Goals
                  </h3>
                  <textarea
                    aria-label="Character Goals"
                    name="goals"
                    rows={3}
                    value={formData.goals || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <AlertCircle size={14} /> Flaws
                  </h3>
                  <textarea
                    aria-label="Character Flaws"
                    name="flaws"
                    rows={3}
                    value={formData.flaws || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>
              </div>

              {/* Backstory */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlignLeft size={14} /> Backstory
                </h3>
                <textarea
                  aria-label="Character Backstory"
                  name="backstory"
                  rows={6}
                  value={formData.backstory || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Notes */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlignLeft size={14} /> Notes
                </h3>
                <textarea
                  aria-label="Character Notes"
                  name="notes"
                  rows={4}
                  value={formData.notes || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Relationships */}
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Heart size={14} /> Relationships
                </h3>
                <RelationshipManager
                  characterId={character.id}
                  relationships={formData.relationships || []}
                  onUpdate={handleRelationshipsUpdate}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
