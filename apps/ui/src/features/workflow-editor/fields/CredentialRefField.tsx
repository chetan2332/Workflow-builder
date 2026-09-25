import type { FieldProps } from './types';

const MOCK_CREDENTIALS = [
  { value: 'none', label: 'None' },
  { value: 'credential-1', label: 'API Key 1' },
  { value: 'credential-2', label: 'OAuth Token' },
  { value: 'credential-3', label: 'Basic Auth' },
];

export function CredentialRefField({ field, value, onChange }: FieldProps) {
  const v = String(value ?? field.default ?? 'none');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="input-label" htmlFor={field.id}>{field.label}</label>
      <select id={field.id} className="input" value={v} onChange={e => onChange(field.id, e.target.value)}>
        {MOCK_CREDENTIALS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>
    </div>
  );
}
