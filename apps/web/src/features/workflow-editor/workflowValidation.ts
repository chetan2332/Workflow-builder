import { NODE_DEFINITIONS_BY_ID } from '../../nodeTemplates';
import type { HandleConfig, NodeTemplateConfig } from '../../nodeConfigSchema';
import type { Node, Edge } from '@xyflow/react';

export type NodeDataWithTemplate = {
  definitionId: string;
  actionState?: Record<string, unknown>;
  [key: string]: unknown;
};

function parseNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return fallback;
}

export function getEffectiveHandles(
  tpl: NodeTemplateConfig | null,
  data: NodeDataWithTemplate,
): HandleConfig[] {
  if (!tpl) return [];

  const base = tpl.handles;
  const state = data.actionState ?? {};

  const baseInputs = base.filter((h) => h.kind === 'input');
  const baseOutputs = base.filter((h) => h.kind === 'output');

  switch (tpl.nodeId) {
    case 'FUNCTION': {
      const inputCount = parseNumber(state.inputHandleCount, 1);
      const templateIn = baseInputs[0];
      const inputs =
        templateIn && inputCount > 0
          ? Array.from({ length: inputCount }, (_, i) => ({
              ...templateIn,
              id: `in-${i + 1}`,
              label: templateIn.label ?? `in ${i + 1}`,
            }))
          : baseInputs;
      return [...inputs, ...baseOutputs];
    }
    case 'IF': {
      const inputCount = parseNumber(state.inputHandleCount, 1);
      const templateIn = baseInputs[0];
      const inputs =
        templateIn && inputCount > 0
          ? Array.from({ length: inputCount }, (_, i) => ({
              ...templateIn,
              id: `in-${i + 1}`,
              label: templateIn.label ?? `in ${i + 1}`,
            }))
          : baseInputs;
      return [...inputs, ...baseOutputs];
    }
    case 'SWITCH': {
      const inputCount = parseNumber(state.inputHandleCount, 1);
      const outputCount = parseNumber(state.outputHandleCount, 1);
      const templateIn = baseInputs[0];
      const templateOut = baseOutputs[0];

      const inputs =
        templateIn && inputCount > 0
          ? Array.from({ length: inputCount }, (_, i) => ({
              ...templateIn,
              id: `in-${i + 1}`,
              label: templateIn.label ?? `in ${i + 1}`,
            }))
          : baseInputs;

      const labelsRaw =
        typeof state.outputLabels === 'string'
          ? (state.outputLabels as string).split(',').map((s) => s.trim())
          : [];

      const outputs =
        templateOut && outputCount > 0
          ? Array.from({ length: outputCount }, (_, i) => ({
              ...templateOut,
              id: `out-${i + 1}`,
              label:
                labelsRaw[i] || templateOut.label || `case ${i + 1}`,
            }))
          : baseOutputs;

      return [...inputs, ...outputs];
    }
    default:
      return base;
  }
}

function getHandle(
  node: Node,
  handleId: string | null,
): { kind: string; type: string } | null {
  if (!handleId) return null;
  const data = node.data as NodeDataWithTemplate;
  const tpl = data?.definitionId ? NODE_DEFINITIONS_BY_ID[data.definitionId] : null;
  const handles = getEffectiveHandles(tpl, data ?? {});
  const h = handles.find((x) => x.id === handleId);
  return h ? { kind: h.kind, type: h.type } : null;
}

export function isValidConnection(
  nodes: Node[],
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
  if (sourceHandle.kind !== 'output' || targetHandle.kind !== 'input')
    return false;

  if (sourceHandle.type !== targetHandle.type) return false;

  const targetInputAlreadyConnected = edges.some(
    (e) => e.target === connection.target && e.targetHandle === connection.targetHandle,
  );
  if (targetInputAlreadyConnected) return false;

  return true;
}

export function getUnsatisfiedNodeIds(
  nodes: Node[],
  edges: Edge[],
): Set<string> {
  const unsatisfied = new Set<string>();

  for (const node of nodes) {
    const data = node.data as NodeDataWithTemplate;
    const tpl = data?.definitionId ? NODE_DEFINITIONS_BY_ID[data.definitionId] : null;
    const handles = getEffectiveHandles(tpl, data ?? {});

    for (const h of handles) {
      if (h.kind === 'input') {
        const hasIncoming = edges.some(
          (e) => e.target === node.id && e.targetHandle === h.id,
        );
        if (!hasIncoming) unsatisfied.add(node.id);
      } else {
        const hasOutgoing = edges.some(
          (e) => e.source === node.id && e.sourceHandle === h.id,
        );
        if (!hasOutgoing) unsatisfied.add(node.id);
      }
    }
  }

  return unsatisfied;
}
