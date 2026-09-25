import type { FieldProps } from './types';

const MOCK_FILES = [
  { value: '', label: 'Choose file…' },
  { value: 'file-1', label: 'document.txt' },
  { value: 'file-2', label: 'data.csv' },
  { value: 'file-3', label: 'config.json' },
];

export function FileField({ field, value, onChange }: FieldProps) {
  const v = String(value ?? field.default ?? '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="input-label" htmlFor={field.id}>{field.label}</label>
      <select id={field.id} className="input" value={v} onChange={e => onChange(field.id, e.target.value)}>
        {MOCK_FILES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
      </select>
      {field.description && <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>{field.description}</p>}
    </div>
  );
}
