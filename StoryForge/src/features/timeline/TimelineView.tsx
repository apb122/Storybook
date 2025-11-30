import React, { useState, useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { SplitView } from '@/components/ui/SplitView';
import { getApiKey, generateAiResponse, type AiRequestPayload } from '@/services/aiService';
import { buildStoryContextSnapshot } from '@/utils/buildStoryContextSnapshot';

interface TimelineViewProps {
  projectId: string;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ projectId }) => {
  const plotNodes = useStoryStore((state) => state.plotNodes);
  const characters = useStoryStore((state) => state.characters);
  const locations = useStoryStore((state) => state.locations);
  const updatePlotNode = useStoryStore((state) => state.updatePlotNode);
  const addContinuityIssue = useStoryStore((state) => state.addContinuityIssue);
  const projects = useStoryStore((state) => state.projects);
  const variables = useStoryStore((state) => state.variables);

  const [isCheckingContinuity, setIsCheckingContinuity] = useState(false);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filterCharacterId, setFilterCharacterId] = useState<string>('');
  const [filterLocationId, setFilterLocationId] = useState<string>('');

  // Filter and Sort Scenes
  const scenes = useMemo(() => {
    return plotNodes
      .filter((node) => node.projectId === projectId && node.type === 'scene')
      .filter((node) => {
        if (filterCharacterId && node.povCharacterId !== filterCharacterId) return false;
        if (filterLocationId && node.locationId !== filterLocationId) return false;
        return true;
      })
      .sort((a, b) => {
        // Primary sort: Timeline Position
        if (a.timelinePosition && b.timelinePosition) {
          return a.timelinePosition.localeCompare(b.timelinePosition, undefined, { numeric: true });
        }
        if (a.timelinePosition) return -1;
        if (b.timelinePosition) return 1;

        // Secondary sort: Order
        return a.order - b.order;
      });
  }, [plotNodes, projectId, filterCharacterId, filterLocationId]);

  const projectCharacters = useMemo(
    () =>
      characters
        .filter((c) => c.projectId === projectId)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [characters, projectId]
  );

  const projectLocations = useMemo(
    () =>
      locations
        .filter((l) => l.projectId === projectId)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [locations, projectId]
  );

  const handleTimelinePositionChange = (id: string, newPosition: string) => {
    updatePlotNode(id, { timelinePosition: newPosition });
  };

  const selectedNode = useMemo(
    () => plotNodes.find((n) => n.id === selectedNodeId),
    [plotNodes, selectedNodeId]
  );

  const handleCheckContinuity = async () => {
    if (!selectedNode) return;
    const apiKey = getApiKey();
    if (!apiKey) {
      alert('Please set your API key in the AI Workshop first.');
      return;
    }

    setIsCheckingContinuity(true);
    try {
      const contextSnapshot = buildStoryContextSnapshot(
        projectId,
        projects,
        characters,
        plotNodes,
        variables,
        selectedNode.id
      );

      const payload: AiRequestPayload = {
        projectId,
        userMessage: 'Check this scene for continuity errors.',
        mode: 'continuity',
        contextSnapshot,
        apiKey,
      };

      const response = await generateAiResponse(payload);

      if (response.suggestedIssues) {
        response.suggestedIssues.forEach((issue) => {
          addContinuityIssue({
            ...issue,
            relatedEntityIds: [selectedNode.id],
          });
        });
        alert(
          `Found ${response.suggestedIssues.length} potential issues. Check the AI Workshop Continuity tab.`
        );
      } else {
        alert('No specific issues found by AI.');
      }
    } catch (error) {
      console.error('Continuity check failed:', error);
      alert('Failed to run continuity check.');
    } finally {
      setIsCheckingContinuity(false);
    }
  };

  const Sidebar = (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-4 border-b border-gray-700 space-y-3 bg-gray-900/50">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Filters</h3>
        <div className="grid grid-cols-2 gap-2">
          <select
            title="Filter by Character"
            value={filterCharacterId}
            onChange={(e) => setFilterCharacterId(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-sm rounded px-2 py-1 text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Characters</option>
            {projectCharacters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            title="Filter by Location"
            value={filterLocationId}
            onChange={(e) => setFilterLocationId(e.target.value)}
            className="bg-gray-800 border border-gray-600 text-sm rounded px-2 py-1 text-white focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Locations</option>
            {projectLocations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scene List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {scenes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No scenes found matching filters.
          </div>
        ) : (
          scenes.map((scene) => {
            const povChar = characters.find((c) => c.id === scene.povCharacterId);
            const loc = locations.find((l) => l.id === scene.locationId);

            return (
              <div
                key={scene.id}
                onClick={() => setSelectedNodeId(scene.id)}
                className={`p-3 rounded-md cursor-pointer border transition-all ${
                  selectedNodeId === scene.id
                    ? 'bg-indigo-900/40 border-indigo-500/50 shadow-sm'
                    : 'bg-gray-800/40 border-transparent hover:bg-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={scene.timelinePosition || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleTimelinePositionChange(scene.id, e.target.value)}
                    placeholder="Time..."
                    className="w-20 bg-gray-900 border border-gray-700 rounded px-1.5 py-0.5 text-xs text-indigo-300 placeholder-gray-600 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <h4 className="flex-1 font-medium text-gray-200 text-sm truncate">
                    {scene.title}
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {povChar && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-900/30 text-blue-300 border border-blue-800/30">
                      👤 {povChar.name}
                    </span>
                  )}
                  {loc && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-900/30 text-emerald-300 border border-emerald-800/30">
                      📍 {loc.name}
                    </span>
                  )}
                </div>

                {scene.summary && (
                  <p className="text-xs text-gray-500 line-clamp-2 pl-1 border-l-2 border-gray-700">
                    {scene.summary}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const DetailPane = selectedNode ? (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-700 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{selectedNode.title}</h2>
          <div className="text-sm text-gray-400 flex gap-4">
            <span>
              Position:{' '}
              <span className="text-indigo-400">{selectedNode.timelinePosition || 'Unset'}</span>
            </span>
          </div>
        </div>
        <button
          onClick={handleCheckContinuity}
          disabled={isCheckingContinuity}
          className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isCheckingContinuity ? 'Checking...' : 'Check Continuity'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Goals</label>
            <textarea
              value={selectedNode.goals || ''}
              onChange={(e) => updatePlotNode(selectedNode.id, { goals: e.target.value })}
              rows={2}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="What does the character want?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Conflict</label>
            <textarea
              value={selectedNode.conflict || ''}
              onChange={(e) => updatePlotNode(selectedNode.id, { conflict: e.target.value })}
              rows={2}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="What stands in their way?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Outcome</label>
            <textarea
              value={selectedNode.outcome || ''}
              onChange={(e) => updatePlotNode(selectedNode.id, { outcome: e.target.value })}
              rows={2}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="How does it end?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Notes</label>
            <textarea
              value={selectedNode.notes || ''}
              onChange={(e) => updatePlotNode(selectedNode.id, { notes: e.target.value })}
              rows={4}
              className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes..."
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <p className="text-lg font-medium">Select a scene to view details</p>
    </div>
  );

  return <SplitView sidebar={Sidebar} content={DetailPane} />;
};
