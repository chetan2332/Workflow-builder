let _token: string | null = null;

export function setAuthToken(token: string | null) {
  _token = token;
}

export function authHeaders(): Record<string, string> {
  return _token ? { Authorization: `Bearer ${_token}` } : {};
}

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
