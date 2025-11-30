import React, { useState, useMemo } from 'react';
import { useStoryStore } from '../../../state/store';
import { SplitView } from '../../../components/ui/SplitView';
import type { StoryItem } from '../../../types/story';

interface ItemTabProps {
    projectId: string;
}

export const ItemTab: React.FC<ItemTabProps> = ({ projectId }) => {
    const items = useStoryStore((state) => state.items);
    const addItem = useStoryStore((state) => state.addItem);
    const updateItem = useStoryStore((state) => state.updateItem);
    const deleteItem = useStoryStore((state) => state.deleteItem);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [formData, setFormData] = useState<Partial<StoryItem>>({});

    const projectItems = useMemo(() => {
        return items
            .filter((i) => i.projectId === projectId)
            .filter((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [items, projectId, searchQuery]);





    const handleCreate = () => {
        const newItem: StoryItem = {
            id: crypto.randomUUID(),
            projectId,
            name: 'New Item',
            type: 'Object',
            importance: 'minor',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addItem(newItem);
        setSelectedId(newItem.id);
        setFormData(newItem);
    };

    const handleSave = () => {
        if (selectedId && formData) {
            updateItem(selectedId, formData);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteItem(id);
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

    const Sidebar = (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 space-y-4">
                <button
                    onClick={handleCreate}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                >
                    + New Item
                </button>
                <input
                    type="text"
                    placeholder="Search items..."
                    title="Search items"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {projectItems.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => {
                            setSelectedId(item.id);
                            setFormData(item);
                        }}
                        className={`p-3 rounded-md cursor-pointer transition-colors flex justify-between items-center group ${selectedId === item.id ? 'bg-indigo-900/50 border border-indigo-500/50' : 'hover:bg-gray-700'
                            }`}
                    >
                        <div>
                            <h4 className="text-white font-medium">{item.name}</h4>
                            <span className={`text-xs capitalize ${item.importance === 'major' ? 'text-yellow-400' :
                                item.importance === 'mcguffin' ? 'text-purple-400' :
                                    'text-gray-400'
                                }`}>
                                {item.importance}
                            </span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                            }}
                            title="Delete Item"
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
                <h2 className="text-xl font-bold text-white">Edit Item</h2>
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
                            title="Item Name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                        <input
                            type="text"
                            name="type"
                            title="Item Type"
                            value={formData.type || ''}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Weapon, Artifact, Document..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Importance</label>
                    <select
                        name="importance"
                        title="Item Importance"
                        value={formData.importance || 'minor'}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="minor">Minor</option>
                        <option value="major">Major</option>
                        <option value="mcguffin">McGuffin</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        title="Item Description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                    <input
                        type="text"
                        title="Item Tags"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-lg font-medium">Select an item or create a new one</p>
        </div>
    );

    return <SplitView sidebar={Sidebar} content={Content} />;
};
