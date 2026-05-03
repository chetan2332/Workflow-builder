import type { FieldProps } from './types';

// Mock credentials for now - will be replaced with API call
const MOCK_CREDENTIALS = [
  { value: 'none', label: 'None' },
  { value: 'credential-1', label: 'API Key 1' },
  { value: 'credential-2', label: 'OAuth Token' },
  { value: 'credential-3', label: 'Basic Auth' },
];

export function CredentialRefField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? 'none');

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
      </label>
      <select
        id={field.id}
        value={stringValue}
        onChange={(e) => onChange(field.id, e.target.value)}
        className="input"
      >
        {MOCK_CREDENTIALS.map((cred) => (
          <option key={cred.value} value={cred.value}>
            {cred.label}
          </option>
        ))}
      </select>
    </div>
  );
}