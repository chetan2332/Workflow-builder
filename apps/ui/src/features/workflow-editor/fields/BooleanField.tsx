import type { FieldProps } from './types';

export function BooleanField({ field, value, onChange }: FieldProps) {
  const checked = typeof value === 'boolean' ? value : value === 'true';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <input type="checkbox" id={field.id} checked={checked}
        onChange={e => onChange(field.id, e.target.checked)}
        style={{ width: 15, height: 15, accentColor: 'var(--accent)', cursor: 'pointer' }} />
      <label htmlFor={field.id} className="input-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
        {field.label}
      </label>
    </div>
  );
}
