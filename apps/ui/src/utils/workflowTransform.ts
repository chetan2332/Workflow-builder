import type { WorkflowDetail, WorkflowEdge, WorkflowNode } from '@n8n-project/shared';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';

export function backendToXYFlow(
  workflow: WorkflowDetail,
  definitionsById: Record<string, { shape: string }>,
): { nodes: Node<WorkflowNode>[]; edges: Edge[] } {
  const nodes = workflow.nodes.map((node) => {
    const def = definitionsById[node.type];
    if (!def) throw new Error(`Node definition not found: ${node.type}`);
    return {
      id: node.id,
      type: def.shape,
      position: { x: node.positionX, y: node.positionY },
      data: node,
    };
  });

  const edges = workflow.edges.map((edge) => ({
    id: edge.id,
    source: edge.sourceNodeId,
    target: edge.targetNodeId,
    sourceHandle: edge.sourceHandle ?? undefined,
    targetHandle: edge.targetHandle ?? undefined,
    markerEnd: { type: MarkerType.ArrowClosed },
  }));

  return { nodes, edges };
}

export function XYFlowToBackend(
  nodes: Node<WorkflowNode>[],
  edges: Edge[],
): { nodes: WorkflowNode[]; edges: WorkflowEdge[] } {
  const backendNodes = nodes
    .filter((n) => !n.data?.isDummy)
    .map((n) => ({
      id: n.id,
      type: n.data.type,
      version: n.data.version,
      category: n.data.category,
      positionX: n.position.x,
      positionY: n.position.y,
      configValues: n.data.configValues,
      label: n.data.label,
      description: n.data.description,
      inputHandles: n.data.inputHandles,
      outputHandles: n.data.outputHandles,
      configHandles: n.data.configHandles,
      state: n.data.state,
    } as WorkflowNode));

  const backendEdges = edges
    .filter((e) => !e.data?.isDummyEdge)
    .map((e) => ({
      id: e.id,
      sourceNodeId: e.source,
      targetNodeId: e.target,
      sourceHandle: e.sourceHandle ?? undefined,
      targetHandle: e.targetHandle ?? undefined,
    } as WorkflowEdge));

  return { nodes: backendNodes, edges: backendEdges };
}
