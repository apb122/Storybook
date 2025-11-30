import React, { useState, useMemo } from 'react';
import { useStoryStore } from '../../../state/store';
import { SplitView } from '../../../components/ui/SplitView';
import type { Location } from '../../../types/story';

interface LocationTabProps {
    projectId: string;
}

export const LocationTab: React.FC<LocationTabProps> = ({ projectId }) => {
    const locations = useStoryStore((state) => state.locations);
    const addLocation = useStoryStore((state) => state.addLocation);
    const updateLocation = useStoryStore((state) => state.updateLocation);
    const deleteLocation = useStoryStore((state) => state.deleteLocation);

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [formData, setFormData] = useState<Partial<Location>>({});

    const projectLocations = useMemo(() => {
        return locations
            .filter((l) => l.projectId === projectId)
            .filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [locations, projectId, searchQuery]);





    const handleCreate = () => {
        const newLocation: Location = {
            id: crypto.randomUUID(),
            projectId,
            name: 'New Location',
            type: 'City',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addLocation(newLocation);
        setSelectedId(newLocation.id);
        setFormData(newLocation);
    };

    const handleSave = () => {
        if (selectedId && formData) {
            updateLocation(selectedId, formData);
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            deleteLocation(id);
            if (selectedId === id) {
                setSelectedId(null);
                setFormData({});
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map((t) => t.trim()).filter(Boolean);
        setFormData((prev) => ({ ...prev, tags }));
    };

    const handleEventsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const events = e.target.value.split('\n').filter(Boolean);
        setFormData((prev) => ({ ...prev, importantEvents: events }));
    };

    const Sidebar = (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700 space-y-4">
                <button
                    onClick={handleCreate}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
                >
                    + New Location
                </button>
                <input
                    type="text"
                    placeholder="Search locations..."
                    title="Search locations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {projectLocations.map((loc) => (
                    <div
                        key={loc.id}
                        onClick={() => {
                            setSelectedId(loc.id);
                            setFormData(loc);
                        }}
                        className={`p-3 rounded-md cursor-pointer transition-colors flex justify-between items-center group ${selectedId === loc.id ? 'bg-indigo-900/50 border border-indigo-500/50' : 'hover:bg-gray-700'
                            }`}
                    >
                        <div>
                            <h4 className="text-white font-medium">{loc.name}</h4>
                            <span className="text-xs text-gray-400">{loc.type}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(loc.id);
                            }}
                            title="Delete Location"
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
                <h2 className="text-xl font-bold text-white">Edit Location</h2>
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
                            title="Location Name"
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
                            title="Location Type"
                            value={formData.type || ''}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="City, Forest, Planet..."
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        title="Location Description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Important Events (one per line)</label>
                    <textarea
                        rows={4}
                        title="Important Events"
                        value={formData.importantEvents?.join('\n') || ''}
                        onChange={handleEventsChange}
                        className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                    <input
                        type="text"
                        title="Location Tags"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-lg font-medium">Select a location or create a new one</p>
        </div>
    );

    return <SplitView sidebar={Sidebar} content={Content} />;
};
