import type { NodeTemplateConfig, NodeType } from './nodeConfigSchema';

const modules = import.meta.glob('./node-config/*.json', { eager: true });
const NODE_DEFINITIONS = Object.values(modules).map((m) => {
  const mod = m as { default?: unknown };
  return (mod.default ?? m) as NodeTemplateConfig;
});

export const NODE_DEFINITIONS_BY_ID: Record<string, NodeTemplateConfig> =
  NODE_DEFINITIONS.reduce((acc, def) => {
    acc[def.nodeId] = def;
    return acc;
  }, {} as Record<string, NodeTemplateConfig>);

export type NodeDefinitionId = NodeTemplateConfig['nodeId'];

export type GroupedTemplates = {
  nodeType: NodeType;
  templates: NodeTemplateConfig[];
};

const ALL_NODE_TYPES: NodeType[] = ['TRIGGER', 'CODE', 'CONDITION', 'OTHER'];

export const NODE_TYPE_LABELS: Record<NodeType, string> = {
  TRIGGER: 'Trigger',
  CODE: 'Code',
  CONDITION: 'Condition',
  OTHER: 'Other',
};

export const GROUPED_TEMPLATES: GroupedTemplates[] = ALL_NODE_TYPES.map(
  (nodeType) => ({
    nodeType,
    templates: NODE_DEFINITIONS.filter((def) => def.nodeType === nodeType),
  }),
);

