import React, { useState } from 'react';
import { useStoryStore } from '@/state/store';
import { useShallow } from 'zustand/react/shallow';
import type { PlotNode } from '@/types/story';
import { AlertCircle, Target, ShieldAlert, Flag, AlignLeft } from 'lucide-react';

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
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-sf-border">
        <div className="flex-1 mr-4">
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="text-2xl font-bold bg-transparent border-none p-0 focus:ring-0 text-sf-text placeholder-sf-text-muted w-full"
            placeholder="Title"
            aria-label="Scene Title"
          />
          <div className="text-xs text-sf-text-muted mt-1 uppercase tracking-wider font-mono">
            {node.type}
          </div>
        </div>
        <button onClick={handleSave} className="btn-primary text-sm px-4 py-2">
          Save
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        <section>
          <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2">
            Summary
          </label>
          <textarea
            name="summary"
            rows={3}
            value={formData.summary || ''}
            onChange={handleChange}
            className="w-full resize-none"
            placeholder="Brief summary..."
            aria-label="Summary"
          />
        </section>

        {node.type === 'scene' && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2">
                  POV Character
                </label>
                <select
                  name="povCharacterId"
                  value={formData.povCharacterId || ''}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-sf-border rounded-sm px-3 py-2 text-sf-text focus:border-sf-text outline-none"
                  aria-label="POV Character"
                  title="POV Character"
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
                <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2">
                  Location
                </label>
                <select
                  name="locationId"
                  value={formData.locationId || ''}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-sf-border rounded-sm px-3 py-2 text-sf-text focus:border-sf-text outline-none"
                  aria-label="Location"
                  title="Location"
                >
                  <option value="">Select Location...</option>
                  {projectLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>
            </section>

            <section>
              <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2">
                Timeline Position
              </label>
              <input
                type="text"
                name="timelinePosition"
                placeholder="e.g. Day 3, Afternoon"
                value={formData.timelinePosition || ''}
                onChange={handleChange}
                className="w-full"
                aria-label="Timeline Position"
              />
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Target size={12} /> Goals
                </label>
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
                <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ShieldAlert size={12} /> Conflict
                </label>
                <textarea
                  name="conflict"
                  rows={4}
                  value={formData.conflict || ''}
                  onChange={handleChange}
                  className="w-full resize-none"
                  placeholder="What stands in the way?"
                  aria-label="Conflict"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Flag size={12} /> Outcome
                </label>
                <textarea
                  name="outcome"
                  rows={4}
                  value={formData.outcome || ''}
                  onChange={handleChange}
                  className="w-full resize-none"
                  placeholder="How does it end?"
                  aria-label="Outcome"
                />
              </div>
            </section>
          </>
        )}

        <section>
          <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlignLeft size={12} /> Notes
          </label>
          <textarea
            name="notes"
            rows={4}
            value={formData.notes || ''}
            onChange={handleChange}
            className="w-full"
            aria-label="Notes"
          />
        </section>

        {/* Continuity Issues Section */}
        <section className="border border-sf-border rounded-sm p-4">
          <h3 className="text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertCircle size={14} /> Continuity Check
          </h3>
          <SceneContinuityList nodeId={nodeId} projectId={node.projectId} />
        </section>
      </div>
    </div>
  );
};

const SceneContinuityList: React.FC<{ nodeId: string; projectId: string }> = ({
  nodeId,
  projectId,
}) => {
  const issues = useStoryStore(
    useShallow((state) =>
      state.continuityIssues.filter(
        (i) => i.projectId === projectId && i.relatedEntityIds?.includes(nodeId)
      )
    )
  );

  if (issues.length === 0) {
    return <p className="text-sf-text-muted text-sm italic">No continuity issues reported.</p>;
  }

  return (
    <div className="space-y-2">
      {issues.map((issue) => (
        <div key={issue.id} className="bg-sf-surface p-3 rounded-sm border border-sf-border">
          <div className="flex justify-between items-start mb-1">
            <span
              className={`text-[10px] font-bold px-1.5 rounded uppercase ${
                issue.severity === 'major'
                  ? 'bg-red-100 text-red-800'
                  : issue.severity === 'moderate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
              }`}
            >
              {issue.severity}
            </span>
            {issue.resolved && (
              <span className="text-green-600 text-xs font-medium">✓ Resolved</span>
            )}
          </div>
          <p className="text-sm text-sf-text">{issue.description}</p>
        </div>
      ))}
    </div>
  );
};
