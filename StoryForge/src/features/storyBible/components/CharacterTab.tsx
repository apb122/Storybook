import React, { useState, useMemo } from 'react';
import { useStoryStore } from '../../../state/store';
import { SplitView } from '../../../components/ui/SplitView';
import type { Character } from '../../../types/story';

interface CharacterTabProps {
    projectId: string;
}

export const CharacterTab: React.FC<CharacterTabProps> = ({ projectId }) => {
    const characters = useStoryStore((state) => state.characters);
    const addCharacter = useStoryStore((state) => state.addCharacter);
    const updateCharacter = useStoryStore((state) => state.updateCharacter);
    const deleteCharacter = useStoryStore((state) => state.deleteCharacter);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [formData, setFormData] = useState<Partial<Character>>({});

    const projectCharacters = useMemo(() => {
        return characters
            .filter((c) => c.projectId === projectId)
            .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [characters, projectId, searchQuery]);





    const handleCreate = () => {
        const newCharacter: Character = {
            id: crypto.randomUUID(),
            projectId,
            name: 'New Character',
            role: 'supporting',
            relationships: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addCharacter(newCharacter);
        setSelectedId(newCharacter.id);
        setFormData(newCharacter);
    };

    const handleSave = () => {
        if (selectedId && formData) {
            updateCharacter(selectedId, formData);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this character?')) {
            deleteCharacter(id);
            if (selectedId === id) {
                setSelectedId(null);
                setFormData({});
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
        setFormData((prev) => ({ ...prev, tags }));
    };

    const handleTraitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const traits = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
        setFormData((prev) => ({ ...prev, traits }));
    };

    const Sidebar = (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 space-y-4">
                <button
                    onClick={handleCreate}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                >
                    + New Character
                </button>
                <input
                    type="text"
                    placeholder="Search characters..."
                    title="Search characters"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {projectCharacters.map((char) => (
                    <div
                        key={char.id}
                        onClick={() => {
                            setSelectedId(char.id);
                            setFormData(char);
                        }}
                        className={`p-3 rounded-md cursor-pointer transition-colors flex justify-between items-center group ${selectedId === char.id ? 'bg-indigo-900/50 border border-indigo-500/50' : 'hover:bg-gray-700'
                            }`}
                    >
                        <div>
                            <h4 className="text-white font-medium">{char.name}</h4>
                            <span className="text-xs text-gray-400 capitalize">{char.role}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(char.id);
                            }}
                            title="Delete Character"
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const Content = selectedId ? (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Edit Character</h2>
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                >
                    Save Changes
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            title="Character Name"
                            placeholder="Character Name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                        <select
                            name="role"
                            title="Character Role"
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
                        <label className="block text-sm font-medium text-gray-400 mb-1">Age</label>
                        <input
                            type="text"
                            name="age"
                            title="Character Age"
                            placeholder="Age"
                            value={formData.age || ''}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Traits (comma separated)</label>
                        <input
                            type="text"
                            title="Character Traits"
                            placeholder="Brave, Smart, etc."
                            value={formData.traits?.join(', ') || ''}
                            onChange={handleTraitsChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Goals</label>
                    <textarea
                        name="goals"
                        rows={2}
                        title="Character Goals"
                        placeholder="What does the character want?"
                        value={formData.goals || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Flaws</label>
                    <textarea
                        name="flaws"
                        rows={2}
                        title="Character Flaws"
                        placeholder="What is the character's weakness?"
                        value={formData.flaws || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Backstory</label>
                    <textarea
                        name="backstory"
                        rows={4}
                        title="Character Backstory"
                        placeholder="Character history..."
                        value={formData.backstory || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
                    <textarea
                        name="notes"
                        rows={3}
                        title="Character Notes"
                        placeholder="Additional notes..."
                        value={formData.notes || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                    <input
                        type="text"
                        title="Character Tags"
                        placeholder="Tags..."
                        value={formData.tags?.join(', ') || ''}
                        onChange={handleTagsChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">Select a character or create a new one</p>
        </div>
    );

    return <SplitView sidebar={Sidebar} content={Content} />;
};
