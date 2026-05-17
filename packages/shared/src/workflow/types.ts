import type { Handle, NodeCategory } from '../definitions/types';

/**
 * Workflow status enum
 */
export type WorkflowStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export type NodeExecutionState = {
  status: 'pending' | 'success' | 'error' | 'partial';
  outputData: Record<string, any[]>;
}

/**
 * Workflow node (backend representation)
 */
export interface WorkflowNode {
  id: string;
  type: string;           // e.g., "trigger.start", "code.http", "flow.if"
  version: number;        // Versioning support
  category: NodeCategory;
  positionX: number;
  positionY: number;
  configValues: Record<string, any>;
  label: string;
  description: string;
  inputHandles: Handle[];
  outputHandles: Handle[];
  configHandles?: Handle[];
  state?: NodeExecutionState; // execution state for runtime
  [key: string]: any; // allow additional properties (to extend with Node)
}

/**
 * Workflow edge (backend representation)
 */
export interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle: string | null;
  targetHandle: string | null;
}

/**
 * Basic workflow information (list view)
 */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete workflow with nodes and edges
 */
export interface WorkflowDetail {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Request payload for creating a workflow
 */
export interface CreateWorkflowRequest {
  name: string;
  description?: string;
}

/**
 * Node data for updating a workflow
 */
export interface UpdateWorkflowNode {
  id: string;
  positionX: number;
  positionY: number;
  configValues: Record<string, any>;
  label: string;
  description: string;
  inputHandles: Handle[];
  outputHandles: Handle[];
  configHandles?: Handle[];
}

/**
 * Edge data for updating a workflow
 */
export interface UpdateWorkflowEdge extends WorkflowEdge {}

/**
 * Request payload for updating a workflow
 */
export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  status?: WorkflowStatus;
  nodes: UpdateWorkflowNode[];
  edges: UpdateWorkflowEdge[];
}
