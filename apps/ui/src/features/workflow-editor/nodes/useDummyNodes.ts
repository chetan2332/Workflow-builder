import { useMemo } from 'react';
import { MarkerType, type Node, type Edge } from '@xyflow/react';
import { NodeCategory, type WorkflowNode } from '@n8n-project/shared';

export function useDummyNodes(nodes: Node<WorkflowNode>[], edges: Edge[]) {
  return useMemo(() => {
    const dummyNodes: Node<WorkflowNode>[] = [];
    const dummyEdges: Edge[] = [];

    nodes.filter(n => !n.data.isDummy).forEach(node => {
      node.data.outputHandles.forEach((handle, index) => {
        const hasRealConnection = edges.some(
          e => e.source === node.id && e.sourceHandle === handle.id && !e.data?.isDummyEdge,
        );
        if (hasRealConnection) return;

        const dummyId = `dummy-${node.id}-${handle.id}`;
        const pos = { x: node.position.x + 150, y: node.position.y + index * 40 };

        dummyNodes.push({
          id: dummyId,
          type: 'dummy',
          position: pos,
          data: {
            id: dummyId, type: 'dummy', version: 1,
            category: NodeCategory.FLOW,
            positionX: pos.x, positionY: pos.y,
            configValues: {}, label: '', description: '',
            inputHandles: [{ id: 'in', label: 'Input', type: 'input', schema: { type: 'any' }, fixed: true, schemaEditable: false }],
            outputHandles: [],
            isDummy: true, sourceNodeId: node.id, sourceHandleId: handle.id,
          },
          width: 24, height: 24,
          measured: { width: 24, height: 24 },
          draggable: false, selectable: true,
        });

        dummyEdges.push({
          id: `edge-dummy-${node.id}-${handle.id}`,
          source: node.id, sourceHandle: handle.id,
          target: dummyId, targetHandle: 'in',
          type: 'default',
          markerEnd: { type: MarkerType.ArrowClosed },
          data: { isDummyEdge: true },
        });
      });
    });

    return { dummyNodes, dummyEdges };
  }, [nodes, edges]);
}
