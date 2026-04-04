export type Workflow = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

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