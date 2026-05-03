import type {
  NodeType,
  NodeShape,
  HandleConfig,
  ActionFieldType,
  ActionField,
  NodeActionConfig,
} from '@n8n-project/shared';

// Re-export for backward compatibility
export type {
  NodeType,
  NodeShape,
  HandleConfig,
  ActionFieldType,
  ActionField,
  NodeActionConfig,
};

// Frontend-specific types (NOT in shared package)
export type NodeTemplateConfig = {
  nodeId: string;
  name: string;
  nodeType: NodeType;
  description: string;
  shape: NodeShape;
  handles: HandleConfig[];
  action?: NodeActionConfig;
  dynamicHandles?: {
    inputs: boolean;
    outputs: boolean;
  };
};

export type EdgeData = {
  data?: unknown;
  executedAt?: number;
  status?: 'pending' | 'success' | 'error';
  error?: string;
  executionTimeMs?: number;
  dataType?: 'flow' | 'json';
};

export type NodeDefinitionId = string;

export type WorkflowNodeData = {
  label?: string;
  definitionId: NodeDefinitionId;
  actionState?: Record<string, unknown>;
  isDummy?: boolean;
  sourceNodeId?: string;
  sourceHandleId?: string;
  onDummyClick?: (dummyId: string, data: WorkflowNodeData) => void;
};

