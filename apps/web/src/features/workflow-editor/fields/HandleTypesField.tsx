import type { FieldProps } from './types';

export function HandleTypesField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? 'flow');

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
        <option value="flow">Flow (execution/control)</option>
        <option value="json">JSON (structured data)</option>
      </select>
      <p className="text-xs text-slate-500">
        Data type for {field.label.toLowerCase()}
      </p>
    </div>
  );
}
