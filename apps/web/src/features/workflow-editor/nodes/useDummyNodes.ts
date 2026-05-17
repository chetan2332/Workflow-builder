import { useMemo } from 'react';
import { MarkerType, type Node, type Edge } from '@xyflow/react';
import { NodeCategory, type WorkflowNode } from '@n8n-project/shared';

function calculateDummyPosition(node: Node<WorkflowNode>, index: number) {
  return {
    x: node.position.x + 150,
    y: node.position.y + index * 40,
  };
}

export function useDummyNodes(
  nodes: Node<WorkflowNode>[],
  edges: Edge[]
) {
  return useMemo(() => {
    const dummyNodes: Node<WorkflowNode>[] = [];
    const dummyEdges: Edge[] = [];

    nodes
      .filter((n) => !n.data.isDummy)
      .forEach((node) => {

        const outputHandles = node.data.outputHandles;

        outputHandles.forEach((handle, index) => {
          // Check if this handle has a real connection (ignore dummy edges)
          const hasRealConnection = edges.some(
            (e) =>
              e.source === node.id &&
              e.sourceHandle === handle.id &&
              !e.data?.isDummy  // Ignore dummy edges
          );

          if (!hasRealConnection) {
            const dummyId = `dummy-${node.id}-${handle.id}`;
            const edgeId = `edge-dummy-${node.id}-${handle.id}`;

            const position = calculateDummyPosition(node, index);

            dummyNodes.push({
              id: dummyId,
              type: 'dummy',
              position: position,
              data: {
                id: dummyId,
                type: 'dummy',
                version: 1,
                category: NodeCategory.FLOW,
                positionX: position.x,
                positionY: position.y,
                configValues: {},
                label: '',
                description: 'Placeholder node',
                inputHandles: [{
                  id: 'in',
                  label: 'Input',
                  type: 'input',
                  schema: { type: 'any' },
                  fixed: true,
                  schemaEditable: false,
                }],
                outputHandles: [],
                isDummy: true,
                sourceNodeId: node.id,
                sourceHandleId: handle.id
              },
              width: 24,
              height: 24,
              measured: { width: 24, height: 24 },
              draggable: false,
              selectable: true,
            });

            dummyEdges.push({
              id: edgeId,
              source: node.id,
              sourceHandle: handle.id,
              target: dummyId,
              targetHandle: 'in',
              type: 'default',
              markerEnd: { type: MarkerType.ArrowClosed },
              data: { isDummy: true },
            });
          }
        });
      });

    return { dummyNodes, dummyEdges };
  }, [nodes, edges]);
}
