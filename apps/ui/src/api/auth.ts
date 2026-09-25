import { authHeaders, API_BASE } from './client';

export async function syncUser(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/me`, { method: 'POST', headers: authHeaders() });
  if (!res.ok) throw new Error(`Failed to sync user: HTTP ${res.status}`);
}
