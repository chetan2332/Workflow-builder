import { authHeaders } from './client';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export async function syncUser(): Promise<void> {
  const response = await fetch(`${API_BASE}/api/auth/me`, {
    method: 'POST',
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to sync user: HTTP ${response.status}`);
  }
}
