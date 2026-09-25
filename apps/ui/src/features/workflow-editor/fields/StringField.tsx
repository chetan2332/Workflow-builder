import type { FieldProps } from './types';

export function StringField({ field, value, onChange }: FieldProps) {
  const v = String(value ?? field.default ?? '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="input-label" htmlFor={field.id}>
        {field.label}{field.required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
      </label>
      <input id={field.id} className="input" type="text" value={v}
        onChange={e => onChange(field.id, e.target.value)}
        placeholder={field.placeholder} />
      {field.description && <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>{field.description}</p>}
    </div>
  );
}
