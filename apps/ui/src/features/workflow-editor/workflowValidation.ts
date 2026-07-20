import { canConnect, type Handle, type WorkflowNode } from '@n8n-project/shared';
import type { Node, Edge } from '@xyflow/react';

function getHandle(node: Node<WorkflowNode>, handleId: string | null): Handle | null {
  if (!handleId) return null;
  const data = node.data as WorkflowNode;
  return (
    data.inputHandles?.find(h => h.id === handleId) ||
    data.outputHandles?.find(h => h.id === handleId) ||
    null
  );
}

export function isValidConnection(
  nodes: Node<WorkflowNode>[],
  edges: Edge[],
  connection: { source: string; sourceHandle: string | null; target: string; targetHandle: string | null },
): boolean {
  if (connection.source === connection.target) return false;

  const sourceNode = nodes.find(n => n.id === connection.source);
  const targetNode = nodes.find(n => n.id === connection.target);
  if (!sourceNode || !targetNode) return false;

  const sourceHandle = getHandle(sourceNode, connection.sourceHandle);
  const targetHandle = getHandle(targetNode, connection.targetHandle);
  if (!sourceHandle || !targetHandle) return false;
  if (sourceHandle.type !== 'output' || targetHandle.type !== 'input') return false;

  const adjacencyList = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adjacencyList.has(edge.source)) adjacencyList.set(edge.source, []);
    adjacencyList.get(edge.source)!.push(edge.target);
  }

  if (adjacencyList.get(connection.source)?.includes(connection.target)) return false;

  const visited = new Set<string>();
  const dfs = (nodeId: string): boolean => {
    if (nodeId === connection.source) return true;
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);
    for (const neighbor of adjacencyList.get(nodeId) ?? []) {
      if (dfs(neighbor)) return true;
    }
    return false;
  };

  if (dfs(connection.target)) return false;
  if (!canConnect(sourceHandle.schema, targetHandle.schema)) return false;
  return true;
}

export function getUnsatisfiedNodeIds(nodes: Node<WorkflowNode>[], edges: Edge[]): Set<string> {
  const unsatisfied = new Set<string>();
  for (const node of nodes) {
    const data = node.data as WorkflowNode;
    for (const h of data.inputHandles ?? []) {
      if (!edges.some(e => e.target === node.id && e.targetHandle === h.id)) {
        unsatisfied.add(node.id);
      }
    }
  }
  return unsatisfied;
}
