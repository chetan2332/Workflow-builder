import type { FieldProps } from './types';

export function SelectField({ field, value, onChange }: FieldProps) {
  const v = String(value ?? field.default ?? '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="input-label" htmlFor={field.id}>{field.label}</label>
      <select id={field.id} className="input" value={v}
        onChange={e => onChange(field.id, e.target.value)}
        style={{ cursor: 'pointer' }}>
        <option value="">Select…</option>
        {Array.isArray(field.options) && field.options.map(opt => {
          const val   = typeof opt === 'string' ? opt : opt.value;
          const label = typeof opt === 'string' ? opt : opt.label;
          return <option key={val} value={val}>{label}</option>;
        })}
      </select>
      {field.description && <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>{field.description}</p>}
    </div>
  );
}
