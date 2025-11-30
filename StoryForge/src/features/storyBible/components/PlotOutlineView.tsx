import React, { useMemo } from 'react';
import { generateId } from '@/utils/ids';
import { useStoryStore } from '@/state/store';
import { SplitView } from '@/components/ui/SplitView';
// Import the SceneDetailPanel component
import { SceneDetailPanel } from './SceneDetailPanel';
import type { PlotNode } from '@/types/story';

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
      // Recursive delete would be better, but for now just delete the node.
      // The store might need a cascade delete or we handle it here.
      // For simplicity, let's just delete the node. Ideally we should find all children and delete them too.
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
          className={`flex items-center p-2 hover:bg-gray-800 rounded-md cursor-pointer group ${isSelected ? 'bg-indigo-900/50 border border-indigo-500/50' : ''}`}
          style={{ marginLeft: `${level * 20}px` }}
          onClick={() => setSelectedPlotNodeId(node.id)}
        >
          <div
            className={`mr-2 px-1.5 py-0.5 text-xs rounded uppercase font-bold tracking-wider
                        ${
                          node.type === 'act'
                            ? 'bg-red-900/50 text-red-200'
                            : node.type === 'arc'
                              ? 'bg-orange-900/50 text-orange-200'
                              : node.type === 'chapter'
                                ? 'bg-blue-900/50 text-blue-200'
                                : 'bg-green-900/50 text-green-200'
                        }`}
          >
            {node.type}
          </div>
          <span className="flex-1 text-sm font-medium text-gray-200 truncate">{node.title}</span>

          <div className="hidden group-hover:flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveNode(node, 'up');
              }}
              className="p-1 text-gray-400 hover:text-white"
              title="Move Up"
            >
              ↑
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveNode(node, 'down');
              }}
              className="p-1 text-gray-400 hover:text-white"
              title="Move Down"
            >
              ↓
            </button>
            {node.type !== 'scene' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const childType =
                    node.type === 'act' ? 'chapter' : node.type === 'chapter' ? 'scene' : 'scene';
                  handleAddNode(node.id, childType);
                }}
                className="p-1 text-gray-400 hover:text-white"
                title="Add Child"
              >
                +
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteNode(node.id);
              }}
              className="p-1 text-gray-400 hover:text-red-400"
              title="Delete"
            >
              ×
            </button>
          </div>
        </div>
        {children.map((child) => renderNode(child, level + 1))}
      </div>
    );
  };

  const Sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Plot Outline</h3>
        <button
          onClick={() => handleAddNode(null, 'act')}
          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded transition-colors"
        >
          + Act
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {rootNodes.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No plot nodes yet.</p>
            <button
              onClick={() => handleAddNode(null, 'act')}
              className="text-indigo-400 hover:underline mt-2"
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
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg font-medium">Select a plot node to edit details</p>
          </div>
        )
      }
    />
  );
};
