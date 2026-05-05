/**
 * Node data for React Flow canvas nodes
 */
export type WorkflowNodeData = {
  label?: string;
  definitionId: string;  // Node type (e.g., "code.http", "trigger.start")
  config?: Record<string, unknown>;
  isDummy?: boolean;
  sourceNodeId?: string;
  sourceHandleId?: string;
};

/**
 * Edge data for React Flow canvas edges
 */
export type EdgeData = {
  data?: unknown;
  executedAt?: number;
  status?: 'pending' | 'success' | 'error';
  error?: string;
  executionTimeMs?: number;
  dataType?: 'flow' | 'json';
  isDummyEdge?: boolean;
};

