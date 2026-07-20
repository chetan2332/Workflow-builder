import type { FieldProps } from './types';

export function TextareaField({ field, value, onChange }: FieldProps) {
  const v = String(value ?? field.default ?? '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="input-label" htmlFor={field.id}>
        {field.label}{field.required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
      </label>
      <textarea id={field.id} className="input" value={v}
        onChange={e => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        style={{ minHeight: 80, resize: 'vertical', fontFamily: 'var(--font-body)' }} />
      {field.description && <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>{field.description}</p>}
    </div>
  );
}
