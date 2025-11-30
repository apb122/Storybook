import React, { useMemo } from 'react';
import { generateId } from '@/utils/ids';
import { useStoryStore } from '@/state/store';
import { SplitView } from '@/components/ui/SplitView';
import { SceneDetailPanel } from './SceneDetailPanel';
import type { PlotNode } from '@/types/story';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface PlotOutlineViewProps {
  projectId: string;
}

export const PlotOutlineView: React.FC<PlotOutlineViewProps> = ({ projectId }) => {
  const plotNodes = useStoryStore((state) => state.plotNodes);
  const addPlotNode = useStoryStore((state) => state.addPlotNode);
  const deletePlotNode = useStoryStore((state) => state.deletePlotNode);
  const updatePlotNode = useStoryStore((state) => state.updatePlotNode);
  const selectedPlotNodeId = useStoryStore((state) => state.ui.selectedPlotNodeId);
  const setSelectedPlotNodeId = useStoryStore((state) => state.setSelectedPlotNodeId);

  const projectNodes = useMemo(() => {
    return plotNodes.filter((n) => n.projectId === projectId).sort((a, b) => a.order - b.order);
  }, [plotNodes, projectId]);

  const rootNodes = useMemo(() => projectNodes.filter((n) => !n.parentId), [projectNodes]);

  const getChildNodes = (parentId: string) => projectNodes.filter((n) => n.parentId === parentId);

  const handleAddNode = (parentId: string | null, type: PlotNode['type']) => {
    const siblings = parentId ? getChildNodes(parentId) : rootNodes;
    const newOrder = siblings.length > 0 ? Math.max(...siblings.map((n) => n.order)) + 1 : 0;

    const newNode: PlotNode = {
      id: generateId(),
      projectId,
      parentId,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      order: newOrder,
    };

    addPlotNode(newNode);
    setSelectedPlotNodeId(newNode.id);
  };

  const handleDeleteNode = (id: string) => {
    if (window.confirm('Are you sure you want to delete this node and all its children?')) {
      const nodesToDelete = [id];
      const findChildren = (pId: string) => {
        const children = plotNodes.filter((n) => n.parentId === pId);
        children.forEach((c) => {
          nodesToDelete.push(c.id);
          findChildren(c.id);
        });
      };
      findChildren(id);
      nodesToDelete.forEach((nodeId) => deletePlotNode(nodeId));
      if (selectedPlotNodeId === id) setSelectedPlotNodeId(undefined);
    }
  };

  const handleMoveNode = (node: PlotNode, direction: 'up' | 'down') => {
    const siblings = (node.parentId ? getChildNodes(node.parentId) : rootNodes).sort(
      (a, b) => a.order - b.order
    );
    const index = siblings.findIndex((n) => n.id === node.id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const prev = siblings[index - 1];
      updatePlotNode(node.id, { order: prev.order });
      updatePlotNode(prev.id, { order: node.order });
    } else if (direction === 'down' && index < siblings.length - 1) {
      const next = siblings[index + 1];
      updatePlotNode(node.id, { order: next.order });
      updatePlotNode(next.id, { order: node.order });
    }
  };

  const renderNode = (node: PlotNode, level: number = 0) => {
    const children = getChildNodes(node.id);
    const isSelected = selectedPlotNodeId === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`
            flex items-center p-2 rounded-sm cursor-pointer group transition-colors text-sm
            ${isSelected ? 'bg-sf-text text-sf-bg' : 'hover:bg-sf-surface text-sf-text'}
          `}
          style={{ marginLeft: `${level * 16}px` }}
          onClick={() => setSelectedPlotNodeId(node.id)}
        >
          <div
            className={`
              mr-2 px-1.5 py-0.5 text-[10px] rounded uppercase font-bold tracking-wider
              ${
                node.type === 'act'
                  ? 'bg-red-100 text-red-800'
                  : node.type === 'arc'
                    ? 'bg-orange-100 text-orange-800'
                    : node.type === 'chapter'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
              }
            `}
          >
            {node.type.substring(0, 3)}
          </div>
          <span className="flex-1 font-medium truncate">{node.title}</span>

          <div
            className={`hidden group-hover:flex items-center gap-1 ${isSelected ? 'text-sf-bg' : 'text-sf-text-muted'}`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveNode(node, 'up');
              }}
              className="p-1 hover:bg-black/10 rounded"
              title="Move Up"
            >
              <ChevronUp size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveNode(node, 'down');
              }}
              className="p-1 hover:bg-black/10 rounded"
              title="Move Down"
            >
              <ChevronDown size={12} />
            </button>
            {node.type !== 'scene' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const childType =
                    node.type === 'act' ? 'chapter' : node.type === 'chapter' ? 'scene' : 'scene';
                  handleAddNode(node.id, childType);
                }}
                className="p-1 hover:bg-black/10 rounded"
                title="Add Child"
              >
                <Plus size={12} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNode(node.id);
              }}
              className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        {children.map((child) => renderNode(child, level + 1))}
      </div>
    );
  };

  const Sidebar = (
    <div className="flex flex-col h-full border-r border-sf-border pr-6">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-sf-text">Outline</h3>
        <button
          onClick={() => handleAddNode(null, 'act')}
          className="btn-ghost p-1 hover:bg-sf-border rounded-sm"
          title="Add Act"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 -mr-2 pr-2">
        {rootNodes.length === 0 ? (
          <div className="text-center text-sf-text-muted mt-10 text-sm">
            <p>No plot nodes yet.</p>
            <button
              onClick={() => handleAddNode(null, 'act')}
              className="text-sf-accent hover:underline mt-2"
            >
              Create an Act
            </button>
          </div>
        ) : (
          rootNodes.map((node) => renderNode(node))
        )}
      </div>
    </div>
  );

  return (
    <SplitView
      sidebar={Sidebar}
      content={
        selectedPlotNodeId ? (
          <SceneDetailPanel key={selectedPlotNodeId} nodeId={selectedPlotNodeId} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-sf-text-muted">
            <p className="text-lg font-medium">Select a plot node to edit details</p>
          </div>
        )
      }
    />
  );
};
