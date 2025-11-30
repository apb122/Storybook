import React, { useState, useEffect } from 'react';
import type { StoryItem } from '@/types/story';
import { Save, Package, AlignLeft } from 'lucide-react';

interface ItemEditorProps {
    item: StoryItem;
    onSave: (id: string, updates: Partial<StoryItem>) => void;
}

export const ItemEditor: React.FC<ItemEditorProps> = ({ item, onSave }) => {
    // Initialize form data when item changes
    // We use a key on the parent component to force remount when item changes
    // so we don't need an effect here to sync state
    const [formData, setFormData] = useState<Partial<StoryItem>>(item);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (!isDirty) return;

        const timer = setTimeout(() => {
            onSave(item.id, formData);
            setIsDirty(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [formData, isDirty, item.id, onSave]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setIsDirty(true);
    };

    return (
        <div className="flex flex-col h-full bg-gray-900">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                        <Package size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{formData.name}</h2>
                        <span className="text-sm text-gray-400 capitalize">{formData.type}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isDirty && <span className="text-xs text-yellow-500 mr-2">Unsaved changes...</span>}
                    <button
                        onClick={() => {
                            onSave(item.id, formData);
                            setIsDirty(false);
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors flex items-center gap-2"
                    >
                        <Save size={16} />
                        Save
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-6 lg:col-span-1">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Package size={14} /> Details
                            </h3>

                            <div>
                                <label htmlFor="item-name" className="block text-xs font-medium text-gray-500 mb-1">
                                    Name
                                </label>
                                <input
                                    id="item-name"
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="item-type" className="block text-xs font-medium text-gray-500 mb-1">
                                    Type
                                </label>
                                <input
                                    id="item-type"
                                    type="text"
                                    name="type"
                                    value={formData.type || ''}
                                    onChange={handleChange}
                                    placeholder="Weapon, Artifact..."
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="item-importance"
                                    className="block text-xs font-medium text-gray-500 mb-1"
                                >
                                    Importance
                                </label>
                                <select
                                    id="item-importance"
                                    name="importance"
                                    value={formData.importance || 'minor'}
                                    onChange={handleChange}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="minor">Minor</option>
                                    <option value="major">Major</option>
                                    <option value="mcguffin">McGuffin</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <AlignLeft size={14} /> Description
                            </h3>
                            <textarea
                                name="description"
                                rows={6}
                                value={formData.description || ''}
                                onChange={handleChange}
                                aria-label="Description"
                                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
