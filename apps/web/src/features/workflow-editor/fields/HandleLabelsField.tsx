import type { FieldProps } from './types';

export function HandleLabelsField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? '');

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
      </label>
      <input
        id={field.id}
        type="text"
        value={stringValue}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder ?? 'label1, label2, label3'}
        className="input"
      />
      <p className="text-xs text-slate-500">Comma-separated labels for handles</p>
    </div>
  );
}
