import type { Workflow, WorkflowDetail, CreateWorkflowRequest, UpdateWorkflowRequest } from '@n8n-project/shared';
import { authHeaders, API_BASE } from './client';

async function readError(res: Response): Promise<string> {
  try { return await res.text() || `HTTP ${res.status}`; } catch { return `HTTP ${res.status}`; }
}

export async function getWorkflows(): Promise<Workflow[]> {
  const res = await fetch(`${API_BASE}/api/workflows`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await readError(res));
  const data = await res.json();
  return data.workflows ?? data ?? [];
}

export async function fetchWorkflow(id: string): Promise<WorkflowDetail> {
  const res = await fetch(`${API_BASE}/api/workflows/${id}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function createWorkflow(input: CreateWorkflowRequest): Promise<Workflow> {
  const res = await fetch(`${API_BASE}/api/workflows`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function updateWorkflow(id: string, data: UpdateWorkflowRequest): Promise<WorkflowDetail> {
  const res = await fetch(`${API_BASE}/api/workflows/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function deleteWorkflow(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/workflows/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(await readError(res));
}
