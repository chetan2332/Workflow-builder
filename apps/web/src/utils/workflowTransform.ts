import type { WorkflowDetail, WorkflowEdge, WorkflowNode } from '@n8n-project/shared';
import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';

export function backendToXYFlow(workflow: WorkflowDetail, definitionsById: Record<string, any>): {
  nodes: Node<WorkflowNode>[];
  edges: Edge[];
} {
  const nodes = workflow.nodes.map(node => {

    const nodeDefinition = definitionsById[node.type];
    if (!nodeDefinition) {
      throw new Error(`Node definition not found for type: ${node.type}`);
    }

    return {
      id: node.id,
      type: nodeDefinition.shape,
      position: {
        x: node.positionX,
        y: node.positionY,
      },
      data: node,
    };
  });

  const edges = workflow.edges.map(edge => ({
    id: edge.id,
    source: edge.sourceNodeId,
    target: edge.targetNodeId,
    sourceHandle: edge.sourceHandle || undefined,
    targetHandle: edge.targetHandle || undefined,
    markerEnd: { type: MarkerType.ArrowClosed },
  }));

  return { nodes, edges };
}

export function XYFlowToBackend(
  nodes: Node<WorkflowNode>[],
  edges: Edge[]
): {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
} {
  const backendNodes = nodes
    .filter(node => !node.data?.isDummy) // Exclude dummy nodes
    .map(node => ({
      id: node.id,
      type: node.data.type,          
      version: node.data.version,   
      category: node.data.category,
      positionX: node.position.x,
      positionY: node.position.y,
      configValues: node.data.configValues,
      label: node.data.label,
      description: node.data.description,
      inputHandles: node.data.inputHandles,
      outputHandles: node.data.outputHandles,
      configHandles: node.data.configHandles,
      state: node.data.state, // execution state for runtime
    } as WorkflowNode));

  const backendEdges = edges
    .filter(edge => !edge.data?.isDummyEdge) // Exclude dummy edges
    .map(edge => ({
      id: edge.id,
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
    } as WorkflowEdge));

  return { nodes: backendNodes, edges: backendEdges };
}
