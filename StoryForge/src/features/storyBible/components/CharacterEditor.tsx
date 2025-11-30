import React, { useState, useEffect } from 'react';
import type { Character, CharacterRelationship } from '@/types/story';
import { User, Hash, AlignLeft, Heart, Target, AlertCircle } from 'lucide-react';
import { RelationshipManager } from './RelationshipManager';
import { RelationshipGraph } from './RelationshipGraph';
import { TraitLibrary } from './TraitLibrary';
import { CharacterContinuityView } from './CharacterContinuityView';

interface CharacterEditorProps {
  character: Character;
  onSave: (id: string, updates: Partial<Character>) => void;
}

export const CharacterEditor: React.FC<CharacterEditorProps> = ({ character, onSave }) => {
  const [formData, setFormData] = useState<Partial<Character>>(character);
  const [isDirty, setIsDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'network' | 'continuity'>('details');
  const [showTraitLibrary, setShowTraitLibrary] = useState(false);

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
    <div className="flex flex-col h-full overflow-hidden relative">
      {showTraitLibrary && (
        <TraitLibrary
          onClose={() => setShowTraitLibrary(false)}
          onSelect={handleAddTrait}
          selectedTraits={formData.traits || []}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-sf-border">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="text-3xl font-bold bg-transparent border-none p-0 focus:ring-0 text-sf-text placeholder-sf-text-muted w-full"
            placeholder="Character Name"
            aria-label="Character Name"
          />
          <div className="flex items-center gap-2 mt-2">
            <select
              name="role"
              value={formData.role || 'supporting'}
              onChange={handleChange}
              className="text-sm bg-transparent border-none p-0 text-sf-text-muted font-mono uppercase tracking-wider focus:ring-0 cursor-pointer"
              aria-label="Character Role"
            >
              <option value="protagonist">Protagonist</option>
              <option value="antagonist">Antagonist</option>
              <option value="supporting">Supporting</option>
              <option value="other">Other</option>
            </select>
            <span className="text-sf-border">|</span>
            <span className="text-xs text-sf-text-muted">{isDirty ? 'Saving...' : 'Saved'}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${activeTab === 'details' ? 'bg-sf-text text-sf-bg' : 'text-sf-text-muted hover:text-sf-text'}`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${activeTab === 'network' ? 'bg-sf-text text-sf-bg' : 'text-sf-text-muted hover:text-sf-text'}`}
          >
            Network
          </button>
          <button
            onClick={() => setActiveTab('continuity')}
            className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${activeTab === 'continuity' ? 'bg-sf-text text-sf-bg' : 'text-sf-text-muted hover:text-sf-text'}`}
          >
            Continuity
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'network' ? (
          <RelationshipGraph characterId={character.id} />
        ) : activeTab === 'continuity' ? (
          <CharacterContinuityView characterId={character.id} projectId={character.projectId} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={12} /> Core Stats
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-sf-text-muted mb-1">Age</label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age || ''}
                      onChange={handleChange}
                      className="w-full"
                      aria-label="Age"
                    />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider flex items-center gap-2">
                    <Hash size={12} /> Attributes
                  </h3>
                  <button
                    onClick={() => setShowTraitLibrary(true)}
                    className="text-xs text-sf-accent hover:underline"
                  >
                    + Library
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-sf-text-muted mb-1">Traits</label>
                    <input
                      type="text"
                      value={formData.traits?.join(', ') || ''}
                      onChange={handleTraitsChange}
                      placeholder="e.g. Brave, Stubborn"
                      className="w-full"
                      aria-label="Traits"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-sf-text-muted mb-1">Tags</label>
                    <input
                      type="text"
                      value={formData.tags?.join(', ') || ''}
                      onChange={handleTagsChange}
                      placeholder="e.g. Magic, Royalty"
                      className="w-full"
                      aria-label="Tags"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Middle & Right Column */}
            <div className="lg:col-span-2 space-y-8">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Target size={12} /> Goals
                  </h3>
                  <textarea
                    name="goals"
                    rows={4}
                    value={formData.goals || ''}
                    onChange={handleChange}
                    className="w-full resize-none"
                    placeholder="What do they want?"
                    aria-label="Goals"
                  />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertCircle size={12} /> Flaws
                  </h3>
                  <textarea
                    name="flaws"
                    rows={4}
                    value={formData.flaws || ''}
                    onChange={handleChange}
                    className="w-full resize-none"
                    placeholder="What holds them back?"
                    aria-label="Flaws"
                  />
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlignLeft size={12} /> Backstory
                </h3>
                <textarea
                  name="backstory"
                  rows={8}
                  value={formData.backstory || ''}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Where do they come from?"
                  aria-label="Backstory"
                />
              </section>

              <section>
                <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlignLeft size={12} /> Notes
                </h3>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes || ''}
                  onChange={handleChange}
                  className="w-full"
                  placeholder="Additional notes..."
                  aria-label="Notes"
                />
              </section>

              <section>
                <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Heart size={12} /> Relationships
                </h3>
                <RelationshipManager
                  characterId={character.id}
                  relationships={formData.relationships || []}
                  onUpdate={handleRelationshipsUpdate}
                />
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
