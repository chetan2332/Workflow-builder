import type { NodeDefinition } from '@n8n-project/shared';
import { authHeaders } from './client';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

/**
 * Response from GET /api/execution/nodes
 */
export interface GetNodesResponse {
  nodes: NodeDefinition[];
  count: number;
}

/**
 * Request body for POST /api/execution/node/:nodeId
 */
export interface ExecuteNodeRequest {
  nodeId: string;
  type: string;
  version: number;
  config: any;
  inputs: Record<string, any[]>;
}

/**
 * Response from POST /api/execution/node/:nodeId
 */
export interface ExecuteNodeResponse {
  success: boolean;
  result?: {
    outputs: Record<string, any[]>;
    metadata?: {
      duration?: number;
      itemsProcessed?: number;
      logs?: string[];
    };
  };
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
}

/**
 * Fetch all node definitions from backend
 */
export async function fetchNodeDefinitions(): Promise<NodeDefinition[]> {
  const response = await fetch(`${API_BASE}/api/execution/nodes`);

  if (!response.ok) {
    const text = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(`Failed to fetch node definitions: ${text}`);
  }

  const data: GetNodesResponse = await response.json();
  return data.nodes;
}

/**
 * Execute a single node
 */
export async function executeNode(
  nodeId: string,
  request: ExecuteNodeRequest
): Promise<ExecuteNodeResponse> {
  const response = await fetch(`${API_BASE}/api/execution/node/${nodeId}`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => `HTTP ${response.status}`);
    throw new Error(`Node execution failed: ${text}`);
  }

  return response.json();
}
