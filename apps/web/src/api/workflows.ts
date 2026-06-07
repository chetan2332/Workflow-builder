import type {
  Workflow,
  WorkflowDetail,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
} from '@n8n-project/shared';
import { authHeaders } from './client';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

/**
 * Fetch all workflows
 */
export async function getWorkflows(): Promise<Workflow[]> {
  const response = await fetch(`${API_BASE}/workflows`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const result = await response.json();
  return result.workflows || result || [];
}

/**
 * Fetch a single workflow by ID
 */
export async function fetchWorkflow(id: string): Promise<WorkflowDetail> {
  const response = await fetch(`${API_BASE}/workflows/${id}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

/**
 * Update an existing workflow
 */
export async function updateWorkflow(
  id: string,
  data: UpdateWorkflowRequest,
): Promise<WorkflowDetail> {
  const response = await fetch(`${API_BASE}/workflows/${id}`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

/**
 * Create a new workflow
 */
export async function createWorkflow(
  input: CreateWorkflowRequest,
): Promise<Workflow> {
  const response = await fetch(`${API_BASE}/workflows`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

/**
 * Delete a workflow by ID
 */
export async function deleteWorkflow(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/workflows/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}

/**
 * Read error message from response body
 */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}