import { useMemo, useEffect } from 'react';
import { MarkerType, type Node, type Edge } from '@xyflow/react';
import type { WorkflowNodeData, HandleConfig } from '../../nodeConfigSchema';
import { NODE_DEFINITIONS_BY_ID } from '../../nodeTemplates';
import { getEffectiveHandles } from './workflowValidation';

function calculateDummyPosition(node: Node, _handle: HandleConfig, index: number) {
  return {
    x: node.position.x + 150,
    y: node.position.y + index * 40,
  };
}

export function useDummyNodes(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
  onDummyClick: (dummyId: string, data: WorkflowNodeData) => void,
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void
) {
  const result = useMemo(() => {
    const dummies: Node<WorkflowNodeData>[] = [];
    const edgesToCreate: Edge[] = [];

    nodes
      .filter((n) => !n.data.isDummy)
      .forEach((node) => {
        const definition = NODE_DEFINITIONS_BY_ID[node.data.definitionId];
        if (!definition) return;

        const effectiveHandles = getEffectiveHandles(definition, node.data);
        const outputHandles = effectiveHandles.filter((h) => h.kind === 'output');

        outputHandles.forEach((handle, index) => {
          // Check if this handle has a real connection (ignore dummy edges)
          const hasRealConnection = edges.some(
            (e) =>
              e.source === node.id &&
              e.sourceHandle === handle.id &&
              !e.data?.isDummyEdge  // Ignore dummy edges
          );

          if (!hasRealConnection) {
            const dummyId = `dummy-${node.id}-${handle.id}`;
            const edgeId = `edge-dummy-${node.id}-${handle.id}`;

            dummies.push({
              id: dummyId,
              type: 'dummy',
              position: calculateDummyPosition(node, handle, index),
              data: {
                isDummy: true,
                label: '',
                definitionId: 'DUMMY',
                sourceNodeId: node.id,
                sourceHandleId: handle.id,
                onDummyClick,
              },
              width: 24,
              height: 24,
              measured: { width: 24, height: 24 },
              draggable: true,  // Allow dragging
              selectable: true,
            });

            // Check if edge already exists in state
            const edgeExists = edges.some((e) => e.id === edgeId);
            if (!edgeExists) {
              edgesToCreate.push({
                id: edgeId,
                source: node.id,
                sourceHandle: handle.id,
                target: dummyId,
                targetHandle: 'in',
                type: 'default',
                markerEnd: { type: MarkerType.ArrowClosed },
                data: { isDummyEdge: true },
              });
            }
          }
        });
      });

    return { dummies, edgesToCreate };
  }, [nodes, edges, onDummyClick]);

  // Add edges to state via useEffect
  useEffect(() => {
    if (result.edgesToCreate.length > 0) {
      setEdges((eds) => [...eds, ...result.edgesToCreate]);
    }
  }, [result.edgesToCreate, setEdges]);

  return result.dummies;
}
