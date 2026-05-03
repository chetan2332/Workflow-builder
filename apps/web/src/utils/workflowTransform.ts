import type { Node, Edge } from '@xyflow/react';
import { MarkerType } from '@xyflow/react';
import type { WorkflowDetail } from '../api/workflows';
import type { WorkflowNodeData } from '../nodeConfigSchema';
import { NODE_DEFINITIONS_BY_ID } from '../nodeTemplates';

// Map backend shape enum to XYFlow node type
function getNodeType(shape: string): string {
  const shapeMap: Record<string, string> = {
    'CIRCLE': 'circle',
    'OPPOSITE_D': 'oppositeD',
    'ROUNDED_RECTANGLE': 'roundedRectangle',
    'RECTANGLE_WITH_TEXT': 'rectangleWithText',
  };
  return shapeMap[shape] || 'circle';
}

export function backendToXYFlow(workflow: WorkflowDetail): {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
} {
  const nodes = workflow.nodes.map(node => {
    // Use template data sent from backend
    const shape = node.template?.shape || 'CIRCLE';
    const xyflowType = getNodeType(shape);

    return {
      id: node.id,
      type: xyflowType,
      position: {
        x: node.positionX,
        y: node.positionY,
      },
      data: {
        label: node.label || node.template?.name || node.templateId,
        definitionId: node.templateId,
        actionState: node.actionState,
      },
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

export function xyFlowToBackend(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[]
): {
  nodes: Array<{
    id: string;
    templateId: string;
    label?: string;
    positionX: number;
    positionY: number;
    actionState: Record<string, any>;
  }>;
  edges: Array<{
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
} {
  const backendNodes = nodes
    .filter(node => !node.data?.isDummy) // Exclude dummy nodes
    .map(node => ({
      id: node.id,
      templateId: node.data.definitionId,
      label: node.data.label,
      positionX: node.position.x,
      positionY: node.position.y,
      actionState: node.data.actionState || {},
    }));

  const backendEdges = edges
    .filter(edge => !edge.data?.isDummyEdge) // Exclude dummy edges
    .map(edge => ({
      id: edge.id,
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
    }));

  return { nodes: backendNodes, edges: backendEdges };
}
