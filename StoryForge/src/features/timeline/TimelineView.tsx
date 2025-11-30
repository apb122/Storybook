import React, { useState, useMemo } from 'react';
import { useStoryStore } from '@/state/store';
import { SplitView } from '@/components/ui/SplitView';
import { getApiKey, generateAiResponse, type AiRequestPayload } from '@/services/aiService';
import { buildStoryContextSnapshot } from '@/utils/buildStoryContextSnapshot';
import { Filter, User, MapPin, CheckCircle } from 'lucide-react';

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
    <div className="flex flex-col h-full border-r border-sf-border pr-6">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-bold text-sf-text flex items-center gap-2">
          <Filter size={18} /> Timeline
        </h3>
        <div className="space-y-2">
          <select
            title="Filter by Character"
            value={filterCharacterId}
            onChange={(e) => setFilterCharacterId(e.target.value)}
            className="w-full bg-transparent border border-sf-border rounded-sm px-2 py-1.5 text-sm text-sf-text focus:border-sf-text outline-none"
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
            className="w-full bg-transparent border border-sf-border rounded-sm px-2 py-1.5 text-sm text-sf-text focus:border-sf-text outline-none"
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
      <div className="flex-1 overflow-y-auto space-y-1 -mr-2 pr-2">
        {scenes.length === 0 ? (
          <div className="text-center py-8 text-sf-text-muted text-sm">
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
                className={`
                  p-3 rounded-sm cursor-pointer border transition-all
                  ${
                    selectedNodeId === scene.id
                      ? 'bg-sf-surface border-sf-text'
                      : 'bg-transparent border-sf-border hover:border-sf-text-muted'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={scene.timelinePosition || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleTimelinePositionChange(scene.id, e.target.value)}
                    placeholder="Time..."
                    className="w-20 bg-transparent border-b border-sf-border px-0 py-0.5 text-xs text-sf-accent placeholder-sf-text-muted focus:border-sf-accent outline-none"
                  />
                  <h4 className="flex-1 font-bold text-sf-text text-sm truncate">{scene.title}</h4>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {povChar && (
                    <span className="flex items-center gap-1 text-[10px] text-sf-text-muted uppercase tracking-wider">
                      <User size={10} /> {povChar.name}
                    </span>
                  )}
                  {loc && (
                    <span className="flex items-center gap-1 text-[10px] text-sf-text-muted uppercase tracking-wider">
                      <MapPin size={10} /> {loc.name}
                    </span>
                  )}
                </div>

                {scene.summary && (
                  <p className="text-xs text-sf-text-muted line-clamp-2">{scene.summary}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const DetailPane = selectedNode ? (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-start mb-6 pb-4 border-b border-sf-border">
        <div>
          <h2 className="text-2xl font-bold text-sf-text mb-1">{selectedNode.title}</h2>
          <div className="text-sm text-sf-text-muted flex gap-4">
            <span>
              Position:{' '}
              <span className="text-sf-accent">{selectedNode.timelinePosition || 'Unset'}</span>
            </span>
          </div>
        </div>
        <button
          onClick={handleCheckContinuity}
          disabled={isCheckingContinuity}
          className="btn-secondary text-xs flex items-center gap-2"
        >
          {isCheckingContinuity ? (
            'Checking...'
          ) : (
            <>
              <CheckCircle size={14} /> Check Continuity
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-8">
        <section>
          <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2">
            Goals
          </label>
          <textarea
            value={selectedNode.goals || ''}
            onChange={(e) => updatePlotNode(selectedNode.id, { goals: e.target.value })}
            rows={2}
            className="w-full resize-none"
            placeholder="What does the character want?"
          />
        </section>
        <section>
          <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2">
            Conflict
          </label>
          <textarea
            value={selectedNode.conflict || ''}
            onChange={(e) => updatePlotNode(selectedNode.id, { conflict: e.target.value })}
            rows={2}
            className="w-full resize-none"
            placeholder="What stands in their way?"
          />
        </section>
        <section>
          <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2">
            Outcome
          </label>
          <textarea
            value={selectedNode.outcome || ''}
            onChange={(e) => updatePlotNode(selectedNode.id, { outcome: e.target.value })}
            rows={2}
            className="w-full resize-none"
            placeholder="How does it end?"
          />
        </section>
        <section>
          <label className="block text-xs font-bold text-sf-text-muted uppercase tracking-wider mb-2">
            Notes
          </label>
          <textarea
            value={selectedNode.notes || ''}
            onChange={(e) => updatePlotNode(selectedNode.id, { notes: e.target.value })}
            rows={4}
            className="w-full"
            placeholder="Additional notes..."
          />
        </section>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full text-sf-text-muted">
      <p className="text-lg font-medium">Select a scene to view details</p>
    </div>
  );

  return <SplitView sidebar={Sidebar} content={DetailPane} />;
};
