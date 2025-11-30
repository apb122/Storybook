import React, { useState } from 'react';
import { useStoryStore } from '@/state/store';
import type { PlotNode } from '@/types/story';

interface SceneDetailPanelProps {
  nodeId: string;
}

export const SceneDetailPanel: React.FC<SceneDetailPanelProps> = ({ nodeId }) => {
  const plotNodes = useStoryStore((state) => state.plotNodes);
  const updatePlotNode = useStoryStore((state) => state.updatePlotNode);
  const characters = useStoryStore((state) => state.characters);
  const locations = useStoryStore((state) => state.locations);

  const node = plotNodes.find((n) => n.id === nodeId);
  const [formData, setFormData] = useState<Partial<PlotNode>>(node || {});

  if (!node) return <div>Node not found</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updatePlotNode(nodeId, formData);
  };

  const projectCharacters = characters.filter((c) => c.projectId === node.projectId);
  const projectLocations = locations.filter((l) => l.projectId === node.projectId);

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          Edit {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
        </h2>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
          <input
            type="text"
            name="title"
            title="Title"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Summary</label>
          <textarea
            name="summary"
            rows={3}
            title="Summary"
            value={formData.summary || ''}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {node.type === 'scene' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  POV Character
                </label>
                <select
                  name="povCharacterId"
                  title="POV Character"
                  value={formData.povCharacterId || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Character...</option>
                  {projectCharacters.map((char) => (
                    <option key={char.id} value={char.id}>
                      {char.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                <select
                  name="locationId"
                  title="Location"
                  value={formData.locationId || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Location...</option>
                  {projectLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Timeline Position
              </label>
              <input
                type="text"
                name="timelinePosition"
                title="Timeline Position"
                placeholder="e.g. Day 3, Afternoon"
                value={formData.timelinePosition || ''}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Goals</label>
              <textarea
                name="goals"
                rows={2}
                title="Scene Goals"
                placeholder="What does the POV character want?"
                value={formData.goals || ''}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Conflict</label>
              <textarea
                name="conflict"
                rows={2}
                title="Scene Conflict"
                placeholder="What stands in their way?"
                value={formData.conflict || ''}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Outcome</label>
              <textarea
                name="outcome"
                rows={2}
                title="Scene Outcome"
                placeholder="How does the scene end?"
                value={formData.outcome || ''}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
          <textarea
            name="notes"
            rows={3}
            title="Notes"
            value={formData.notes || ''}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
