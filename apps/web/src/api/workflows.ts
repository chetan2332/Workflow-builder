export type Workflow = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export type WorkflowDetail = {
  id: string;
  name: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  nodes: Array<{
    id: string;
    templateId: string;
    templateVersion: string;
    label: string | null;
    positionX: number;
    positionY: number;
    actionState: Record<string, unknown>;
    template: {
      templateId: string;
      name: string;
      shape: string;
      nodeType: string;
      handlesConfig: any;
      actionConfig: any;
      dynamicHandles: any;
    };
  }>;
  edges: Array<{
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandle: string | null;
    targetHandle: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

async function readErrorMessage(response: Response) {
  try {
    const text = await response.text();
    return text || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

export async function getWorkflows(): Promise<Workflow[]> {
    const response = await fetch(`${API_BASE}/workflows`);
    if (response.status !== 200) {
      throw new Error(await readErrorMessage(response));
    }
    const result = await response.json();
    return result.workflows || result;
}

export async function fetchWorkflow(id: string): Promise<WorkflowDetail> {
  const response = await fetch(`${API_BASE}/workflows/${id}`);
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json();
}

export async function updateWorkflow(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: string;
    nodes: Array<{
      id: string;
      templateId: string;
      label?: string;
      positionX: number;
      positionY: number;
      actionState: Record<string, any>;
    }>;
    edges: Array<{
      id: string;
      sourceNodeId: string;
      targetNodeId: string;
      sourceHandle?: string;
      targetHandle?: string;
    }>;
  }
): Promise<WorkflowDetail> {
  const response = await fetch(`${API_BASE}/workflows/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
  return response.json();
}

export async function createWorkflow(input: {
    name: string;
    description?: string;
}): Promise<Workflow> {
    const response = await fetch(`${API_BASE}/workflows`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    });
    if (response.status !== 201 && response.status !== 200) {
      throw new Error(await readErrorMessage(response));
    }
    return response.json();
}

export async function deleteWorkflow(id: string): Promise<void> {
    const response = await fetch(`${API_BASE}/workflows/${id}`, {
        method: 'DELETE',
    });
    if (response.status !== 204 && response.status !== 200) {
      throw new Error(await readErrorMessage(response));
    }
}