import { canConnect, type Handle, type WorkflowNode } from '@n8n-project/shared';
import type { Node, Edge } from '@xyflow/react';

// function parseNumber(value: unknown, fallback: number): number {
//   if (typeof value === 'number') return value;
//   if (typeof value === 'string') {
//     const n = Number(value);
//     if (!Number.isNaN(n)) return n;
//   }
//   return fallback;
// }

// export function getEffectiveHandles(
//   tpl: NodeTemplateConfig | null,
//   data: NodeDataWithTemplate,
// ): HandleConfig[] {
//   if (!tpl) return [];

//   const base = tpl.handles;
//   const state = data.actionState ?? {};

//   const baseInputs = base.filter((h) => h.kind === 'input');
//   const baseOutputs = base.filter((h) => h.kind === 'output');

//   switch (tpl.nodeId) {
//     case 'FUNCTION': {
//       const inputCount = parseNumber(state.inputHandleCount, 1);
//       const templateIn = baseInputs[0];
//       const inputs =
//         templateIn && inputCount > 0
//           ? Array.from({ length: inputCount }, (_, i) => ({
//               ...templateIn,
//               id: `in-${i + 1}`,
//               label: templateIn.label ?? `in ${i + 1}`,
//             }))
//           : baseInputs;
//       return [...inputs, ...baseOutputs];
//     }
//     case 'IF': {
//       const inputCount = parseNumber(state.inputHandleCount, 1);
//       const templateIn = baseInputs[0];
//       const inputs =
//         templateIn && inputCount > 0
//           ? Array.from({ length: inputCount }, (_, i) => ({
//               ...templateIn,
//               id: `in-${i + 1}`,
//               label: templateIn.label ?? `in ${i + 1}`,
//             }))
//           : baseInputs;
//       return [...inputs, ...baseOutputs];
//     }
//     case 'SWITCH': {
//       const inputCount = parseNumber(state.inputHandleCount, 1);
//       const outputCount = parseNumber(state.outputHandleCount, 1);
//       const templateIn = baseInputs[0];
//       const templateOut = baseOutputs[0];

//       const inputs =
//         templateIn && inputCount > 0
//           ? Array.from({ length: inputCount }, (_, i) => ({
//               ...templateIn,
//               id: `in-${i + 1}`,
//               label: templateIn.label ?? `in ${i + 1}`,
//             }))
//           : baseInputs;

//       const labelsRaw =
//         typeof state.outputLabels === 'string'
//           ? (state.outputLabels as string).split(',').map((s) => s.trim())
//           : [];

//       const outputs =
//         templateOut && outputCount > 0
//           ? Array.from({ length: outputCount }, (_, i) => ({
//               ...templateOut,
//               id: `out-${i + 1}`,
//               label:
//                 labelsRaw[i] || templateOut.label || `case ${i + 1}`,
//             }))
//           : baseOutputs;

//       return [...inputs, ...outputs];
//     }
//     default:
//       return base;
//   }
// }

function getHandle(
  node: Node<WorkflowNode>,
  handleId: string | null,
): Handle | null {
  if (!handleId) return null;
  const data = node.data as WorkflowNode;
  return data.inputHandles?.find((h) => h.id === handleId) ||
    data.outputHandles?.find((h) => h.id === handleId) ||
    null;
}

export function isValidConnection(
  nodes: Node<WorkflowNode>[],
  edges: Edge[],
  connection: { source: string; sourceHandle: string | null; target: string; targetHandle: string | null },
): boolean {
  if (connection.source === connection.target) return false;

  const sourceNode = nodes.find((n) => n.id === connection.source);
  const targetNode = nodes.find((n) => n.id === connection.target);
  if (!sourceNode || !targetNode) return false;

  const sourceHandle = getHandle(sourceNode, connection.sourceHandle);
  const targetHandle = getHandle(targetNode, connection.targetHandle);
  if (!sourceHandle || !targetHandle) return false;
  if (sourceHandle.type !== 'output' || targetHandle.type !== 'input')
    return false;

  // Prevent cycles: using DFS to check if target can reach source

  // map for adgacency list
  const adjacencyList = new Map<string, string[]>();
  for (const edge of edges) {
    if (!adjacencyList.has(edge.source)) {
      adjacencyList.set(edge.source, []);
    }
    adjacencyList.get(edge.source)!.push(edge.target);
  }

  // check if connection already exists
  if (adjacencyList.get(connection.source)?.includes(connection.target)) {
    return false; // Connection already exists
  }

  const visited = new Set<string>();
  const dfs = (nodeId: string): boolean => {
    if (nodeId === connection.source) return true; // Cycle detected
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    
    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (dfs(neighbor)) return true;
    }

    return false;
  }

  if (dfs(connection.target)) {
    return false; // Cycle detected
  }

  // Type compatibility check:
  if (!canConnect(sourceHandle.schema, targetHandle.schema)) {
    return false; // Can't provide data from flow-only connection
  }
  
  // All other combinations are allowed
  return true;
}

export function getUnsatisfiedNodeIds(
  nodes: Node<WorkflowNode>[],
  edges: Edge[],
): Set<string> {
  const unsatisfied = new Set<string>();

  for (const node of nodes) {
    const data = node.data as WorkflowNode;
    const handles = data.inputHandles;

    for (const h of handles) {
      const hasIncoming = edges.some(
        (e) => e.target === node.id && e.targetHandle === h.id,
      );
      if (!hasIncoming) unsatisfied.add(node.id);
    }
  }

  return unsatisfied;
}
