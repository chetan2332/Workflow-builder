import type {
  NodeExecutionRequest,
  NodeExecutionResult,
} from '@n8n-project/shared';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

async function readErrorMessage(response: Response) {
  try {
    const text = await response.text();
    return text || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

export async function executeNode(
  request: NodeExecutionRequest,
): Promise<NodeExecutionResult> {
  const response = await fetch(`${API_BASE}/node-execution`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

// Re-export types for convenience
export type { NodeExecutionRequest, NodeExecutionResult };
