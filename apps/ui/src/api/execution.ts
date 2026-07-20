import type { NodeDefinition } from '@n8n-project/shared';
import { authHeaders, API_BASE } from './client';

export interface ExecuteNodeRequest {
  nodeId: string;
  type: string;
  version: number;
  config: Record<string, unknown>;
  inputs: Record<string, unknown[]>;
}

export interface ExecuteNodeResponse {
  success: boolean;
  result?: {
    outputs: Record<string, unknown[]>;
    metadata?: { duration?: number; itemsProcessed?: number; logs?: string[] };
  };
  error?: { message: string; code?: string; stack?: string };
}

export async function fetchNodeDefinitions(): Promise<NodeDefinition[]> {
  const res = await fetch(`${API_BASE}/api/execution/nodes`);
  if (!res.ok) throw new Error(`Failed to fetch node definitions: HTTP ${res.status}`);
  const data = await res.json();
  return data.nodes;
}

export async function executeNode(nodeId: string, req: ExecuteNodeRequest): Promise<ExecuteNodeResponse> {
  const res = await fetch(`${API_BASE}/api/execution/node/${nodeId}`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error(`Node execution failed: HTTP ${res.status}`);
  return res.json();
}
