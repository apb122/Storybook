import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, MarkerType } from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useStoryStore } from '@/state/store';
import type { EntityId } from '@/types/story';

interface RelationshipGraphProps {
    characterId: EntityId;
}

export const RelationshipGraph: React.FC<RelationshipGraphProps> = ({ characterId }) => {
    const characters = useStoryStore((state) => state.characters);

    const { nodes, edges } = useMemo(() => {
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        // Simple circular layout
        const centerX = 400;
        const centerY = 300;
        const radius = 200;
        const angleStep = (2 * Math.PI) / characters.length;

        characters.forEach((char, index) => {
            const angle = index * angleStep;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            nodes.push({
                id: char.id,
                position: { x, y },
                data: { label: char.name },
                style: {
                    background: char.id === characterId ? '#4f46e5' : '#1f2937',
                    color: '#fff',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    padding: '10px',
                    width: 150,
                    textAlign: 'center',
                },
            });

            char.relationships.forEach((rel) => {
                // Avoid duplicate edges for bidirectional relationships (simple check)
                // For now, we just add all edges
                edges.push({
                    id: `${char.id}-${rel.characterId}`,
                    source: char.id,
                    target: rel.characterId,
                    label: rel.type,
                    type: 'smoothstep',
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                    },
                    style: { stroke: '#9ca3af' },
                    labelStyle: { fill: '#9ca3af', fontSize: 12 },
                });
            });
        });

        return { nodes, edges };
    }, [characters, characterId]);

    return (
        <div className="h-[500px] w-full bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
            <ReactFlow nodes={nodes} edges={edges} fitView attributionPosition="bottom-right">
                <Background color="#374151" gap={16} />
                <Controls />
                <MiniMap
                    nodeColor={(node) => {
                        return node.id === characterId ? '#4f46e5' : '#1f2937';
                    }}
                    maskColor="rgba(0, 0, 0, 0.7)"
                />
            </ReactFlow>
        </div>
    );
};
