import React, { useState } from 'react';
import type { Character, CharacterRelationship } from '@/types/story';
import { useStoryStore } from '@/state/store';
import { Plus, Trash2, Heart, Shield, Users } from 'lucide-react';

interface RelationshipManagerProps {
  characterId: string;
  relationships: CharacterRelationship[];
  onUpdate: (relationships: CharacterRelationship[]) => void;
}

export const RelationshipManager: React.FC<RelationshipManagerProps> = ({
  characterId,
  relationships = [],
  onUpdate,
}) => {
  const characters = useStoryStore((state) => state.characters);
  const otherCharacters = characters.filter((c) => c.id !== characterId);

  const [isAdding, setIsAdding] = useState(false);
  const [newRelTargetId, setNewRelTargetId] = useState('');
  const [newRelType, setNewRelType] = useState<CharacterRelationship['type']>('ally');
  const [newRelDesc, setNewRelDesc] = useState('');

  const handleAdd = () => {
    if (!newRelTargetId) return;

    const newRel: CharacterRelationship = {
      characterId: newRelTargetId,
      type: newRelType,
      description: newRelDesc,
    };

    onUpdate([...relationships, newRel]);
    setIsAdding(false);
    setNewRelTargetId('');
    setNewRelDesc('');
  };

  const handleDelete = (targetId: string) => {
    onUpdate(relationships.filter((r) => r.characterId !== targetId));
  };

  const getRelIcon = (type: string) => {
    switch (type) {
      case 'family':
      case 'romantic':
        return <Heart size={14} className="text-pink-400" />;
      case 'enemy':
        return <Shield size={14} className="text-red-400" />;
      case 'ally':
      case 'mentor':
        return <Users size={14} className="text-blue-400" />;
      default:
        return <Users size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-400">Connections</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
        >
          <Plus size={12} /> Add Relationship
        </button>
      </div>

      {isAdding && (
        <div className="bg-gray-800 p-3 rounded-md border border-gray-700 space-y-3">
          <div>
            <label htmlFor="rel-character" className="block text-xs text-gray-500 mb-1">
              Character
            </label>
            <select
              id="rel-character"
              value={newRelTargetId}
              onChange={(e) => setNewRelTargetId(e.target.value)}
              className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            >
              <option value="">Select character...</option>
              {otherCharacters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="rel-type" className="block text-xs text-gray-500 mb-1">
                Type
              </label>
              <select
                id="rel-type"
                value={newRelType}
                onChange={(e) => setNewRelType(e.target.value as CharacterRelationship['type'])}
                className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              >
                <option value="ally">Ally</option>
                <option value="enemy">Enemy</option>
                <option value="family">Family</option>
                <option value="romantic">Romantic</option>
                <option value="mentor">Mentor</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="rel-desc" className="block text-xs text-gray-500 mb-1">
                Description
              </label>
              <input
                id="rel-desc"
                type="text"
                value={newRelDesc}
                onChange={(e) => setNewRelDesc(e.target.value)}
                placeholder="Childhood friend..."
                className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-2 py-1 text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newRelTargetId}
              className="px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {relationships.length === 0 && !isAdding && (
          <p className="text-xs text-gray-500 italic text-center py-2">No relationships defined.</p>
        )}
        {relationships.map((rel) => {
          const targetChar = characters.find((c) => c.id === rel.characterId);
          return (
            <div
              key={rel.characterId}
              className="flex items-center justify-between bg-gray-800 p-2 rounded border border-gray-700 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300">
                  {targetChar?.name?.[0] || '?'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {targetChar?.name || 'Unknown'}
                    </span>
                    {getRelIcon(rel.type)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="capitalize">{rel.type}</span>
                    {rel.description && (
                      <>
                        <span>•</span>
                        <span>{rel.description}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDelete(rel.characterId)}
                aria-label="Delete relationship"
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
